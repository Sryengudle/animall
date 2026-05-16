
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADAUUq6yN6Va8SicDjSrN3Y6Lat5soLuA",
  authDomain: "pashubazar-132a8.firebaseapp.com",
  projectId: "pashubazar-132a8",
  storageBucket: "pashubazar-132a8.firebasestorage.app",
  messagingSenderId: "767040019209",
  appId: "1:767040019209:web:0ac28afde993a646c051d8",
  measurementId: "G-7RE3R8V241"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
