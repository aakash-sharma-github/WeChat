// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXZJYPt2_MLFQz8X8qrMrmKunDiuIyjs8",
  authDomain: "video-con-ba0d1.firebaseapp.com",
  projectId: "video-con-ba0d1",
  storageBucket: "video-con-ba0d1.appspot.com",
  messagingSenderId: "463202979511",
  appId: "1:463202979511:web:a85c5b28cd1fcfeed3c732",
  measurementId: "G-8X0T53D77V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB, "users");
export const meetingsRef = collection(firebaseDB, "meetings");
