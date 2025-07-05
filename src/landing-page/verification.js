import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '/modules/auth.js';

// --- Auth Functions (exposed to window for HTML onclick) ---
window.handleAuthorityLogin = async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const result = await signInWithEmail(email, password);
        if (result.user) {
            updateAuthStatus({ user: result.user, error: null });
            setTimeout(() => { window.location.href = '/authority-page/index.html'; }, 1500);
        }
    } catch (error) {
        updateAuthStatus({ user: null, error: error.message });
    }
};

window.handleAuthoritySignUp = async () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
        const result = await signUpWithEmail(email, password);
        if (result.user) {
            updateAuthStatus({ user: result.user, error: null });
            setTimeout(() => { window.location.href = '/authority-page/index.html'; }, 1500);
        }
    } catch (error) {
        updateAuthStatus({ user: null, error: error.message });
    }
};

window.handleAuthorityGoogleSignIn = async () => {
    try {
        const result = await signInWithGoogle();
        if (result.user) {
            updateAuthStatus({ user: result.user, error: null });
            setTimeout(() => { window.location.href = '/authority-page/index.html'; }, 1500);
        }
    } catch (error) {
        updateAuthStatus({ user: null, error: error.message });
    }
};

// --- Modal Functions ---
window.openModal = () => {
    document.getElementById('authorityModal').style.display = 'flex';
};

window.closeModal = () => {
    document.getElementById('authorityModal').style.display = 'none';
};

window.switchTab = (tab) => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('signupForm').style.display = 'none';
    } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('signupForm').style.display = 'block';
    }
};

window.redirectTo = (type) => {
    if (type === 'admin') {
        window.location.href = '/admin-page/project/index.html';
    }
    closeModal();
};

// --- UI Update Functions ---
function updateAuthStatus({ user, error }) {
    const statusDiv = document.getElementById('auth-status');
    if (user) {
        statusDiv.textContent = 'Authentication successful! Redirecting...';
        statusDiv.style.color = '#155724';
    } else if (error) {
        statusDiv.textContent = `Error: ${error}`;
        statusDiv.style.color = '#721c24';
    }
}

// --- Event Listeners ---
window.addEventListener('click', (event) => {
    const modal = document.getElementById('authorityModal');
    if (event.target === modal) {
        closeModal();
    }
});
