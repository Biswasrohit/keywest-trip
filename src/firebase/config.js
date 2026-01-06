import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your Firebase project configuration
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps > Add app > Web
// 4. Copy the firebaseConfig object and paste below
// 5. Go to Realtime Database > Create Database > Start in test mode

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isConfigured = firebaseConfig.apiKey && firebaseConfig.databaseURL;

let app = null;
let database = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase connected successfully!');
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn(
    'Firebase not configured. Using local storage fallback.\n' +
    'To enable real-time sync, create a .env file with your Firebase credentials.'
  );
}

export { app, database };
