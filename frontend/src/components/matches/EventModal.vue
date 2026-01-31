<script setup>
  import { ref, computed, watch } from 'vue';
  import matchesService from '@/services/matchesService';

  const props = defineProps({
    isOpen: Boolean,
    match: Object
  });

  const emit = defineEmits(['close', 'refreshMatch']);

  // --- STATO DEL FORM ---
  const selectedTeamId = ref(null);
  const selectedType = ref(null);
  const selectedPlayerId = ref('');
  const outPlayerId = ref('');      
  const inPlayerId = ref('');       
  const minute = ref(0);

  const eventTypes = ["GOAL", "AMMONIZIONE", "ESPULSIONE", "RIGORE", "ANGOLO", "SOSTITUZIONE", "FALLO"];

  // --- LOGICA DI FILTRAGGIO DINAMICO ---

  const homeTeam = computed(() => props.match?.squadre?.casa);
  const awayTeam = computed(() => props.match?.squadre?.trasferta);
  const selectedTeam = computed(() => 
    selectedTeamId.value === homeTeam.value?.teamId ? homeTeam.value : awayTeam.value
  );

  // 1. Identifica chi ha lasciato il campo (per sostituzione o espulsione)
  const playersOffField = computed(() => {
    const off = new Set();
    props.match?.eventi?.forEach(e => {
      if (e.tipo === 'SOSTITUZIONE' && e.playerOutId) off.add(Number(e.playerOutId));
      if (e.tipo === 'ESPULSIONE' && e.playerId) off.add(Number(e.playerId));
    });
    return off;
  });

  // 2. Identifica chi è già entrato dalla panchina
  const playersAlreadyEntered = computed(() => {
    const entered = new Set();
    props.match?.eventi?.forEach(e => {
      if (e.tipo === 'SOSTITUZIONE' && e.playerId) entered.add(Number(e.playerId));
    });
    return entered;
  });

  // 3. Conteggio sostituzioni per squadra
  const substitutionsCount = computed(() => {
    if (!props.match?.eventi || !selectedTeamId.value) return 0;
    return props.match.eventi.filter(e => 
      e.tipo === 'SOSTITUZIONE' && Number(e.squadraId) === Number(selectedTeamId.value)
    ).length;
  });

  const hasSubstitutionsLeft = computed(() => substitutionsCount.value < 5);

  // 4. Giocatori ATTUALMENTE IN CAMPO
  const playersCurrentlyOnField = computed(() => {
    if (!selectedTeam.value) return [];
    const off = playersOffField.value;
    const entered = playersAlreadyEntered.value;

    // Titolari ancora in campo
    const startersStillIn = (selectedTeam.value.formazione?.titolari || []).filter(p => !off.has(Number(p.playerId)));

    // Sostituti entrati in campo
    const subsInField = (selectedTeam.value.formazione?.panchina || []).filter(p => entered.has(Number(p.playerId)) && !off.has(Number(p.playerId)));

    return [...startersStillIn, ...subsInField];
  });

  // 5. Giocatori DISPONIBILI IN PANCHINA
  const availableBench = computed(() => {
    if (!selectedTeam.value || !hasSubstitutionsLeft.value) return [];
    const entered = playersAlreadyEntered.value;

    return (selectedTeam.value.formazione?.panchina || []).filter(p => !entered.has(Number(p.playerId)));
  });

  // --- GESTIONE AZIONI ---

  watch(() => props.isOpen, (newVal) => {
    if (newVal) {
      minute.value = props.match?.minutoCorrente || 0;
      resetForm();
    }
  });

  const isValid = computed(() => {
    if (!selectedTeamId.value || !selectedType.value) return false;
    if (['ANGOLO', 'RIGORE', 'FALLO'].includes(selectedType.value)) return true;
    
    if (selectedType.value === 'SOSTITUZIONE') {
      return outPlayerId.value && inPlayerId.value && hasSubstitutionsLeft.value;
    }
    
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
          <div class="sub-limit-info" :class="{ 'danger': !hasSubstitutionsLeft }">
            Sostituzioni effettuate: {{ substitutionsCount }} / 5
          </div>

          <template v-if="hasSubstitutionsLeft">
            <div class="form-group">
              <label>Esce</label>
              <select v-model="outPlayerId" class="select-input">
                <option value="" disabled>-- Seleziona --</option>
                <option v-for="p in playersCurrentlyOnField" :key="p.playerId" :value="p.playerId">
                  {{ p.nome }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Entra</label>
              <select v-model="inPlayerId" class="select-input">
                <option value="" disabled>-- Seleziona --</option>
                <option v-for="p in availableBench" :key="p.playerId" :value="p.playerId">
                  {{ p.nome }}
                </option>
              </select>
            </div>
          </template>
          <p v-else class="limit-msg">Limite sostituzioni raggiunto per questa squadra.</p>
        </div>

        <div v-else-if="selectedType && !['RIGORE', 'ANGOLO', 'FALLO'].includes(selectedType)" class="form-group">
          <label>Giocatore (In campo)</label>
          <select v-model="selectedPlayerId" class="select-input" :disabled="!selectedTeamId">
            <option value="" disabled>-- Seleziona Giocatore --</option>
            <option v-for="p in playersCurrentlyOnField" :key="p.playerId" :value="p.playerId">
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
  .sub-limit-info { font-size: 11px; font-weight: bold; margin-bottom: 10px; color: #64748b; }
  .sub-limit-info.danger { color: #ef4444; }
  .limit-msg { font-size: 13px; color: #ef4444; font-weight: bold; text-align: center; margin: 10px 0; }
  
  .select-input, .minute-input { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; outline: none; }

  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  .btn-primary { background: #003366; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-secondary { background: #f1f5f9; border: none; padding: 12px 15px; border-radius: 8px; color: #475569; font-weight: 600; cursor: pointer; }
</style>