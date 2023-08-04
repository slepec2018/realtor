// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMX29u0XdWuHTw88R_6LgBTSjBNpIJyR4",
  authDomain: "realtor-8d145.firebaseapp.com",
  projectId: "realtor-8d145",
  storageBucket: "realtor-8d145.appspot.com",
  messagingSenderId: "218682687667",
  appId: "1:218682687667:web:a69d89575fe8e16d8730c6"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();