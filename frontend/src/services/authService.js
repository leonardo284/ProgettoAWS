import api from './api';

export const authService = {
   /**
   * Effettua il login verificando le credenziali nel DB
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // La risposta contiene { success: true, token: "...", user: {...} }
      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || 'Errore durante il login';
      throw new Error(message);
    }
  },
};