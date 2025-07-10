import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyCJg_Q-5GlDaZAPTTUFe8Lk1hzz0-K4BvM",
    authDomain: "safepin-1d951.firebaseapp.com",
    projectId: "safepin-1d951",
    storageBucket: "safepin-1d951.appspot.com",
    messagingSenderId: "177195659244",
    appId: "1:177195659244:web:5f9f9f9f9f9f9f9f9f9f9f",
    measurementId: "G-7FKZQV0WFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

// Initialize Analytics only if we're in a browser environment and not localhost
let analytics = null;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
        analytics = getAnalytics(app);
        setAnalyticsCollectionEnabled(analytics, false);
    } catch (error) {
        console.warn('Analytics initialization failed:', error);
    }
}

export { app, auth, db, functions, storage, analytics };