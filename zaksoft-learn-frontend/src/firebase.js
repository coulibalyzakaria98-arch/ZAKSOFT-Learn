import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5A1qW_158S3nBLf-jC9S2aMX6nB4aV0U",
  authDomain: "zaksoft-learn-3f23a.firebaseapp.com",
  projectId: "zaksoft-learn-3f23a",
  storageBucket: "zaksoft-learn-3f23a.appspot.com",
  messagingSenderId: "452207936163",
  appId: "1:452207936163:web:96a759e66c75c829e1281a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators only in development
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("Connected to Firebase Emulators");
  } catch (error) {
    console.error("Error connecting to Firebase Emulators:", error);
  }
}

export { auth, db, storage };
