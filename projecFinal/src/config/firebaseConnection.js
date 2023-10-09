// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlSM4cePrnxtdpYwwGXXpeHA82cdbxzAM",
  authDomain: "curso-udemy-3f236.firebaseapp.com",
  projectId: "curso-udemy-3f236",
  storageBucket: "curso-udemy-3f236.appspot.com",
  messagingSenderId: "989803520452",
  appId: "1:989803520452:web:06333283404423bf8ec491",
  measurementId: "G-K8CZ3LWFCK",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
const storageRef = ref(storage);

export { db, auth, storage, storageRef };
