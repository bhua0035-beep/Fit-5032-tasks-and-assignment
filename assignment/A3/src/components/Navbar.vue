<template>
  <header>
    <!-- Accessibility Skip Link (WCAG 2.1 AA - BR E.3) -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <nav class="navbar navbar-expand-xl navbar-dark bg-success shadow-sm" aria-label="Main Navigation">
      <div class="container-fluid px-3 px-lg-4">
        <router-link class="navbar-brand fw-bold d-flex align-items-center" to="/">
          <span class="fs-4 me-2" aria-hidden="true">🌿</span>
          <span>EcoYouth Action</span>
        </router-link>

        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarMainContent" 
          aria-controls="navbarMainContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation menu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMainContent">
          <!-- Primary Navigation Links -->
          <ul class="navbar-nav me-auto mb-2 mb-xl-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/resources">Resources Library</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/events">Events Directory</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/map">Impact Map</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/calendar">Counseling Booking</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/analytics">Analytics & Charts</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white fw-semibold" to="/ai-coach">🌱 Coping Assistant</router-link>
            </li>
            <li class="nav-item" v-if="currentUser?.role === 'admin'">
              <router-link class="nav-link text-info fw-semibold" to="/email-center">📧 Email Center</router-link>
            </li>
            <li class="nav-item" v-if="currentUser?.role === 'admin'">
              <router-link class="nav-link text-warning fw-bold" to="/admin">🛡️ Admin Dashboard</router-link>
            </li>
          </ul>

          <!-- Accessibility Toolbar & User Auth -->
          <div class="d-flex align-items-center flex-wrap gap-2">
            <!-- Online / Offline Network Status Pill (BR F.1 Offline Feature) -->
            <span 
              class="badge rounded-pill px-2 py-1 text-white" 
              :class="isOnline ? 'bg-dark' : 'bg-danger'" 
              :title="isOnline ? 'Network connected' : 'Offline mode active (Local Cache)'"
              aria-live="polite"
            >
              {{ isOnline ? '🟢 Online' : '🟠 Offline Mode' }}
            </span>

            <!-- Accessibility Font Sizing Controls (WCAG 2.1 AA) -->
            <div class="btn-group btn-group-sm" role="group" aria-label="Adjust font size">
              <button 
                type="button" 
                class="btn btn-outline-light" 
                @click="setFontSize('normal')" 
                title="Normal Font Size"
                :class="{ active: accessibility.fontSize === 'normal' }"
              >
                A
              </button>
              <button 
                type="button" 
                class="btn btn-outline-light" 
                @click="setFontSize('large')" 
                title="Large Font Size (+20%)"
                :class="{ active: accessibility.fontSize === 'large' }"
              >
                A+
              </button>
              <button 
                type="button" 
                class="btn btn-outline-light" 
                @click="setFontSize('xlarge')" 
                title="Extra Large Font Size (+40%)"
                :class="{ active: accessibility.fontSize === 'xlarge' }"
              >
                A++
              </button>
            </div>

            <!-- High Contrast Mode Toggle (WCAG 2.1 AAA Contrast) -->
            <button 
              type="button" 
              class="btn btn-sm btn-outline-light" 
              @click="toggleHighContrast" 
              :title="accessibility.highContrast ? 'Switch to Standard Theme' : 'Switch to High Contrast Mode'"
              aria-pressed="accessibility.highContrast"
            >
              🌓 {{ accessibility.highContrast ? 'Standard' : 'Contrast' }}
            </button>

            <!-- User Auth Profile / Login Button -->
            <div v-if="isAuthenticated" class="dropdown">
              <button 
                class="btn btn-sm btn-light dropdown-toggle d-flex align-items-center" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <span class="badge bg-success me-1">{{ currentUser?.role?.toUpperCase() }}</span>
                <span>{{ currentUser?.username }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li><h6 class="dropdown-header">{{ currentUser?.email }}</h6></li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" @click="handleLogout">Logout</button>
                </li>
              </ul>
            </div>
            <div v-else>
              <router-link to="/auth" class="btn btn-sm btn-light fw-semibold">
                Sign In / Register
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { 
  isAuthenticated, 
  currentUser, 
  logout, 
  isOnline, 
  accessibility, 
  toggleHighContrast, 
  setFontSize 
} from '../store.js';

const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push('/auth');
};
</script>
