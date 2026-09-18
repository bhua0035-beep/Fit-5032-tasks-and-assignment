import { createRouter, createWebHistory } from 'vue-router'
import { authReady, currentUser } from './store.js'
import HomeView from './views/HomeView.vue'
import FirebaseRegisterView from './views/FirebaseRegisterView.vue'
import FirebaseSigninView from './views/FirebaseSigninView.vue'
import AccountView from './views/AccountView.vue'
import AddBookView from './views/AddBookView.vue'
import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
import JSONLab from './components/JSONLab.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/week5-registration', name: 'Week5Registration', component: LibraryRegistrationForm },
    { path: '/json-lab', name: 'JsonLab', component: JSONLab },
    { path: '/register', name: 'Register', component: FirebaseRegisterView },
    { path: '/login', name: 'Login', component: FirebaseSigninView },
    { path: '/account', name: 'Account', component: AccountView, meta: { requiresAuth: true } },
    { path: '/books/add', name: 'AddBook', component: AddBookView, meta: { requiresAuth: true } }
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
