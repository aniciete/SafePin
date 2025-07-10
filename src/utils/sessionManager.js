import { auth } from '../config/firebase.js';
import { navigateTo, PATHS } from './pathUtils.js';
import { showAuthFeedback, showSessionWarning } from './ui.js';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout
let sessionTimer = null;
let warningTimer = null;

function handleSessionTimeout() {
    auth.signOut();
    showAuthFeedback('Session expired. Please log in again.', 'warning');
    navigateTo(PATHS.LOGIN, { replace: true });
}

export function resetSessionTimer() {
    clearTimeout(sessionTimer);
    clearTimeout(warningTimer);

    warningTimer = setTimeout(() => {
        showSessionWarning(resetSessionTimer);
    }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

    sessionTimer = setTimeout(() => {
        handleSessionTimeout();
    }, SESSION_TIMEOUT);
}

export function initSessionManagement() {
    resetSessionTimer();
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
}