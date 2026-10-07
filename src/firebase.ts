// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import type { ConfirmationResult } from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCbVV0yryF3gjp6-0mX74_A2afiIt7Tm08",
  authDomain: "connectx-e5c4e.firebaseapp.com",
  projectId: "connectx-e5c4e",
  storageBucket: "connectx-e5c4e.firebasestorage.app",
  messagingSenderId: "842553262184",
  appId: "1:842553262184:web:70d6e189a4a367ec26bbdd",
  measurementId: "G-QP136SQB4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Export the type if needed elsewhere in your app
export type { ConfirmationResult };