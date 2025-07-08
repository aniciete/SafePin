/*
 * Firebase Cloud Function: Rate limit anonymous report submissions by IP address.
 * Keeps reports anonymous (no user tracking).
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import admin from 'firebase-admin';

// Allow max 5 reports per IP per hour
const MAX_REPORTS_PER_HOUR = 5;

export const rateLimitReport = onCall(async (request) => {
  // Extract IP from context
  const ip = request.rawRequest.ip || request.rawRequest.headers['x-forwarded-for'] || 'unknown';
  if (ip === 'unknown') {
    throw new HttpsError('failed-precondition', 'Cannot determine IP address for rate limiting.');
  }

  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const rateLimitRef = admin.firestore().collection('rateLimits').doc(ip);
  const doc = await rateLimitRef.get();

  let timestamps = [];
  if (doc.exists) {
    timestamps = doc.data().timestamps || [];
    // Remove timestamps older than 1 hour
    timestamps = timestamps.filter(ts => ts > oneHourAgo);
  }
  if (timestamps.length >= MAX_REPORTS_PER_HOUR) {
    throw new HttpsError('resource-exhausted', 'Too many reports submitted from this IP. Please try again later.');
  }
  // Add current timestamp
  timestamps.push(now);
  await rateLimitRef.set({ timestamps }, { merge: true });
  return { allowed: true };
});
