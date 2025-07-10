/*
 * Firebase Cloud Function: Validate Firestore 'reports' writes
 * Ensures all required fields are present and valid before accepting a report.
 * Keeps reports anonymous (no user tracking).
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import admin from 'firebase-admin';
import { sanitizeInput as sanitize } from './utils/security.js';

// List of required fields for a report
const REQUIRED_FIELDS = [
  'incidentType',
  'severityLevel',
  'description',
  'imageUrl',
  'location',
  'status',
  'createdAt',
];

export const validateReport = onDocumentCreated('reports/{reportId}', async (event) => {
    const snap = event.data;
    if (!snap) {
      console.log('No data associated with the event');
      return;
    }
    const data = snap.data();
    const missing = REQUIRED_FIELDS.filter(field => !(field in data));
    let errors = [];

    // Check for missing fields
    if (missing.length > 0) {
      errors.push(`Missing fields: ${missing.join(', ')}`);
    }

    // Validate types and values
    if (typeof data.incidentType !== 'string' || !data.incidentType) {
      errors.push('incidentType must be a non-empty string');
    }
    if (typeof data.severityLevel !== 'string' || !data.severityLevel) {
      errors.push('severityLevel must be a non-empty string');
    }
    if (typeof data.description !== 'string' || !data.description) {
      errors.push('description must be a non-empty string');
    }
    if (typeof data.imageUrl !== 'string' || !data.imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
      errors.push('imageUrl must be a valid Firebase Storage URL');
    }
    if (
      !data.location ||
      typeof data.location.lat !== 'number' ||
      typeof data.location.lng !== 'number'
    ) {
      errors.push('location must have valid lat and lng numbers');
    }
    if (data.status !== 'pending_verification' && data.status !== 'verified' && data.status !== 'resolved') {
      errors.push('status must be one of: pending_verification, verified, resolved');
    }
    // createdAt is a Firestore timestamp, but may be missing if client-side write is buggy
    if (!data.createdAt) {
      errors.push('createdAt timestamp missing');
    }

    // If there are validation errors, delete the report and log the error
    if (errors.length > 0) {
      console.error(`Invalid report submission: ${errors.join('; ')}`);

      // Since the image is now uploaded before the report is created,
      // we need to delete the orphaned image from Firebase Storage.
      const { imageUrl } = data;
      if (imageUrl && typeof imageUrl === 'string') {
        try {
          const storage = admin.storage();
          const fileRef = storage.refFromURL(imageUrl);
          await fileRef.delete();
          console.log(`Successfully deleted orphaned image: ${imageUrl}`);
        } catch (err) {
          console.error('Failed to delete Firebase Storage image during validation cleanup:', err);
        }
      }

      // Finally, delete the invalid report document
      await snap.ref.delete();
      return null;
    }
    
    // If validation passes, sanitize the data and update the document.
    const sanitizedData = {
      incidentType: sanitize(data.incidentType),
      severityLevel: sanitize(data.severityLevel),
      description: sanitize(data.description),
    };

    // Update the document with sanitized fields
    await snap.ref.update(sanitizedData);
    console.log(`Report ${event.params.reportId} has been sanitized and updated.`);

    return null;
  });