<script setup>
  import { ref, computed, watch } from 'vue';
  import matchesService from '@/services/matchesService';

  const props = defineProps({
    isOpen: Boolean,
    match: Object
  });

  const emit = defineEmits(['close', 'refreshMatch']);

  const selectedTeamId = ref(null);
  const selectedType = ref(null);
  const selectedPlayerId = ref('');
  const outPlayerId = ref('');      
  const inPlayerId = ref('');       
  const minute = ref(0);

  const eventTypes = ["GOAL", "AMMONIZIONE", "ESPULSIONE", "RIGORE", "ANGOLO", "SOSTITUZIONE", "FALLO"];

  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      minute.value = props.match?.minutoCorrente || 0;
      resetForm();
    }
  });

  const homeTeam = computed(() => props.match?.squadre?.casa);
  const awayTeam = computed(() => props.match?.squadre?.trasferta);
  const selectedTeam = computed(() => 
    selectedTeamId.value === homeTeam.value?.teamId ? homeTeam.value : awayTeam.value
  );

  const starters = computed(() => selectedTeam.value?.formazione?.titolari || []);
  const bench = computed(() => selectedTeam.value?.formazione?.panchina || []);

  const isValid = computed(() => {
    if (!selectedTeamId.value || !selectedType.value) return false;
    if (['ANGOLO', 'RIGORE', 'FALLO'].includes(selectedType.value)) return true;
    if (selectedType.value === 'SOSTITUZIONE') return outPlayerId.value && inPlayerId.value;
    return selectedPlayerId.value !== '';
  });

  const resetForm = () => {
    selectedTeamId.value = null;
    selectedType.value = null;
    selectedPlayerId.value = '';
    outPlayerId.value = '';
    inPlayerId.value = '';
  };

  const handleRegisterEvent = async () => {
    try {
      const payload = {
        squadraId: selectedTeamId.value,
        tipo: selectedType.value,
        minuto: minute.value,
      };

      if (selectedType.value === 'SOSTITUZIONE') {
        payload.playerId = inPlayerId.value; 
        payload.playerOutId = outPlayerId.value;
      } else if (!['ANGOLO', 'RIGORE', 'FALLO'].includes(selectedType.value)) {
        payload.playerId = selectedPlayerId.value;
      }

      await matchesService.addLiveEvent(props.match.matchId, payload);
      emit('refreshMatch');
      emit('close');
    } catch (err) {
      console.error("Errore salvataggio evento:", err);
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
              v-for="team in [homeTeam, awayTeam]" 
              :key="team?.teamId"
              :class="['team-btn', { active: selectedTeamId === team?.teamId }]"
              @click="selectedTeamId = team?.teamId"
            >
              {{ team?.nome }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Tipo di Evento</label>
          <div class="event-grid">
            <button 
              v-for="type in eventTypes" :key="type"
              :class="['event-btn', { selected: selectedType === type }]"
              @click="selectedType = type"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <div v-if="selectedType === 'SOSTITUZIONE' && selectedTeamId" class="sub-container">
          <div class="form-group">
            <label>Esce</label>
            <select v-model="outPlayerId" class="select-input">
              <option value="" disabled>-- Seleziona --</option>
              <option v-for="p in starters" :key="p.playerId" :value="p.playerId">{{ p.nome }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Entra</label>
            <select v-model="inPlayerId" class="select-input">
              <option value="" disabled>-- Seleziona --</option>
              <option v-for="p in bench" :key="p.playerId" :value="p.playerId">{{ p.nome }}</option>
            </select>
          </div>
        </div>

        <div v-else-if="selectedType && !['RIGORE', 'ANGOLO', 'FALLO'].includes(selectedType)" class="form-group">
          <label>Giocatore</label>
          <select v-model="selectedPlayerId" class="select-input" :disabled="!selectedTeamId">
            <option value="" disabled>-- Seleziona Giocatore --</option>
            <option v-for="p in starters" :key="p.playerId" :value="p.playerId">
              {{ p.nome }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Minuto Effettivo</label>
          <input type="number" v-model="minute" class="minute-input" />
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Annulla</button>
        <button @click="handleRegisterEvent" class="btn-primary" :disabled="!isValid">
          Registra Evento
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7); display: flex; justify-content: center;
    align-items: center; z-index: 9999;
  }
  .modal-content {
    background: white; padding: 25px; border-radius: 16px;
    width: 90%; max-width: 420px;
  }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .modal-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; }
  .close-btn { background: none; border: none; font-size: 24px; color: #94a3b8; cursor: pointer; }

  .form-group { margin-bottom: 15px; }
  label { display: block; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }

  .team-selector { display: flex; gap: 10px; }
  .team-btn { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .team-btn.active { background: #1e293b; color: white; border-color: #1e293b; }

  .event-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .event-btn { padding: 10px 5px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 0.7rem; font-weight: 700; cursor: pointer; }
  .event-btn.selected { background: #ef4444; color: white; border-color: #ef4444; }

  .sub-container { background: #f1f5f9; padding: 12px; border-radius: 10px; margin-bottom: 15px; }
  .select-input, .minute-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; outline: none; }

  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  .btn-primary { background: #003366; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-secondary { background: #f1f5f9; border: none; padding: 12px 15px; border-radius: 8px; color: #475569; font-weight: 600; cursor: pointer; }
</style>