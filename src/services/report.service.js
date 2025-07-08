/**
 * @fileoverview Service for handling report submissions.
 * @module report.service
 */

import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase.js';
import { ValidationError, ERROR_SEVERITY } from '../utils/errorHandler.js';
import { downloadReportAsTxt } from '../utils/ui.js';

/**
 * Uploads an image to Firebase Storage and returns the download URL.
 * @param {File} imageFile - The image file to upload.
 * @param {string} userId - The anonymous user ID.
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export async function uploadReportImage(imageFile, userId) {
    if (!imageFile) {
        throw new ValidationError('Image file is required.', ERROR_SEVERITY.MEDIUM);
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${imageFile.name}`;
    const storageRef = ref(storage, `reports/${userId}/${fileName}`);

    try {
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new ValidationError(
            'Failed to upload image. Please try again.',
            ERROR_SEVERITY.CRITICAL
        );
    }
}

/**
 * Gathers data, uploads the image, submits the report to Firestore, and handles UI updates.
 * @param {object} reportData - The report data from the form.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} The ID of the newly created report.
 */
export async function submitReport(reportData, imageFile) {
    try {
        // 1. Upload image and get URL
        const imageUrl = await uploadReportImage(imageFile, reportData.userId);

        // 2. Submit to Firestore with the new image URL
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, {
            ...reportData,
            imageUrl, // Add the image URL to the document
            createdAt: serverTimestamp(),
            status: 'pending_verification', // Initial status
        });
        console.log('Report submitted with ID: ', docRef.id);

        // 3. Create and download local backup file
        downloadReportAsTxt({ ...reportData, id: docRef.id, imageUrl });

        return docRef.id;
    } catch (error) {
        console.error('Submission failed:', error);
        // Re-throw a more specific error to be handled by the UI controller
        throw new ValidationError(
            error.message || 'Failed to submit report. Please try again later.',
            error.severity || ERROR_SEVERITY.CRITICAL
        );
    }
}

/**
 * Updates the status of a specific report in Firestore.
 * @param {string} reportId - The ID of the report to update.
 * @param {string} newStatus - The new status to set for the report.
 * @returns {Promise<void>}
 */
export async function updateReportStatus(reportId, newStatus) {
  if (!reportId || !newStatus) {
    throw new ValidationError(
      'Report ID and new status are required.',
      ERROR_SEVERITY.MEDIUM,
    );
  }

  const reportRef = doc(db, 'reports', reportId);

  try {
    await updateDoc(reportRef, {
      status: newStatus,
    });
    console.log(`Report ${reportId} status updated to ${newStatus}`);
  } catch (error) {
    console.error('Failed to update report status:', error);
    throw new ValidationError(
      'Failed to update report status. Please try again.',
      ERROR_SEVERITY.CRITICAL,
    );
  }
}