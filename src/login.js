import {
  createAuthModal,
  setupAuthModal,
} from './components/AuthModal.js';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  onAuthStateChange,
} from './services/auth.service.js';

document.addEventListener('DOMContentLoaded', () => {
  const authContainer = document.querySelector('.auth-container');
  const authModal = createAuthModal();
  authContainer.innerHTML = '';
  authContainer.appendChild(authModal);
  setupAuthModal(authModal);

  const statusDiv = authModal.querySelector('#auth-status');

  function updateAuthStatus(message, isError = false) {
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? 'red' : 'green';
  }

  async function handleLogin(email, password) {
    try {
      const result = await signInWithEmail(email, password);
      if (result.user) {
        updateAuthStatus(`Welcome, ${result.user.email}!`);
        setTimeout(() => {
          window.location.href = 'authority-page/index.html';
        }, 1500);
      }
    } catch (error) {
      updateAuthStatus(error.message, true);
    }
  }

  async function handleSignUp(email, password, role) {
    try {
      const result = await signUpWithEmail(email, password, role);
      if (result.user) {
        updateAuthStatus(`Welcome, ${result.user.email}!`);
        setTimeout(() => {
          window.location.href = 'authority-page/index.html';
        }, 1500);
      }
    } catch (error) {
      updateAuthStatus(error.message, true);
    }
  }

  async function handleGoogleSignIn(role) {
    try {
      const result = await signInWithGoogle(role);
      if (result.user) {
        updateAuthStatus(`Welcome, ${result.user.email}!`);
        setTimeout(() => {
          window.location.href = 'authority-page/index.html';
        }, 1500);
      }
    } catch (error) {
      updateAuthStatus(error.message, true);
    }
  }

  authModal.addEventListener('login', (e) => {
    const { email, password } = e.detail;
    handleLogin(email, password);
  });

  authModal.addEventListener('signup', (e) => {
    const { email, password, role } = e.detail;
    handleSignUp(email, password, role);
  });

  authModal.addEventListener('googleSignIn', (e) => {
    const { role } = e.detail;
    handleGoogleSignIn(role);
  });

});
