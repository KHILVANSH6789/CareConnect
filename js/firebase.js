import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWek6DQ-aJPlgRNU8foNYJJKAbE1CpSck",
  authDomain: "careconnect-0.firebaseapp.com",
  projectId: "careconnect-0",
  storageBucket: "careconnect-0.appspot.com",
  messagingSenderId: "1060349745892",
  appId: "1:1060349745892:web:e024de28b3a80cfd67eaf1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
