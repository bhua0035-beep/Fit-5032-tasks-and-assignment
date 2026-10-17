<template>
  <div class="container my-5">
    <!-- Header & Action Row -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <h1 class="h2 fw-bold text-success mb-1">Youth Climate Events & Support Directory</h1>
        <p class="text-muted mb-0">
          Interactive schedule of grief circles, tree-planting sessions, and youth climate advocacy circles across Melbourne.
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <!-- BR E.4 Export Buttons -->
        <button class="btn btn-outline-success" @click="handleExportCSV" title="Export events to CSV">
          📥 Export Events (CSV)
        </button>
        <button class="btn btn-outline-danger" @click="handleExportPDF" title="Export events to PDF">
          📄 Export Schedule (PDF)
        </button>
        <router-link to="/calendar" class="btn btn-success">
          🗓️ Book Counseling Slot
        </router-link>
      </div>
    </div>

    <!-- Table Controls: Global Search & Per-Page Controls (BR D.3) -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <label for="eventGlobalSearch" class="form-label small text-muted fw-bold">Global Events Search</label>
            <div class="input-group">
              <span class="input-group-text bg-light">🔍</span>
              <input 
                id="eventGlobalSearch"
                type="text" 
                class="form-control" 
                v-model.trim="globalFilter" 
                placeholder="Search by event title, location, date, or category..."
              >
            </div>
          </div>
          <div class="col-md-3">
            <label for="eventCategoryQuick" class="form-label small text-muted fw-bold">Filter Category</label>
            <select id="eventCategoryQuick" class="form-select" v-model="columnFilters.category">
              <option value="">All Categories</option>
              <option value="Counseling">Counseling & Circles</option>
              <option value="Action">Action & Greening</option>
              <option value="Mindfulness">Mindfulness</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Advocacy">Advocacy & Policy</option>
            </select>
          </div>
          <div class="col-md-3 text-md-end pt-md-4">
            <span class="badge bg-secondary p-2">
              Showing {{ paginatedEvents.length }} of {{ filteredEvents.length }} matching events
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Interactive Table 2 (BR D.3: Sort, Search, Column Filters, 10 Rows/Page) -->
    <div class="card shadow-sm border-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0" aria-label="Melbourne Climate Events Table">
          <thead class="table-success">
            <!-- Header Row with Sortable Columns -->
            <tr>
              <th scope="col" class="sortable-th" @click="sortBy('title')">
                Event Title
                <span v-if="sortKey === 'title'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('category')">
                Category
                <span v-if="sortKey === 'category'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('date')">
                Date & Time
                <span v-if="sortKey === 'date'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('location')">
                Location (Melbourne)
                <span v-if="sortKey === 'location'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('capacity')">
                Spots / Capacity
                <span v-if="sortKey === 'capacity'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="sortable-th" @click="sortBy('status')">
                Status
                <span v-if="sortKey === 'status'">{{ sortOrder === 'asc' ? ' ▲' : ' ▼' }}</span>
              </th>
              <th scope="col" class="text-end">Register</th>
            </tr>
            <!-- Individual Column Search Inputs (BR D.3 Specification) -->
            <tr class="bg-light">
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.title" 
                  placeholder="Filter title..."
                  aria-label="Filter events by title"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.category" 
                  placeholder="Filter category..."
                  aria-label="Filter events by category"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.date" 
                  placeholder="Filter date..."
                  aria-label="Filter events by date"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.location" 
                  placeholder="Filter location..."
                  aria-label="Filter events by location"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.capacity" 
                  placeholder="Min spots..."
                  aria-label="Filter events by capacity"
                >
              </th>
              <th class="p-1">
                <input 
                  type="text" 
                  class="form-control form-control-sm" 
                  v-model.trim="columnFilters.status" 
                  placeholder="Filter status..."
                  aria-label="Filter events by status"
                >
              </th>
              <th class="p-1 text-center">
                <button 
                  class="btn btn-sm btn-outline-secondary w-100 py-0" 
                  @click="clearFilters" 
                  title="Clear all filters"
                >
                  Clear
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in paginatedEvents" :key="event.id">
              <td>
                <span class="fw-semibold text-dark">{{ event.title }}</span>
              </td>
              <td>
                <span class="badge bg-success-subtle text-success border border-success-subtle">
                  {{ event.category }}
                </span>
              </td>
              <td>
                <div>{{ event.date }}</div>
                <small class="text-muted">{{ event.time }}</small>
              </td>
              <td>
                <router-link to="/map" class="text-decoration-none text-primary" title="View on Map">
                  📍 {{ event.location }}
                </router-link>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <span class="me-2">{{ event.booked }} / {{ event.capacity }}</span>
                  <div class="progress flex-grow-1" style="height: 6px;">
                    <div 
                      class="progress-bar" 
                      :class="event.booked >= event.capacity ? 'bg-danger' : (event.booked >= event.capacity * 0.8 ? 'bg-warning' : 'bg-success')" 
                      :style="{ width: (event.booked / event.capacity * 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td>
                <span 
                  class="badge" 
                  :class="{
                    'bg-success': event.status === 'Open',
                    'bg-warning text-dark': event.status === 'Almost Full',
                    'bg-danger': event.status === 'Full'
                  }"
                >
                  {{ event.status }}
                </span>
              </td>
              <td class="text-end">
                <button 
                  class="btn btn-sm" 
                  :class="event.status === 'Full' ? 'btn-outline-secondary disabled' : 'btn-outline-success'"
                  @click="registerForEvent(event)"
                >
                  {{ event.status === 'Full' ? 'Waitlist' : 'RSVP Free' }}
                </button>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                No matching community events found. Try adjusting your search query or column filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer (Strictly 10 rows per page limit - BR D.3) -->
      <div class="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center py-3">
        <div class="small text-muted">
          Showing <strong>{{ startIndex + 1 }}</strong> to <strong>{{ Math.min(startIndex + pageSize, filteredEvents.length) }}</strong> of <strong>{{ filteredEvents.length }}</strong> events (Page {{ currentPage }} of {{ totalPages || 1 }})
        </div>
        <nav aria-label="Events table pagination">
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
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { eventsList, exportToCSV, exportToPDF } from '../store.js';

// Search & Filter State (BR D.3)
const globalFilter = ref('');
const columnFilters = reactive({
  title: '',
  category: '',
  date: '',
  location: '',
  capacity: '',
  status: ''
});

// Sorting State
const sortKey = ref('date');
const sortOrder = ref('asc');

// Pagination State (10 rows limit)
const currentPage = ref(1);
const pageSize = 10;

const clearFilters = () => {
  globalFilter.value = '';
  columnFilters.title = '';
  columnFilters.category = '';
  columnFilters.date = '';
  columnFilters.location = '';
  columnFilters.capacity = '';
  columnFilters.status = '';
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

// Filtered Events Computation
const filteredEvents = computed(() => {
  return eventsList.value.filter(event => {
    // 1. Global Filter
    if (globalFilter.value) {
      const g = globalFilter.value.toLowerCase();
      const matchGlobal = 
        event.title.toLowerCase().includes(g) ||
        event.category.toLowerCase().includes(g) ||
        event.location.toLowerCase().includes(g) ||
        event.date.includes(g) ||
        event.status.toLowerCase().includes(g);
      if (!matchGlobal) return false;
    }

    // 2. Individual Column Filters
    if (columnFilters.title && !event.title.toLowerCase().includes(columnFilters.title.toLowerCase())) {
      return false;
    }
    if (columnFilters.category && !event.category.toLowerCase().includes(columnFilters.category.toLowerCase())) {
      return false;
    }
    if (columnFilters.date && !event.date.includes(columnFilters.date)) {
      return false;
    }
    if (columnFilters.location && !event.location.toLowerCase().includes(columnFilters.location.toLowerCase())) {
      return false;
    }
    if (columnFilters.status && !event.status.toLowerCase().includes(columnFilters.status.toLowerCase())) {
      return false;
    }
    if (columnFilters.capacity) {
      const minCap = parseInt(columnFilters.capacity, 10);
      if (!isNaN(minCap) && event.capacity < minCap) return false;
    }

    return true;
  }).sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

// Pagination Calculations
const totalPages = computed(() => Math.ceil(filteredEvents.value.length / pageSize));
const startIndex = computed(() => (currentPage.value - 1) * pageSize);
const paginatedEvents = computed(() => {
  return filteredEvents.value.slice(startIndex.value, startIndex.value + pageSize);
});

const registerForEvent = (event) => {
  if (event.booked < event.capacity) {
    event.booked++;
    if (event.booked === event.capacity) event.status = 'Full';
    else if (event.booked >= event.capacity * 0.8) event.status = 'Almost Full';
    alert(`Success! You have registered for "${event.title}". A confirmation has been added to your dashboard.`);
  } else {
    alert(`This event is currently full. You have been added to the waitlist.`);
  }
};

// BR E.4 CSV Export Handler
const handleExportCSV = () => {
  const exportData = filteredEvents.value.map(e => ({
    ID: e.id,
    Title: e.title,
    Category: e.category,
    Date: e.date,
    Time: e.time,
    Location: e.location,
    Capacity: e.capacity,
    Booked: e.booked,
    Status: e.status
  }));
  exportToCSV(exportData, 'EcoYouth_Events_Schedule.csv');
};

// BR E.4 PDF Export Handler
const handleExportPDF = () => {
  const columns = ['Event Title', 'Category', 'Date & Time', 'Location', 'Capacity', 'Status'];
  const rows = filteredEvents.value.map(e => [
    e.title,
    e.category,
    `${e.date} (${e.time})`,
    e.location,
    `${e.booked}/${e.capacity}`,
    e.status
  ]);
  exportToPDF('Youth Climate Events & Community Workshops Schedule', columns, rows, 'EcoYouth_Events_Schedule.pdf');
};
</script>
