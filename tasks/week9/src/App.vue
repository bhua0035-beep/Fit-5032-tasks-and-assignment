<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="app-shell">
    <BHeader />
    <main class="page-content">
      <RouterView />
    </main>
    <footer class="library-footer">
      <div class="container py-3 text-center">
        NoMash Library - FIT5032 Week 7 and Week 8 Firebase activities
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
}

.library-footer {
  background: #132238;
  color: #e8eef8;
  font-size: 0.9rem;
}
</style>
