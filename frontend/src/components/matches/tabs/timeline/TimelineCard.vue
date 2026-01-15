<script setup>
import { computed } from 'vue';
import placeholderImg from '@/assets/players/placeholder.jpg';


const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

const getPlayerData = (playerId) => {
  if (!props.match?.squadre) return null;
  const allPlayers = [
    ...props.match.squadre.casa.formazione.titolari,
    ...props.match.squadre.casa.formazione.panchina,
    ...props.match.squadre.trasferta.formazione.titolari,
    ...props.match.squadre.trasferta.formazione.panchina
  ];
  return allPlayers.find(p => p.playerId === playerId);
};

const player = computed(() => getPlayerData(props.event.playerId));
const isYellow = computed(() => props.event.tipo === 'AMMONIZIONE');

const team = computed(() => 
  props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta
);
</script>

<template>
  <div class="timeline-card booking-card" v-if="player">
    <div class="card-header">
      <div class="type-info">
        <div class="card-icon" :class="isYellow ? 'yellow' : 'red'"></div>
        <span class="type-label">
          {{ isYellow ? 'CARTELLINO GIALLO' : 'CARTELLINO ROSSO' }}
        </span>
      </div>
      <div class="minute">{{ event.minuto }}'</div>
    </div>

    <div class="card-body">
      <div class="player-details">
        <div class="player-name">{{ player.nome }}</div>
        <div class="player-meta">
          <img :src="team.logo" class="mini-logo" />
          {{ team.nome }} · {{ player.ruolo }}
        </div>
      </div>

      <div class="photo-container">
        <img :src="player.foto || placeholderImg" class="player-photo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 12px;
  color: #333;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  background: #fcfcfc;
  border-bottom: 1px solid #f0f0f0;
}

.type-info { display: flex; align-items: center; gap: 10px; }

.card-icon {
  width: 12px;
  height: 18px;
  border-radius: 2px;
}
.yellow { background-color: #ffcc00; }
.red { background-color: #ff4d4d; }

.type-label { 
  font-weight: 700; 
  font-size: 0.75rem; 
  color: #666;
  text-transform: uppercase;
}

.minute { color: #999; font-weight: 700; font-size: 0.85rem; }

.card-body { 
  padding: 12px 15px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.player-name { 
  font-size: 1rem; 
  font-weight: 700; 
  color: #111;
}

.player-meta { 
  font-size: 0.8rem; 
  color: #888; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  margin-top: 2px;
}

.mini-logo { width: 14px; height: 14px; object-fit: contain; }

.player-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: #f7f7f7;
  border: 1px solid #eee; /* Bordo sottile neutro */
}
</style>