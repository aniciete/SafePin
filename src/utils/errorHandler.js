/**
 * Centralized error handling utilities
 * Provides consistent error handling and user feedback across the application
 * @module errorHandler
 */

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
    VALIDATION: 'validation',
    NETWORK: 'network',
    AUTH: 'authentication',
    PERMISSION: 'permission',
    SERVER: 'server',
    CLIENT: 'client',
    UNKNOWN: 'unknown'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, originalError = null) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.severity = severity;
        this.originalError = originalError;
        this.timestamp = new Date().toISOString();
        
        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * Logs errors to console and potentially to external service
 * @param {Error|AppError} error - Error to log
 * @param {Object} context - Additional context information
 */
export const logError = (error, context = {}) => {
    const errorInfo = {
        message: error.message,
        type: error.type || ERROR_TYPES.UNKNOWN,
        severity: error.severity || ERROR_SEVERITY.MEDIUM,
        timestamp: error.timestamp || new Date().toISOString(),
        stack: error.stack,
        context: context,
        userAgent: navigator.userAgent,
        url: window.location.href
    };

    // Log to console based on severity
    switch (errorInfo.severity) {
        case ERROR_SEVERITY.CRITICAL:
        case ERROR_SEVERITY.HIGH:
            console.error('🚨 Critical Error:', errorInfo);
            break;
        case ERROR_SEVERITY.MEDIUM:
            console.warn('⚠️ Warning:', errorInfo);
            break;
        case ERROR_SEVERITY.LOW:
            console.info('ℹ️ Info:', errorInfo);
            break;
        default:
            console.log('📝 Log:', errorInfo);
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    // sendToLoggingService(errorInfo);
};

/**
 * Handles Firebase errors and converts them to user-friendly messages
 * @param {Error} error - Firebase error
 * @returns {AppError} - Formatted application error
 */
export const handleFirebaseError = (error) => {
    let message = 'An unexpected error occurred';
    let type = ERROR_TYPES.SERVER;
    let severity = ERROR_SEVERITY.MEDIUM;

    switch (error.code) {
        case 'auth/user-not-found':
            message = 'No account found with this email address';
            type = ERROR_TYPES.AUTH;
            break;
        case 'auth/wrong-password':
            message = 'Incorrect password';
            type = ERROR_TYPES.AUTH;
            break;
        case 'auth/email-already-in-use':
            message = 'An account with this email already exists';
            type = ERROR_TYPES.AUTH;
            break;
        case 'auth/weak-password':
            message = 'Password is too weak';
            type = ERROR_TYPES.VALIDATION;
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address';
            type = ERROR_TYPES.VALIDATION;
            break;
        case 'auth/user-disabled':
            message = 'This account has been disabled';
            type = ERROR_TYPES.AUTH;
            severity = ERROR_SEVERITY.HIGH;
            break;
        case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later';
            type = ERROR_TYPES.AUTH;
            severity = ERROR_SEVERITY.HIGH;
            break;
        case 'permission-denied':
            message = 'You do not have permission to perform this action';
            type = ERROR_TYPES.PERMISSION;
            severity = ERROR_SEVERITY.HIGH;
            break;
        case 'unavailable':
            message = 'Service is temporarily unavailable. Please try again later';
            type = ERROR_TYPES.NETWORK;
            severity = ERROR_SEVERITY.HIGH;
            break;
        case 'deadline-exceeded':
            message = 'Request timed out. Please check your connection and try again';
            type = ERROR_TYPES.NETWORK;
            break;
        default:
            if (error.message) {
                message = error.message;
            }
    }

    return new AppError(message, type, severity, error);
};

/**
 * Handles network errors
 * @param {Error} error - Network error
 * @returns {AppError} - Formatted application error
 */
export const handleNetworkError = (error) => {
    let message = 'Network error occurred';
    let severity = ERROR_SEVERITY.MEDIUM;

    if (!navigator.onLine) {
        message = 'No internet connection. Please check your network and try again';
        severity = ERROR_SEVERITY.HIGH;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Unable to connect to server. Please try again later';
        severity = ERROR_SEVERITY.HIGH;
    } else if (error.status) {
        switch (error.status) {
            case 400:
                message = 'Invalid request. Please check your input';
                break;
            case 401:
                message = 'Authentication required. Please log in again';
                severity = ERROR_SEVERITY.HIGH;
                break;
            case 403:
                message = 'Access denied. You do not have permission';
                severity = ERROR_SEVERITY.HIGH;
                break;
            case 404:
                message = 'Requested resource not found';
                break;
            case 429:
                message = 'Too many requests. Please wait and try again';
                severity = ERROR_SEVERITY.HIGH;
                break;
            case 500:
                message = 'Server error. Please try again later';
                severity = ERROR_SEVERITY.HIGH;
                break;
            default:
                message = `Server error (${error.status}). Please try again later`;
        }
    }

    return new AppError(message, ERROR_TYPES.NETWORK, severity, error);
};

/**
 * Shows error message to user in UI
 * @param {string|Error|AppError} error - Error to display
 * @param {string} containerId - ID of container to show error in
 * @param {number} duration - Duration to show error (ms), 0 for permanent
 */
export const showErrorMessage = (error, containerId = 'error-container', duration = 5000) => {
    let message = '';
    let severity = ERROR_SEVERITY.MEDIUM;

    if (typeof error === 'string') {
        message = error;
    } else if (error instanceof AppError) {
        message = error.message;
        severity = error.severity;
    } else if (error instanceof Error) {
        message = error.message || 'An unexpected error occurred';
    } else {
        message = 'An unexpected error occurred';
    }

    // Create or get error container
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'error-container';
        
        // Try to insert at the top of main content or body
        const main = document.querySelector('main') || document.body;
        main.insertBefore(container, main.firstChild);
    }

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = `error-message error-${severity}`;
    errorElement.innerHTML = `
        <div class="error-content">
            <span class="error-icon">${getErrorIcon(severity)}</span>
            <span class="error-text">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add to container
    container.appendChild(errorElement);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, duration);
    }

    // Add CSS if not already present
    addErrorStyles();
};

/**
 * Shows success message to user
 * @param {string} message - Success message
 * @param {string} containerId - ID of container to show message in
 * @param {number} duration - Duration to show message (ms)
 */
export const showSuccessMessage = (message, containerId = 'success-container', duration = 3000) => {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'success-container';
        
        const main = document.querySelector('main') || document.body;
        main.insertBefore(container, main.firstChild);
    }

    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-text">${message}</span>
            <button class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    container.appendChild(successElement);

    if (duration > 0) {
        setTimeout(() => {
            if (successElement.parentNode) {
                successElement.remove();
            }
        }, duration);
    }

    addErrorStyles(); // Reuse styles for success messages
};

/**
 * Gets appropriate icon for error severity
 * @param {string} severity - Error severity
 * @returns {string} - Icon character
 */
const getErrorIcon = (severity) => {
    switch (severity) {
        case ERROR_SEVERITY.CRITICAL:
            return '🚨';
        case ERROR_SEVERITY.HIGH:
            return '❌';
        case ERROR_SEVERITY.MEDIUM:
            return '⚠️';
        case ERROR_SEVERITY.LOW:
            return 'ℹ️';
        default:
            return '⚠️';
    }
};

/**
 * Adds CSS styles for error messages if not already present
 */
const addErrorStyles = () => {
    if (document.getElementById('error-handler-styles')) {
        return;
    }

    const styles = document.createElement('style');
    styles.id = 'error-handler-styles';
    styles.textContent = `
        .error-container, .success-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        }

        .error-message, .success-message {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 10px;
            animation: slideIn 0.3s ease-out;
        }

        .error-message.error-critical {
            border-left: 4px solid #dc3545;
        }

        .error-message.error-high {
            border-left: 4px solid #fd7e14;
        }

        .error-message.error-medium {
            border-left: 4px solid #ffc107;
        }

        .error-message.error-low {
            border-left: 4px solid #17a2b8;
        }

        .success-message {
            border-left: 4px solid #28a745;
        }

        .error-content, .success-content {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            gap: 8px;
        }

        .error-icon, .success-icon {
            font-size: 16px;
            flex-shrink: 0;
        }

        .error-text, .success-text {
            flex: 1;
            font-size: 14px;
            line-height: 1.4;
            color: #333;
        }

        .error-close, .success-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        .error-close:hover, .success-close:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @media (max-width: 480px) {
            .error-container, .success-container {
                left: 10px;
                right: 10px;
                max-width: none;
            }
        }
    `;

    document.head.appendChild(styles);
};

/**
 * Wraps async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} - Wrapped function
 */
export const withErrorHandling = (fn, options = {}) => {
    const {
        showUserError = true,
        logError: shouldLog = true,
        fallbackValue = null,
        context = {}
    } = options;

    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            let appError;

            // Convert to AppError if needed
            if (error instanceof AppError) {
                appError = error;
            } else if (error.code && error.code.startsWith('auth/')) {
                appError = handleFirebaseError(error);
            } else if (error.name === 'TypeError' || error.status) {
                appError = handleNetworkError(error);
            } else {
                appError = new AppError(
                    error.message || 'An unexpected error occurred',
                    ERROR_TYPES.UNKNOWN,
                    ERROR_SEVERITY.MEDIUM,
                    error
                );
            }

            // Log error if requested
            if (shouldLog) {
                logError(appError, { ...context, functionName: fn.name });
            }

            // Show user error if requested
            if (showUserError) {
                showErrorMessage(appError);
            }

            // Return fallback value or re-throw
            if (fallbackValue !== null) {
                return fallbackValue;
            } else {
                throw appError;
            }
        }
    };
};
