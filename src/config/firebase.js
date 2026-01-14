// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy4VGB9WoVV5YArzaSHmF1fRBMYfpTe0c",
  authDomain: "datn-a5156.firebaseapp.com",
  databaseURL: "https://datn-a5156-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datn-a5156",
  storageBucket: "datn-a5156.firebasestorage.app",
  messagingSenderId: "637143869736",
  appId: "1:637143869736:web:c65cb81fb3f1bf786e081d",
  measurementId: "G-EYTWD6M6S6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export { app, analytics, firestore };
export const API_KEY = "AIzaSyAy4VGB9WoVV5YArzaSHmF1fRBMYfpTe0c";