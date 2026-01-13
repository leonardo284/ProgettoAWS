<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import playerService from '@/services/playersService'; 
import { getTeamById } from '@/services/teamsService'; 
import PlayerHeader from '@/components/players/PlayerHeader.vue';

const route = useRoute();
const player = ref(null);
const team = ref(null); // Ref per i dati del club
const loading = ref(true);

// PlayerDetailPage.vue
onMounted(async () => {
  try {
    const playerData = await playerService.getPlayerById(route.params.id);
    player.value = playerData;

    if (playerData && playerData.currentTeam) {
      const teamId = typeof playerData.currentTeam === 'object' 
                     ? (playerData.currentTeam.teamId || playerData.currentTeam._id) 
                     : playerData.currentTeam;

      const teamData = await getTeamById(teamId);
      team.value = teamData; 
      //console.log("Team caricato:", team.value); 
    }
  } catch (error) {
    console.error("Errore:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="player-loader">
    <div class="spinner"></div>
    <p>Caricamento profilo atleta...</p>
  </div>
  
  <main v-else-if="player" class="player-detail">
    <PlayerHeader :player="player" :team="team" />
    
    <div class="player-body-content">
      <section class="stats-overview">
        </section>
    </div>
  </main>

  <div v-else class="player-error">
    <h2>Atleta non trovato</h2>
    <router-link to="/club">Torna ai Club</router-link>
  </div>
</template>

<style scoped>
.player-loader { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.player-body-content { padding: 40px 10%; }

/* spinner base */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>