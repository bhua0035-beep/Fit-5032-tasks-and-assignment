<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-12 text-center mb-4">
        <h2>Eco-Anxiety Resources Library</h2>
        <p class="lead">Find coping strategies and share your own helpful links.</p>
      </div>
    </div>

    <!-- Form to Add New Resource -->
    <div class="row mb-5">
      <div class="col-md-8 offset-md-2">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <strong>Share a Resource</strong>
          </div>
          <div class="card-body">
            <form @submit.prevent="addResource">
              <div class="row g-3 align-items-center">
                <div class="col-sm-5">
                  <input type="text" class="form-control" v-model="newResource.title" placeholder="Resource Title" required>
                </div>
                <div class="col-sm-5">
                  <input type="text" class="form-control" v-model="newResource.type" placeholder="Type (e.g. Article, Video)" required>
                </div>
                <div class="col-sm-2">
                  <button type="submit" class="btn btn-success w-100">Add</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic List of Resources using v-for -->
    <div class="row">
      <div class="col-md-10 offset-md-1">
        <table class="table table-striped table-bordered shadow-sm">
          <thead class="table-success">
            <tr>
              <th>Resource Title</th>
              <th>Resource Type</th>
              <th>Average Rating</th>
              <th>Rate (1-5)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(resource, index) in resourcesList" :key="index">
              <td>{{ resource.title }}</td>
              <td>{{ resource.type }}</td>
              <td>
                <span v-if="resource.ratings && resource.ratings.length > 0">
                  {{ calculateAverage(resource.ratings) }} / 5 ({{ resource.ratings.length }} votes)
                </span>
                <span v-else class="text-muted">No ratings yet</span>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button v-for="star in 5" :key="star" class="btn btn-outline-warning" @click="addRating(index, star)">{{ star }}★</button>
                </div>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-danger" @click="removeResource(index)" v-if="currentUser?.role === 'admin'">Remove</button>
              </td>
            </tr>
            <tr v-if="resourcesList.length === 0">
              <td colspan="5" class="text-center text-muted">No resources added yet. Be the first to share one!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { currentUser } from '../store.js';


// Default starter data
const initialResources = [
  { title: '10 Ways to Cope with Eco-Anxiety', type: 'Article', ratings: [5, 4, 5] },
  { title: 'Guided Meditation for Climate Stress', type: 'Audio', ratings: [4, 5] },
  { title: 'Local Tree Planting Groups', type: 'Community Link', ratings: [] }
];

// Reactive state for the list
const resourcesList = ref([]);

// Reactive state for the new form
const newResource = ref({
  title: '',
  type: ''
});

// Load from LocalStorage on mount
onMounted(() => {
  const savedResources = localStorage.getItem('ecoYouthResources');
  if (savedResources) {
    resourcesList.value = JSON.parse(savedResources);
  } else {
    // Populate with defaults if empty
    resourcesList.value = [...initialResources];
  }
});

// Watch for changes and save to LocalStorage automatically
watch(resourcesList, (newVal) => {
  localStorage.setItem('ecoYouthResources', JSON.stringify(newVal));
}, { deep: true });

// Function to add a resource
const addResource = () => {
  if (newResource.value.title && newResource.value.type) {
    resourcesList.value.push({
      title: newResource.value.title,
      type: newResource.value.type,
      ratings: []
    });
    // Clear the form
    newResource.value.title = '';
    newResource.value.type = '';
  }
};

// Function to remove a resource
const removeResource = (index) => {
  resourcesList.value.splice(index, 1);
};

// Function to calculate average rating
const calculateAverage = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
};

// Function to add a rating
const addRating = (index, star) => {
  if (!resourcesList.value[index].ratings) {
    resourcesList.value[index].ratings = [];
  }
  resourcesList.value[index].ratings.push(star);
};
</script>


