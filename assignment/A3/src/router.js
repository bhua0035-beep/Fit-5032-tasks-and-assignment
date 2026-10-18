import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Resources from './views/Resources.vue';
import EventsTable from './views/EventsTable.vue';
import MapView from './views/MapView.vue';
import Calendar from './views/Calendar.vue';
import Analytics from './views/Analytics.vue';
import AICoach from './views/AICoach.vue';
import EmailCenter from './views/EmailCenter.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import Auth from './views/Auth.vue';
import { isAuthenticated, currentUser } from './store.js';

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home - EcoYouth Action' } },
  { path: '/resources', name: 'Resources', component: Resources, meta: { title: 'Resources Library', requiresAuth: true } },
  { path: '/events', name: 'Events', component: EventsTable, meta: { title: 'Events Schedule' } },
  { path: '/map', name: 'Map', component: MapView, meta: { title: 'Impact Map & Routing' } },
  { path: '/calendar', name: 'Calendar', component: Calendar, meta: { title: 'Counseling Calendar & Conflict Management' } },
  { path: '/analytics', name: 'Analytics', component: Analytics, meta: { title: 'Impact Analytics & Charts' } },
  { path: '/ai-coach', name: 'AICoach', component: AICoach, meta: { title: 'Youth Coping Assistant' } },
  { path: '/email-center', name: 'EmailCenter', component: EmailCenter, meta: { title: 'Email Center', requiresAdmin: true } },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { title: 'Admin Dashboard', requiresAdmin: true } },
  { path: '/auth', name: 'Auth', component: Auth, meta: { title: 'Sign In / Register' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation Guards for Protected & Admin Routes
router.beforeEach((to, from, next) => {
  // Update document title for accessibility
  document.title = to.meta.title ? `${to.meta.title} | EcoYouth Action` : 'EcoYouth Action Melbourne';

  if (to.meta.requiresAdmin) {
    if (!isAuthenticated.value) {
      next({ name: 'Auth' });
    } else if (currentUser.value?.role !== 'admin') {
      alert('Access Denied: This area requires Administrator privileges.');
      next({ name: 'Resources' });
    } else {
      next();
    }
  } else if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      next({ name: 'Auth' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
