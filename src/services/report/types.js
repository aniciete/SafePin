/**
 * @typedef {Object} ReportData
 * @property {string} incidentType - Type of incident
 * @property {string} severityLevel - Severity level of incident
 * @property {string} description - Description of incident
 * @property {Object} location - Location coordinates
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string} [imageUrl] - Optional URL of uploaded image
 * @property {'pending_verification'|'verified'|'resolved'|'rejected'} status - Report status
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} ReportValidationError
 * @property {string} field - Name of the field with error
 * @property {string} message - Error message
 * @property {string} code - Error code for programmatic handling
 */

export const INCIDENT_TYPES = [
  'theft',
  'harassment',
  'vandalism',
  'assault',
  'suspicious_activity',
  'traffic_violation',
  'other'
];

export const SEVERITY_LEVELS = ['low', 'medium', 'high'];

export const REPORT_STATUS = {
  PENDING: 'pending_verification',
  VERIFIED: 'verified',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

export const METRO_MANILA_BOUNDS = {
  north: 14.7565,
  south: 14.4755,
  east: 121.0851,
  west: 120.9321
}; 