import axios from 'axios'
import { useAuthStore } from '@/stores/auth' // 1. Importa lo store
import router from '@/router'

const api = axios.create({
  baseURL: '/api', 
  timeout: 5000
})

// INTERCEPTOR RICHIESTE: Inserisce il token in OGNI chiamata
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.token // Prende il token dallo store Pinia
    
    // se il token esiste lo inserisce nell'header Authorization
    if (token) {
      // Inserisce il token nel formato standard Bearer
      config.headers.Authorization = `Bearer ${token}`
    } 
    /*else {
      console.warn("Nessun token trovato nello store!")
    }*/
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// INTERCEPTOR RISPOSTE: Gestisce errori 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore()
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      auth.logout()
      if (router.currentRoute.value.path !== '/login') {
        // Reindirizza alla pagina di login con un messaggio di sessione scaduta
        router.push({ name: 'Login', query: { error: 'session_expired' } })
      }
    }
    return Promise.reject(error)
  }
)

export default api