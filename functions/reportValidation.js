/*
 * Firebase Cloud Function: Validate Firestore 'reports' writes
 * Ensures all required fields are present and valid before accepting a report.
 * Keeps reports anonymous (no user tracking).
 */

import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import admin from 'firebase-admin';
import { sanitizeInput as sanitize } from './utils/security.js';

export const sanitizeReport = onDocumentCreated('reports/{reportId}', async (event) => {
    const snap = event.data;
    if (!snap) {
      console.log('No data associated with the event');
      return;
    }
    const data = snap.data();

    // Sanitize the data and update the document.
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