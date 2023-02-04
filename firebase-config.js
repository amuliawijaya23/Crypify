import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APPID
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// connect to firestore db
export const db = getFirestore(app);

// user authentication
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
