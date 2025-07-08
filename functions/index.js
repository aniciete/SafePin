import admin from 'firebase-admin';
import { deleteReportImage } from './deleteReportImage.js';
import { validateReport } from './reportValidation.js';

// Initialize Firebase Admin
admin.initializeApp();

// Export functions
export {
    deleteReportImage,
    validateReport,
};
