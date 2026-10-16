<template>
  <div class="container my-5">
    <!-- Header & Action Row -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h1 class="h2 fw-bold text-success mb-1">Eco-Anxiety Resources Library</h1>
        <p class="text-muted mb-0">
          Curated coping guides, research papers, and grounding tools for youth climate wellbeing.
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- BR E.4 Export Buttons -->
        <button class="btn btn-outline-success" @click="handleExportCSV" title="Export current table to CSV file">
          📥 Export CSV
        </button>
        <button class="btn btn-outline-danger" @click="handleExportPDF" title="Export current table to styled PDF report">
          📄 Export PDF
        </button>
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addResourceModal">
          ➕ Share New Resource
        </button>
      </div>
    </div>

    <!-- Table Controls: Global Search & Per-Page Controls (BR D.3) -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <label for="globalSearch" class="form-label small text-muted fw-bold">Global Table Search</label>
            <div class="input-group">
              <span class="input-group-text bg-light">🔍</span>
              <input 
                id="globalSearch"
                type="text" 
                class="form-control" 
                v-model.trim="globalFilter" 
                placeholder="Search across all resource columns..."
              >
            </div>
          </div>
          <div class="col-md-3">
            <label for="categoryQuickFilter" class="form-label small text-muted fw-bold">Quick Category Filter</label>
            <select id="categoryQuickFilter" class="form-select" v-model="columnFilters.category">
              <option value="">All Categories</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Audio/Video">Audio/Video</option>
              <option value="Action Guide">Action Guide</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Community">Community</option>
              <option value="Academic">Academic</option>
              <option value="Policy">Policy</option>
            </select>
          </div>
          <div class="col-md-3 text-md-end pt-md-4">
            <span class="badge bg-secondary p-2">
              Showing {{ paginatedResources.length }} of {{ filteredResources.length }} total matching resources
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Table (BR D.3: Sort, Search, Column Filters, 10 Rows/Page) -->
    <div class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" aria-label="Eco-anxiety Resources Table">
          <thead class="table-success">
            <!-- Header Row with Sortable Columns -->
            <tr>
              <th scope="col" class="sortable-th" @click="sortBy('title')">
                Resource Title
                <span v-if="sortKey === 'title'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('category')">
                Category
                <span v-if="sortKey === 'category'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('format')">
                Format
                <span v-if="sortKey === 'format'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('author')">
                Author / Source
                <span v-if="sortKey === 'author'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('rating')">
                Avg Rating (BR C.3)
                <span v-if="sortKey === 'rating'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col">Rate It</th>
              <th scope="col" class="text-end">Actions</th>
            </tr>
            <!-- Individual Column Search Inputs (BR D.3 Specification) -->
            <tr class="bg-light">
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.title" 
                  placeholder="Filter title..."
                  aria-label="Filter by title"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.category" 
                  placeholder="Filter category..."
                  aria-label="Filter by category"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.format" 
                  placeholder="Filter format..."
                  aria-label="Filter by format"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.author" 
                  placeholder="Filter author..."
                  aria-label="Filter by author"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.minRating" 
                  placeholder="Min rating (e.g. 4)..."
                  aria-label="Filter by minimum rating"
                >
              </th>
              <th colspan="2" class="p-1 text-center">
                <button 
                  class="btn btn-sm btn-outline-secondary w-100 py-0" 
                  @click="clearFilters" 
                  title="Clear all filters"
                >
                  Clear Filters
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedResources" :key="item.id">
              <td>
                <span class="fw-semibold text-dark">{{ item.title }}</span>
              </td>
              <td>
                <span class="badge bg-success-subtle text-success border border-success-subtle">
                  {{ item.category }}
                </span>
              </td>
              <td>{{ item.format }}</td>
              <td><small class="text-muted">{{ item.author }}</small></td>
              <td>
                <span class="fw-bold text-warning">★ {{ getAverageRating(item.ratings) }}</span>
                <small class="text-muted ms-1">({{ item.ratings?.length || 0 }} votes)</small>
              </td>
              <td>
                <!-- 5-Star Interactive Rating (BR C.3) -->
                <div class="btn-group btn-group-sm" role="group" :aria-label="'Rate ' + item.title">
                  <button 
                    v-for="star in 5" 
                    :key="star" 
                    type="button" 
                    class="btn btn-outline-warning py-0 px-1" 
                    @click="addRating(item.id, star)"
                    :title="'Give ' + star + ' stars'"
                  >
                    ★
                  </button>
                </div>
              </td>
              <td class="text-end">
                <a :href="item.url" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary me-1">
                  View
                </a>
                <button 
                  v-if="currentUser?.role === 'admin'" 
                  class="btn btn-sm btn-outline-danger" 
                  @click="removeResource(item.id)"
                  title="Delete Resource (Admin)"
                >
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredResources.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                No matching resources found. Try adjusting your search query or column filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer (Strictly 10 rows per page limit - BR D.3) -->
      <div class="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
        <div class="small text-muted">
          Showing <strong>{{ startIndex + 1 }}</strong> to <strong>{{ Math.min(startIndex + pageSize, filteredResources.length) }}</strong> of <strong>{{ filteredResources.length }}</strong> resources (Page {{ currentPage }} of {{ totalPages || 1 }})
        </div>
        <nav aria-label="Resource table navigation">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="currentPage--" aria-label="Previous Page">Previous</button>
            </li>
            <li 
              v-for="p in totalPages" 
              :key="p" 
              class="page-item" 
              :class="{ active: currentPage === p }"
            >
              <button class="page-link" @click="currentPage = p">{{ p }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages || totalPages === 0 }">
              <button class="page-link" @click="currentPage++" aria-label="Next Page">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Add Resource Modal -->
    <div class="modal fade" id="addResourceModal" tabindex="-1" aria-labelledby="addResourceModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitNewResource">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="addResourceModalLabel">Share an Eco-Anxiety Resource</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="newTitle" class="form-label">Resource Title *</label>
                <input type="text" id="newTitle" class="form-control" v-model.trim="newResource.title" required minlength="4">
              </div>
              <div class="mb-3">
                <label for="newCategory" class="form-label">Category *</label>
                <select id="newCategory" class="form-select" v-model="newResource.category" required>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Audio/Video">Audio/Video</option>
                  <option value="Action Guide">Action Guide</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Community">Community</option>
                  <option value="Academic">Academic</option>
                  <option value="Policy">Policy</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="newFormat" class="form-label">Format *</label>
                <input type="text" id="newFormat" class="form-control" v-model.trim="newResource.format" placeholder="e.g. PDF Guide, Audio, Article" required>
              </div>
              <div class="mb-3">
                <label for="newAuthor" class="form-label">Author / Organization *</label>
                <input type="text" id="newAuthor" class="form-control" v-model.trim="newResource.author" required>
              </div>
              <div class="mb-3">
                <label for="newUrl" class="form-label">Website / Download URL</label>
                <input type="url" id="newUrl" class="form-control" v-model.trim="newResource.url" placeholder="https://example.com">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-success" data-bs-dismiss="modal">Submit Resource</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { resourcesList, currentUser, exportToCSV, exportToPDF } from '../store.js';

// Global & Column-Level Search State (BR D.3)
const globalFilter = ref('');
const columnFilters = reactive({
  title: '',
  category: '',
  format: '',
  author: '',
  minRating: ''
});

// Sorting State
const sortKey = ref('title');
const sortOrder = ref('asc');

// Pagination State (Strictly 10 rows per page limit - BR D.3)
const currentPage = ref(1);
const pageSize = 10;

// New Resource Form Model
const newResource = reactive({
  title: '',
  category: 'Mindfulness',
  format: 'PDF Guide',
  author: '',
  url: 'https://ecoyouth.org.au'
});

const clearFilters = () => {
  globalFilter.value = '';
  columnFilters.title = '';
  columnFilters.category = '';
  columnFilters.format = '';
  columnFilters.author = '';
  columnFilters.minRating = '';
  currentPage.value = 1;
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const getAverageRating = (ratings) => {
  if (!ratings || !ratings.length) return '0.0';
  const sum = ratings.reduce((a, b) => a + b, 0);
  return (sum / ratings.length).toFixed(1);
};

// Filtered Resources Computation
const filteredResources = computed(() => {
  return resourcesList.value.filter(item => {
    // 1. Global Filter
    if (globalFilter.value) {
      const g = globalFilter.value.toLowerCase();
      const matchGlobal = 
        item.title.toLowerCase().includes(g) ||
        item.category.toLowerCase().includes(g) ||
        item.format.toLowerCase().includes(g) ||
        item.author.toLowerCase().includes(g);
      if (!matchGlobal) return false;
    }

    // 2. Individual Column Filters
    if (columnFilters.title && !item.title.toLowerCase().includes(columnFilters.title.toLowerCase())) {
      return false;
    }
    if (columnFilters.category && !item.category.toLowerCase().includes(columnFilters.category.toLowerCase())) {
      return false;
    }
    if (columnFilters.format && !item.format.toLowerCase().includes(columnFilters.format.toLowerCase())) {
      return false;
    }
    if (columnFilters.author && !item.author.toLowerCase().includes(columnFilters.author.toLowerCase())) {
      return false;
    }
    if (columnFilters.minRating) {
      const avg = parseFloat(getAverageRating(item.ratings));
      const min = parseFloat(columnFilters.minRating);
      if (!isNaN(min) && avg < min) return false;
    }

    return true;
  }).sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (sortKey.value === 'rating') {
      aVal = parseFloat(getAverageRating(a.ratings));
      bVal = parseFloat(getAverageRating(b.ratings));
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

// Total Pages & Paginated Slice
const totalPages = computed(() => Math.ceil(filteredResources.value.length / pageSize));
const startIndex = computed(() => (currentPage.value - 1) * pageSize);
const paginatedResources = computed(() => {
  return filteredResources.value.slice(startIndex.value, startIndex.value + pageSize);
});

// Add Rating (BR C.3)
const addRating = (id, star) => {
  const item = resourcesList.value.find(r => r.id === id);
  if (item) {
    if (!item.ratings) item.ratings = [];
    item.ratings.push(star);
    item.votes = item.ratings.length;
  }
};

// Add New Resource
const submitNewResource = () => {
  if (newResource.title && newResource.author) {
    resourcesList.value.unshift({
      id: Date.now(),
      title: newResource.title,
      category: newResource.category,
      format: newResource.format,
      author: newResource.author,
      ratings: [5],
      votes: 1,
      url: newResource.url || 'https://ecoyouth.org.au'
    });
    newResource.title = '';
    newResource.author = '';
  }
};

// Remove Resource (Admin)
const removeResource = (id) => {
  if (confirm('Are you sure you want to remove this resource?')) {
    resourcesList.value = resourcesList.value.filter(r => r.id !== id);
  }
};

// BR E.4 CSV Export Handler
const handleExportCSV = () => {
  const exportData = filteredResources.value.map(r => ({
    ID: r.id,
    Title: r.title,
    Category: r.category,
    Format: r.format,
    Author: r.author,
    AverageRating: getAverageRating(r.ratings),
    Votes: r.ratings?.length || 0
  }));
  exportToCSV(exportData, 'EcoYouth_Resources_Report.csv');
};

// BR E.4 PDF Export Handler
const handleExportPDF = () => {
  const columns = ['Title', 'Category', 'Format', 'Author', 'Avg Rating'];
  const rows = filteredResources.value.map(r => [
    r.title,
    r.category,
    r.format,
    r.author,
    `${getAverageRating(r.ratings)}★ (${r.ratings?.length || 0})`
  ]);
  exportToPDF('Eco-Anxiety Coping Resources Library', columns, rows, 'EcoYouth_Resources_Report.pdf');
};
</script>
