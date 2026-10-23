import { createRouter, createWebHistory } from 'vue-router'
import { authReady, currentUser } from './store.js'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    {
      path: '/week5-registration',
      name: 'Week5Registration',
      component: () => import('./components/LibraryRegistrationForm.vue')
    },
    { path: '/json-lab', name: 'JsonLab', component: () => import('./components/JSONLab.vue') },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/FirebaseRegisterView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('./views/FirebaseSigninView.vue')
    },
    {
      path: '/WeatherCheck',
      name: 'GetWeather',
      component: () => import('./views/WeatherView.vue')
    },
    {
      path: '/CountBookAPI',
      name: 'CountBookAPI',
      component: () => import('./views/CountBookAPI.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/account',
      name: 'Account',
      component: () => import('./views/AccountView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/books/add',
      name: 'AddBook',
      component: () => import('./views/AddBookView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    await authReady

    if (!currentUser.value) {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
  }

  return true
})

export default router
