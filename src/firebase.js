import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQZ54pIfxjoUjWRKmt9IUbV7_C3ZbDet4",
  authDomain: "innsightai123.firebaseapp.com",
  projectId: "innsightai123",
  storageBucket: "innsightai123.firebasestorage.app",
  messagingSenderId: "90156459249",
  appId: "1:90156459249:web:1733aa196d5f2fa5ad3550",
  measurementId: "G-JDGHY71NN7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
