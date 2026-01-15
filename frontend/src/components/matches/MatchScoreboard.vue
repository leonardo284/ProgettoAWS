<script setup>
const props = defineProps({
  match: { type: Object, required: true }
});

// Funzione sicura per estrarre il nome
const getPlayerName = (playerId, teamKey) => {
  if (!props.match?.squadre?.[teamKey]?.formazione) return '...';
  
  const team = props.match.squadre[teamKey];
  const player = [...team.formazione.titolari, ...team.formazione.panchina]
    .find(p => p.playerId === playerId);
    
  return player ? player.nome : 'Giocatore';
};

const getGoals = (teamId) => {
  if (!props.match?.eventi) return [];
  return props.match.eventi.filter(e => e.tipo === "GOAL" && e.squadraId === teamId);
};
</script>

<template>
  <div class="scoreboard-container" v-if="match && match.squadre">
    <div class="match-header">
      <span class="giornata">GIORNATA {{ match.giornata }}</span>
      <span class="stato-pill">{{ match.stato?.replace('_', ' ') }}</span>
    </div>

    <div class="score-display">
      <div class="team-side">
        <img :src="match.squadre.casa.logo" class="team-logo" alt="logo casa">
        <h2 class="team-name">{{ match.squadre.casa.nome }}</h2>
      </div>

      <div class="score-numbers">
        <span class="big-score">{{ match.risultato.casa }}</span>
        <span class="divider">-</span>
        <span class="big-score">{{ match.risultato.trasferta }}</span>
      </div>

      <div class="team-side">
        <img :src="match.squadre.trasferta.logo" class="team-logo" alt="logo trasferta">
        <h2 class="team-name">{{ match.squadre.trasferta.nome }}</h2>
      </div>
    </div>

    <div class="scorers-footer">
      <div class="scorers-column home">
        <div v-for="goal in getGoals(match.squadre.casa.teamId)" :key="goal._id" class="goal-item">
          {{ getPlayerName(goal.playerId, 'casa') }} {{ goal.minuto }}' ⚽
        </div>
      </div>

      <div class="scorers-column away">
        <div v-for="goal in getGoals(match.squadre.trasferta.teamId)" :key="goal._id" class="goal-item">
          ⚽ {{ getPlayerName(goal.playerId, 'trasferta') }} {{ goal.minuto }}'
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scoreboard-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 30px;
  border: 2px solid #ddd; 
  /* Ombra leggermente più intensa per profondità */
  box-shadow: 0 6px 15px rgba(0,0,0,0.1); 
  margin-bottom: 25px;
  color: #1a1a1a;
}

.match-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  font-weight: 800;
  color: #555;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.stato-pill {
  background: #e0e0e0; /* Grigio più visibile */
  color: #000;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid #ccc;
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.team-side {
  flex: 1;
  text-align: center;
}

.team-logo {
  width: 85px;
  height: 85px;
  object-fit: contain;
  margin-bottom: 12px;
}

.team-name {
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
  color: #000;
}

.score-numbers {
  display: flex;
  align-items: center;
  gap: 25px;
}

.big-score {
  font-size: 5rem;
  font-weight: 900;
  color: #000;
  line-height: 1;
}

.divider {
  font-size: 2.5rem;
  color: #bbb;
  font-weight: 300;
}

.scorers-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Linea separatrice più evidente */
  border-top: 2px solid #eee; 
  padding-top: 25px;
  gap: 40px;
}

.scorers-column.home { text-align: right; }
.scorers-column.away { text-align: left; }

.goal-item {
  font-size: 0.95rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}

@media (max-width: 600px) {
  .big-score { font-size: 3.5rem; }
  .team-logo { width: 60px; height: 60px; }
  .team-name { font-size: 1.1rem; }
  .scoreboard-container { padding: 20px; }
}
</style>