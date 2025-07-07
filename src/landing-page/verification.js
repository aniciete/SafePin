/**
 * @fileoverview Verification Controller Module
 * Handles authentication modal functionality and user verification
 * @module VerificationController
 */

import { signUpWithEmail, signInWithEmail, signInWithGoogle } from '../modules/auth.js';
import { ValidationError, ERROR_TYPES, ERROR_SEVERITY, showErrorMessage } from '../utils/errorHandler.js';

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 */

/**
 * Validation Service - Handles all form validation logic
 */
class ValidationService {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {ValidationResult}
     */
    validateEmail(email) {
        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email.trim()) {
            errors.push('Email is required');
        } else if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @param {boolean} isSignup - Whether this is for signup (stricter validation)
     * @returns {ValidationResult}
     */
    validatePassword(password, isSignup = false) {
        const errors = [];

        if (!password.trim()) {
            errors.push('Password is required');
            return { isValid: false, errors };
        }

        if (isSignup) {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            if (!/(?=.*[a-z])/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            if (!/(?=.*[A-Z])/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            if (!/(?=.*\d)/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            if (!/(?=.*[!@#$%^&*])/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*)');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate form fields
     * @param {HTMLFormElement} form - Form element to validate
     * @param {boolean} isSignup - Whether this is a signup form
     * @returns {ValidationResult}
     */
    validateForm(form, isSignup = false) {
        const email = form.querySelector('input[type="email"]')?.value || '';
        const password = form.querySelector('input[type="password"]')?.value || '';

        const emailValidation = this.validateEmail(email);
        const passwordValidation = this.validatePassword(password, isSignup);

        return {
            isValid: emailValidation.isValid && passwordValidation.isValid,
            errors: [...emailValidation.errors, ...passwordValidation.errors]
        };
    }
}

/**
 * UI Service - Handles all UI updates and interactions
 */
class UIService {
    constructor() {
        this.setupStyles();
    }

    /**
     * Setup required CSS styles dynamically
     * @private
     */
    setupStyles() {
        const styles = `
            .auth-status { padding: 10px; margin: 10px 0; border-radius: 4px; }
            .auth-status.loading { background: #f0f0f0; }
            .auth-status.success { background: #d4edda; color: #155724; }
            .auth-status.error { background: #f8d7da; color: #721c24; }
            .form-error { color: #dc3545; margin: 10px 0; padding: 10px; background: #f8d7da; border-radius: 4px; }
            .field-error { color: #dc3545; font-size: 0.875em; margin-top: 4px; }
        `;

        if (!document.getElementById('verification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'verification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }

    /**
     * Update authentication status display
     * @param {Object} params - Status parameters
     */
    updateAuthStatus({ user, error, loading }) {
        const statusDiv = document.getElementById('auth-status');
        if (!statusDiv) return;

        statusDiv.className = 'auth-status';
        
        if (loading) {
            statusDiv.textContent = loading;
            statusDiv.classList.add('loading');
        } else if (user) {
            statusDiv.textContent = 'Authentication successful! Redirecting...';
            statusDiv.classList.add('success');
        } else if (error) {
            statusDiv.textContent = error;
            statusDiv.classList.add('error');
        } else {
            statusDiv.textContent = '';
        }
    }

    /**
     * Show form validation errors
     * @param {string[]} errors - Array of error messages
     * @param {HTMLElement} form - Form element to show errors in
     */
    showFormErrors(errors, form) {
        this.clearFormErrors(form);

        if (errors.length === 0) return;

        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-error';
        errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');

        form.insertBefore(errorContainer, form.firstChild);
    }

    /**
     * Clear form validation errors
     * @param {HTMLElement} form - Form to clear errors from
     */
    clearFormErrors(form) {
        const errors = form.querySelectorAll('.form-error, .field-error');
        errors.forEach(error => error.remove());
    }

    /**
     * Toggle form loading state
     * @param {HTMLFormElement} form - Form element
     * @param {boolean} isLoading - Loading state
     */
    toggleFormLoading(form, isLoading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input');

        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.textContent;
            submitBtn.textContent = 'Please wait...';
            inputs.forEach(input => input.disabled = true);
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
            inputs.forEach(input => input.disabled = false);
        }
    }

    /**
     * Show/hide modal
     * @param {string} modalId - Modal element ID
     * @param {boolean} show - Whether to show or hide
     */
    toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        if (show) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        } else {
            modal.style.display = 'none';
            modal.classList.remove('active');
            this.clearFormErrors(modal);
            this.updateAuthStatus({});
        }
    }

    /**
     * Switch between login and signup forms
     * @param {string} tabName - Tab name ('login' or 'signup')
     */
    switchTab(tabName) {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const tabs = document.querySelectorAll('.auth-tab');

        if (!loginForm || !signupForm) return;

        this.clearFormErrors(loginForm);
        this.clearFormErrors(signupForm);
        this.updateAuthStatus({});

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.textContent.toLowerCase().includes(tabName));
        });

        loginForm.style.display = tabName === 'login' ? 'block' : 'none';
        signupForm.style.display = tabName === 'signup' ? 'block' : 'none';
    }
}

/**
 * Main Verification Controller Class
 * Handles authentication flow and user interactions
 */
export class VerificationController {
    constructor() {
        this.validationService = new ValidationService();
        this.uiService = new UIService();
        this.init();
    }

    /**
     * Initialize the controller
     * @private
     */
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
    }

    /**
     * Setup event listeners for all interactive elements
     * @private
     */
    setupEventListeners() {
        // Modal controls
        document.querySelectorAll('[data-action]').forEach(element => {
            const action = element.dataset.action;
            element.addEventListener('click', (e) => {
                e.preventDefault();
                switch (action) {
                    case 'open-modal':
                        this.openModal();
                        break;
                    case 'close-modal':
                        this.closeModal();
                        break;
                    case 'switch-tab':
                        this.uiService.switchTab(element.dataset.tab || 'login');
                        break;
                }
            });
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const googleAuthBtn = document.querySelector('[data-action="google-auth"]');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        if (googleAuthBtn) {
            googleAuthBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }

        // Close modal on outside click
        const modal = document.getElementById('authorityModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    /**
     * Setup real-time form validation
     * @private
     */
    setupFormValidation() {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input, form.id === 'signupForm');
                });
                input.addEventListener('input', () => {
                    const errorElement = input.parentElement.querySelector('.field-error');
                    if (errorElement) {
                        errorElement.remove();
                    }
                });
            });
        });
    }

    /**
     * Validate a single form field
     * @private
     * @param {HTMLInputElement} input - Input element to validate
     * @param {boolean} isSignup - Whether this is a signup form field
     */
    validateField(input, isSignup = false) {
        let validation;
        if (input.type === 'email') {
            validation = this.validationService.validateEmail(input.value);
        } else if (input.type === 'password') {
            validation = this.validationService.validatePassword(input.value, isSignup);
        }

        if (validation && !validation.isValid) {
            this.showFieldError(input, validation.errors[0]);
        }
    }

    /**
     * Show error message for a specific field
     * @private
     * @param {HTMLInputElement} input - Input element
     * @param {string} message - Error message
     */
    showFieldError(input, message) {
        const container = input.parentElement;
        let errorElement = container.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            container.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Handle login form submission
     * @private
     * @param {Event} e - Form submit event
     */
    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const validation = this.validationService.validateForm(form);

        if (!validation.isValid) {
            this.uiService.showFormErrors(validation.errors, form);
            return;
        }

        this.uiService.toggleFormLoading(form, true);
        this.uiService.updateAuthStatus({ loading: 'Signing in...' });

        try {
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;

            const { user, error } = await signInWithEmail(email, password);

            if (error) {
                throw new ValidationError(error, ERROR_SEVERITY.MEDIUM);
            }

            this.uiService.updateAuthStatus({ user });
            setTimeout(() => this.redirectTo('user'), 1500);
        } catch (error) {
            const validationError = error instanceof ValidationError ? error : new ValidationError(
                'Failed to sign in. Please try again.',
                ERROR_SEVERITY.MEDIUM
            );
            this.uiService.updateAuthStatus({ error: validationError.message });
        } finally {
            this.uiService.toggleFormLoading(form, false);
        }
    }

    /**
     * Handle signup form submission
     * @private
     * @param {Event} e - Form submit event
     */
    async handleSignup(e) {
        e.preventDefault();
        const form = e.target;
        const validation = this.validationService.validateForm(form, true);

        if (!validation.isValid) {
            this.uiService.showFormErrors(validation.errors, form);
            return;
        }

        this.uiService.toggleFormLoading(form, true);
        this.uiService.updateAuthStatus({ loading: 'Creating account...' });

        try {
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;
            const role = form.querySelector('select[name="role"]').value;

            const { user, error } = await signUpWithEmail(email, password, role);

            if (error) {
                throw new ValidationError(error, ERROR_SEVERITY.MEDIUM);
            }

            this.uiService.updateAuthStatus({ user });
            setTimeout(() => this.redirectTo('verify'), 1500);
        } catch (error) {
            const validationError = error instanceof ValidationError ? error : new ValidationError(
                'Failed to create account. Please try again.',
                ERROR_SEVERITY.MEDIUM
            );
            this.uiService.updateAuthStatus({ error: validationError.message });
        } finally {
            this.uiService.toggleFormLoading(form, false);
        }
    }

    /**
     * Handle Google Sign In
     * @private
     */
    async handleGoogleSignIn() {
        this.uiService.updateAuthStatus({ loading: 'Signing in with Google...' });

        try {
            const { user, error } = await signInWithGoogle();

            if (error) {
                throw new ValidationError(error, ERROR_SEVERITY.MEDIUM);
            }

            this.uiService.updateAuthStatus({ user });
            setTimeout(() => this.redirectTo('user'), 1500);
        } catch (error) {
            const validationError = error instanceof ValidationError ? error : new ValidationError(
                'Failed to sign in with Google. Please try again.',
                ERROR_SEVERITY.MEDIUM
            );
            this.uiService.updateAuthStatus({ error: validationError.message });
        }
    }

    /**
     * Open the authentication modal
     * @private
     */
    openModal() {
        this.uiService.toggleModal('authorityModal', true);
    }

    /**
     * Close the authentication modal
     * @private
     */
    closeModal() {
        this.uiService.toggleModal('authorityModal', false);
    }

    /**
     * Redirect user based on their type
     * @private
     * @param {string} type - User type
     */
    redirectTo(type) {
        const redirectMap = {
            'authority': '/authority-page/',
            'admin': '/admin-page/project/',
            'default': '/'
        };

        window.location.href = redirectMap[type] || redirectMap.default;
    }
}

// Initialize the controller when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VerificationController();
});
