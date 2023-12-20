import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-es-8977f.firebaseapp.com",
    projectId: "real-es-8977f",
    storageBucket: "real-es-8977f.appspot.com",
    messagingSenderId: "934660072092",
    appId: "1:934660072092:web:fab8cc7b79a73700bb0359"
};

export const app = initializeApp(firebaseConfig);