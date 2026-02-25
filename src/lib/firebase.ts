import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️ ก๊อปปี้ Config จากหน้า Console ของ Firebase ของคุณฟลุ๊คมาวางที่นี่นะครับ
const firebaseConfig = {
  apiKey: "AIzaSyAQDF3IXRmej5bV-plLH-u0STeqgUz3YqM",
  authDomain: "trash-bank-rw.firebaseapp.com",
  projectId: "trash-bank-rw",
  storageBucket: "trash-bank-rw.firebasestorage.app",
  messagingSenderId: "785943212785",
  appId: "1:785943212785:web:a45e4898984649f7dc6f50",
  measurementId: "G-QGRGXD06P8"
};


// ป้องกันการ Initialize ซ้ำซ้อน
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };