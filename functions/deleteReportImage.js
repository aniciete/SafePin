/*
 * Firebase Cloud Function: Delete image from Firebase Storage when a report is deleted.
 * This function is triggered when a document in the 'reports' collection is deleted.
 */

import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import admin from 'firebase-admin';

export const deleteReportImage = onDocumentDeleted('reports/{reportId}', async (event) => {
    const snap = event.data;
    if (!snap) {
        console.log('No data associated with the event');
        return;
    }
    const deletedData = snap.data();
    const { imageUrl } = deletedData;

    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('https://firebasestorage.googleapis.com/')) {
      console.log('No valid image URL found, skipping deletion.');
      return null;
    }

    try {
      const storage = admin.storage();
      const fileRef = storage.refFromURL(imageUrl);
      await fileRef.delete();
      console.log(`Successfully deleted image: ${imageUrl}`);
      return null;
    } catch (error) {
      // Log error but don't re-throw, as the report is already deleted.
      console.error(`Failed to delete image from Firebase Storage: ${imageUrl}`, error);
      // Handle cases where the file might not exist
      if (error.code === 'storage/object-not-found') {
        console.warn('Image not found in Storage, it might have been deleted already.');
        return null;
      }
      // For other errors, you might want to add more specific handling
      return null;
    }
  });