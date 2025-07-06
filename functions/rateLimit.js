/*
 * Firebase Cloud Function: Rate limit anonymous report submissions by IP address.
 * Keeps reports anonymous (no user tracking).
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Allow max 5 reports per IP per hour
const MAX_REPORTS_PER_HOUR = 5;

exports.rateLimitReport = functions.https.onCall(async (data, context) => {
  // Extract IP from context
  const ip = context.rawRequest.ip || context.rawRequest.headers['x-forwarded-for'] || 'unknown';
  if (ip === 'unknown') {
    throw new functions.https.HttpsError('failed-precondition', 'Cannot determine IP address for rate limiting.');
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
    throw new functions.https.HttpsError('resource-exhausted', 'Too many reports submitted from this IP. Please try again later.');
  }
  // Add current timestamp
  timestamps.push(now);
  await rateLimitRef.set({ timestamps }, { merge: true });
  return { allowed: true };
});
