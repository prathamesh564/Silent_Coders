"use client";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTQweU4X8G2S61nGLGYx9vcv-4iWf8cNQ",
  authDomain: "silentcode-52cd8.firebaseapp.com",
  projectId: "silentcode-52cd8",
  storageBucket: "silentcode-52cd8.firebasestorage.app",
  messagingSenderId: "1045605615056",
  appId: "1:1045605615056:web:b361a1eaaebe2006dd25d5",
  measurementId: "G-5VL5CF21ML"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("Firebase analytics not initialized:", err.message || err);
  }
}