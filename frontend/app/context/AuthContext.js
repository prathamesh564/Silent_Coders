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

  const createRegister = async (profile) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("No user logged in");

    
    const userDocRef = doc(db, "students", uid);

    await setDoc(userDocRef, {
      ...profile,
      uid: uid,
      quizHistory: [], 
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