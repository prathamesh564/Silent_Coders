"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../core/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  /**
   * UPDATED: Fixed collection name and data mapping
   * This now uses the "students" collection to match security rules and dashboard fetch logic.
   */
  const createRegister = async (profile) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No user logged in");

    // CRITICAL FIX: Changed "profiles" to "students" to match rules
    const userDocRef = doc(db, "students", uid);

    await setDoc(userDocRef, {
      ...profile,
      uid: uid,
      quizHistory: [], // Initialize for dashboard stats
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "Student record created successfully" };
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, createRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};