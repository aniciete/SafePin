import { onAuthStateChange } from '../services/auth.service.js';

let currentUser = null;

export function initializeSession() {
    onAuthStateChange((user) => {
        currentUser = user;
        const event = new CustomEvent('auth-changed', {
            detail: { user },
        });
        document.dispatchEvent(event);
    });
}

export function getCurrentUser() {
    return currentUser;
}