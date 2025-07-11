import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics, setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDTwxz4f0JQbwRRCgP8z85xYS52sH_wb_s",
  authDomain: "safepin-1d951.firebaseapp.com",
  projectId: "safepin-1d951",
  storageBucket: "safepin-1d951.firebasestorage.app",
  messagingSenderId: "177195659244",
  appId: "1:177195659244:web:cffe2d8295601de5b05ac9",
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
        setAnalyticsCollectionEnabled(analytics, true); // Enable analytics
    } catch (error) {
        console.warn('Analytics initialization failed:', error.message);
    }
}

export { app, auth, db, functions, storage, analytics };