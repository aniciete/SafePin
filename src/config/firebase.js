import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPyEkv4KR0xXE7lh2QqEQDhXnQxQkqbXE",
    authDomain: "safepin-4c82c.firebaseapp.com",
    projectId: "safepin-4c82c",
    storageBucket: "safepin-4c82c.appspot.com",
    messagingSenderId: "1095800409544",
    appId: "1:1095800409544:web:e6e1d1f3c6c9c7e7d7c7d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }; 