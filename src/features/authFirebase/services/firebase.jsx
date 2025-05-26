// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Exportar funciones de Firestore
export {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqabnkwhyhitaXWCR0Q17EgPVNTl4FDb4",
  authDomain: "spotify-tdea.firebaseapp.com",
  projectId: "spotify-tdea",
  storageBucket: "spotify-tdea.firebasestorage.app",
  messagingSenderId: "198487371681",
  appId: "1:198487371681:web:6f81239704bb982f16a5e0",
  measurementId: "G-VCKX2T7EWM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
