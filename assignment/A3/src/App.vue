<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Navbar />
    <!-- WCAG 2.1 AA Skip Link Target -->
    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
/* Maintain smooth layout rendering */
#main-content:focus {
  outline: none;
}
</style>
