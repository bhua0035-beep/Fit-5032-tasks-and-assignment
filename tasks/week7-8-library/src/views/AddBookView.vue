<template>
  <section class="page-section">
    <div class="container">
      <p class="eyebrow mb-2">Cloud Firestore</p>
      <h1 class="h2">Add a library book</h1>
      <p class="text-secondary mb-4">Each submission creates a document in the <code>books</code> collection.</p>

      <div class="content-card p-4 mb-4">
        <h2 class="h4 mb-3">Add a book document</h2>
        <form class="row g-3 align-items-end" @submit.prevent="addBook">
          <div class="col-md-4">
            <label class="form-label" for="book-isbn">ISBN number</label>
            <input id="book-isbn" v-model.number="form.isbn" type="number" min="1" class="form-control" required>
          </div>
          <div class="col-md-5">
            <label class="form-label" for="book-name">Book name</label>
            <input id="book-name" v-model.trim="form.name" class="form-control" required>
          </div>
          <div class="col-md-3">
            <button class="btn btn-primary w-100" :disabled="submitting">
              {{ submitting ? 'Adding...' : 'Add to Firestore' }}
            </button>
          </div>
        </form>
        <div v-if="status" class="alert alert-success mt-3 mb-0" role="status">{{ status }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/init.js'
import { currentUser } from '../store.js'

const form = reactive({ isbn: '', name: '' })
const submitting = ref(false)
const status = ref('')

const addBook = async () => {
  submitting.value = true
  status.value = ''
  try {
    const documentReference = await addDoc(collection(db, 'books'), {
      isbn: Number(form.isbn),
      name: form.name,
      ownerUid: currentUser.value.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    console.log('[Firestore] Added document:', documentReference.id)
    status.value = `Book added to Firestore. Document ID: ${documentReference.id}`
    form.isbn = ''
    form.name = ''
  } finally {
    submitting.value = false
  }
}
</script>
