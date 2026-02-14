"use client";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";


export async function createUserProfile(userId, profileData) {
  try {
    const profileRef = collection(db, "profiles");
    const docRef = await addDoc(profileRef, { userId, ...profileData });
    return { id: docRef.id, ...profileData };
  } catch (err) {
    console.error("Error creating user profile:", err);
    throw err;
  }
}


export async function createProfile(profileData) {
  try {
    const profileRef = collection(db, "profiles");
    const docRef = await addDoc(profileRef, profileData);
    return { id: docRef.id, ...profileData };
  } catch (err) {
    console.error("Error creating profile:", err);
    throw err;
  }
}

export async function updateProfile(profileId, newData) {
  try {
    const docRef = doc(db, "profiles", profileId);
    await updateDoc(docRef, newData);
    console.log("Profile updated successfully!");
    return true;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
}