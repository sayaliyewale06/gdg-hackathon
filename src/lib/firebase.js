import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMxbU6P3SFuzhydrrnugqfxqybxZTSiFg",
  authDomain: "gdghack-c92ae.firebaseapp.com",
  projectId: "gdghack-c92ae",
  storageBucket: "gdghack-c92ae.firebasestorage.app",
  messagingSenderId: "1011349585142",
  appId: "1:1011349585142:web:16ad64978ec94f4ea580d7",
  measurementId: "G-EBBK1KCRCS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
