/*
 * Firebase Cloud Function to generate a signed Cloudinary upload signature.
 *
 * Before deploying, configure Cloudinary credentials in your project:
 *   firebase functions:config:set cloudinary.cloud_name="YOUR_CLOUD_NAME" \
 *       cloudinary.api_key="YOUR_API_KEY" cloudinary.api_secret="YOUR_API_SECRET"
 *
 * Then deploy with: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary using environment config
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret,
});

/**
 * Callable function that returns a signed upload payload.
 * Front-end should POST the returned signature, timestamp, api_key, and file to
 * https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
 */
exports.getCloudinarySignature = functions.https.onCall(async (data, context) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    folder: 'safepin_reports', // Optional: store uploads in a dedicated folder
  };

  // The signature is created by Cloudinary using API secret
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    functions.config().cloudinary.api_secret,
  );

  return {
    timestamp,
    signature,
    apiKey: functions.config().cloudinary.api_key,
    cloudName: functions.config().cloudinary.cloud_name,
    folder: paramsToSign.folder,
  };
});
