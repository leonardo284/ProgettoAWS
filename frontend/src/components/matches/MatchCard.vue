<script setup>
  import { formatTime, formatShortDate } from '@/services/utilityService';

  // Definizione delle props
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
        <img :src="match.squadre.casa.logo" class="team-logo" :alt="match.squadre.casa.nome" />
        <span class="team-name">{{ match.squadre.casa.nome }}</span>
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
  margin-bottom: 0.8rem;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s ease-in-out;
  border: 1px solid #eee;
}

.match-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  border-color: #00f2d3;
}

/* Colonna Info Sinistra */
.match-info {
  width: 150px;
  padding-right: 20px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.matchday-text {
  font-weight: 800;
  font-size: 0.75rem;
  color: #001c33;
  letter-spacing: 0.5px;
}

.date-time-row {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.85rem;
  margin-top: 4px;
}

.pipe-sep { color: #ccc; }

/* Centro della Card: Squadre e Score */
.teams-flex {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  padding: 0 20px;
}

.team {
  display: flex;
  flex-direction: column; 
  align-items: center;
  gap: 0.6rem;
  width: 160px; 
  text-align: center;
}

.team-logo {
  width: 45px;
  height: 45px;
  object-fit: contain;
  flex-shrink: 0;
}

.team-name {
  font-weight: 800;
  text-transform: uppercase;
  color: #001c33;
  font-size: 0.85rem;
  line-height: 1.2;
}

/* Box Punteggio */
.score-box {
  background: #001c33;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  font-size: 1.8rem;
  font-weight: 900;
  min-width: 90px;
  justify-content: center;
}

.score-separator { opacity: 0.3; font-weight: 300; }

.side-spacer { width: 150px; }

/* --- RESPONSIVE MOBILE --- */
@media (max-width: 850px) {
  .match-card {
    flex-direction: column;
    padding: 1.5rem 1rem;
    gap: 1.2rem;
  }

  .match-info {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 12px;
    align-items: center;
  }

  .teams-flex {
    width: 100%;
    padding: 0;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .team {
    width: 100px;
  }

  .team-logo {
    width: 50px;
    height: 50px;
  }

  .team-name {
    font-size: 0.7rem;
  }

  .score-box {
    min-width: 75px;
    font-size: 1.4rem;
    padding: 0.4rem 0.8rem;
  }

  .side-spacer { display: none; }
}
</style>