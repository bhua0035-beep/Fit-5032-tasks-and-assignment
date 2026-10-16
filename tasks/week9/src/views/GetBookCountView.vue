<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const errorMessage = ref('')
const isLoading = ref(false)
const countBooksApiUrl = import.meta.env.VITE_COUNT_BOOKS_API_URL

const getBookCountAPI = async () => {
  if (!countBooksApiUrl) {
    errorMessage.value = 'The countBooks API URL has not been configured.'
    return
  }

  count.value = null
  errorMessage.value = ''
  isLoading.value = true

  try {
    const response = await axios.get(countBooksApiUrl)
    count.value = response.data.count
  } catch (error) {
    errorMessage.value = 'Unable to get the book count.'
    console.error('Error fetching book count:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="page-section">
    <div class="container">
      <div class="content-card book-counter mx-auto p-4 p-md-5 text-center">
        <p class="eyebrow mb-2">Week 9 Cloud Function</p>
        <h1 class="h2 mb-4">Book Counter</h1>

        <button class="btn btn-primary" type="button" :disabled="isLoading" @click="getBookCountAPI">
          {{ isLoading ? 'Getting Book Count...' : 'Get Book Count' }}
        </button>

        <p v-if="count !== null" class="result mt-4 mb-0">Total number of books: {{ count }}</p>
        <p v-else-if="errorMessage" class="alert alert-danger mt-4 mb-0" role="alert">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.book-counter {
  max-width: 640px;
}

.result {
  color: #172033;
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
