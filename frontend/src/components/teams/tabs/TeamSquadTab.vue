<script setup>
import { ref, onMounted, computed } from 'vue';
import { getPlayersByTeamId } from '@/services/playersService';
import PlayerCard from '@/components/players/PlayerCard.vue';

const props = defineProps({
  team: { type: Object, required: true }
});

const players = ref([]);
const loading = ref(true);

// Definizione dell'ordine e delle etichette da visualizzare
const roles = [
  { key: "Portiere", label: "Portieri" },
  { key: "Difensore", label: "Difensori" },
  { key: "Centrocampista", label: "Centrocampisti" },
  { key: "Attaccante", label: "Attaccanti" },
  { key: "Sconosciuto", label: "Altri" }
];

onMounted(async () => {
  try {
    loading.value = true;
    players.value = await getPlayersByTeamId(props.team.teamId);
  } finally {
    loading.value = false;
  }
});

// Raggruppa i giocatori per ruolo basandosi sull'ordine definito sopra
const groupedPlayers = computed(() => {
  return roles.map(role => ({
    ...role,
    list: players.value.filter(p => p.ruolo === role.key)
  })).filter(group => group.list.length > 0); // Mostra solo categorie con almeno un giocatore
});
</script>

<template>
  <div class="squad-tab">
    <div v-if="loading" class="loader">Caricamento rosa...</div>
    
    <div v-else v-for="group in groupedPlayers" :key="group.key" class="role-section">
      <h2 class="role-label">{{ group.label }}</h2>
      
      <div class="players-grid">
        <PlayerCard 
          v-for="p in group.list" 
          :key="p.playerId" 
          :player="p" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.squad-tab {
  padding: 20px 0;
}

.role-section {
  margin-bottom: 40px;
}

/* Stile per la label della categoria */
.role-label {
  font-size: 1.8rem;
  font-weight: 800;
  color: #001f3f;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid #001f3f;
  text-transform: capitalize;
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.loader {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
}
</style>