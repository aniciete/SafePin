/**
 * Security utilities for client-side input sanitization and validation
 * @module security
 */

import DOMPurify from 'isomorphic-dompurify';

// Default configuration for allowed HTML elements and attributes
const DEFAULT_ALLOWED_TAGS = [
  'a', 'b', 'br', 'div', 'em', 'i', 'li', 'ol', 'p', 'span', 'strong', 'ul'
];

const DEFAULT_ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel', 'class'
];

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string|null|undefined} input - The HTML content to sanitize
 * @param {Object} [options] - Configuration options for sanitization
 * @param {string[]} [options.allowedTags] - List of allowed HTML tags
 * @param {string[]} [options.allowedAttr] - List of allowed HTML attributes
 * @param {boolean} [options.allowLinks=false] - Whether to allow links (if true, forces noopener/noreferrer)
 * @returns {string} Sanitized HTML string
 * @throws {TypeError} If input cannot be converted to string
 */
export function sanitizeHtml(input, options = {}) {
    // Handle null/undefined input
    if (input == null) {
        return '';
    }

    // Convert input to string
    try {
        input = String(input);
    } catch (e) {
        throw new TypeError('Input cannot be converted to string');
    }

    const {
        allowedTags = DEFAULT_ALLOWED_TAGS,
        allowedAttr = DEFAULT_ALLOWED_ATTR,
        allowLinks = false
    } = options;

    // Configure DOMPurify
    const config = {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: allowedAttr,
        ALLOW_DATA_ATTR: false,
        ALLOW_UNKNOWN_PROTOCOLS: false,
        ALLOW_SCRIPT_URLS: false,
        ADD_TAGS: ['#text'],
        WHOLE_DOCUMENT: false,
        SANITIZE_DOM: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_TRUSTED_TYPE: false
    };

    // If links are allowed, ensure they open safely
    if (allowLinks && !allowedTags.includes('a')) {
        config.ALLOWED_TAGS.push('a');
        config.ALLOWED_ATTR.push('href', 'target', 'rel');
        config.FORCE_HTTPS = true;
        
        // Add hook to enforce safe link attributes
        DOMPurify.addHook('afterSanitizeAttributes', function(node) {
            if (node.tagName === 'A') {
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
                
                // Ensure href is safe
                const href = node.getAttribute('href');
                if (href && !href.startsWith('http')) {
                    node.removeAttribute('href');
                }
            }
        });
    }

    // Perform sanitization
    return DOMPurify.sanitize(input, config);
}

/**
 * Sanitizes plain text content (removes all HTML)
 * @param {string|null|undefined} input - The text content to sanitize
 * @returns {string} Sanitized plain text
 * @throws {TypeError} If input cannot be converted to string
 */
export function sanitizeText(input) {
    // Handle null/undefined input
    if (input == null) {
        return '';
    }

    // Convert input to string
    try {
        input = String(input);
    } catch (e) {
        throw new TypeError('Input cannot be converted to string');
    }

    // Remove all HTML tags and decode entities
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        ALLOW_DATA_ATTR: false,
        RETURN_DOM_FRAGMENT: false,
    });
}