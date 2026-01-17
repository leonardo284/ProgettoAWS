<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import { useRouter } from 'vue-router'

import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    const data = await authService.login(username.value, password.value)
    
    if (data.success) {
      auth.login(data.user) 
      router.push('/')
    }
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<template>
  <AppNavbar />

  <main class="main-content">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <h1>Area Riservata</h1>
          <p>Inserisci le tue credenziali per accedere</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              id="username"
              v-model="username" 
              type="text" 
              placeholder="Il tuo username"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

          <button type="submit" class="login-btn">
            ACCEDI
          </button>
        </form>

        <div class="login-footer">
          <p>Non hai un account? <a href="#">Contatta l'amministratore</a></p>
        </div>
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.main-content {
  /* Assicura che il footer stia in fondo anche se la pagina è vuota */
  min-height: calc(100vh - 70px - 300px); /* Altezza schermo meno Navbar e Footer approssimativo */
  background-color: #f4f7f9;
}

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.login-card {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: #003366;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px auto;
}

.logo-circle svg {
  width: 32px;
  height: 32px;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #003366;
  margin-bottom: 5px;
}

.login-header p {
  color: #666;
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
}

input {
  padding: 12px 15px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #003366;
}

.error-msg {
  color: #dc3545;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
}

.login-btn {
  background: #003366;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.login-btn:hover {
  background: #002244;
}

.login-btn:active {
  transform: scale(0.98);
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.85rem;
  color: #888;
}

.login-footer a {
  color: #003366;
  font-weight: 700;
  text-decoration: none;
}
</style>