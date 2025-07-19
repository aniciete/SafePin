import { supabase } from '../config/supabase.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { ValidationError, AuthError } from '../utils/errorHandler.js';
import { sanitizeText } from '../utils/security.js';
import { showAuthFeedback } from '../utils/ui.js';

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
        if (!['regular', 'authority', 'admin'].includes(role)) {
            throw new ValidationError('Invalid role specified');
        }

        // Create user with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    role: role
                }
            }
        });

        if (error) {
            throw new AuthError(error.message);
        }

        showAuthFeedback('Account created successfully! Please verify your email.', 'success');

        return { user: data.user, error: null };
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

        // Attempt login
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new AuthError(error.message);
        }

        // Check if onboarding is needed
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, onboarding_completed')
            .eq('id', data.user.id)
            .single();

        if (userError) {
            throw new AuthError('Could not retrieve user data.');
        }
        
        if (userData.role === 'authority' && !userData.onboarding_completed) {
            showAuthFeedback('Please complete the onboarding process.', 'info');
            return { 
                user: data.user, 
                error: null,
                requiresOnboarding: true 
            };
        }
        
        showAuthFeedback(`Welcome back, ${data.user.email}!`, 'success');
        return { user: data.user, error: null };
    } catch (error) {
        if (error instanceof ValidationError || error instanceof AuthError) {
            return { user: null, error: error.message };
        }
        return { user: null, error: 'An error occurred during sign in' };
    }
};

/**
 * Sign in with Google
 * @returns {Promise<{user: Object|null, error: string|null}>}
 */
export const signInWithGoogle = async () => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            throw new AuthError(error.message);
        }

        return { user: data.user, error: null };
    } catch (error) {
        if (error instanceof AuthError) {
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
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new AuthError(error.message);
        }
        return { error: null };
    } catch (error) {
        return { error: 'An error occurred during sign out' };
    }
};

/**
 * Set up auth state observer
 * @param {Function} callback 
 * @returns {{ data: { subscription: any } }} Unsubscribe object
 */
export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
};