import {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
} from '../services/auth.service.js';

const MODAL_HTML = `
<div class="auth-container">
    <div class="auth-header">
        <h1>Authority Access Portal</h1>
        <p>Sign in or create an account</p>
    </div>
    
    <div class="auth-tabs">
        <button class="auth-tab active" id="loginTab" aria-label="Sign In">Sign In</button>
        <button class="auth-tab" id="signupTab" aria-label="Sign Up">Sign Up</button>
    </div>
    
    <div id="auth-status"></div>
    
    <!-- Login Form -->
    <form id="loginForm" class="auth-form active">
        <label for="loginEmail" class="visually-hidden">Organization Email</label>
        <input type="email" id="loginEmail" placeholder="Organization Email" required>
        <label for="loginPassword" class="visually-hidden">Password</label>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="submit" aria-label="Sign In with email and password">Sign In</button>
        <div class="auth-divider">OR</div>
        <button type="button" class="google-signin-btn" id="googleSignInBtn" aria-label="Sign in with Google">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo">
            Sign in with Google
        </button>
    </form>
    
    <!-- Signup Container -->
    <div id="signupContainer" class="auth-form" style="display: none;">
        <!-- Step 1: Role Selection -->
        <div id="roleStep" style="width: 100%;">
            <div class="role-selection" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                <label for="role" style="font-weight: 500; color: #4a5568;">Select your role to continue:</label>
                <select id="role" name="role" style="padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 1rem; background-color: white;">
                    <option value="admin">Admin</option>
                    <option value="authority">Authority</option>
                </select>
            </div>
            <button type="button" id="roleContinueBtn" aria-label="Continue to the next step">Continue</button>
        </div>

        <!-- Step 2: Credentials -->
        <form id="credentialsStep" style="display: none; flex-direction: column; gap: 1rem; width: 100%;">
            <label for="signupEmail" class="visually-hidden">Your Email</label>
            <input type="email" id="signupEmail" placeholder="Your Email" required>
            <label for="signupPassword" class="visually-hidden">Create Password</label>
            <input type="password" id="signupPassword" placeholder="Create Password" required>
            <button type="submit" aria-label="Sign Up with email and password">Sign Up</button>
            <div class="auth-divider">OR</div>
            <button type="button" class="google-signin-btn" id="googleSignUpBtn" aria-label="Sign up with Google">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo">
                Sign up with Google
            </button>
            <button type="button" id="backToRoleBtn" style="background: #a0aec0; margin-top: 1rem;" aria-label="Go back to the previous step">Back</button>
        </form>
    </div>
</div>
`;

export function createAuthModal() {
    const modal = document.createElement('div');
    modal.innerHTML = MODAL_HTML;
    return modal;
}

export function setupAuthModal(modal) {
    const tabs = modal.querySelectorAll('.auth-tab');
    const loginForm = modal.querySelector('#loginForm');
    const signupForm = modal.querySelector('#signupContainer');
    const googleSignInBtn = modal.querySelector('#googleSignInBtn');
    const googleSignUpBtn = modal.querySelector('#googleSignUpBtn');
    const adminLoginBtn = modal.querySelector('#adminLoginBtn');
    const closeBtn = modal.querySelector('#closeAuthorityModalBtn');
    const roleStep = modal.querySelector('#roleStep');
    const credentialsStep = modal.querySelector('#credentialsStep');
    const roleContinueBtn = modal.querySelector('#roleContinueBtn');
    const backToRoleBtn = modal.querySelector('#backToRoleBtn');

    const switchTab = (tab) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.id === 'loginTab') {
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
        const email = modal.querySelector('#loginEmail').value;
        const password = modal.querySelector('#loginPassword').value;
        signInWithEmail(email, password);
    });

    credentialsStep.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = modal.querySelector('#signupEmail').value;
        const password = modal.querySelector('#signupPassword').value;
        const role = modal.querySelector('#role').value;
        signUpWithEmail(email, password, role);
    });

    googleSignInBtn.addEventListener('click', () => signInWithGoogle('authority'));
    googleSignUpBtn.addEventListener('click', () => signInWithGoogle(modal.querySelector('#role').value));

    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            window.location.href = '/admin-page/project/index.html';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    roleContinueBtn.addEventListener('click', () => {
        roleStep.style.display = 'none';
        credentialsStep.style.display = 'flex';
    });

    backToRoleBtn.addEventListener('click', () => {
        roleStep.style.display = 'block';
        credentialsStep.style.display = 'none';
    });
}