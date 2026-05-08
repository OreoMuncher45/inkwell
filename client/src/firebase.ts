import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxOIpcys0KaCKs-Suq_MzH6vH5VIj_p3I",
  authDomain: "inkwell-57e6d.firebaseapp.com",
  projectId: "inkwell-57e6d",
  storageBucket: "inkwell-57e6d.firebasestorage.app",
  messagingSenderId: "144705728164",
  appId: "1:144705728164:web:3136c8e74a30269b9b4031",
  measurementId: "G-7CJRS8DS0X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
