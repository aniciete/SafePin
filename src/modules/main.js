import { signUpWithEmail, signInWithEmail, signInWithGoogle, onAuthStateChange } from './auth.js';

// Make auth functions available globally
window.handleAuthorityLogin = async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const result = await signInWithEmail(email, password);
        if (result.user) {
            updateAuthStatus({
                user: result.user,
                error: null
            });
            // Redirect to authority page after successful login
            setTimeout(() => {
                window.location.href = 'authority-page/index.html';
            }, 1500);
        }
    } catch (error) {
        updateAuthStatus({
            user: null,
            error: error.message
        });
    }
};

window.handleAuthoritySignUp = async () => {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const authorityType = document.getElementById('authorityType').value;
    
    if (!authorityType) {
        updateAuthStatus({
            user: null,
            error: 'Please select an authority type'
        });
        return;
    }

    try {
        const result = await signUpWithEmail(email, password);
        if (result.user) {
            // Here you would typically store the authority type in your database
            updateAuthStatus({
                user: result.user,
                error: null
            });
            // Redirect to authority page after successful signup
            setTimeout(() => {
                window.location.href = 'authority-page/index.html';
            }, 1500);
        }
    } catch (error) {
        updateAuthStatus({
            user: null,
            error: error.message
        });
    }
};

window.handleAuthorityGoogleSignIn = async () => {
    try {
        const result = await signInWithGoogle();
        if (result.user) {
            updateAuthStatus({
                user: result.user,
                error: null
            });
            // Redirect to authority page after successful Google sign-in
            setTimeout(() => {
                window.location.href = 'authority-page/index.html';
            }, 1500);
        }
    } catch (error) {
        updateAuthStatus({
            user: null,
            error: error.message
        });
    }
};

function updateAuthStatus(result) {
    const statusDiv = document.getElementById('auth-status');
    if (!statusDiv) return; // Guard against element not being present

    if (result.error) {
        statusDiv.textContent = `Error: ${result.error}`;
        statusDiv.style.color = 'red';
    } else if (result.user) {
        statusDiv.textContent = `Welcome, ${result.user.email}!`;
        statusDiv.style.color = 'green';
    }
}

window.redirectTo = (type) => {
    if (type === 'admin') {
        window.location.href = 'admin-page/project/index.html';
    }
};

// Check auth state on page load
onAuthStateChange((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
    } else {
        console.log('No user signed in');
    }
}); 