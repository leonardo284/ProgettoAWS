import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    isLoggedIn: !!sessionStorage.getItem('user')
  }),
  actions: {
    login(userData) {
      this.user = userData;
      this.isLoggedIn = true;
      // Salvataggio in sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userData));
    },
    logout() {
      this.user = null;
      this.isLoggedIn = false;
      // Rimozione da sessionStorage
      sessionStorage.removeItem('user');
      // Per sicurezza pulisco tutta la sessione
      sessionStorage.clear();
    }
  }
})