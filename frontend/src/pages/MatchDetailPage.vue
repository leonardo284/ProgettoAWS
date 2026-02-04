<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { io } from 'socket.io-client'; 
  import matchService from '@/services/matchesService';

  // Componenti
  import AppNavbar from '@/components/layout/AppNavbar.vue';
  import AppFooter from '@/components/layout/AppFooter.vue';
  import MatchScoreboard from '@/components/matches/MatchScoreboard.vue';
  import MatchTabs from '@/components/matches/tabs/MatchTabs.vue';
  import MatchAdminControls from '@/components/matches/MatchAdminControls.vue';
  import EventModal from '@/components/matches/EventModal.vue'; 

  const route = useRoute();
  const auth = useAuthStore();
  const match = ref(null);
  const loading = ref(true);
  let timerInterval = null;
  let socket = null;

  // variabile che indica se il modal per l'inserimento eventi è aperto
  const isEventModalOpen = ref(false);

  // Funzione che prende come parametro la partita e restituisce il minuto di gioco in tempo reale
  const calculateLiveMinute = (data) => {
    if (!data) return 0;
    let riferimento = null;
    let offset = 0;

    // Determina il riferimento temporale in base allo stato della partita
    // recuperando i timestamp di inizio tempi
    if (data.stato === 'IN_CORSO_PRIMO_TEMPO') {
      riferimento = data.inizioPrimoTempo;
    } else if (data.stato === 'IN_CORSO_SECONDO_TEMPO') {
      riferimento = data.inizioSecondoTempo;
      offset = 45;
    }

    if (riferimento) {
      const start = new Date(riferimento).getTime();
      const now = new Date().getTime();
      const diffSeconds = (now - start) / 1000; // Differenza in secondi (divido per mille perché getTime() restituisce millisecondi)
      const factor = 0.3;                       // Fattore di velocità per simulare il tempo di gioco reale
      
      let min = Math.floor(diffSeconds * factor) + 1 + offset;  // Calcolo del minuto di gioco
      return Math.min(min, offset === 0 ? 45 : 90);             // Limita al massimo a 45 o 90 minuti
    } else {
      // Se la partita non è in corso, restituisco il minuto finale del tempo
      if (data.stato === 'FINE_PRIMO_TEMPO') return 45;
      if (data.stato === 'FINITA') return 90;
      return 0;
    }
  };

  // Funzione per recuperare i dati della partita 
  const fetchMatch = async () => {
    try {
      // Recupero i dati della partita
      const data = await matchService.getMatchById(route.params.id);
      // Calcolo il minuto corrente in base ai timestamp
      data.minutoCorrente = calculateLiveMinute(data);
      match.value = data;
    } catch (error) {
      console.error("Errore recupero partita:", error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    // Recupero i dati iniziali della partita
    fetchMatch();

    // Inizializzazione Socket.io
    socket = io('http://localhost:3000');

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
    // ogni 1000 millisecondi ricalcola il minuto di gioco se la partita è in corso
    timerInterval = setInterval(() => {
      if (match.value && match.value.stato.startsWith('IN_CORSO')) {
        match.value.minutoCorrente = calculateLiveMinute(match.value);
      }
    }, 1000);
  });

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval); // termino l'interval del timer
    if (socket) socket.disconnect(); // Disconnetto Socket.io 
  });

  // funzione per ricaricare i dati della partita (eseguita alla ricezione dell'eventorefreshMatch)
  const handleRefresh = () => fetchMatch();  
  // funzioni per aprire/chiudere il modal di inserimento eventi (eseguite alla ricezione degli eventi openEventPopup)
  const openEventModal = () => isEventModalOpen.value = true;
  // funzione per chiudere il modal di inserimento eventi (eseguita alla ricezione dell'evento close)
  const closeEventModal = () => isEventModalOpen.value = false;
  
</script>

<template>
  <AppNavbar />
  <main class="container">
    <div v-if="loading" class="loader">Caricamento in corso...</div>

    <template v-else-if="match">
      <!-- se l'admin è loggato allora mostro il MatchAdminControl -->
      <MatchAdminControls 
        v-if="auth.isLoggedIn && auth.user?.role === 'administrator'" 
        :match="match" 
        @refreshMatch="handleRefresh"   
        @openEventPopup="openEventModal"
      />

      <MatchScoreboard :match="match" />
      <MatchTabs :match="match" />

      <!-- Modal per l'inserimento eventi -->
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