<script setup>
import placeholderImg from '@/assets/players/placeholder.jpg';

const props = defineProps({
  player: { type: Object, required: true },
  side: { type: String, default: 'home' },
  events: { type: Array, default: () => [] },
  isSub: { type: Boolean, default: false },
  entered: { type: Boolean, default: false }
});

const roleMap = { 'P': 'Portiere', 'D': 'Difensore', 'C': 'Centrocampista', 'A': 'Attaccante' };

const hasExited = () => !props.isSub && props.events?.some(e => e.tipo === 'SOSTITUZIONE' && e.playerOutId === props.player.playerId);
const hasYellow = () => props.events?.some(e => e.playerId === props.player.playerId && e.tipo === 'AMMONIZIONE');
const hasRed = () => props.events?.some(e => e.playerId === props.player.playerId && e.tipo === 'ESPULSIONE');
</script>

<template>
  <div class="player-lineup-row" :class="[side]" v-if="player">
    
    <template v-if="side === 'home'">
      <div class="player-main">
        <img :src="player.foto || placeholderImg" class="player-img" />
        <div class="player-info">
          <span class="name">{{ player.nome }}</span>
          <span class="full-role">{{ roleMap[player.ruolo] || player.ruolo }}</span>
        </div>
        <div class="event-icons">
          <span v-if="hasYellow()" class="card yellow"></span>
          <span v-if="hasRed()" class="card red"></span>
          <span v-if="entered" class="arrow in">↑</span>
          <span v-if="hasExited()" class="arrow out">↓</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="player-main">
        <div class="event-icons">
          <span v-if="hasExited()" class="arrow out">↓</span>
          <span v-if="entered" class="arrow in">↑</span>
          <span v-if="hasRed()" class="card red"></span>
          <span v-if="hasYellow()" class="card yellow"></span>
        </div>
        <div class="player-info text-right">
          <span class="name">{{ player.nome }}</span>
          <span class="full-role">{{ roleMap[player.ruolo] || player.ruolo }}</span>
        </div>
        <img :src="player.foto || placeholderImg" class="player-img" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.player-lineup-row { 
  display: flex; 
  align-items: center; 
  padding: 12px 10px; 
  border-bottom: 1px solid #eee; 
  background: #fff; 
}

.player-main { display: flex; align-items: center; gap: 10px; flex: 1; }

.player-img { 
  width: 40px; 
  height: 40px; 
  border-radius: 50%; 
  object-fit: cover; 
  background: #f5f5f5; 
  border: 1px solid #ddd; 
}

.player-info { display: flex; flex-direction: column; flex: 1; }

/* Nome sempre nero e ben visibile */
.name { 
  font-size: 0.95rem; 
  font-weight: 700; 
  color: #000; /* Nero pieno invece di #333 */
}

.full-role { 
  font-size: 0.7rem; 
  color: #888; 
  text-transform: uppercase; 
  font-weight: 500;
}

.text-right { text-align: right; }

.event-icons { display: flex; align-items: center; gap: 6px; }

.card { 
  width: 10px; 
  height: 14px; 
  border-radius: 2px; 
  border: 1px solid rgba(0,0,0,0.1);
}

.yellow { background: #ffcc00; }
.red { background: #ff4d4d; }

.arrow { font-weight: 900; font-size: 1.2rem; }
.in { color: #28a745; }
.out { color: #e31b23; }

</style>