<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-xl-6">
          <p class="eyebrow mb-2">Firebase Authentication</p>
          <h1 class="h2 mb-2">Create a library account</h1>
          <p class="text-secondary mb-4">Register with an email address and password.</p>

          <div class="content-card p-4 p-md-5">
            <form @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label" for="register-name">Display name</label>
                <input id="register-name" v-model.trim="form.name" class="form-control form-control-lg" required>
              </div>
              <div class="mb-3">
                <label class="form-label" for="register-email">Email address</label>
                <input id="register-email" v-model.trim="form.email" type="email" class="form-control form-control-lg" required>
              </div>
              <div class="mb-3">
                <label class="form-label" for="register-password">Password</label>
                <input id="register-password" v-model="form.password" type="password" minlength="6" class="form-control form-control-lg" required>
              </div>
              <div class="mb-4">
                <label class="form-label" for="register-confirm">Confirm password</label>
                <input id="register-confirm" v-model="form.confirmPassword" type="password" minlength="6" class="form-control form-control-lg" required>
              </div>
              <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
              <button class="btn btn-primary btn-lg w-100" :disabled="submitting">
                {{ submitting ? 'Creating account...' : 'Register with Firebase' }}
              </button>
            </form>
            <p class="text-center mt-4 mb-0">Already registered? <RouterLink to="/login">Sign in</RouterLink></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../store.js'

const router = useRouter()
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const submitting = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'The passwords do not match.'
    return
  }

  submitting.value = true
  try {
    await register(form)
    await router.push('/account')
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed.'
  } finally {
    submitting.value = false
  }
}
</script>
