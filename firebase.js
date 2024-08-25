// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFireStore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkDLzoTsSZjvmErdmD4cMUmDXDYwpcZAk",
  authDomain: "pantry-tracker-e7353.firebaseapp.com",
  projectId: "pantry-tracker-e7353",
  storageBucket: "pantry-tracker-e7353.appspot.com",
  messagingSenderId: "217491736962",
  appId: "1:217491736962:web:7fa1f473d603206d89a79b",
  measurementId: "G-TDTGFZ23VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);

export {firestore};
