<script setup>
import { onMounted, ref } from 'vue'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/init.js'

const jsondata = ref(null)

const getBookCountAPI = async () => {
  try {
    const snapshot = await getCountFromServer(collection(db, 'books'))
    jsondata.value = { count: snapshot.data().count }
  } catch (error) {
    jsondata.value = { error: 'Unable to retrieve the book count.' }
    console.error('Error fetching book count:', error)
  }
}

onMounted(getBookCountAPI)
</script>

<template>
  <main class="api-response">
    <pre v-if="jsondata">{{ JSON.stringify(jsondata, null, 2) }}</pre>
    <p v-else>Loading...</p>
  </main>
</template>

<style scoped>
.api-response {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: #ffffff;
}

pre {
  margin: 0;
  color: #172033;
  font-size: 1rem;
}
</style>
