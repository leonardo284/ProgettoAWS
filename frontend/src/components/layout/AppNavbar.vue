<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

// Stato per la visibilità del pannello mobile
const mostraPannello = ref(false)

const invertiMenu = () => {
  mostraPannello.value = !mostraPannello.value
}

const chiudiMenu = () => {
  mostraPannello.value = false
}

const gestisciAccount = () => {
  chiudiMenu()
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
      <RouterLink to="/" class="logo-link" @click="chiudiMenu">SERIE ASW</RouterLink>
    </div>

    <button class="pulsante-menu" @click="invertiMenu" :class="{ 'attivo': mostraPannello }">
      <span class="linea"></span>
      <span class="linea"></span>
      <span class="linea"></span>
    </button>

    <nav class="navbar__nav" :class="{ 'aperto': mostraPannello }">
      <RouterLink to="/calendario" @click="chiudiMenu">Calendario</RouterLink>
      <RouterLink to="/classifica" @click="chiudiMenu">Classifica</RouterLink>
      <RouterLink to="/club" @click="chiudiMenu">Club</RouterLink>
      <RouterLink to="/statistiche" @click="chiudiMenu">Statistiche</RouterLink>
      
      <div class="opzione-account-mobile" @click="gestisciAccount">
        <span v-if="auth.isLoggedIn">Profilo ({{ auth.user?.username }})</span>
        <span v-else>Accedi / Registrati</span>
      </div>
    </nav>

    <div class="navbar__desktop-user">
      <button @click="gestisciAccount" class="bottone-profilo">
        <div class="cerchio-utente">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <span v-if="auth.isLoggedIn" class="nome-utente">{{ auth.user?.username }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
  .navbar { 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    padding: 0 1.5rem; 
    height: 70px; 
    background-color: #003366; 
    color: white; 
    position: sticky; 
    top: 0; 
    z-index: 1000; 
  }
  
  .navbar__logo { font-size: 1.4rem; font-weight: 800; letter-spacing: 1px; }
  .logo-link { color: white; text-decoration: none; }

  .navbar__nav { display: flex; gap: 1.5rem; }
  .navbar__nav a { color: white; text-decoration: none; font-weight: 600; text-transform: uppercase; font-size: 0.9rem; }
  .navbar__nav a.router-link-active { border-bottom: 2px solid white; }

  .bottone-profilo { background: none; border: none; color: white; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .cerchio-utente { background: rgba(255,255,255,0.15); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.3s; }
  .cerchio-utente:hover { background: rgba(255,255,255,0.25); }

  .pulsante-menu { display: none; background: none; border: none; cursor: pointer; padding: 5px; }
  .opzione-account-mobile { display: none; }

  /* --- MEDIA QUERY PER SMARTPHONE --- */
  @media (max-width: 900px) {
    .pulsante-menu { display: flex; flex-direction: column; gap: 6px; }
    .linea { width: 28px; height: 3px; background-color: white; border-radius: 2px; transition: all 0.3s ease; }
    
    /* Trasforma le linee in una X quando attivo */
    .pulsante-menu.attivo .linea:nth-child(1) { transform: translateY(9px) rotate(45deg); }
    .pulsante-menu.attivo .linea:nth-child(2) { opacity: 0; }
    .pulsante-menu.attivo .linea:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

    .navbar__desktop-user { display: none; }

    .navbar__nav {
      position: fixed;
      top: 70px;
      right: 0;
      width: 70%; /* Il menu occupa il 70% della larghezza */
      height: calc(100vh - 70px);
      background-color: #00254a;
      flex-direction: column;
      padding: 2rem 0;
      gap: 0;
      transform: translateX(100%);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: -5px 0 15px rgba(0,0,0,0.3);
    }

    .navbar__nav.aperto { transform: translateX(0); }

    .navbar__nav a, .opzione-account-mobile {
      width: 100%;
      padding: 1.2rem 2rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      text-align: left;
    }

    .opzione-account-mobile { 
      display: block; 
      color: #00d4ff; 
      font-weight: 700;
      margin-top: auto; /* Sposta l'account in fondo al menu mobile */
    }
  }
</style>