<template>
  <nav class="navbar navbar-expand-xl navbar-dark bg-primary shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-semibold" to="/">NoMash Library</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#libraryNavigation"
        aria-controls="libraryNavigation"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="libraryNavigation" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-xl-center gap-xl-1">
          <li class="nav-item"><RouterLink class="nav-link" to="/">Home</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/week5-registration">Week 5 Form</RouterLink>
          </li>
          <li class="nav-item"><RouterLink class="nav-link" to="/json-lab">JSON Lab</RouterLink></li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/WeatherCheck">Get Weather</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/CountBookAPI">Count Book API</RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="nav-link" to="/register">Register</RouterLink>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <RouterLink class="btn btn-light btn-sm ms-xl-2" to="/login">Sign in</RouterLink>
          </li>
          <template v-else>
            <li class="nav-item"><RouterLink class="nav-link" to="/account">My account</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/books/add">Add book</RouterLink></li>
            <li class="nav-item">
              <span class="navbar-text small ms-xl-2">{{ currentUser?.username }}</span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { currentUser, isAuthenticated } from '../store.js'
</script>
