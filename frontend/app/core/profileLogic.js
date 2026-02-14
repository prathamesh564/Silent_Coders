"use client";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createProfile(profileData) {
  try {
    if (!profileData.uid) throw new Error("No UID provided for profile");

    const docRef = doc(db, "profiles", profileData.uid);
    await setDoc(docRef, profileData);
    
    return { id: profileData.uid, ...profileData };
  } catch (err) {
    console.error("Error creating profile:", err);
    throw err;
  }
}
export async function updateProfile(profileId, newData) {
  try {
    const docRef = doc(db, "profiles", profileId);
    await updateDoc(docRef, newData);
    return true;
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
}