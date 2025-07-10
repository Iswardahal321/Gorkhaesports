// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAPBM2kO7Z2uoNddBcMCN-9KuJ-NWihnYk",
  authDomain: "gorkhaesports-df740.firebaseapp.com",
  projectId: "gorkhaesports-df740",
  storageBucket: "gorkhaesports-df740.appspot.com",
  messagingSenderId: "808274561434",
  appId: "1:808274561434:web:df2cbb39a93b232088d223",
  measurementId: "G-EP3YTR0JFG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
