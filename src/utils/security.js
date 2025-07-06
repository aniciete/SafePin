/**
 * Security utilities for SafePin application
 * Provides security-related functions and protections
 */

/**
 * Rate limiting utility for client-side operations
 */
class RateLimiter {
    constructor() {
        this.attempts = new Map();
    }

    /**
     * Check if an action is rate limited
     * @param {string} key - Unique key for the action (e.g., 'login:user@email.com')
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {boolean} - True if action is allowed, false if rate limited
     */
    isAllowed(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 15 minutes default
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        
        // Remove old attempts outside the window
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        // Update the attempts array
        this.attempts.set(key, validAttempts);
        
        // Check if we're under the limit
        return validAttempts.length < maxAttempts;
    }

    /**
     * Record an attempt
     * @param {string} key - Unique key for the action
     */
    recordAttempt(key) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        attempts.push(now);
        this.attempts.set(key, attempts);
    }

    /**
     * Get remaining attempts
     * @param {string} key - Unique key for the action
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {number} - Number of remaining attempts
     */
    getRemainingAttempts(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        return Math.max(0, maxAttempts - validAttempts.length);
    }

    /**
     * Get time until next attempt is allowed
     * @param {string} key - Unique key for the action
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {number} - Milliseconds until next attempt is allowed, 0 if allowed now
     */
    getTimeUntilReset(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        if (this.isAllowed(key, maxAttempts, windowMs)) {
            return 0;
        }

        const now = Date.now();
        const attempts = this.attempts.get(key) || [];
        const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        if (validAttempts.length === 0) {
            return 0;
        }

        // Time until the oldest attempt expires
        const oldestAttempt = Math.min(...validAttempts);
        return windowMs - (now - oldestAttempt);
    }

    /**
     * Clear attempts for a key
     * @param {string} key - Unique key for the action
     */
    clearAttempts(key) {
        this.attempts.delete(key);
    }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * CSRF protection utilities
 */
export const csrf = {
    /**
     * Generate a CSRF token
     * @returns {string} - CSRF token
     */
    generateToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },

    /**
     * Store CSRF token in session storage
     * @param {string} token - CSRF token to store
     */
    storeToken(token) {
        sessionStorage.setItem('csrf_token', token);
    },

    /**
     * Get stored CSRF token
     * @returns {string|null} - Stored CSRF token or null
     */
    getToken() {
        return sessionStorage.getItem('csrf_token');
    },

    /**
     * Validate CSRF token
     * @param {string} token - Token to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    validateToken(token) {
        const storedToken = this.getToken();
        return storedToken && storedToken === token;
    },

    /**
     * Add CSRF token to form data
     * @param {FormData} formData - Form data to add token to
     */
    addToFormData(formData) {
        const token = this.getToken();
        if (token) {
            formData.append('csrf_token', token);
        }
    },

    /**
     * Add CSRF token to request headers
     * @param {Object} headers - Headers object to add token to
     */
    addToHeaders(headers) {
        const token = this.getToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }
};

/**
 * Content Security Policy utilities
 */
export const csp = {
    /**
     * Generate a nonce for inline scripts/styles
     * @returns {string} - Nonce value
     */
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode(...array));
    },

    /**
     * Check if current page has CSP violations
     * @returns {boolean} - True if violations detected
     */
    hasViolations() {
        // This would typically check for CSP violation reports
        // For now, we'll just return false
        return false;
    }
};

/**
 * Input sanitization utilities (additional to validation.js)
 */
export const sanitize = {
    /**
     * Remove potentially dangerous characters from user input
     * @param {string} input - Input to sanitize
     * @returns {string} - Sanitized input
     */
    userInput(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }

        return input
            // Remove null bytes
            .replace(/\0/g, '')
            // Remove control characters except newlines and tabs
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            // Limit consecutive whitespace
            .replace(/\s{10,}/g, ' '.repeat(10))
            // Remove potential path traversal
            .replace(/\.\.\//g, '')
            .replace(/\.\.\\/g, '');
    },

    /**
     * Sanitize filename for safe storage
     * @param {string} filename - Filename to sanitize
     * @returns {string} - Sanitized filename
     */
    filename(filename) {
        if (!filename || typeof filename !== 'string') {
            return 'untitled';
        }

        return filename
            // Remove path separators
            .replace(/[/\\]/g, '')
            // Remove dangerous characters
            .replace(/[<>:"|?*]/g, '')
            // Remove control characters
            .replace(/[\x00-\x1F\x7F]/g, '')
            // Limit length
            .substring(0, 255)
            // Ensure it's not empty
            || 'untitled';
    },

    /**
     * Sanitize URL to prevent malicious redirects
     * @param {string} url - URL to sanitize
     * @param {Array} allowedDomains - List of allowed domains
     * @returns {string|null} - Sanitized URL or null if invalid
     */
    url(url, allowedDomains = []) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        try {
            const urlObj = new URL(url);
            
            // Only allow http and https protocols
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return null;
            }

            // Check allowed domains if specified
            if (allowedDomains.length > 0) {
                const isAllowed = allowedDomains.some(domain => 
                    urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
                );
                if (!isAllowed) {
                    return null;
                }
            }

            return urlObj.toString();
        } catch (error) {
            return null;
        }
    }
};

/**
 * Session security utilities
 */
export const session = {
    /**
     * Check if session is expired based on last activity
     * @param {number} maxInactiveMs - Maximum inactive time in milliseconds
     * @returns {boolean} - True if session is expired
     */
    isExpired(maxInactiveMs = 30 * 60 * 1000) { // 30 minutes default
        const lastActivity = localStorage.getItem('last_activity');
        if (!lastActivity) {
            return true;
        }

        const now = Date.now();
        const lastActivityTime = parseInt(lastActivity, 10);
        return (now - lastActivityTime) > maxInactiveMs;
    },

    /**
     * Update last activity timestamp
     */
    updateActivity() {
        localStorage.setItem('last_activity', Date.now().toString());
    },

    /**
     * Clear session data
     */
    clear() {
        localStorage.removeItem('last_activity');
        sessionStorage.clear();
    },

    /**
     * Initialize session monitoring
     * @param {Function} onExpired - Callback when session expires
     * @param {number} checkIntervalMs - How often to check in milliseconds
     */
    monitor(onExpired, checkIntervalMs = 60 * 1000) { // Check every minute
        // Update activity on user interactions
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, this.updateActivity, { passive: true });
        });

        // Periodic session check
        const checkSession = () => {
            if (this.isExpired()) {
                if (typeof onExpired === 'function') {
                    onExpired();
                }
            }
        };

        setInterval(checkSession, checkIntervalMs);
        
        // Initial activity update
        this.updateActivity();
    }
};

/**
 * Secure random utilities
 */
export const random = {
    /**
     * Generate cryptographically secure random string
     * @param {number} length - Length of string to generate
     * @param {string} charset - Character set to use
     * @returns {string} - Random string
     */
    string(length = 32, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => charset[byte % charset.length]).join('');
    },

    /**
     * Generate random integer within range
     * @param {number} min - Minimum value (inclusive)
     * @param {number} max - Maximum value (exclusive)
     * @returns {number} - Random integer
     */
    integer(min = 0, max = 100) {
        const range = max - min;
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return min + (array[0] % range);
    },

    /**
     * Generate UUID v4
     * @returns {string} - UUID string
     */
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
};

/**
 * Password security utilities
 */
export const password = {
    /**
     * Check password strength
     * @param {string} password - Password to check
     * @returns {Object} - {score: number, feedback: Array}
     */
    checkStrength(password) {
        if (!password) {
            return { score: 0, feedback: ['Password is required'] };
        }

        const feedback = [];
        let score = 0;

        // Length check
        if (password.length >= 8) score += 1;
        else feedback.push('Use at least 8 characters');

        if (password.length >= 12) score += 1;

        // Character variety checks
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('Include lowercase letters');

        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('Include uppercase letters');

        if (/\d/.test(password)) score += 1;
        else feedback.push('Include numbers');

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        else feedback.push('Include special characters');

        // Common patterns check
        if (/(.)\1{2,}/.test(password)) {
            score -= 1;
            feedback.push('Avoid repeated characters');
        }

        if (/123|abc|qwe/i.test(password)) {
            score -= 1;
            feedback.push('Avoid common sequences');
        }

        return {
            score: Math.max(0, Math.min(5, score)),
            feedback: feedback
        };
    },

    /**
     * Generate secure password
     * @param {number} length - Password length
     * @param {Object} options - Generation options
     * @returns {string} - Generated password
     */
    generate(length = 16, options = {}) {
        const {
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSymbols = true,
            excludeSimilar = true
        } = options;

        let charset = '';
        if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (excludeSimilar) {
            charset = charset.replace(/[il1Lo0O]/g, '');
        }

        if (!charset) {
            throw new Error('No character set available for password generation');
        }

        return random.string(length, charset);
    }
};

/**
 * Initialize security measures
 */
export const initSecurity = () => {
    // Generate and store CSRF token
    const csrfToken = csrf.generateToken();
    csrf.storeToken(csrfToken);

    // Add CSRF token to all forms
    document.addEventListener('DOMContentLoaded', () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        });
    });

    // Monitor session activity
    session.monitor(() => {
        console.warn('Session expired due to inactivity');
        // Redirect to login or show session expired message
        if (window.location.pathname !== '/login.html') {
            window.location.href = '/login.html?reason=session_expired';
        }
    });

    // Add security headers via meta tags (where possible)
    const addMetaTag = (name, content) => {
        const meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('http-equiv') ? 'http-equiv' : 'name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    };

    // Prevent MIME type sniffing
    addMetaTag('http-equiv', 'X-Content-Type-Options');
    
    // Prevent clickjacking
    addMetaTag('http-equiv', 'X-Frame-Options');
};

// Auto-initialize security when module is loaded
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }
}
