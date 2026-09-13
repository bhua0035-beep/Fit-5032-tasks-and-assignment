<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h3 class="card-title mb-0">Login or Register</h3>
          </div>
          <div class="card-body">
            <div class="alert alert-info mb-4">
              <strong>Demo Login:</strong> Use <code>user / password</code> for normal access, or <code>admin / password</code> for admin access.
            </div>
            <form @submit.prevent="submitForm">
              
              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="username" 
                  v-model.trim="formData.username"
                  @blur="() => validateUsername(true)"
                  @input="() => validateUsername(false)"
                >
                <div v-if="errors.username" class="text-danger mt-1">
                  {{ errors.username }}
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model.trim="formData.email"
                  @blur="() => validateEmail(true)"
                  @input="() => validateEmail(false)"
                >
                <div v-if="errors.email" class="text-danger mt-1">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model.trim="formData.password"
                  @blur="() => validatePassword(true)"
                  @input="() => validatePassword(false)"
                >
                <div v-if="errors.password" class="text-danger mt-1">
                  {{ errors.password }}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="text-center">
                <button type="submit" class="btn btn-success w-100 mb-2">Login / Register</button>
                <button type="button" class="btn btn-secondary w-100" @click="clearForm">Clear</button>
              </div>

              <div v-if="submittedSuccess" class="alert alert-success mt-3" role="alert">
                Success! Redirecting...
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../store.js';

const router = useRouter();

const formData = ref({
  username: '',
  email: '',
  password: ''
});

const errors = ref({
  username: null,
  email: null,
  password: null
});

const submittedSuccess = ref(false);

const validateUsername = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else {
    errors.value.username = null;
  }
};

const validateEmail = (blur) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(formData.value.email)) {
    if (blur) errors.value.email = "Please enter a valid email address.";
  } else {
    errors.value.email = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 6;

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else {
    errors.value.password = null;
  }
};

const submitForm = () => {
  validateUsername(true);
  validateEmail(true);
  validatePassword(true);

  if (!errors.value.username && !errors.value.email && !errors.value.password) {
    const success = login(formData.value.username, formData.value.password);
    if (success) {
      submittedSuccess.value = true;
      errors.value.password = null;
      setTimeout(() => {
        router.push('/resources');
      }, 500);
    } else {
      submittedSuccess.value = false;
      errors.value.password = "Invalid username or password";
    }
  } else {
    submittedSuccess.value = false;
  }
};

const clearForm = () => {
  formData.value = {
    username: '',
    email: '',
    password: ''
  };
  errors.value = {
    username: null,
    email: null,
    password: null
  };
  submittedSuccess.value = false;
};
</script>
