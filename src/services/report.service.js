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
import { ReportValidator } from './report/validation.js';
import { OfflineReportManager } from './report/offline.js';

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
 * Submits a report with offline support and validation
 * @param {object} reportData - The report data from the form
 * @param {File} imageFile - The image file to upload
 * @returns {Promise<{id: string, status: 'online'|'offline'}>} The submission result
 */
export async function submitReport(reportData, imageFile) {
    try {
        // 1. Validate report data
        const validationErrors = ReportValidator.validate(reportData);
        if (validationErrors.length > 0) {
            throw new ValidationError(
                'Validation failed',
                ERROR_SEVERITY.MEDIUM,
                { errors: validationErrors }
            );
        }

        // 2. Check if we're online
        if (!navigator.onLine) {
            // Queue report for later submission
            const tempId = await OfflineReportManager.queueReport({
                ...reportData,
                imageFile: imageFile // Store file reference for later upload
            });
            
            return {
                id: tempId,
                status: 'offline'
            };
        }

        // 3. If online, proceed with normal submission
        // Upload image first
        const imageUrl = await uploadReportImage(imageFile, reportData.userId);

        // Submit to Firestore
        const reportsCollection = collection(db, 'reports');
        const docRef = await addDoc(reportsCollection, {
            ...reportData,
            imageUrl,
            createdAt: serverTimestamp(),
            status: 'pending_verification'
        });

        // Create local backup
        downloadReportAsTxt({
            ...reportData,
            id: docRef.id,
            imageUrl
        });

        return {
            id: docRef.id,
            status: 'online'
        };
    } catch (error) {
        console.error('Submission failed:', error);
        
        // If it's not a validation error, try to queue for offline submission
        if (!(error instanceof ValidationError) && !navigator.onLine) {
            const tempId = await OfflineReportManager.queueReport({
                ...reportData,
                imageFile: imageFile
            });
            
            return {
                id: tempId,
                status: 'offline'
            };
        }

        throw new ValidationError(
            error.message || 'Failed to submit report. Please try again later.',
            error.severity || ERROR_SEVERITY.CRITICAL,
            { originalError: error }
        );
    }
}

/**
 * Updates the status of a specific report in Firestore
 * @param {string} reportId - The ID of the report to update
 * @param {string} newStatus - The new status to set
 * @returns {Promise<void>}
 */
export async function updateReportStatus(reportId, newStatus) {
    // Validate the new status
    const validationErrors = ReportValidator.validateField('status', newStatus, 'validStatus');
    if (validationErrors) {
        throw new ValidationError(
            validationErrors.message,
            ERROR_SEVERITY.MEDIUM
        );
    }

    const reportRef = doc(db, 'reports', reportId);

    try {
        await updateDoc(reportRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
        console.log(`Report ${reportId} status updated to ${newStatus}`);
    } catch (error) {
        console.error('Failed to update report status:', error);
        throw new ValidationError(
            'Failed to update report status. Please try again.',
            ERROR_SEVERITY.CRITICAL
        );
    }
}