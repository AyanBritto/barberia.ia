// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLprT2VUS25seWhb_OmaoyK7FRCixfc70",
  authDomain: "barberia-ayan.firebaseapp.com",
  projectId: "barberia-ayan",
  storageBucket: "barberia-ayan.firebasestorage.app",
  messagingSenderId: "234688993789",
  appId: "1:234688993789:web:ce9c8d38f76968c2396194"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

if (import.meta.env.DEV) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).firebase = { auth, db, storage };
}