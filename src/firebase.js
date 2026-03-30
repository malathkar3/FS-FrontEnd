import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBurF7nnLQIRo4ubJm1x5pTmLmHuiVdxfw",
  authDomain: "fs-project-46fa0.firebaseapp.com",
  projectId: "fs-project-46fa0",
  storageBucket: "fs-project-46fa0.firebasestorage.app",
  messagingSenderId: "309867009425",
  appId: "1:309867009425:web:78d39b4f4076618aeaf630",
  measurementId: "G-3WX6XZ5KBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, analytics };
export default app;
