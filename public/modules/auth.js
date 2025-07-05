import { auth, db } from './firebase-init.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendEmailVerification,
    getAdditionalUserInfo
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Sign up with email and password
export const signUpWithEmail = async (email, password, role) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send email verification
        await sendEmailVerification(user);

        // Store user role in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: role
        });

        return { user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
            return { user: null, error: 'Please verify your email before signing in.' };
        }
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// Sign in with Google
export const signInWithGoogle = async (role = null) => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if it's a new user
        const additionalUserInfo = getAdditionalUserInfo(result);
        if (additionalUserInfo.isNewUser && role) {
            // Store user role in Firestore for new users
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: role
            });
        } else if (!user.emailVerified) {
            // For returning users, you might want to enforce email verification if not already done
            // This case is less common with Google Sign-In as they are usually verified
        }

        return { user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        return { error: error.message };
    }
};

// Auth state observer
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
