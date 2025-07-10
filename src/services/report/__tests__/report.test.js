import { ReportValidator } from '../validation.js';
import { OfflineReportManager } from '../offline.js';
import { submitReport, updateReportStatus } from '../../report.service.js';
import { ValidationError } from '../../../utils/errorHandler.js';

// Mock IndexedDB
const indexedDB = {
    open: jest.fn(),
    transaction: jest.fn(),
    objectStore: jest.fn(),
    add: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
};

// Mock Firebase
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    doc: jest.fn(),
    updateDoc: jest.fn(),
    serverTimestamp: jest.fn()
}));

jest.mock('firebase/storage', () => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn()
}));

describe('Report Validation', () => {
    const validReport = {
        incidentType: 'theft',
        severityLevel: 'high',
        description: 'This is a valid description of the incident that occurred.',
        location: {
            lat: 14.5995,
            lng: 121.0364
        },
        status: 'pending_verification'
    };

    test('validates a correct report', () => {
        const errors = ReportValidator.validate(validReport);
        expect(errors).toHaveLength(0);
    });

    test('validates incident type', () => {
        const report = {
            ...validReport,
            incidentType: 'invalid_type'
        };
        const errors = ReportValidator.validate(report);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('INVALID_INCIDENT_TYPE');
    });

    test('validates severity level', () => {
        const report = {
            ...validReport,
            severityLevel: 'invalid_level'
        };
        const errors = ReportValidator.validate(report);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('INVALID_SEVERITY');
    });

    test('validates description length', () => {
        const report = {
            ...validReport,
            description: 'too short'
        };
        const errors = ReportValidator.validate(report);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('MIN_LENGTH');
    });

    test('validates location bounds', () => {
        const report = {
            ...validReport,
            location: {
                lat: 0,
                lng: 0
            }
        };
        const errors = ReportValidator.validate(report);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('INVALID_LOCATION');
    });
});

describe('Offline Support', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Mock IndexedDB success scenario
        const mockRequest = {
            onerror: null,
            onsuccess: null,
            result: {
                transaction: jest.fn().mockReturnThis(),
                objectStore: jest.fn().mockReturnThis(),
                add: jest.fn(),
                get: jest.fn(),
                put: jest.fn(),
                delete: jest.fn()
            }
        };
        
        indexedDB.open.mockImplementation(() => {
            setTimeout(() => {
                mockRequest.onsuccess({ target: mockRequest });
            }, 0);
            return mockRequest;
        });
    });

    test('queues report when offline', async () => {
        // Mock navigator.onLine
        Object.defineProperty(navigator, 'onLine', {
            value: false,
            writable: true
        });

        const report = {
            ...validReport,
            imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' })
        };

        const result = await submitReport(report);
        expect(result.status).toBe('offline');
        expect(result.id).toMatch(/^temp_/);
    });

    test('processes queued reports when back online', async () => {
        // Setup mock reports in IndexedDB
        const mockReports = [
            {
                id: 'temp_1',
                data: validReport,
                status: 'pending',
                createdAt: new Date(),
                retryCount: 0
            }
        ];

        // Mock successful sync
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ id: 'real_1' })
            })
        );

        await OfflineReportManager.initialize();
        const reports = await OfflineReportManager.getPendingReports();
        
        expect(reports).toEqual(mockReports);
        
        // Trigger sync
        await new Promise(resolve => {
            const syncEvent = new Event('sync');
            syncEvent.tag = 'sync-reports';
            self.dispatchEvent(syncEvent);
            setTimeout(resolve, 100);
        });

        // Verify report was processed
        const remainingReports = await OfflineReportManager.getPendingReports();
        expect(remainingReports).toHaveLength(0);
    });
});

describe('Report Submission', () => {
    test('submits report successfully when online', async () => {
        Object.defineProperty(navigator, 'onLine', {
            value: true,
            writable: true
        });

        const mockImageUrl = 'https://firebasestorage.googleapis.com/test.jpg';
        const mockReportId = 'report_1';

        // Mock Firebase functions
        const { uploadBytes, getDownloadURL } = require('firebase/storage');
        const { addDoc } = require('firebase/firestore');

        uploadBytes.mockResolvedValue({ ref: {} });
        getDownloadURL.mockResolvedValue(mockImageUrl);
        addDoc.mockResolvedValue({ id: mockReportId });

        const report = {
            ...validReport,
            imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' })
        };

        const result = await submitReport(report);
        expect(result.status).toBe('online');
        expect(result.id).toBe(mockReportId);
    });

    test('handles validation errors', async () => {
        const invalidReport = {
            incidentType: 'invalid',
            severityLevel: 'invalid',
            description: 'short',
            location: { lat: 0, lng: 0 }
        };

        await expect(submitReport(invalidReport)).rejects.toThrow(ValidationError);
    });
});

describe('Status Updates', () => {
    test('updates report status successfully', async () => {
        const { updateDoc } = require('firebase/firestore');
        updateDoc.mockResolvedValue();

        await updateReportStatus('report_1', 'verified');
        expect(updateDoc).toHaveBeenCalled();
    });

    test('validates status before update', async () => {
        await expect(
            updateReportStatus('report_1', 'invalid_status')
        ).rejects.toThrow(ValidationError);
    });
}); 