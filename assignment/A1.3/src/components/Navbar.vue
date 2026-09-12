<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container">
      <router-link class="navbar-brand" to="/">EcoYouth</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/calendar">Event Calendar</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link class="nav-link" to="/resources">Resources</router-link>
          </li>
          <li class="nav-item" v-if="currentUser?.role === 'admin'">
            <router-link class="nav-link text-warning" to="/admin">Admin</router-link>
          </li>
          <li class="nav-item" v-if="!isAuthenticated">
            <router-link class="btn btn-outline-light ms-2" to="/auth">Login / Register</router-link>
          </li>
          <li class="nav-item" v-else>
            <button class="btn btn-outline-light ms-2" @click="handleLogout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { isAuthenticated, currentUser, logout } from '../store.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  logout();
  router.push('/auth');
}
</script>

