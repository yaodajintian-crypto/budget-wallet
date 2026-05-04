import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAZd0BHlWJhx8K6BetikZh1Wfrp03fvkPI",
    authDomain: "budget-wallet-2026.firebaseapp.com",
    projectId: "budget-wallet-2026",
    storageBucket: "budget-wallet-2026.firebasestorage.app",
    messagingSenderId: "675919521229",
    appId: "1:675919521229:web:4cd979fe5b0b84e8add084",
    measurementId: "G-NMBJ8Z461H"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);