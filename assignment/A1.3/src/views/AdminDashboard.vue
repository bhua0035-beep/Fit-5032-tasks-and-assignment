<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <div class="card shadow border-danger">
          <div class="card-header bg-danger text-white">
            <h3 class="card-title mb-0">Admin Dashboard</h3>
          </div>
          <div class="card-body">
            <p class="lead">Welcome, {{ currentUser?.username }}. You have Administrator privileges.</p>
            <hr>
            <h5>System Users</h5>
            <table class="table table-bordered">
              <thead class="table-dark">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usersDB" :key="user.username">
                  <td>{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-primary'">{{ user.role.toUpperCase() }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { currentUser, usersDB } from '../store.js';
</script>
