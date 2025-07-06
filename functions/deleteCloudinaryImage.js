/*
 * Firebase Cloud Function: Delete Cloudinary image by URL (for orphan cleanup)
 * Keeps reports anonymous (no user tracking).
 */

const functions = require('firebase-functions');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret,
});

exports.deleteCloudinaryImage = functions.https.onCall(async (data, context) => {
  const { imageUrl } = data;
  if (!imageUrl) {
    throw new functions.https.HttpsError('invalid-argument', 'No imageUrl provided');
  }
  // Extract public_id from URL
  const matches = imageUrl.match(/\/v\d+\/([^\.\/]+)\.[a-z]+$/i);
  if (!matches || !matches[1]) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid Cloudinary URL');
  }
  const publicId = `safepin_reports/${matches[1]}`;
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
    return { success: true };
  } catch (err) {
    console.error('Failed to delete Cloudinary image:', err);
    throw new functions.https.HttpsError('internal', 'Failed to delete image');
  }
});
