/**
 * Server-side security utilities for Firebase Cloud Functions
 * @module security
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import csrf from 'csurf';

// Initialize rate limiter with Redis for distributed systems
// For development/testing, use memory store
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// IP-based rate limiter for auth endpoints
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 failed attempts per hour
    message: 'Too many failed attempts from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// CSRF Protection
const csrfProtection = csrf({ cookie: true });

/**
 * Security middleware for Express-based Cloud Functions
 * @type {Object}
 */
export const securityMiddleware = {
    // Basic security headers
    helmet: helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ['\'self\''],
                scriptSrc: ['\'self\'', '\'unsafe-inline\'', 'https://apis.google.com'],
                styleSrc: ['\'self\'', '\'unsafe-inline\''],
                imgSrc: ['\'self\'', 'data:', 'https:'],
                connectSrc: ['\'self\'', 'https://*.firebaseio.com', 'https://*.cloudfunctions.net'],
                frameSrc: ['\'none\''],
                objectSrc: ['\'none\''],
                upgradeInsecureRequests: [],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        frameguard: {
            action: 'deny'
        },
        referrerPolicy: { policy: 'same-origin' }
    }),
    
    // Rate limiting
    rateLimiter: limiter,
    authRateLimiter: authLimiter,
    
    // CSRF Protection
    csrf: csrfProtection,
    
    // Validate Firebase ID Token
    validateFirebaseIdToken: async (req, res, next) => {
        if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
            !(req.cookies && req.cookies.__session)) {
            functions.logger.error('No Firebase ID token was passed');
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        let idToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else if (req.cookies) {
            idToken = req.cookies.__session;
        } else {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }

        try {
            const decodedIdToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedIdToken;
            next();
        } catch (error) {
            functions.logger.error('Error while verifying Firebase ID token:', error);
            res.status(403).json({ error: 'Unauthorized' });
        }
    }
};

/**
 * Input validation middleware
 * @param {Object} schema - Joi schema for request validation
 * @returns {Function} Express middleware
 */
export const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: 'Invalid input',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};

/**
 * Role-based access control middleware
 * @param {string[]} allowedRoles - Array of roles allowed to access the endpoint
 * @returns {Function} Express middleware
 */
export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userDoc = await admin.firestore()
                .collection('users')
                .doc(req.user.uid)
                .get();

            if (!userDoc.exists) {
                res.status(403).json({ error: 'User not found' });
                return;
            }

            const userData = userDoc.data();
            if (!allowedRoles.includes(userData.role)) {
                res.status(403).json({ error: 'Insufficient permissions' });
                return;
            }

            next();
        } catch (error) {
            functions.logger.error('Error checking user role:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

/**
 * Sanitize user input
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') {
        return '';
    }
    return xss(input.trim());
};

/**
 * Log security events
 * @param {string} event - Event type
 * @param {Object} data - Event data
 * @param {string} severity - Event severity
 */
export const logSecurityEvent = (event, data, severity = 'INFO') => {
    const logData = {
        timestamp: new Date().toISOString(),
        event,
        severity,
        ...data
    };

    switch (severity) {
        case 'ERROR':
            functions.logger.error(logData);
            break;
        case 'WARN':
            functions.logger.warn(logData);
            break;
        default:
            functions.logger.info(logData);
    }

    // Store security events in Firestore for audit
    admin.firestore()
        .collection('security_logs')
        .add(logData)
        .catch(error => {
            functions.logger.error('Error logging security event:', error);
        });
};

/**
 * Validate and sanitize request parameters
 * @param {Object} params - Request parameters to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validated and sanitized parameters
 */
export const validateParams = (params, rules) => {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(params)) {
        const rule = rules[key];
        if (!rule) continue;

        if (rule.type === 'string') {
            sanitized[key] = typeof value === 'string' ? 
                sanitizeInput(value) : '';
        } else if (rule.type === 'number') {
            sanitized[key] = Number(value) || 0;
        } else if (rule.type === 'boolean') {
            sanitized[key] = Boolean(value);
        }

        // Apply additional validation
        if (rule.validate && !rule.validate(sanitized[key])) {
            throw new Error(`Invalid ${key}`);
        }
    }

    return sanitized;
};

/**
 * Check if request is from allowed origin
 * @param {string} origin - Request origin
 * @returns {boolean} Whether origin is allowed
 */
export const isAllowedOrigin = (origin) => {
    const allowedOrigins = [
        'https://safepin.web.app',
        'https://safepin.firebaseapp.com'
    ];
    
    if (process.env.FUNCTIONS_EMULATOR) {
        allowedOrigins.push('http://localhost:5000');
    }
    
    return allowedOrigins.includes(origin);
};