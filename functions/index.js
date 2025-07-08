import admin from 'firebase-admin';
import { rateLimitReport } from './rateLimit.js';
import { deleteReportImage } from './deleteReportImage.js';
import { validateReport } from './reportValidation.js';
import { listUsers } from './listUsers.js';

// Initialize Firebase Admin
admin.initializeApp();

// Export functions
export {
    rateLimitReport,
    deleteReportImage,
    validateReport,
    listUsers
};
