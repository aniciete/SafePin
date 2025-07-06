// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDTwxz4f0JQbwRRCgP8z85xYS52sH_wb_s",
  authDomain: "safepin-1d951.firebaseapp.com",
  projectId: "safepin-1d951",
  storageBucket: "safepin-1d951.firebasestorage.app",
  messagingSenderId: "177195659244",
  appId: "1:177195659244:web:cffe2d8295601de5b05ac9",
  measurementId: "G-7FKZQV0WFB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
