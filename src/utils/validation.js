/**
 * Input validation and sanitization utilities
 * Provides centralized validation for all user inputs across the application
 * @module validation
 */
import DOMPurify from 'isomorphic-dompurify';

/**
 * Validates and sanitizes text input
 * @param {string} input - The input string to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 1)
 * @param {number} options.maxLength - Maximum length (default: 1000)
 * @param {boolean} options.required - Whether the field is required (default: true)
 * @param {RegExp} options.pattern - Optional regex pattern to match
 * @param {string} options.fieldName - Name of the field for error messages
 * @returns {Object} - {isValid: boolean, value: string, error: string}
 */
export const validateText = (input, options = {}) => {
    const {
        minLength = 1,
        maxLength = 1000,
        required = true,
        pattern = null,
        fieldName = 'Field'
    } = options;

    // Handle null/undefined input
    if (input === null || input === undefined) {
        input = '';
    }

    // Convert to string and trim
    const trimmedInput = String(input).trim();

    // Check if required
    if (required && trimmedInput.length === 0) {
        return {
            isValid: false,
            value: '',
            error: `${fieldName} is required`
        };
    }

    // If not required and empty, return valid
    if (!required && trimmedInput.length === 0) {
        return {
            isValid: true,
            value: '',
            error: null
        };
    }

    // Check length constraints
    if (trimmedInput.length < minLength) {
        return {
            isValid: false,
            value: trimmedInput,
            error: `${fieldName} must be at least ${minLength} characters long`
        };
    }

    if (trimmedInput.length > maxLength) {
        return {
            isValid: false,
            value: trimmedInput,
            error: `${fieldName} must not exceed ${maxLength} characters`
        };
    }

    // Check pattern if provided
    if (pattern && !pattern.test(trimmedInput)) {
        return {
            isValid: false,
            value: trimmedInput,
            error: `${fieldName} format is invalid`
        };
    }

    const sanitizedValue = DOMPurify.sanitize(trimmedInput);

    return {
        isValid: true,
        value: sanitizedValue,
        error: null
    };
};

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @param {boolean} required - Whether email is required
 * @returns {Object} - {isValid: boolean, value: string, error: string}
 */
export const validateEmail = (email, required = true) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return validateText(email, {
        required,
        maxLength: 254,
        pattern: emailPattern,
        fieldName: 'Email'
    });
};

/**
 * Validates password
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} - {isValid: boolean, value: string, error: string}
 */
export const validatePassword = (password, options = {}) => {
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = false
    } = options;

    if (!password || password.length === 0) {
        return {
            isValid: false,
            value: '',
            error: 'Password is required'
        };
    }

    if (password.length < minLength) {
        return {
            isValid: false,
            value: password,
            error: `Password must be at least ${minLength} characters long`
        };
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        return {
            isValid: false,
            value: password,
            error: 'Password must contain at least one uppercase letter'
        };
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        return {
            isValid: false,
            value: password,
            error: 'Password must contain at least one lowercase letter'
        };
    }

    if (requireNumbers && !/\d/.test(password)) {
        return {
            isValid: false,
            value: password,
            error: 'Password must contain at least one number'
        };
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            isValid: false,
            value: password,
            error: 'Password must contain at least one special character'
        };
    }

    return {
        isValid: true,
        value: password,
        error: null
    };
};

/**
 * Validates file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - {isValid: boolean, file: File, error: string}
 */
export const validateFile = (file, options = {}) => {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        required = true
    } = options;

    if (!file) {
        if (required) {
            return {
                isValid: false,
                file: null,
                error: 'File is required'
            };
        }
        return {
            isValid: true,
            file: null,
            error: null
        };
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        return {
            isValid: false,
            file: null,
            error: `File size must not exceed ${maxSizeMB}MB`
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            file: null,
            error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        };
    }

    return {
        isValid: true,
        file: file,
        error: null
    };
};

/**
 * Validates coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Object} - {isValid: boolean, coordinates: {lat, lng}, error: string}
 */
export const validateCoordinates = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
        return {
            isValid: false,
            coordinates: null,
            error: 'Invalid coordinates provided'
        };
    }

    if (latitude < -90 || latitude > 90) {
        return {
            isValid: false,
            coordinates: null,
            error: 'Latitude must be between -90 and 90 degrees'
        };
    }

    if (longitude < -180 || longitude > 180) {
        return {
            isValid: false,
            coordinates: null,
            error: 'Longitude must be between -180 and 180 degrees'
        };
    }

    return {
        isValid: true,
        coordinates: { lat: latitude, lng: longitude },
        error: null
    };
};

/**
 * Validates incident report data
 * @param {Object} reportData - Report data to validate
 * @returns {Object} - {isValid: boolean, data: Object, errors: Array}
 */
export const validateIncidentReport = (reportData) => {
    const errors = [];
    const validatedData = {};

    // Validate incident type
    const incidentTypeValidation = validateText(reportData.incidentType, {
        required: true,
        maxLength: 100,
        fieldName: 'Incident type'
    });
    if (!incidentTypeValidation.isValid) {
        errors.push(incidentTypeValidation.error);
    } else {
        validatedData.incidentType = incidentTypeValidation.value;
    }

    // Validate severity level
    const severityValidation = validateText(reportData.severityLevel, {
        required: true,
        maxLength: 50,
        fieldName: 'Severity level'
    });
    if (!severityValidation.isValid) {
        errors.push(severityValidation.error);
    } else {
        validatedData.severityLevel = severityValidation.value;
    }

    // Validate description
    const descriptionValidation = validateText(reportData.description, {
        required: true,
        minLength: 10,
        maxLength: 2000,
        fieldName: 'Description'
    });
    if (!descriptionValidation.isValid) {
        errors.push(descriptionValidation.error);
    } else {
        validatedData.description = descriptionValidation.value;
    }

    // Validate coordinates
    if (reportData.location) {
        const coordinatesValidation = validateCoordinates(
            reportData.location.lat,
            reportData.location.lng
        );
        if (!coordinatesValidation.isValid) {
            errors.push(coordinatesValidation.error);
        } else {
            validatedData.location = coordinatesValidation.coordinates;
        }
    } else {
        errors.push('Location coordinates are required');
    }

    return {
        isValid: errors.length === 0,
        data: validatedData,
        errors: errors
    };
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html - HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html);
};
