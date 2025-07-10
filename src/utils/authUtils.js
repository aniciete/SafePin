import { auth } from '../config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { initSessionManagement } from './sessionManager.js';
import { showAuthFeedback } from './ui.js';

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
