import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAujf5Q-fyQM4xKQBdEIkkOKXnr2kDrA9k",
  authDomain: "financial-assistant-cade5.firebaseapp.com",
  projectId: "financial-assistant-cade5",
  storageBucket: "financial-assistant-cade5.firebasestorage.app",
  messagingSenderId: "324562262554",
  appId: "1:324562262554:web:fcdcc67e0a8862c44e0fa3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
