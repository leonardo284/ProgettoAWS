<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

// Funzione per recuperare i dati completi di un giocatore dal match
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

const playerIn = computed(() => getPlayerData(props.event.playerInId));
const playerOut = computed(() => getPlayerData(props.event.playerOutId));
const team = computed(() => 
  props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta
);
</script>

<template>
  <div class="timeline-card substitution-card" v-if="playerIn && playerOut">
    <div class="card-header">
      <div class="type-info">
        <span class="sub-icon-wrapper">
          <span class="arrow-up">↑</span>
          <span class="arrow-down">↓</span>
        </span>
        <span class="type-label">SOSTITUZIONE</span>
      </div>
      <div class="minute">{{ event.minuto }}'</div>
    </div>

    <div class="card-body">
      <div class="player-entry entra">
        <div class="details">
          <span class="action-label label-entra">ENTRA</span>
          <div class="player-name">{{ playerIn.nome }}</div>
          <div class="player-meta">
            <img :src="team.logo" class="mini-logo" />
            {{ team.nome }} · {{ playerIn.ruolo }} #{{ playerIn.numero || '?' }}
          </div>
        </div>
        <div class="player-photo-wrapper">
          <img :src="playerIn.foto" class="player-photo" />
        </div>
      </div>

      <div class="player-entry esce">
        <div class="details">
          <span class="action-label label-esce">ESCE</span>
          <div class="player-name">{{ playerOut.nome }}</div>
          <div class="player-meta">
            <img :src="team.logo" class="mini-logo" />
            {{ team.nome }} · {{ playerOut.ruolo }} #{{ playerOut.numero || '?' }}
          </div>
        </div>
        <div class="player-photo-wrapper">
          <img :src="playerOut.foto" class="player-photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.substitution-card {
  background: #1e1e1e;
  border-radius: 12px;
  border: 1px solid #333;
  margin-bottom: 15px;
  color: #fff;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid #333;
}

.type-info { display: flex; align-items: center; gap: 10px; }

.sub-icon-wrapper { display: flex; flex-direction: column; line-height: 0.8; font-weight: 900; }
.arrow-up { color: #28a745; font-size: 1rem; }
.arrow-down { color: #dc3545; font-size: 1rem; }

.type-label { font-weight: 800; font-size: 0.85rem; letter-spacing: 0.5px; }
.minute { color: #aaa; font-weight: 600; font-size: 0.9rem; }

.card-body { padding: 15px; display: flex; flex-direction: column; gap: 20px; }

.player-entry { display: flex; justify-content: space-between; align-items: center; }

.details { flex: 1; }
.action-label { font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 4px; }
.label-entra { color: #28a745; }
.label-esce { color: #dc3545; }

.player-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 2px; }
.player-meta { font-size: 0.8rem; color: #999; display: flex; align-items: center; gap: 6px; }
.mini-logo { width: 14px; height: 14px; object-fit: contain; }

.player-photo-wrapper {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 2px solid #333;
  overflow: hidden;
  background: #2a2a2a;
}

.entra .player-photo-wrapper { border-color: #28a745; }
.esce .player-photo-wrapper { border-color: #dc3545; }

.player-photo { width: 100%; height: 100%; object-fit: cover; }
</style>