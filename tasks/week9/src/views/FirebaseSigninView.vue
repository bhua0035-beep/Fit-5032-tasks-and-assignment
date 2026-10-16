<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-xl-6">
          <p class="eyebrow mb-2">Firebase Authentication</p>
          <h1 class="h2 mb-2">Sign in to NoMash Library</h1>
          <p class="text-secondary mb-4">Firebase verifies the library account and reports the current user.</p>

          <div class="content-card p-4 p-md-5">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label" for="login-email">Email address</label>
                <input id="login-email" v-model.trim="email" type="email" class="form-control form-control-lg" required>
              </div>
              <div class="mb-4">
                <label class="form-label" for="login-password">Password</label>
                <input id="login-password" v-model="password" type="password" class="form-control form-control-lg" required>
              </div>
              <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
              <button class="btn btn-primary btn-lg w-100" :disabled="submitting">
                {{ submitting ? 'Signing in...' : 'Sign in with Firebase' }}
              </button>
            </form>
            <p class="text-center mt-4 mb-0">Need an account? <RouterLink to="/register">Register</RouterLink></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../store.js'

const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorMessage = ref('')
const route = useRoute()
const router = useRouter()

const handleLogin = async () => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await login(email.value, password.value)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : '/account')
  } catch (error) {
    console.error('[Firebase Auth] Sign in failed:', error.code)
    errorMessage.value = 'Sign-in failed. Check the email and password.'
  } finally {
    submitting.value = false
  }
}
</script>
