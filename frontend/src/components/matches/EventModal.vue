<script setup>
import { ref, computed, watch } from 'vue';
import matchesService from '@/services/matchesService'; // Importiamo il servizio

const props = defineProps({
  isOpen: Boolean,
  match: Object
});

const emit = defineEmits(['close', 'refreshMatch']); // Cambiato 'save' in 'refreshMatch'

const selectedTeamId = ref(null);
const selectedPlayerId = ref('');
const selectedType = ref(null);
const minute = ref(props.match?.minutoCorrente || 0);

const eventTypes = ["GOAL", "AMMONIZIONE", "ESPULSIONE", "FALLO", "RIGORE", "ANGOLO", "SOSTITUZIONE"];

const homeTeam = computed(() => props.match?.squadre?.casa);
const awayTeam = computed(() => props.match?.squadre?.trasferta);

const filteredPlayers = computed(() => {
  let team = null;
  if (selectedTeamId.value === homeTeam.value?.teamId) team = homeTeam.value;
  else if (selectedTeamId.value === awayTeam.value?.teamId) team = awayTeam.value;
  if (!team || !team.formazione) return [];
  return [...(team.formazione.titolari || []), ...(team.formazione.panchina || [])];
});

const isValid = computed(() => selectedTeamId.value && selectedPlayerId.value && selectedType.value);

// FUNZIONE DI REGISTRAZIONE REALE
const handleRegisterEvent = async () => {
  try {
    const payload = {
      squadraId: selectedTeamId.value,
      playerId: selectedPlayerId.value,
      tipo: selectedType.value,
      minuto: minute.value
    };

    // Chiamata al backend tramite il servizio che hai già in matchesService.js
    await matchesService.addLiveEvent(props.match.matchId, payload);
    
    emit('refreshMatch'); // Dice a MatchDetailPage di ricaricare i dati
    emit('close');        // Chiude la modale
    
    // Reset form per il prossimo evento
    selectedType.value = null;
    selectedPlayerId.value = '';
  } catch (err) {
    console.error("Errore salvataggio evento:", err);
    alert("Errore durante il salvataggio dell'evento");
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Nuovo Evento Live</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Squadra</label>
          <div class="team-selector">
            <button 
              v-if="homeTeam"
              type="button"
              :class="['team-btn', { active: selectedTeamId === homeTeam.teamId }]"
              @click="selectedTeamId = homeTeam.teamId"
            >
              {{ homeTeam.nome }}
            </button>
            <button 
              v-if="awayTeam"
              type="button"
              :class="['team-btn', { active: selectedTeamId === awayTeam.teamId }]"
              @click="selectedTeamId = awayTeam.teamId"
            >
              {{ awayTeam.nome }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Giocatore</label>
          <select v-model="selectedPlayerId" class="select-input" :disabled="!selectedTeamId">
            <option value="" disabled>-- Seleziona Giocatore --</option>
            <option v-for="player in filteredPlayers" :key="player.playerId" :value="player.playerId">
              {{ player.nome }} ({{ player.ruolo }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Tipo di Evento</label>
          <div class="event-grid">
            <button 
              v-for="type in eventTypes" 
              :key="type"
              type="button"
              :class="['event-btn', { selected: selectedType === type }]"
              @click="selectedType = type"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Minuto</label>
          <input type="number" v-model="minute" class="minute-input" />
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Annulla</button>
        <button 
          @click="handleRegisterEvent" 
          class="btn-primary" 
          :disabled="!isValid"
        >
          Registra Evento
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); display: flex; justify-content: center;
  align-items: center; z-index: 9999;
}
.modal-content {
  background: white; padding: 25px; border-radius: 12px;
  width: 90%; max-width: 450px; color: #333;
}
.team-selector { display: flex; gap: 10px; margin-top: 5px; }
.team-btn {
  flex: 1; padding: 12px; border: 2px solid #eee; border-radius: 8px;
  background: #f8f9fa; cursor: pointer; font-weight: bold;
}
.team-btn.active { border-color: #003366; background: #003366; color: white; }

.form-group { margin-top: 15px; }
label { display: block; font-size: 12px; font-weight: bold; color: #666; }
.select-input { width: 100%; padding: 12px; margin-top: 5px; border-radius: 8px; border: 1px solid #ddd; }

.event-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 5px; }
.event-btn { padding: 10px 5px; border: 1px solid #ddd; border-radius: 6px; background: white; font-size: 10px; font-weight: bold; cursor: pointer; }
.event-btn.selected { background: #e21e1e; color: white; border-color: #e21e1e; }

.minute-input { width: 100%; padding: 12px; margin-top: 5px; border-radius: 8px; border: 1px solid #ddd; }
.modal-footer { margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px; }
.btn-primary { background: #003366; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: #eee; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
</style>