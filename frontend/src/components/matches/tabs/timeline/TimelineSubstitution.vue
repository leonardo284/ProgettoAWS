<script setup>
import { computed } from 'vue';
import placeholderImg from '@/assets/players/placeholder.jpg';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

const getPlayerData = (playerId) => {
  if (!playerId || !props.match?.squadre) return null;
  
  const s = props.match.squadre;
  const tutti = [
    ...(s.casa.formazione.titolari || []),
    ...(s.casa.formazione.panchina || []),
    ...(s.trasferta.formazione.titolari || []),
    ...(s.trasferta.formazione.panchina || [])
  ];
  
  return tutti.find(p => Number(p.playerId) === Number(playerId));
};

const playerIn = computed(() => getPlayerData(props.event.playerId)); 
const playerOut = computed(() => getPlayerData(props.event.playerOutId));

// Recupero l'intera squadra per avere logo e nome
const team = computed(() => 
  props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta
);
</script>

<template>
  <div class="sub-card-light" v-if="playerIn || playerOut">
    <div class="time-column">
      <span class="minute-badge">{{ event.minuto }}'</span>
      <div class="line-connector"></div>
    </div>
    
    <div class="event-content">
      <div class="header-row">
        <span class="sub-icon">⇅</span>
        <span class="label">SOSTITUZIONE</span>
      </div>

      <div class="player-entry">
        <div class="player-data">
          <span class="status-tag in">ENTRA</span>
          <span class="name">{{ playerIn?.nome || 'Sconosciuto' }}</span>
          <div class="team-info">
            <img :src="team?.logo" class="team-logo-inline" v-if="team?.logo" />
            <span class="team-details">{{ team?.nome }} · {{ playerIn?.ruolo }}</span>
          </div>
        </div>
        <div class="photo-container">
          <img 
            :src="playerIn?.foto || placeholderImg" 
            class="p-img border-in" 
            @error="(e) => e.target.src = placeholderImg"
          />
        </div>
      </div>

      <div class="horizontal-divider"></div>

      <div class="player-entry">
        <div class="player-data">
          <span class="status-tag out">ESCE</span>
          <span class="name">{{ playerOut?.nome || 'Sconosciuto' }}</span>
          <div class="team-info">
            <img :src="team?.logo" class="team-logo-inline" v-if="team?.logo" />
            <span class="team-details">{{ team?.nome }} · {{ playerOut?.ruolo }}</span>
          </div>
        </div>
        <div class="photo-container">
          <img 
            :src="playerOut?.foto || placeholderImg" 
            class="p-img border-out" 
            @error="(e) => e.target.src = placeholderImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-card-light {
  display: flex;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.time-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.minute-badge {
  background: #0f172a;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
}

.event-content { flex: 1; }

.header-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.sub-icon { color: #10b981; font-weight: bold; }
.label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.05em; }

.player-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-data { display: flex; flex-direction: column; }

.team-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}

.team-logo-inline {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.team-details {
  font-size: 0.75rem;
  color: #64748b;
}

.status-tag {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 1px 6px;
  border-radius: 4px;
  width: fit-content;
  margin-bottom: 2px;
}

.status-tag.in { background: #dcfce7; color: #166534; }
.status-tag.out { background: #fee2e2; color: #991b1b; }

.name { font-weight: 700; color: #1e293b; font-size: 1rem; line-height: 1.2; }

.photo-container { position: relative; width: 48px; height: 48px; }

.p-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f5f9;
  border: 2px solid transparent;
}

.border-in { border-color: #10b981; }
.border-out { border-color: #ef4444; }

.horizontal-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 10px 0;
}
</style>