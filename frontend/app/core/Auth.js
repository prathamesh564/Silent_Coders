"use client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { auth } from "./firebase";

export async function login(email, password) {
  try {
  return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("auth.login error:", err);
    
if (err && err.code === "auth/configuration-not-found") {
throw new Error(
"Firebase Auth configuration not found. Check your Firebase project console: ensure the project exists and required sign-in providers are enabled, and that your firebaseConfig (apiKey/authDomain) is correct. Original error: " +
  err.message
 );
 }
    throw err;
  }
}

export async function createAccount(email, password) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error("auth.createAccount error:", err);
    throw err;
  }
}

export async function resetEmail(email) {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (err) {
    console.error("auth.resetEmail error:", err);
    throw err;
  }
}

export async function logout() {
  try {
    return await signOut(auth);
  } catch (err) {
    console.error("auth.logout error:", err);
    throw err;
  }
}