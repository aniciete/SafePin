/**
 * @fileoverview Centralized error handling system
 * Provides comprehensive error handling, logging, and recovery mechanisms
 * @module errorHandler
 */

/**
 * Error types for categorization
 * @enum {string}
 */
export const ERROR_TYPES = {
    VALIDATION: 'validation',
    NETWORK: 'network',
    AUTH: 'authentication',
    PERMISSION: 'permission',
    SERVER: 'server',
    CLIENT: 'client',
    RATE_LIMIT: 'rate_limit',
    DATABASE: 'database',
    STORAGE: 'storage',
    UNKNOWN: 'unknown'
};

/**
 * Error severity levels
 * @enum {string}
 */
export const ERROR_SEVERITY = {
    LOW: 'low',           // Non-critical, doesn't affect core functionality
    MEDIUM: 'medium',     // Minor impact, core functionality still works
    HIGH: 'high',        // Major impact, core functionality affected
    CRITICAL: 'critical' // System failure, immediate attention needed
};

/**
 * Error recovery strategies
 * @enum {string}
 */
export const RECOVERY_STRATEGIES = {
    RETRY: 'retry',           // Retry the operation
    FALLBACK: 'fallback',     // Use fallback/cached data
    RESET: 'reset',           // Reset to initial state
    RELOAD: 'reload',         // Reload the page/component
    NOTIFY: 'notify',         // Just notify user
    REDIRECT: 'redirect'      // Redirect to safe state
};

/**
 * Base custom error class
 */
class BaseError extends Error {
    constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM) {
        super(message);
        this.name = this.constructor.name;
        this.type = type;
        this.severity = severity;
        this.timestamp = new Date().toISOString();
        this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // Clean stack trace for production
        if (process.env.NODE_ENV === 'production') {
            this.stack = this.cleanStackTrace(this.stack);
        }
    }

    /**
     * Clean stack trace for production
     * @private
     */
    cleanStackTrace(stack) {
        if (!stack) return '';
        return stack
            .split('\n')
            .filter(line => !line.includes('node_modules'))
            .join('\n');
    }
}

/**
 * Validation error class
 */
export class ValidationError extends BaseError {
    constructor(message, fields = {}) {
        super(message, ERROR_TYPES.VALIDATION, ERROR_SEVERITY.MEDIUM);
        this.fields = fields;
    }
}

/**
 * Network error class
 */
export class NetworkError extends BaseError {
    constructor(message, status = null, endpoint = null) {
        super(message, ERROR_TYPES.NETWORK, ERROR_SEVERITY.HIGH);
        this.status = status;
        this.endpoint = endpoint;
    }
}

/**
 * Authentication error class
 */
export class AuthError extends BaseError {
    constructor(message, code = null) {
        super(message, ERROR_TYPES.AUTH, ERROR_SEVERITY.HIGH);
        this.code = code;
    }
}

/**
 * Permission error class
 */
export class PermissionError extends BaseError {
    constructor(message, requiredPermissions = []) {
        super(message, ERROR_TYPES.PERMISSION, ERROR_SEVERITY.HIGH);
        this.requiredPermissions = requiredPermissions;
    }
}

/**
 * Rate limit error class
 */
export class RateLimitError extends BaseError {
    constructor(message, retryAfter = null) {
        super(message, ERROR_TYPES.RATE_LIMIT, ERROR_SEVERITY.HIGH);
        this.retryAfter = retryAfter;
    }
}

/**
 * Database error class
 */
export class DatabaseError extends BaseError {
    constructor(message, operation = null) {
        super(message, ERROR_TYPES.DATABASE, ERROR_SEVERITY.HIGH);
        this.operation = operation;
    }
}

/**
 * Storage error class
 */
export class StorageError extends BaseError {
    constructor(message, resource = null) {
        super(message, ERROR_TYPES.STORAGE, ERROR_SEVERITY.HIGH);
        this.resource = resource;
    }
}

/**
 * Error logger class
 */
class ErrorLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * Log an error
     * @param {Error} error - Error to log
     * @param {Object} context - Additional context
     */
    log(error, context = {}) {
        const errorLog = {
            id: error.id || `err_${Date.now()}`,
            message: error.message,
            type: error.type || ERROR_TYPES.UNKNOWN,
            severity: error.severity || ERROR_SEVERITY.MEDIUM,
            timestamp: error.timestamp || new Date().toISOString(),
            stack: error.stack,
            context: {
                ...context,
                url: window.location.href,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            }
        };

        // Add to local logs
        this.logs.unshift(errorLog);
        if (this.logs.length > this.maxLogs) {
            this.logs.pop();
        }

        // Console logging based on severity
        this.logToConsole(errorLog);

        // Send to external service if critical
        if (errorLog.severity === ERROR_SEVERITY.CRITICAL) {
            this.sendToExternalService(errorLog);
        }

        return errorLog;
    }

    /**
     * Log to console with formatting
     * @private
     */
    logToConsole(errorLog) {
        const styles = {
            [ERROR_SEVERITY.LOW]: 'color: #666;',
            [ERROR_SEVERITY.MEDIUM]: 'color: #f90;',
            [ERROR_SEVERITY.HIGH]: 'color: #f00;',
            [ERROR_SEVERITY.CRITICAL]: 'color: #f00; font-weight: bold;'
        };

        const icon = {
            [ERROR_SEVERITY.LOW]: 'ℹ️',
            [ERROR_SEVERITY.MEDIUM]: '⚠️',
            [ERROR_SEVERITY.HIGH]: '🚨',
            [ERROR_SEVERITY.CRITICAL]: '💀'
        };

        console.group(`${icon[errorLog.severity]} Error: ${errorLog.type}`);
        console.log(`%c${errorLog.message}`, styles[errorLog.severity]);
        console.log('Context:', errorLog.context);
        if (errorLog.stack) console.log('Stack:', errorLog.stack);
        console.groupEnd();
    }

    /**
     * Send error to external service
     * @private
     */
    async sendToExternalService(errorLog) {
        // TODO: Implement external service integration
        // This could be Sentry, LogRocket, etc.
        console.warn('External error logging not implemented');
    }

    /**
     * Get recent errors
     * @param {number} limit - Number of errors to return
     * @returns {Array} Recent errors
     */
    getRecentErrors(limit = 10) {
        return this.logs.slice(0, limit);
    }

    /**
     * Clear error logs
     */
    clearLogs() {
        this.logs = [];
    }
}

// Singleton logger instance
const errorLogger = new ErrorLogger();

/**
 * Error recovery handler
 */
class ErrorRecovery {
    /**
     * Get recovery strategy for an error
     * @param {Error} error - Error to handle
     * @returns {Object} Recovery strategy
     */
    static getStrategy(error) {
        const strategies = {
            [ERROR_TYPES.NETWORK]: {
                strategy: RECOVERY_STRATEGIES.RETRY,
                maxRetries: 3,
                backoffMs: 1000
            },
            [ERROR_TYPES.AUTH]: {
                strategy: RECOVERY_STRATEGIES.REDIRECT,
                path: '/login'
            },
            [ERROR_TYPES.RATE_LIMIT]: {
                strategy: RECOVERY_STRATEGIES.NOTIFY,
                waitMs: error.retryAfter || 60000
            },
            [ERROR_TYPES.DATABASE]: {
                strategy: RECOVERY_STRATEGIES.FALLBACK,
                useCached: true
            },
            [ERROR_TYPES.VALIDATION]: {
                strategy: RECOVERY_STRATEGIES.NOTIFY
            }
        };

        return strategies[error.type] || {
            strategy: RECOVERY_STRATEGIES.NOTIFY
        };
    }

    /**
     * Execute recovery strategy
     * @param {Error} error - Error to recover from
     * @param {Function} operation - Original operation that failed
     * @returns {Promise} Recovery result
     */
    static async recover(error, operation = null) {
        const strategy = this.getStrategy(error);

        switch (strategy.strategy) {
            case RECOVERY_STRATEGIES.RETRY:
                return this.retryOperation(operation, strategy);
            case RECOVERY_STRATEGIES.FALLBACK:
                return this.useFallback(error, strategy);
            case RECOVERY_STRATEGIES.REDIRECT:
                return this.redirect(strategy.path);
            case RECOVERY_STRATEGIES.RELOAD:
                return this.reload();
            case RECOVERY_STRATEGIES.RESET:
                return this.reset();
            case RECOVERY_STRATEGIES.NOTIFY:
            default:
                return this.notify(error);
        }
    }

    /**
     * Retry an operation with exponential backoff
     * @private
     */
    static async retryOperation(operation, strategy) {
        if (!operation) return null;

        for (let attempt = 1; attempt <= strategy.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                if (attempt === strategy.maxRetries) throw error;
                await new Promise(resolve => 
                    setTimeout(resolve, strategy.backoffMs * Math.pow(2, attempt - 1))
                );
            }
        }
    }

    /**
     * Use fallback data/operation
     * @private
     */
    static async useFallback(error, strategy) {
        if (strategy.useCached) {
            // TODO: Implement cache retrieval
            return null;
        }
        return null;
    }

    /**
     * Redirect to a safe state
     * @private
     */
    static redirect(path) {
        window.location.href = path;
    }

    /**
     * Reload the page
     * @private
     */
    static reload() {
        window.location.reload();
    }

    /**
     * Reset to initial state
     * @private
     */
    static reset() {
        // TODO: Implement state reset
        return null;
    }

    /**
     * Show notification to user
     * @private
     */
    static notify(error) {
        showErrorMessage(error);
        return null;
    }
}

/**
 * Show error message in UI
 * @param {Error} error - Error to display
 * @param {string} containerId - Container ID
 * @param {number} duration - Display duration
 */
export function showErrorMessage(error, containerId = 'error-container', duration = 5000) {
    const message = error.message || 'An unexpected error occurred';
    const severity = error.severity || ERROR_SEVERITY.MEDIUM;

    // Log error
    errorLogger.log(error);

    // Create or get container
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'error-container';
        
        const main = document.querySelector('main') || document.body;
        main.insertBefore(container, main.firstChild);
    }

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = `error-message error-${severity}`;
    errorElement.setAttribute('role', 'alert');
    errorElement.innerHTML = `
        <div class="error-content">
            <span class="error-icon">${getErrorIcon(severity)}</span>
            <span class="error-text">${message}</span>
            <button class="error-close" 
                    onclick="this.parentElement.parentElement.remove()"
                    aria-label="Close error message">×</button>
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

    // Add styles if not already present
    addErrorStyles();
}

/**
 * Show success message
 * @param {string} message - Success message
 * @param {string} containerId - Container ID
 * @param {number} duration - Display duration
 */
export function showSuccessMessage(message, containerId = 'success-container', duration = 3000) {
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
    successElement.setAttribute('role', 'status');
    successElement.innerHTML = `
        <div class="success-content">
            <span class="success-icon">✓</span>
            <span class="success-text">${message}</span>
            <button class="success-close" 
                    onclick="this.parentElement.parentElement.remove()"
                    aria-label="Close success message">×</button>
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

    addErrorStyles();
}

/**
 * Get error icon based on severity
 * @private
 */
function getErrorIcon(severity) {
    switch (severity) {
        case ERROR_SEVERITY.CRITICAL:
            return '💀';
        case ERROR_SEVERITY.HIGH:
            return '🚨';
        case ERROR_SEVERITY.MEDIUM:
            return '⚠️';
        case ERROR_SEVERITY.LOW:
        default:
            return 'ℹ️';
    }
}

/**
 * Add error styles to document
 * @private
 */
function addErrorStyles() {
    if (document.getElementById('error-handler-styles')) return;

    const styles = `
        .error-container,
        .success-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .error-message,
        .success-message {
            margin-bottom: 10px;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        }

        .error-message {
            background: #fff;
            border-left: 4px solid #dc3545;
        }

        .success-message {
            background: #fff;
            border-left: 4px solid #28a745;
        }

        .error-content,
        .success-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .error-icon,
        .success-icon {
            font-size: 1.2em;
        }

        .error-text,
        .success-text {
            flex: 1;
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
        }

        .error-close,
        .success-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;
            opacity: 0.5;
            transition: opacity 0.2s;
        }

        .error-close:hover,
        .success-close:hover {
            opacity: 1;
        }

        .error-critical {
            background: #fff0f0;
            border-color: #dc3545;
        }

        .error-high {
            background: #fff3f3;
            border-color: #ff4444;
        }

        .error-medium {
            background: #fff9f0;
            border-color: #ffa500;
        }

        .error-low {
            background: #f8f9fa;
            border-color: #6c757d;
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
            .error-container,
            .success-container {
                top: auto;
                bottom: 0;
                left: 0;
                right: 0;
                max-width: 100%;
            }

            .error-message,
            .success-message {
                margin: 0;
                border-radius: 0;
                border-left: none;
                border-top: 4px solid;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'error-handler-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

/**
 * Higher-order function for error handling
 * @param {Function} fn - Function to wrap
 * @param {Object} options - Error handling options
 */
export function withErrorHandling(fn, options = {}) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            // Log error
            errorLogger.log(error, { args });

            // Try to recover
            if (options.recover !== false) {
                try {
                    const result = await ErrorRecovery.recover(error, () => fn(...args));
                    if (result !== null) return result;
                } catch (recoveryError) {
                    errorLogger.log(recoveryError, { originalError: error });
                }
            }

            // Show error message
            if (options.showError !== false) {
                showErrorMessage(error);
            }

            // Rethrow if specified
            if (options.rethrow) {
                throw error;
            }

            return null;
        }
    };
}

// Export error classes and utilities
export {
    BaseError,
    ErrorLogger,
    ErrorRecovery,
    errorLogger
};
