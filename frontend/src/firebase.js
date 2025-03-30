import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDnRAhckzltVeKi-eh7NB3JHCfp9rA5qhU",
  authDomain: "petcarenew-16b82.firebaseapp.com",
  databaseURL: "https://petcarenew-16b82-default-rtdb.firebaseio.com",
  projectId: "petcarenew-16b82",
  storageBucket: "petcarenew-16b82.appspot.com", // Fixed incorrect storageBucket URL
  messagingSenderId: "756592329567",
  appId: "1:756592329567:web:c35e3bb515228c4a7cecea",
  measurementId: "G-E4NFS5Y6QC",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const realtimeDB = getDatabase(app);

// Initialize Firestore Database
const firestoreDB = getFirestore(app);

export { realtimeDB, firestoreDB, collection, getDocs };
