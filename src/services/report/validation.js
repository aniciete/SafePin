import { INCIDENT_TYPES, SEVERITY_LEVELS, METRO_MANILA_BOUNDS, REPORT_STATUS } from './types.js';

/**
 * Validates report data
 */
export class ReportValidator {
  /**
   * @private
   */
  static RULES = {
    incidentType: ['required', 'validIncidentType'],
    severityLevel: ['required', 'validSeverityLevel'],
    description: ['required', 'minLength:20', 'maxLength:500'],
    location: ['required', 'validLocation'],
    imageUrl: ['validImageUrl'],
    status: ['required', 'validStatus']
  };

  /**
   * Validates the entire report data
   * @param {Partial<ReportData>} data - Report data to validate
   * @returns {ReportValidationError[]} Array of validation errors
   */
  static validate(data) {
    const errors = [];

    // Check each field against its rules
    Object.entries(this.RULES).forEach(([field, rules]) => {
      const value = data[field];
      rules.forEach(rule => {
        const error = this.validateField(field, value, rule);
        if (error) {
          errors.push(error);
        }
      });
    });

    return errors;
  }

  /**
   * Validates a single field
   * @private
   */
  static validateField(field, value, rule) {
    // Handle rules with parameters (e.g., minLength:20)
    const [ruleName, param] = rule.split(':');

    switch (ruleName) {
      case 'required':
        if (!value) {
          return {
            field,
            code: 'REQUIRED',
            message: `${field} is required`
          };
        }
        break;

      case 'validIncidentType':
        if (!INCIDENT_TYPES.includes(value)) {
          return {
            field,
            code: 'INVALID_INCIDENT_TYPE',
            message: `${field} must be one of: ${INCIDENT_TYPES.join(', ')}`
          };
        }
        break;

      case 'validSeverityLevel':
        if (!SEVERITY_LEVELS.includes(value)) {
          return {
            field,
            code: 'INVALID_SEVERITY',
            message: `${field} must be one of: ${SEVERITY_LEVELS.join(', ')}`
          };
        }
        break;

      case 'minLength':
        if (value && value.length < parseInt(param)) {
          return {
            field,
            code: 'MIN_LENGTH',
            message: `${field} must be at least ${param} characters long`
          };
        }
        break;

      case 'maxLength':
        if (value && value.length > parseInt(param)) {
          return {
            field,
            code: 'MAX_LENGTH',
            message: `${field} must be no more than ${param} characters long`
          };
        }
        break;

      case 'validLocation':
        if (!this.validateLocation(value)) {
          return {
            field,
            code: 'INVALID_LOCATION',
            message: 'Location must be within Metro Manila bounds'
          };
        }
        break;

      case 'validImageUrl':
        if (value && !value.startsWith('https://firebasestorage.googleapis.com/')) {
          return {
            field,
            code: 'INVALID_IMAGE_URL',
            message: 'Image URL must be from Firebase Storage'
          };
        }
        break;

      case 'validStatus':
        if (!Object.values(REPORT_STATUS).includes(value)) {
          return {
            field,
            code: 'INVALID_STATUS',
            message: `Status must be one of: ${Object.values(REPORT_STATUS).join(', ')}`
          };
        }
        break;
    }

    return null;
  }

  /**
   * Validates location coordinates
   * @private
   */
  static validateLocation(location) {
    return location &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      location.lat >= METRO_MANILA_BOUNDS.south &&
      location.lat <= METRO_MANILA_BOUNDS.north &&
      location.lng >= METRO_MANILA_BOUNDS.west &&
      location.lng <= METRO_MANILA_BOUNDS.east;
  }
} 