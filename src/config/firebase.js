import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUU3QbyCWQhn7izpwqCJq5S6kQ4Oz9kms",
  authDomain: "noisetrack3.firebaseapp.com",
  projectId: "noisetrack3",
  storageBucket: "noisetrack3.appspot.com",
  messagingSenderId: "299140056895",
  appId: "1:299140056895:web:f7e95472b8c0aff1b3358a"
};

export const initFirebase = initializeApp(firebaseConfig);

export const bd = getFirestore(initFirebase);