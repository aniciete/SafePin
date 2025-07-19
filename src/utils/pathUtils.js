/**
 * Path utility functions for standardized path handling across SafePin
 */

/**
 * Get the base URL for the application
 * @returns {string} Base URL
 */
export function getBaseUrl() {
    return window.location.origin;
}

/**
 * Get a standardized path relative to the application root
 * @param {string} path - The path to standardize
 * @returns {string} Standardized path
 */
export function getStandardPath(path) {
    // Remove leading/trailing slashes and standardize
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    return `${getBaseUrl()}/${cleanPath}`;
}

/**
 * Navigation paths configuration
 */
export const PATHS = {
    // Public paths
    LANDING: '/',
    REPORT: '/report',
    VERIFICATION: '/landing-page/verification.html',
    ABOUT: '/landing-page/about-us.html',
    FEATURES: '/landing-page/features.html',
    FAQ: '/landing-page/faq.html',
    LOGIN: '/login.html',
    
    // Authenticated paths
    AUTHORITY_DASHBOARD: '/authority-page/index.html',
    ADMIN_DASHBOARD: '/admin-page/project/index.html',
    
    // Error pages
    NOT_FOUND: '/404.html'
};

/**
 * Navigate to a path using standardized handling
 * @param {string} path - Path to navigate to
 * @param {Object} options - Navigation options
 */
export function navigateTo(path, options = {}) {
    const { replace = false } = options;
    const standardPath = getStandardPath(path);
    
    if (replace) {
        window.location.replace(standardPath);
    } else {
        window.location.href = standardPath;
    }
}

/**
 * Check if current path matches a given path
 * @param {string} path - Path to check
 * @returns {boolean} Whether current path matches
 */
export function isCurrentPath(path) {
    const currentPath = window.location.pathname;
    const standardPath = path.replace(/^\/+|\/+$/g, '');
    return currentPath.endsWith(standardPath);
}

/**
 * Get breadcrumb trail for current path
 * @returns {Array<{label: string, path: string}>} Breadcrumb trail
 */
export function getBreadcrumbs() {
    const currentPath = window.location.pathname;
    const parts = currentPath.split('/').filter(Boolean);
    
    return parts.map((part, index) => {
        const path = '/' + parts.slice(0, index + 1).join('/');
        const label = part.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '');
        return {
            label: label.charAt(0).toUpperCase() + label.slice(1),
            path
        };
    });
} 