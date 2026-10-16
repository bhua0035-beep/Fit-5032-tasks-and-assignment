<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-5">
        <div class="card shadow border-0">
          <div class="card-header bg-success text-white py-3 text-center">
            <h3 class="card-title h5 mb-0 fw-bold">Sign In to EcoYouth Action</h3>
            <small class="opacity-75">Firebase External Authentication (BR D.1)</small>
          </div>
          <div class="card-body p-4">
            <!-- External Auth Button: Google Sign-In (BR D.1) -->
            <button 
              type="button" 
              class="btn btn-outline-dark w-100 mb-3 d-flex align-items-center justify-content-center gap-2 py-2"
              @click="handleGoogleSignIn"
              :disabled="loading"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              <span>Continue with Google (Firebase Auth)</span>
            </button>

            <div class="position-relative text-center my-3">
              <hr class="text-muted">
              <span class="position-absolute top-50 start-50 translate-middle bg-white px-2 small text-muted">
                or sign in with credentials
              </span>
            </div>

            <!-- Standard Credentials Form -->
            <form @submit.prevent="handleSubmitForm">
              <!-- Username or Email -->
              <div class="mb-3">
                <label for="authIdentifier" class="form-label fw-semibold">Username or Email *</label>
                <input 
                  type="text" 
                  id="authIdentifier" 
                  class="form-control" 
                  v-model.trim="formData.identifier"
                  @blur="validateIdentifier(true)"
                  @input="validateIdentifier(false)"
                  placeholder="e.g. admin or your email"
                  required
                >
                <div v-if="errors.identifier" class="text-danger small mt-1">
                  {{ errors.identifier }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="authPassword" class="form-label fw-semibold">Password *</label>
                <input 
                  type="password" 
                  id="authPassword" 
                  class="form-control" 
                  v-model.trim="formData.password"
                  @blur="validatePassword(true)"
                  @input="validatePassword(false)"
                  placeholder="Min 6 characters"
                  required
                >
                <div v-if="errors.password" class="text-danger small mt-1">
                  {{ errors.password }}
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-success w-100 py-2 mb-3 fw-bold" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isRegisterMode ? 'Create EcoYouth Account' : 'Sign In' }}
              </button>

              <div class="text-center mb-3">
                <a href="#" class="small text-decoration-none text-success" @click.prevent="isRegisterMode = !isRegisterMode">
                  {{ isRegisterMode ? 'Already have an account? Sign In instead' : "Don't have an account? Register now" }}
                </a>
              </div>
            </form>

            <!-- Quick Demo One-Click Logins for Tutors -->
            <div class="p-3 bg-light rounded border">
              <small class="fw-bold text-muted d-block mb-2">⚡ Quick 1-Click Tutor Evaluation Logins:</small>
              <div class="d-flex flex-column gap-2">
                <button 
                  type="button" 
                  class="btn btn-sm btn-outline-danger text-start d-flex justify-content-between align-items-center"
                  @click="quickLogin('admin')"
                >
                  <span>🛡️ <strong>Admin Role</strong> (Full privileges & dashboard)</span>
                  <span class="badge bg-danger">admin / password</span>
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm btn-outline-primary text-start d-flex justify-content-between align-items-center"
                  @click="quickLogin('user')"
                >
                  <span>👤 <strong>Regular Youth User</strong> (Bookings & library)</span>
                  <span class="badge bg-primary">sam / password</span>
                </button>
              </div>
            </div>

            <!-- Feedback Alert -->
            <div v-if="alertMessage" class="alert mt-3 mb-0" :class="alertSuccess ? 'alert-success' : 'alert-danger'">
              {{ alertMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login, loginWithGoogle } from '../store.js';

const router = useRouter();
const isRegisterMode = ref(false);
const loading = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(false);

const formData = reactive({
  identifier: '',
  password: ''
});

const errors = reactive({
  identifier: '',
  password: ''
});

const validateIdentifier = (isBlur) => {
  if (!formData.identifier) {
    if (isBlur) errors.identifier = 'Please enter your username or email.';
  } else if (formData.identifier.length < 3) {
    if (isBlur) errors.identifier = 'Username or email must be at least 3 characters.';
  } else {
    errors.identifier = '';
  }
};

const validatePassword = (isBlur) => {
  if (!formData.password) {
    if (isBlur) errors.password = 'Password is required.';
  } else if (formData.password.length < 6) {
    if (isBlur) errors.password = 'Password must be at least 6 characters.';
  } else {
    errors.password = '';
  }
};

const handleSubmitForm = async () => {
  validateIdentifier(true);
  validatePassword(true);

  if (errors.identifier || errors.password) return;

  loading.value = true;
  alertMessage.value = '';

  const res = await login(formData.identifier, formData.password);
  loading.value = false;

  if (res.success) {
    alertSuccess.value = true;
    alertMessage.value = `Welcome back, ${res.user.username}! Redirecting...`;
    setTimeout(() => {
      router.push(res.user.role === 'admin' ? '/admin' : '/resources');
    }, 600);
  } else {
    alertSuccess.value = false;
    alertMessage.value = res.message || 'Login failed. Please verify credentials.';
  }
};

const handleGoogleSignIn = async () => {
  loading.value = true;
  const res = await loginWithGoogle();
  loading.value = false;

  if (res.success) {
    alertSuccess.value = true;
    alertMessage.value = `Google Authentication Verified! Signed in as ${res.user.name}.`;
    setTimeout(() => {
      router.push('/resources');
    }, 700);
  }
};

const quickLogin = async (role) => {
  if (role === 'admin') {
    formData.identifier = 'admin';
    formData.password = 'password';
  } else {
    formData.identifier = 'sam';
    formData.password = 'password';
  }
  await handleSubmitForm();
};
</script>
