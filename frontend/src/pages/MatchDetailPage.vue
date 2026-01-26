<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { io } from 'socket.io-client'; 
import AppNavbar from '@/components/layout/AppNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import MatchScoreboard from '@/components/matches/MatchScoreboard.vue';
import MatchTabs from '@/components/matches/tabs/MatchTabs.vue';
import MatchAdminControls from '@/components/matches/MatchAdminControls.vue';
import EventModal from '@/components/matches/EventModal.vue'; 
import matchService from '@/services/matchesService';

const route = useRoute();
const auth = useAuthStore();
const match = ref(null);
const loading = ref(true);
let timerInterval = null;
let socket = null;

const isEventModalOpen = ref(false);

const calculateLiveMinute = (data) => {
  if (!data) return 0;
  let riferimento = null;
  let offset = 0;

  if (data.stato === 'IN_CORSO_PRIMO_TEMPO') {
    riferimento = data.inizioPrimoTempo;
  } else if (data.stato === 'IN_CORSO_SECONDO_TEMPO') {
    riferimento = data.inizioSecondoTempo;
    offset = 45;
  }

  if (riferimento) {
    const start = new Date(riferimento).getTime();
    const now = new Date().getTime();
    const diffSeconds = (now - start) / 1000;
    const factor = 0.3; 
    let min = Math.floor(diffSeconds * factor) + 1 + offset;
    return Math.min(min, offset === 0 ? 45 : 90);
  } else {
    if (data.stato === 'FINE_PRIMO_TEMPO') return 45;
    if (data.stato === 'FINITA') return 90;
    return 0;
  }
};

const fetchMatch = async () => {
  try {
    const data = await matchService.getMatchById(route.params.id);
    data.minutoCorrente = calculateLiveMinute(data);
    match.value = data;
  } catch (error) {
    console.error("Errore recupero partita:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchMatch();

  // Inizializzazione Socket.io
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');

  // Gestione dei cambi di STATO (Inizio/Fine tempi)
  socket.on('matchStatusUpdate', (updatedData) => {
    if (match.value && updatedData.matchId === match.value.matchId) {
      console.log("Push ricevuto: Cambio stato in", updatedData.stato);
      
      // Aggiorno i dati core
      match.value.stato = updatedData.stato;

      // Aggiorno i timestamp se presenti (fondamentale per il cronometro)
      if (updatedData.inizioPrimoTempo) {
        match.value.inizioPrimoTempo = updatedData.inizioPrimoTempo;
      }
      if (updatedData.inizioSecondoTempo) {
        match.value.inizioSecondoTempo = updatedData.inizioSecondoTempo;
      }
      
      // Ricalcolo immediato del minuto per sincronizzare la grafica
      match.value.minutoCorrente = calculateLiveMinute(match.value);
    }
  });

  // Gestione degli eventi (Goal, Cartellini, ecc.)
  socket.on('matchUpdate', (data) => {
    if (match.value && data.matchId === match.value.matchId) {
      console.log("Push ricevuto: Nuovo evento di tipo", data.nuovoEvento.tipo);
      
      // Aggiorna punteggio e aggiunge l'evento alla lista
      match.value.risultato = data.risultato;
      if (!match.value.eventi) match.value.eventi = [];
      match.value.eventi.push(data.nuovoEvento);
    }
  });
  // Timer interval per l'aggiornamento fluido del cronometro
  timerInterval = setInterval(() => {
    if (match.value && match.value.stato.startsWith('IN_CORSO')) {
      match.value.minutoCorrente = calculateLiveMinute(match.value);
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (socket) socket.disconnect(); // Pulizia connessione socket
});

const handleRefresh = () => fetchMatch();
const openEventModal = () => isEventModalOpen.value = true;
const closeEventModal = () => isEventModalOpen.value = false;
</script>

<template>
  <AppNavbar />
  <main class="container">
    <div v-if="loading" class="loader">Caricamento in corso...</div>

    <template v-else-if="match">
      <MatchAdminControls 
        v-if="auth.isLoggedIn && auth.user?.role === 'administrator'" 
        :match="match" 
        @refreshMatch="handleRefresh" 
        @openEventPopup="openEventModal"
      />

      <MatchScoreboard :match="match" />
      <MatchTabs :match="match" />

      <EventModal 
        :isOpen="isEventModalOpen" 
        :match="match"
        @close="closeEventModal" 
        @refreshMatch="handleRefresh"
      />
    </template>

    <div v-else class="loader">Partita non trovata.</div>
  </main>
  <AppFooter />
</template>
<style scoped>
.container {
  min-height: 80vh;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.loader {
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>