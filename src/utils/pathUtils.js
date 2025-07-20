/**
 * Path configuration for the SafePin application.
 * All paths should be root-relative for use with react-router-dom.
 */

export const PATHS = {
    // Public paths
    LANDING: '/',
    REPORT: '/report',
    LOGIN: '/login',
    SIGNUP: '/signup',
    
    // Authenticated paths
    DASHBOARD: '/dashboard',
    ADMIN_DASHBOARD: '/dashboard/admin',
    AUTHORITY_DASHBOARD: '/dashboard/authority',
    
    // Error pages
    NOT_FOUND: '*'
};