import { defineStore } from 'pinia'

// definizione dello store per l'autenticazione
// uso sessionStorage così i dati vengono cancellati quando l'utente chiude la scheda del browser
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
    isLoggedIn: !!sessionStorage.getItem('token')
  }),
    // definizione delle azioni per il login e logout

  actions: {
    login(data) {
      this.user = data.user;
      this.token = data.token;
      this.isLoggedIn = true;

      // Salvataggio nel browser per non perdere il login al refresh
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('token', data.token);
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
      sessionStorage.clear();
    }
  }
});