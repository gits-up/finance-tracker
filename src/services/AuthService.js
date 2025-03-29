import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithPopup,
} from "firebase/auth";

// Sign Up with Email & Password
export const registerUser = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: fullName }); // Store full name
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login with Email & Password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Store displayName if it's missing
    if (!user.displayName) {
      await updateProfile(user, { displayName: "Google User" }); // Default name
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
