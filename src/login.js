import {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail
} from './modules/auth.js';

// Show status message in the UI
function showStatus(message, type) {
    const statusDiv = document.getElementById('auth-status');
    statusDiv.textContent = message;
    statusDiv.className = 'auth-status ' + type;
    statusDiv.style.display = 'block';
}

function setLoading(isLoading) {
    const container = document.querySelector('.auth-container');
    if (isLoading) {
        container.classList.add('loading');
    } else {
        container.classList.remove('loading');
    }
}

// Handle form submissions
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    setLoading(true);
    
    const { user, error } = await signInWithEmail(email, password);
    setLoading(false);
    
    if (user) {
        showStatus('Authentication successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'authority-page/index.html';
        }, 1500);
    } else {
        showStatus(error || 'Authentication failed', 'error');
    }
});

let selectedRole = 'admin'; // Default role

// Handle Signup form submission
document.getElementById('credentialsStep').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (password.length < 6) {
        showStatus('Password should be at least 6 characters long.', 'error');
        return;
    }

    setLoading(true);
    const { user, error } = await signUpWithEmail(email, password, selectedRole);
    setLoading(false);

    if (user) {
        showStatus('Account created! A verification link has been sent to your email.', 'success');
        document.getElementById('credentialsStep').style.display = 'none';
        document.getElementById('roleStep').style.display = 'block';
    } else {
        showStatus(error || 'Sign up failed', 'error');
    }
});

// Handle Google Sign-In and Sign-Up
const handleGoogleAuth = async (role = null) => {
    setLoading(true);
    const { user, error } = await signInWithGoogle(role);
    setLoading(false);
    
    if (user) {
        showStatus('Authentication successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'authority-page/index.html';
        }, 1500);
    } else {
        showStatus(error || 'Authentication failed', 'error');
    }
};

document.getElementById('googleSignInBtn').addEventListener('click', () => handleGoogleAuth());
        
document.getElementById('googleSignUpBtn').addEventListener('click', () => {
    handleGoogleAuth(selectedRole);
});

// Tab switching
document.getElementById('loginTab').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('signupContainer').style.display = 'none';
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('auth-status').style.display = 'none';
    document.getElementById('auth-status').textContent = '';
});

document.getElementById('signupTab').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'flex';
    document.getElementById('roleStep').style.display = 'block';
    document.getElementById('credentialsStep').style.display = 'none';
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.add('active');
    document.getElementById('auth-status').style.display = 'none';
    document.getElementById('auth-status').textContent = '';
});

// Signup flow navigation
document.getElementById('roleContinueBtn').addEventListener('click', () => {
    selectedRole = document.getElementById('role').value;
    document.getElementById('roleStep').style.display = 'none';
    document.getElementById('credentialsStep').style.display = 'flex';
});

document.getElementById('backToRoleBtn').addEventListener('click', () => {
    document.getElementById('roleStep').style.display = 'block';
    document.getElementById('credentialsStep').style.display = 'none';
});

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').style.display = 'flex';
    document.getElementById('signupContainer').style.display = 'none';
});
