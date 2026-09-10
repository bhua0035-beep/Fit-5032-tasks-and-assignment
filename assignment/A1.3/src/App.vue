<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-grow-1">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Global styles can be added here */
</style>
