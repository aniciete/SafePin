/*
 * Firebase Cloud Function: Validate Firestore 'reports' writes
 * Ensures all required fields are present and valid before accepting a report.
 * Keeps reports anonymous (no user tracking).
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const { sanitize } = require('./utils/security');

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Initialize Cloudinary using environment config
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret,
});

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

exports.validateReport = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap, context) => {
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
    if (typeof data.imageUrl !== 'string' || !data.imageUrl.startsWith('https://')) {
      errors.push('imageUrl must be a valid HTTPS URL');
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

      // Clean up the orphaned image in Cloudinary before deleting the report
      const { imageUrl } = data;
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('https://')) {
        try {
          // Extract public_id from URL. Assumes "safepin_reports" folder.
          const matches = imageUrl.match(/\/v\d+\/(?:safepin_reports\/)?([^\.\/]+)\.[a-z]+$/i);
          if (matches && matches[1]) {
            const publicId = `safepin_reports/${matches[1]}`;
            await cloudinary.uploader.destroy(publicId, { invalidate: true });
            console.log(`Successfully deleted orphaned image: ${publicId}`);
          } else {
            console.warn(`Could not extract public_id from invalid imageUrl: ${imageUrl}`);
          }
        } catch (err) {
          console.error('Failed to delete Cloudinary image during validation cleanup:', err);
          // Do not re-throw, as we still want to delete the invalid Firestore document.
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
    console.log(`Report ${context.params.reportId} has been sanitized and updated.`);

    return null;
  });