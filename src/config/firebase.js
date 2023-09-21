import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA3U9pg6q_YOzBEVEv_zISPycpixH7g364",
  authDomain: "noisetrack-87d3d.firebaseapp.com",
  projectId: "noisetrack-87d3d",
  storageBucket: "noisetrack-87d3d.appspot.com",
  messagingSenderId: "491811791055",
  appId: "1:491811791055:web:88cf42f3bcd9370e6497ba"
};

export const initFirebase = initializeApp(firebaseConfig) 