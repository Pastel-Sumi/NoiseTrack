import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBesdfp03MkMH6B9XojT0JL-JFZ55XP-98",
  authDomain: "noisetrack2.firebaseapp.com",
  projectId: "noisetrack2",
  storageBucket: "noisetrack2.appspot.com",
  messagingSenderId: "982912369967",
  appId: "1:982912369967:web:65cfd73592952dcb430dda"
};

export const initFirebase = initializeApp(firebaseConfig);

export const bd = getFirestore(initFirebase);