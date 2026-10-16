<template>
  <div class="container my-5">
    <!-- Header -->
    <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
      <div>
        <div class="d-flex align-items-center gap-2">
          <h1 class="h2 fw-bold text-danger mb-0">🛡️ Admin System Dashboard</h1>
          <span class="badge bg-danger">Administrator Access</span>
        </div>
        <p class="text-muted mt-1 mb-0">
          Executive control center for EcoYouth Action: monitor registered members, manage user roles, and trigger bulk communications.
        </p>
      </div>
      <div class="d-flex gap-2">
        <router-link to="/email-center" class="btn btn-primary">
          📢 Bulk Communications
        </router-link>
        <button class="btn btn-outline-secondary" @click="exportUsersCSV">
          📥 Export User Database (CSV)
        </button>
      </div>
    </div>

    <!-- System Overview KPI Metrics -->
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-sm-6">
        <div class="card shadow-sm border-0 border-top border-4 border-danger p-3">
          <small class="text-muted fw-bold">TOTAL REGISTERED USERS</small>
          <div class="h2 fw-bold text-dark mb-0">{{ usersDB.length }}</div>
          <small class="text-success">Across 4 Access Roles</small>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card shadow-sm border-0 border-top border-4 border-success p-3">
          <small class="text-muted fw-bold">RESOURCES IN LIBRARY</small>
          <div class="h2 fw-bold text-dark mb-0">{{ resourcesList.length }}</div>
          <small class="text-muted">7 Categories Active</small>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card shadow-sm border-0 border-top border-4 border-primary p-3">
          <small class="text-muted fw-bold">SCHEDULED WORKSHOPS</small>
          <div class="h2 fw-bold text-dark mb-0">{{ eventsList.length }}</div>
          <small class="text-muted">Melbourne Victoria</small>
        </div>
      </div>
      <div class="col-md-3 col-sm-6">
        <div class="card shadow-sm border-0 border-top border-4 border-warning p-3">
          <small class="text-muted fw-bold">PEER SESSIONS BOOKED</small>
          <div class="h2 fw-bold text-dark mb-0">{{ appointmentsList.length }}</div>
          <small class="text-muted">0 Scheduling Conflicts</small>
        </div>
      </div>
    </div>

    <!-- User Management Table (Interactive Table 3) -->
    <div class="card shadow-sm border-0 mb-4">
      <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-dark">User Account & Role Management</h5>
        <span class="badge bg-secondary">{{ usersDB.length }} Accounts</span>
      </div>
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email Address</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in usersDB" :key="user.id">
              <td><strong>{{ user.name }}</strong></td>
              <td><code>{{ user.username }}</code></td>
              <td>{{ user.email }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="{
                    'bg-danger': user.role === 'admin',
                    'bg-primary': user.role === 'volunteer',
                    'bg-info text-dark': user.role === 'counselor',
                    'bg-secondary': user.role === 'user'
                  }"
                >
                  {{ user.role.toUpperCase() }}
                </span>
              </td>
              <td>
                <select 
                  class="form-select form-select-sm" 
                  style="max-width: 140px;"
                  v-model="user.role"
                >
                  <option value="admin">admin</option>
                  <option value="volunteer">volunteer</option>
                  <option value="counselor">counselor</option>
                  <option value="user">user</option>
                </select>
              </td>
              <td class="text-end">
                <button 
                  class="btn btn-sm btn-outline-danger" 
                  @click="deleteUser(user.id)" 
                  :disabled="user.username === 'admin'"
                >
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- System Audit Log Stream -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-dark text-white py-2">
        <strong class="small">System Security & Activity Audit Log</strong>
      </div>
      <ul class="list-group list-group-flush small" style="max-height: 220px; overflow-y: auto;">
        <li v-for="(log, idx) in auditLogs" :key="idx" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ log.action }}</span>
          <span class="text-muted">{{ log.timestamp }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usersDB, resourcesList, eventsList, appointmentsList, exportToCSV } from '../store.js';

const auditLogs = ref([
  { action: 'Admin logged in from Monash University subnet (Melbourne)', timestamp: 'Just now' },
  { action: 'Firebase Auth token verified via external identity provider', timestamp: '2 minutes ago' },
  { action: 'Booking constraint check executed for Dr. Sarah Lin (Conflict resolved)', timestamp: '15 minutes ago' },
  { action: 'Bulk communication dispatch queue initialized (5 recipients)', timestamp: '1 hour ago' },
  { action: 'Database backup synchronized to Google Cloud Firestore', timestamp: '3 hours ago' }
]);

const deleteUser = (id) => {
  if (confirm('Delete this user account?')) {
    usersDB.value = usersDB.value.filter(u => u.id !== id);
    auditLogs.value.unshift({
      action: `User ID ${id} deleted by Admin`,
      timestamp: 'Just now'
    });
  }
};

const exportUsersCSV = () => {
  const exportData = usersDB.value.map(u => ({
    ID: u.id,
    Name: u.name,
    Username: u.username,
    Email: u.email,
    Role: u.role
  }));
  exportToCSV(exportData, 'EcoYouth_Users_Database.csv');
};
</script>
