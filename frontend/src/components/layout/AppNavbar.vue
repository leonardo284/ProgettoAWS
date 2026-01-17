<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const handleAccountClick = () => {
  if (auth.isLoggedIn) {
    router.push('/account')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar__logo">
      <RouterLink to="/" class="logo-link">SERIE A</RouterLink>
    </div>

    <nav class="navbar__menu">
      <RouterLink to="/calendario">Calendario</RouterLink>
      <RouterLink to="/classifica">Classifica</RouterLink>
      <RouterLink to="/club">Club</RouterLink>
    </nav>

    <div class="navbar__user">
      <button @click="handleAccountClick" class="account-btn">
        <div class="user-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <span v-if="auth.isLoggedIn" class="user-name">{{ auth.user.username }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>

  .navbar { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 70px; background: #003366; color: white; }
  
  .navbar__menu { display: flex; gap: 2rem; }

  .navbar__menu a { color: white; text-decoration: none; font-weight: 600; text-transform: uppercase; }
  
  .account-btn { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 8px; cursor: pointer; }
  
  .user-icon { background: rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

  .navbar__logo {
    font-size: 1.3rem;
    font-weight: bold;
  }

  .logo-link {
    color: white;
    text-decoration: none;
  }

  .navbar__menu a:hover {
    text-decoration: underline;
  }

  /* evidenzia link attivo */
  .navbar__menu a.router-link-active {
    text-decoration: underline;
  }
</style>