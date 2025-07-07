import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { navigateTo, PATHS } from './pathUtils.js';

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
function showSessionWarning() {
    const warningModal = document.createElement('div');
    warningModal.className = 'session-warning-modal';
    warningModal.innerHTML = `
        <div class="modal-content">
            <h3>Session Expiring Soon</h3>
            <p>Your session will expire in 5 minutes due to inactivity.</p>
            <button onclick="window.extendSession()" class="btn btn-primary">Stay Logged In</button>
        </div>
    `;
    document.body.appendChild(warningModal);
    
    // Add the extend session function to window
    window.extendSession = () => {
        warningModal.remove();
        resetSessionTimer();
    };
}

/**
 * Handle session timeout
 */
async function handleSessionTimeout() {
    await auth.signOut();
    showAuthFeedback('Session expired. Please log in again.', 'warning');
    navigateTo(PATHS.LOGIN, { replace: true });
}

/**
 * Show authentication feedback
 * @param {string} message - Feedback message
 * @param {string} type - Feedback type (success, error, warning)
 */
export function showAuthFeedback(message, type = 'info') {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `auth-feedback ${type}`;
    feedbackDiv.textContent = message;
    
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.auth-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    document.body.appendChild(feedbackDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        feedbackDiv.remove();
    }, 5000);
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

// Add styles for feedback and modals
const styles = document.createElement('style');
styles.textContent = `
    .auth-feedback {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 4px;
        z-index: 1000;
        animation: slidein 0.3s ease-in-out;
    }
    
    .auth-feedback.success {
        background: #4CAF50;
        color: white;
    }
    
    .auth-feedback.error {
        background: #f44336;
        color: white;
    }
    
    .auth-feedback.warning {
        background: #ff9800;
        color: white;
    }
    
    .auth-feedback.info {
        background: #2196F3;
        color: white;
    }
    
    .session-warning-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .session-warning-modal .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 4px;
        text-align: center;
    }
    
    @keyframes slidein {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(styles); 