// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'bookuz-acd51.firebaseapp.com',
  projectId: 'bookuz-acd51',
  storageBucket: 'bookuz-acd51.firebasestorage.app',
  messagingSenderId: '768110026781',
  appId: '1:768110026781:web:d28d7f4738f1ab23bde6f4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
