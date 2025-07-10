import { createAuthModal, setupAuthModal } from './components/AuthModal.js';

document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.querySelector('.auth-container');
    const authModal = createAuthModal();
    authContainer.innerHTML = '';
    authContainer.appendChild(authModal);
    setupAuthModal(authModal);
});
