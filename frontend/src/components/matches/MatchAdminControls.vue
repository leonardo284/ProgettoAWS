<script setup>
  import { computed } from 'vue';
  import matchesService from '@/services/matchesService';

  const props = defineProps({
    match: { type: Object, required: true }
  });

  // Dichiaro eventi emessi:
  // refreshMatch -> evento emesso per ricaricare i dati della partita 
  // openEventPopup -> evento emesso per aprire il modal di inserimento evento
  const emit = defineEmits(['refreshMatch', 'openEventPopup']);

  // calcolo delle proprietà booleane basate sullo stato della partita per abilitare/disabilitare i bottoni
  const canStartFirstHalf = computed(() => props.match.stato === 'NON_INIZIATA');
  const canStartSecondHalf = computed(() => props.match.stato === 'FINE_PRIMO_TEMPO');
  // la partita deve essere in corso per poter terminare il periodo
  const canEndPeriod = computed(() => 
    props.match.stato === 'IN_CORSO_PRIMO_TEMPO' || props.match.stato === 'IN_CORSO_SECONDO_TEMPO'
  );
  // la partita deve essere in corso per poter aggiungere eventi
  const canAddEvent = computed(() => 
    props.match.stato === 'IN_CORSO_PRIMO_TEMPO' || props.match.stato === 'IN_CORSO_SECONDO_TEMPO'
  );


  // funzione per aprire il modal di inserimento evento
  // emetto l'evento al componente genitore MatchDetailPage.vue
  const handleOpenEventModal = () => { emit('openEventPopup');};

  // Funzione per avviare il primo tempo
  // emetto anche l'evento per ricaricare i dati della partita
  const handleStartFirstHalf = async () => {
    try {
      await matchesService.startFirstHalf(props.match.matchId);
      emit('refreshMatch');
    } catch (err) {
      console.error("Errore avvio match:", err);
    }
  };

  // Funzione per avviare il secondo tempo
  // emetto anche l'evento per ricaricare i dati della partita
  const handleStartSecondHalf = async () => {
    try {
      await matchesService.startSecondHalf(props.match.matchId);
      emit('refreshMatch');
    } catch (err) {
      console.error("Errore avvio secondo tempo:", err);
    }
  };

  // Funzione per terminare il tempo di gioco corrente (primo o secondo tempo)
  // emetto anche l'evento per ricaricare i dati della partita
  const handleEndPeriod = async () => {
    
    // booleano per capire se si tratta del secondo tempo
    const isSecondHalf = props.match.stato === 'IN_CORSO_SECONDO_TEMPO';
    
    // calcolo del messaggio di conferma
    const msg = !isSecondHalf ? "Fischiare la fine del primo tempo?" : "Fischiare la fine della partita?";
      
    if (confirm(msg)) {
      try {
        // chiamo il service per terminare il tempo di gioco (primo o secondo tempo)
        // ci pensa il backend a capire quale tempo terminare in base allo stato della partita
        await matchesService.endPeriod(props.match.matchId);
        
        console.log("TEmpo di gioco terminato con successo.");
        emit('refreshMatch');
      } catch (err) {
        console.error("Errore fine periodo:", err);
        alert("Errore nel terminare il match.");
      }
    }
  };
</script>

<template>
  <div class="admin-panel">
    <div class="admin-header">
      <span class="badge">LIVE ADMIN PANEL</span>
      <span class="debug-info">STATO: {{ match.stato?.replace(/_/g, ' ') }}</span>
    </div>

    <div class="controls-container">
      <button v-if="canStartFirstHalf" @click="handleStartFirstHalf" class="btn btn-start">
        INIZIA PRIMO TEMPO
      </button>

      <button v-if="canStartSecondHalf" @click="handleStartSecondHalf" class="btn btn-start">
        INIZIA SECONDO TEMPO
      </button>

      <button v-if="canEndPeriod" @click="handleEndPeriod" class="btn btn-stop">
        {{ match.stato === 'IN_CORSO_PRIMO_TEMPO' ? 'FINE 1° TEMPO' : 'FINE PARTITA' }}
      </button>

      <button v-if="canAddEvent" @click="handleOpenEventModal" class="btn btn-event">
        + AGGIUNGI EVENTO ({{ match.minutoCorrente }}')
      </button>
      
      <p v-if="match.stato === 'FINITA'" class="status-msg">Match Concluso</p>
    </div>
  </div>
</template>

<style scoped>
  .admin-panel {
    background: #1a1a1a;
    color: white;
    padding: 15px;
    border-radius: 12px;
    margin-bottom: 20px;
    border-left: 5px solid #e21e1e;
  }
  .admin-header {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .badge { background: #e21e1e; padding: 2px 8px; border-radius: 4px; }
  .debug-info { color: #ffcc00; }
  .controls-container { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn { border: none; padding: 12px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; }
  .btn-start { background: #28a745; color: white; }
  .btn-stop { background: #dc3545; color: white; }
  .btn-event { background: #007bff; color: white; }
  .status-msg { color: #888; font-style: italic; }
</style>