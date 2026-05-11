import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Using the exact config you provided for the project
const firebaseConfig = {
  apiKey: "AIzaSyBV60cTA3STJvgIVAZ2Fp2Jh5jpN3wxnUc",
  authDomain: "socialcheck-b35de.firebaseapp.com",
  projectId: "socialcheck-b35de",
  storageBucket: "socialcheck-b35de.firebasestorage.app",
  messagingSenderId: "1071962741227",
  appId: "1:1071962741227:web:ec9e9e993c569dc02021ae",
  measurementId: "G-221DPF3NLM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is only available in browser environments
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
