// Firebase Configuration & Initialization
// Supports both live Firebase projects and graceful local fallback mode
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc,
  getDoc 
} from 'firebase/firestore';

// Firebase Web App configuration for project fit5032a1-62b71.
const firebaseConfig = {
  apiKey: "AIzaSyAZ33VRHj1rqZvWf_rZV15KNMF-W5S562k",
  authDomain: "fit5032a1-62b71.firebaseapp.com",
  projectId: "fit5032a1-62b71",
  storageBucket: "fit5032a1-62b71.firebasestorage.app",
  messagingSenderId: "564912159945",
  appId: "1:564912159945:web:2f78e06d37b7414ec4a118"
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase initialized with local fallback:", e.message);
}

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc,
  getDoc
};
