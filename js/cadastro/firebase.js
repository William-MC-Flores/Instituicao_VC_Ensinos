import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDn4IoMfe7U97yVnHvMlP7xDmDzxFDpUlg",
  authDomain: "vcensinos.firebaseapp.com",
  projectId: "vcensinos",
  storageBucket: "vcensinos.firebasestorage.app",
  messagingSenderId: "1083943850886",
  appId: "1:1083943850886:web:a56dd998f5652924695207",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
