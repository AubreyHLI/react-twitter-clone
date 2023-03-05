
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtPIpv8DHWR6s5WH-UvsCbT-LWPn5zIFY",
  authDomain: "twitter-clone-9a304.firebaseapp.com",
  projectId: "twitter-clone-9a304",
  storageBucket: "twitter-clone-9a304.appspot.com",
  messagingSenderId: "977792160667",
  appId: "1:977792160667:web:fea87aeac36921b526473e",
  measurementId: "G-4GF42DMSRE"
};

// Initialize Firebase
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

const auth = getAuth(firebaseApp);


export default firebaseApp;
export { db, storage, auth };

