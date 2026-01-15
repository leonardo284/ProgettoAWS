<script setup>
import { computed } from 'vue';
import placeholderImg from '@/assets/players/placeholder.jpg';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

// Recupera i dati del marcatore e dell'eventuale assistman
const getPlayerData = (playerId) => {
  if (!props.match?.squadre || !playerId) return null;
  const allPlayers = [
    ...props.match.squadre.casa.formazione.titolari,
    ...props.match.squadre.casa.formazione.panchina,
    ...props.match.squadre.trasferta.formazione.titolari,
    ...props.match.squadre.trasferta.formazione.panchina
  ];
  return allPlayers.find(p => p.playerId === playerId);
};

const scorer = computed(() => getPlayerData(props.event.playerId));
const assistman = computed(() => getPlayerData(props.event.assistId));

const team = computed(() => 
  props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta
);
</script>

<template>
  <div class="timeline-card goal-card" v-if="scorer">
    <div class="card-header-goal">
      <div class="goal-title">
        <span class="ball-icon">⚽</span>
        <span class="type-label">GOOOOL!</span>
      </div>
      <div class="minute">{{ event.minuto }}'</div>
    </div>
    
    <div class="card-body">
      <div class="player-details">
        <div class="player-name">{{ scorer.nome }}</div>
        <div class="player-meta">
          <img :src="team.logo" class="mini-logo" />
          {{ team.nome }} · {{ scorer.ruolo }}
        </div>
        <div v-if="assistman" class="assist-info">
          Assist: <strong>{{ assistman.nome }}</strong>
        </div>
      </div>

      <div class="photo-container">
        <img 
          :src="scorer.foto || placeholderImg" 
          class="player-photo" 
          @error="(e) => e.target.src = placeholderImg"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.goal-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #d1e3f8;
  margin-bottom: 15px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header-goal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #e3f2fd; 
}

.goal-title { display: flex; align-items: center; gap: 8px; }
.ball-icon { font-size: 1.1rem; }

.type-label { 
  font-weight: 900; 
  font-size: 0.85rem; 
  color: #000000; 
  letter-spacing: 1px; 
}

.minute { 
  color: #1976d2; 
  font-weight: 700; 
}

.card-body { 
  padding: 15px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.player-name { font-size: 1.1rem; font-weight: 800; color: #222; }

.player-meta { 
  font-size: 0.85rem; 
  color: #666; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  margin-top: 3px; 
}

.mini-logo { width: 14px; height: 14px; object-fit: contain; }

.assist-info { 
  font-size: 0.8rem; 
  color: #555; 
  margin-top: 8px; 
  font-style: italic; 
}

.player-photo {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  background: #f0f0f0;
  border: 1px solid #e3f2fd;
}
</style>