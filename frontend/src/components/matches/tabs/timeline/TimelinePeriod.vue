<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

// Determino il testo da mostrare in base al tipo di evento
const label = computed(() => {
  switch (props.event.tipo) {
    case 'INIZIO_PARTITA': return "CALCIO D'INIZIO";
    case 'INTERVALLO': return "INTERVALLO";
    case 'FINE_PARTITA': return "FINE PARTITA";
    default: return "";
  }
});
</script>

<template>
  <div class="timeline-start-wrapper">
    <div class="divider-line"></div>
    
    <div class="start-content">
      <div class="icon-timer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      
      <div class="label-box">
        <span class="main-label">{{ label }}</span>
        
        <div v-if="event.tipo === 'INTERVALLO'" class="partial-score">
          <span class="team">{{ match.squadre.casa.nome }}</span>
          <span class="score">{{ event.risultatoMomento.casa }} - {{ event.risultatoMomento.trasferta }}</span>
          <span class="team">{{ match.squadre.trasferta.nome }}</span>
        </div>
      </div>
    </div>
    
    <div class="divider-line"></div>
  </div>
</template>

<style scoped>
.timeline-start-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 0;
  gap: 20px;
  background: transparent;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #444, #444, transparent);
  opacity: 0.5;
}

.start-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.icon-timer {
  color: #888;
  width: 24px;
  height: 24px;
}

.label-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.main-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #a0a0a0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* Stile per il risultato parziale sotto 'INTERVALLO' */
.partial-score {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
}

.score {
  color: #888;
}

.team {
  text-transform: capitalize;
}
</style>