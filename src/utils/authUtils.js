import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { navigateTo, PATHS } from './pathUtils.js';
import { showSessionWarning } from './ui.js';

// Constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout
let sessionTimer = null;
let warningTimer = null;

/**
 * Initialize session management
 */
export function initSessionManagement() {
    resetSessionTimer();
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
}

/**
 * Reset the session timer
 */
function resetSessionTimer() {
    clearTimeout(sessionTimer);
    clearTimeout(warningTimer);
    
    // Set warning timer
    warningTimer = setTimeout(() => {
        showSessionWarning();
    }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);
    
    // Set session timeout timer
    sessionTimer = setTimeout(() => {
        handleSessionTimeout();
    }, SESSION_TIMEOUT);
}

/**
 * Show session timeout warning
 */

/**
 * Handle session timeout
 */
async function handleSessionTimeout() {
    await auth.signOut();
    showAuthFeedback('Session expired. Please log in again.', 'warning');
    navigateTo(PATHS.LOGIN, { replace: true });
}


/**
 * Add auth state observer
 * @param {Function} callback - Callback function
 */
export function addAuthStateObserver(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            showAuthFeedback(`Welcome back, ${user.email}!`, 'success');
            initSessionManagement();
        }
        callback(user);
    });
}
