/**
 * @fileoverview Handles authentication logic for the authority modal.
 * @module auth
 */

import {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
} from '../services/auth.service.js';

function setupAuthorityModal() {
    const authorityModal = document.getElementById('authorityModal');
    if (!authorityModal) return;

    const tabs = authorityModal.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('authorityLoginForm');
    const signupForm = document.getElementById('authoritySignUpForm');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const closeBtn = document.getElementById('closeAuthorityModalBtn');

    const switchTab = (tab) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab));
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        signInWithEmail(email, password);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const role = document.getElementById('authorityType').value;
        signUpWithEmail(email, password, role);
    });

    googleSignInBtn.addEventListener('click', () => signInWithGoogle('authority'));

    adminLoginBtn.addEventListener('click', () => {
        // Assuming redirectTo is a global function or needs to be imported
        window.location.href = '/admin-page/project/index.html';
    });

    closeBtn.addEventListener('click', () => {
        authorityModal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', setupAuthorityModal);