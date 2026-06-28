import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Using the exact config you provided for the project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBV60cTA3STJvgIVAZ2Fp2Jh5jpN3wxnUc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "socialcheck-b35de.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "socialcheck-b35de",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "socialcheck-b35de.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1071962741227",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1071962741227:web:ec9e9e993c569dc02021ae",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-221DPF3NLM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is only available in browser environments
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
