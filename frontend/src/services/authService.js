import api from './api'; // Importiamo la tua istanza configurata di axios

export const authService = {
  /**
   * Effettua il login verificando le credenziali nel DB
   */
  async login(username, password) {
    try {
      const response = await api.post('/auth/login', {
        username,
        password
      });
      
      return response.data;
    } catch (error) {
      // Recupero il messaggio di errore inviato dal controller del backend
      const message = error.response?.data?.message || 'Errore durante il login';
      throw new Error(message);
    }
  },


};