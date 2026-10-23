<template>
  <section class="page-section">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="content-card p-4 p-md-5">
            <p class="eyebrow mb-2">Firebase Authentication</p>
            <h1 class="h2">Signed in successfully</h1>
            <p class="text-secondary">The current Firebase user is also printed in the browser developer console.</p>
            <dl class="row mt-4 mb-0">
              <dt class="col-sm-3">Display name</dt><dd class="col-sm-9">{{ currentUser?.username }}</dd>
              <dt class="col-sm-3">Email</dt><dd class="col-sm-9">{{ currentUser?.email }}</dd>
              <dt class="col-sm-3">Firebase UID</dt><dd class="col-sm-9"><code>{{ currentUser?.uid }}</code></dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { currentUser } from '../store.js'
</script>
