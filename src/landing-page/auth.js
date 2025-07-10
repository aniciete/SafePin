import { createAuthModal, setupAuthModal } from '../components/AuthModal.js';

document.addEventListener('DOMContentLoaded', () => {
    const authorityModal = document.getElementById('authorityModal');
    if (!authorityModal) return;

    const authModal = createAuthModal();
    authorityModal.innerHTML = '';
    authorityModal.appendChild(authModal);
    setupAuthModal(authorityModal);

    const openModalBtn = document.getElementById('openAuthorityModalBtn');
    if(openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            authorityModal.style.display = 'flex';
        });
    }

    const closeBtn = authorityModal.querySelector('#closeAuthorityModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            authorityModal.style.display = 'none';
        });
    }
});