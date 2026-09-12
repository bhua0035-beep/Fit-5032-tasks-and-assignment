import { ref } from 'vue';

export const isAuthenticated = ref(false);
export const currentUser = ref(null);

export const usersDB = [
  { username: 'admin', email: 'admin@eco.com', password: 'password', role: 'admin' },
  { username: 'user', email: 'user@eco.com', password: 'password', role: 'user' }
];

export const login = (username, password) => {
  const user = usersDB.find(u => u.username === username && u.password === password);
  if (user) {
    isAuthenticated.value = true;
    currentUser.value = { username: user.username, email: user.email, role: user.role };
    return true;
  }
  return false;
};

export const logout = () => {
  isAuthenticated.value = false;
  currentUser.value = null;
};
