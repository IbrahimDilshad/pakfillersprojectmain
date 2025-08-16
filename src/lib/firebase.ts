// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwTQgXHMWysDIerL3oKjgbhHaCwwAoOH4",
  authDomain: "pakfiler-5638f.firebaseapp.com",
  projectId: "pakfiler-5638f",
  storageBucket: "pakfiler-5638f.firebasestorage.app",
  messagingSenderId: "182942418687",
  appId: "1:182942418687:web:eb8c7bea4b944693f9aeca",
  measurementId: "G-0J51YEB0JN"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
