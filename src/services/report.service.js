/**
 * @fileoverview Service for handling report submissions.
 * @module report.service
 */

import { supabase } from '../config/supabase.js';
import { ValidationError, ERROR_SEVERITY } from '../utils/errorHandler.js';
import { downloadReportAsTxt } from '../utils/ui.js';
import { ReportValidator } from './report/validation.js';
import { OfflineReportManager } from './report/offline.js';

/**
 * Uploads an image to Supabase Storage and returns the file path.
 * @param {File} imageFile - The image file to upload.
 * @param {string} userId - The user ID.
 * @returns {Promise<string>} The path of the uploaded file.
 */
export async function uploadReportImage(imageFile, userId) {
    if (!imageFile) {
        throw new ValidationError('Image file is required.', ERROR_SEVERITY.MEDIUM);
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${imageFile.name}`;
    const filePath = `reports/${userId}/${fileName}`;

    try {
        const { data, error } = await supabase.storage
            .from('report-images')
            .upload(filePath, imageFile);

        if (error) {
            throw error;
        }

        return data.path;
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
        const imagePath = await uploadReportImage(imageFile, reportData.user_id);

        // Submit to Supabase
        const { data, error } = await supabase
            .from('reports')
            .insert([{ ...reportData, image_path: imagePath, status: 'pending_verification' }])
            .select();

        if (error) {
            throw error;
        }

        const newReport = data[0];

        // Create local backup
        downloadReportAsTxt({
            ...reportData,
            id: newReport.id,
            imagePath
        });

        return {
            id: newReport.id,
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
 * Updates the status of a specific report in Supabase
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

    try {
        const { error } = await supabase
            .from('reports')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', reportId);

        if (error) {
            throw error;
        }

        console.log(`Report ${reportId} status updated to ${newStatus}`);
    } catch (error) {
        console.error('Failed to update report status:', error);
        throw new ValidationError(
            'Failed to update report status. Please try again.',
            ERROR_SEVERITY.CRITICAL
        );
    }
}

/**
 * Gets a temporary signed URL for a private image.
 * @param {string} filePath - The full path to the image in the storage bucket.
 * @returns {Promise<string>} The signed URL.
 */
export async function getSignedImageUrl(filePath) {
    try {
        const { data, error } = await supabase.functions.invoke('get-signed-url', {
            body: { filePath },
        });

        if (error) {
            throw error;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Failed to get signed URL:', error);
        throw new ValidationError(
            'Could not retrieve image. Please try again later.',
            ERROR_SEVERITY.CRITICAL
        );
    }
}

/**
 * Deletes a report image from storage.
 * @param {string} filePath - The path of the file to delete.
 * @param {string} reportId - The ID of the report the image belongs to.
 * @returns {Promise<void>}
 */
export async function deleteReportImage(filePath, reportId) {
    try {
        const { error } = await supabase.functions.invoke('delete-report-image', {
            body: { filePath, reportId },
        });

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Failed to delete image:', error);
        throw new ValidationError(
            'Failed to delete image. Please try again.',
            ERROR_SEVERITY.CRITICAL
        );
    }
}