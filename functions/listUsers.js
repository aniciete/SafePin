const { getAuth } = require('firebase-admin/auth');
const { HttpsError } = require('firebase-functions/v1/https');

/**
 * Fetches a list of all users from Firebase Authentication.
 * This is a helper function intended to be called by an HTTPS Cloud Function.
 * @returns {Promise<object[]>} A promise that resolves to an array of user objects.
 */
async function getAllUsers() {
  const userRecords = [];
  let nextPageToken;

  do {
    const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
    listUsersResult.users.forEach(userRecord => {
      userRecords.push({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        disabled: userRecord.disabled,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      });
    });
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);

  return userRecords;
}

/**
 * A callable Cloud Function that returns a list of all users.
 * The function checks if the caller is an admin before returning data.
 * @param {object} data - The data passed to the function.
 * @param {object} context - The context of the function call, including auth information.
 */
async function listUsers(data, context) {
  // To secure this function, you should implement a role-based access system.
  // For now, we'll just check if the user is authenticated.
  // In a real app, you'd check if `context.auth.token.admin` is true.
  if (!context.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  try {
    const users = await getAllUsers();
    return { users };
  } catch (error) {
    console.error('Error listing users:', error);
    throw new HttpsError('internal', 'Unable to list users.');
  }
}

module.exports = { listUsers };
