// Firebase Client Configuration
// Uses environment variables with hardcoded fallbacks for local development
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCMPo6KOSAgNYIDwh1aI72bLQoosYhNaZM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-6719476275-3891a.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-6719476275-3891a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-6719476275-3891a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "901398474203",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:901398474203:web:5306530ecc7c8b2e390bfe",
  measurementId: "G-CXNKSZ2845",
};
