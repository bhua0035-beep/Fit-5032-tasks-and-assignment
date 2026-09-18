import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAZ33VRHj1rqZvWf_rZV15KNMF-W5S562k',
  authDomain: 'fit5032a1-62b71.firebaseapp.com',
  projectId: 'fit5032a1-62b71',
  storageBucket: 'fit5032a1-62b71.firebasestorage.app',
  messagingSenderId: '564912159945',
  appId: '1:564912159945:web:2f78e06d37b7414ec4a118'
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
