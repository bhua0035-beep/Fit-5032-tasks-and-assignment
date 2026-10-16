<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const showSiteChrome = computed(() => route.name !== 'CountBookAPI')
</script>

<template>
  <div class="app-shell">
    <BHeader v-if="showSiteChrome" />
    <main class="page-content">
      <RouterView />
    </main>
    <footer v-if="showSiteChrome" class="library-footer">
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
