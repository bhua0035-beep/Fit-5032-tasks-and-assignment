import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Calendar from './views/Calendar.vue'
import Resources from './views/Resources.vue'
import Auth from './views/Auth.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import { isAuthenticated, currentUser } from './store.js'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/resources', name: 'Resources', component: Resources },
  { path: '/auth', name: 'Auth', component: Auth },
  { path: '/admin', name: 'Admin', component: AdminDashboard }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Resources' && !isAuthenticated.value) {
    next({ name: 'Auth' });
  } else if (to.name === 'Admin') {
    if (!isAuthenticated.value) {
      next({ name: 'Auth' });
    } else if (currentUser.value && currentUser.value.role !== 'admin') {
      next({ name: 'Resources' });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router

