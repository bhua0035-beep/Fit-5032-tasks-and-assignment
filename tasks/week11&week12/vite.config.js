import { fileURLToPath, URL } from 'node:url'
import process from 'node:process'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // Cloudflare Pages is hosted at '/', while GitHub Pages uses the repository
  // name as a sub-path. The GitHub Actions workflow supplies VITE_BASE_PATH.
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase'
          if (id.includes('@primevue/themes')) return 'primevue-theme'
          if (id.includes('primevue') || id.includes('@primevue')) return 'primevue'
          if (id.includes('bootstrap') || id.includes('@popperjs')) return 'bootstrap'
          return 'vendor'
        }
      }
    }
  }
})
