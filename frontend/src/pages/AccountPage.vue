<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Importiamo i componenti layout
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout() // Pulisce Pinia e localStorage
  router.push('/login')
}
</script>

<template>
  <AppNavbar />

  <main class="main-content">
    <div class="account-page">
      <div class="account-card" v-if="auth.isLoggedIn">
        <div class="profile-header">
          <div class="avatar-big">
            {{ auth.user.username.charAt(0).toUpperCase() }}
          </div>
          <h1>{{ auth.user.username }}</h1>
          <span class="role-badge">{{ auth.user.role }}</span>
        </div>

        <div class="profile-details">
          <div class="detail-item">
            <label>ID UTENTE</label>
            <p>#{{ auth.user.id }}</p>
          </div>
          <div class="detail-item">
            <label>STATO ACCOUNT</label>
            <p class="status-active">Attivo</p>
          </div>
        </div>

        <button @click="handleLogout" class="logout-btn">
          LOGOUT
        </button>
      </div>

      <div class="account-card" v-else>
        <p>Devi effettuare l'accesso per visualizzare questa pagina.</p>
        <button @click="router.push('/login')" class="login-redirect-btn">
          VAI AL LOGIN
        </button>
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.main-content {
  background: #f8f9fa;
  /* Assicura che la pagina occupi almeno lo spazio visibile */
  min-height: calc(100vh - 70px - 300px); 
}

.account-page {
  padding: 60px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.account-card {
  background: white;
  width: 100%;
  max-width: 450px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  text-align: center;
}

.avatar-big {
  width: 80px;
  height: 80px;
  background: #003366;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  margin: 0 auto 20px;
}

.role-badge {
  display: inline-block;
  background: #e9ecef;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #495057;
  margin-top: 10px;
}

.profile-details {
  margin: 30px 0;
  text-align: left;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.detail-item {
  margin-bottom: 15px;
}

.detail-item label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #adb5bd;
  display: block;
  margin-bottom: 5px;
}

.detail-item p {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.status-active { color: #28a745; }

.logout-btn {
  width: 100%;
  padding: 15px;
  border: 2px solid #dc3545;
  background: transparent;
  color: #dc3545;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #dc3545;
  color: white;
}

.login-redirect-btn {
  margin-top: 20px;
  background: #003366;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
</style>