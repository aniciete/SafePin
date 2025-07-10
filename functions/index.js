import admin from 'firebase-admin';
import { deleteReportImage } from './deleteReportImage.js';
import { sanitizeReport } from './reportValidation.js';

// Initialize Firebase Admin
admin.initializeApp();

// Export functions
export {
    deleteReportImage,
    sanitizeReport,
};
