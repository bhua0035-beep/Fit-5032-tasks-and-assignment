import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { firebaseAuth } from './firebase/init.js'

export const currentUser = ref(null)
export const isAuthenticated = computed(() => currentUser.value !== null)
export const authLoading = ref(true)

let resolveAuthReady
export const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve
})

let initialAuthStateHandled = false

onAuthStateChanged(firebaseAuth, async (user) => {
  if (user) {
    currentUser.value = {
      uid: user.uid,
      username: user.displayName || user.email?.split('@')[0] || 'Library user',
      email: user.email
    }
    console.log('[Firebase Auth] Current user:', currentUser.value)
  } else {
    currentUser.value = null
    console.log('[Firebase Auth] Current user:', null)
  }

  authLoading.value = false
  if (!initialAuthStateHandled) {
    initialAuthStateHandled = true
    resolveAuthReady()
  }
})

export const register = async ({ name, email, password }) => {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  await updateProfile(credential.user, { displayName: name })
  currentUser.value = {
    uid: credential.user.uid,
    username: name,
    email: credential.user.email
  }
  console.log('[Firebase Auth] Registration successful:', currentUser.value)
  return currentUser.value
}

export const login = async (email, password) => {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
  currentUser.value = {
    uid: credential.user.uid,
    username: credential.user.displayName || credential.user.email?.split('@')[0] || 'Library user',
    email: credential.user.email
  }
  console.log('[Firebase Auth] Sign in successful:', currentUser.value)
  return currentUser.value
}
