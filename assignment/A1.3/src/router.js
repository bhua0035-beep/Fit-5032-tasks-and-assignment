import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Calendar from './views/Calendar.vue'
import Resources from './views/Resources.vue'
import Auth from './views/Auth.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/resources', name: 'Resources', component: Resources },
  { path: '/auth', name: 'Auth', component: Auth }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
