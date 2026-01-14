<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import playerService from '@/services/playersService'; 
import { getTeamById } from '@/services/teamsService'; 

import PlayerHeader from '@/components/players/PlayerHeader.vue';
import PlayerGeneralStats from '@/components/players/PlayerGeneralStats.vue';
import PlayerDisciplinaryStats from '@/components/players/PlayerDisciplinaryStats.vue';

const route = useRoute();
const player = ref(null);
const team = ref(null);
const loading = ref(true);

const generalStats = ref({
  played: 0,
  minutes: 0,
  goals: 0,
  assists: 0
});

const disciplinaryStats = ref({
  yellow: 0,
  red: 0
});

onMounted(async () => {
  try {
    const playerId = route.params.id;
    
    // Carico i dati dell'atleta
    const playerData = await playerService.getPlayerById(playerId);
    player.value = playerData;

    // Se l'atleta esiste, carico Team e Statistiche in parallelo
    if (playerData) {
      const teamId = typeof playerData.currentTeam === 'object' 
                     ? (playerData.currentTeam.teamId || playerData.currentTeam._id) 
                     : playerData.currentTeam;

      // Uso Promise.all per caricare tutto insieme velocemente
      const [teamData, statsData, discData] = await Promise.all([
        getTeamById(teamId),
        playerService.getPlayerStats(playerId),
        playerService.getPlayerDisciplinary(playerId)
      ]);

      team.value = teamData;
      
      // Assegno le statistiche se i dati sono tornati correttamente
      if (statsData) generalStats.value = statsData;
      if (discData) disciplinaryStats.value = discData;
    }
  } catch (error) {
    console.error("Errore nel caricamento del dettaglio giocatore:", error);
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
      <PlayerGeneralStats :stats="generalStats" />

      <PlayerDisciplinaryStats 
        :yellow-cards="disciplinaryStats.yellow" 
        :red-cards="disciplinaryStats.red" 
      />
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
  .spinner {
    width: 40px; height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>