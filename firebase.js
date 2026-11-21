import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARhibIwIKQ_r5tDahXUOYStmCx2OrFwfU",
  authDomain: "mdsf-1bdf3.firebaseapp.com",
  projectId: "mdsf-1bdf3",
  storageBucket: "mdsf-1bdf3.firebasestorage.app",
  messagingSenderId: "289401878918",
  appId: "1:289401878918:web:221fbe017998adeb9dd407",
  measurementId: "G-1XDQTDWHZ6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
