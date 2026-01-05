<script setup>
import { formatTime, formatShortDate } from '@/services/utilityService';

// Definizione delle props riceve l'oggetto match dal database
defineProps({
  match: {
    type: Object,
    required: true
  }
});

// Evento per gestire il click sulla card e navigare al dettaglio
defineEmits(['click']);
</script>

<template>
  <div class="match-card" @click="$emit('click', match.matchId)">
    <div class="match-info">
      <div class="matchday-text">MATCHDAY {{ match.giornata }}</div>
      <div class="date-time-row">
        <span>{{ formatShortDate(match.dataOra) }}</span>
        <span class="pipe-sep">|</span>
        <span>{{ formatTime(match.dataOra) }}</span>
      </div>
    </div>

    <div class="teams-flex">
      <div class="team home">
        <span class="team-name">{{ match.squadre.casa.nome }}</span>
        <img :src="match.squadre.casa.logo" class="team-logo" :alt="match.squadre.casa.nome" />
      </div>

      <div class="score-box">
        <span>{{ match.stato === 'NON_INIZIATA' ? 0 : match.risultato.casa }}</span>
        <span class="score-separator">|</span>
        <span>{{ match.stato === 'NON_INIZIATA' ? 0 : match.risultato.trasferta }}</span>
      </div>

      <div class="team away">
        <img :src="match.squadre.trasferta.logo" class="team-logo" :alt="match.squadre.trasferta.nome" />
        <span class="team-name">{{ match.squadre.trasferta.nome }}</span>
      </div>
    </div>
    
    <div class="side-spacer"></div>
  </div>
</template>

<style scoped>
.match-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 1.2rem 2rem;
  margin-bottom: 0.4rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #00f2d3;
}

/* Colonna info sinistra */
.match-info {
  width: 140px;
  padding-right: 20px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.matchday-text {
  font-weight: 700;
  font-size: 0.85rem;
  color: #001c33;
  text-transform: uppercase;
}

.date-time-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
  font-size: 0.8rem;
  margin-top: 4px;
}

.pipe-sep {
  color: #ddd;
  font-weight: 300;
}

/* Flexbox per squadre e punteggio */
.teams-flex {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
}

.team {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 220px;
}

.home { justify-content: flex-end; text-align: right; }
.away { justify-content: flex-start; text-align: left; }

.team-name {
  font-weight: 800;
  text-transform: uppercase;
  color: #001c33;
  font-size: 1rem;
}

.team-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

/* Box punteggio blu scuro */
.score-box {
  background: #001c33;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.4rem;
  border-radius: 6px;
  font-size: 1.6rem;
  font-weight: 700;
  min-width: 80px;
  justify-content: center;
}

.score-separator {
  opacity: 0.4;
  font-weight: 300;
  font-size: 1.2rem;
}

.side-spacer {
  width: 140px; /* Bilancia la larghezza della match-info a sinistra */
}

/* Responsive per schermi piccoli */
@media (max-width: 768px) {
  .match-card {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  .match-info {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    align-items: center;
  }
  .teams-flex { gap: 1rem; }
  .team { width: auto; }
  .side-spacer { display: none; }
}
</style>