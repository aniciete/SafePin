import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    getAdditionalUserInfo
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { ValidationError, AuthError } from '../utils/errorHandler.js';
import { sanitizeText } from '../utils/security.js';
import { showAuthFeedback } from '../utils/ui.js';

// Track failed login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Check if user is locked out due to too many failed attempts
 * @param {string} email 
 * @returns {boolean}
 */
function isLockedOut(email) {
    const attempts = loginAttempts.get(email);
    if (!attempts) return false;
    
    if (attempts.count >= MAX_LOGIN_ATTEMPTS && 
        Date.now() - attempts.timestamp < LOCKOUT_DURATION) {
        return true;
    }
    
    // Reset if lockout duration has passed
    if (Date.now() - attempts.timestamp >= LOCKOUT_DURATION) {
        loginAttempts.delete(email);
    }
    return false;
}

/**
 * Record a failed login attempt
 * @param {string} email 
 */
function recordFailedAttempt(email) {
    const attempts = loginAttempts.get(email) || { count: 0, timestamp: Date.now() };
    attempts.count++;
    attempts.timestamp = Date.now();
    loginAttempts.set(email, attempts);
}

/**
 * Reset login attempts for an email
 * @param {string} email 
 */
function resetLoginAttempts(email) {
    loginAttempts.delete(email);
}

/**
 * Sign up with email and password
 * @param {string} email 
 * @param {string} password 
 * @param {string} role 
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export const signUpWithEmail = async (email, password, role) => {
    try {
        // Validate inputs
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            throw new ValidationError(emailValidation.error);
        }

        const passwordValidation = validatePassword(password, {
            minLength: 12,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true
        });
        if (!passwordValidation.isValid) {
            throw new ValidationError(passwordValidation.error);
        }

        // Sanitize role
        role = sanitizeText(role);
        if (!['user', 'authority', 'admin'].includes(role)) {
            throw new ValidationError('Invalid role specified');
        }

        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user role in Firestore (minimal data)
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
            createdAt: new Date().toISOString(),
            onboardingCompleted: false
        });

        showAuthFeedback('Account created successfully! Please verify your email.', 'success');

        return { user, error: null };
    } catch (error) {
        if (error instanceof ValidationError || error instanceof AuthError) {
            return { user: null, error: error.message };
        }
        return { user: null, error: 'An error occurred during sign up' };
    }
};

/**
 * Sign in with email and password
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export const signInWithEmail = async (email, password) => {
    try {
        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            throw new ValidationError(emailValidation.error);
        }

        // Check for lockout
        if (isLockedOut(email)) {
            throw new AuthError('Too many failed attempts. Please try again later.');
        }

        // Attempt login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check email verification
        if (!userCredential.user.emailVerified) {
            throw new AuthError('Please verify your email before signing in.');
        }

        // Reset failed attempts on success
        resetLoginAttempts(email);

        // Check if onboarding is needed
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        const userData = userDoc.data();
        
        if (userData.role === 'authority' && !userData.onboardingCompleted) {
            showAuthFeedback('Please complete the onboarding process.', 'info');
            return { 
                user: userCredential.user, 
                error: null,
                requiresOnboarding: true 
            };
        }
        
        showAuthFeedback(`Welcome back, ${userCredential.user.email}!`, 'success');
        return { user: userCredential.user, error: null };
    } catch (error) {
        // Record failed attempt
        recordFailedAttempt(email);
        
        if (error instanceof ValidationError || error instanceof AuthError) {
            return { user: null, error: error.message };
        }
        return { user: null, error: 'An error occurred during sign in' };
    }
};

/**
 * Sign in with Google
 * @param {string|null} role - Optional role for new users
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export const signInWithGoogle = async (role = null) => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if new user
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (additionalUserInfo?.isNewUser && role) {
            // Validate and sanitize role
            role = sanitizeText(role);
            if (!['user', 'authority'].includes(role)) {
                throw new ValidationError('Invalid role specified');
            }

            // Store minimal user data
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: role,
                createdAt: new Date().toISOString()
            });
        }

        return { user, error: null };
    } catch (error) {
        if (error instanceof ValidationError || error instanceof AuthError) {
            return { user: null, error: error.message };
        }
        return { user: null, error: 'An error occurred during Google sign in' };
    }
};

/**
 * Sign out the current user
 * @returns {Promise<{error: string|null}>}
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error: 'An error occurred during sign out' };
    }
};

/**
 * Set up auth state observer
 * @param {Function} callback 
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
}; 