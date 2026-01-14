<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Service
import { getStandings } from '@/services/standingsService';
import { getStatsByTeamId } from '@/services/playersService'; 

// Componenti
import TeamWinStats from '@/components/stats/TeamWinStats.vue';
import TeamGoalBar from '@/components/stats/TeamGoalBar.vue';
import TeamScorersCard from '@/components/stats/TeamScorersCard.vue';

const route = useRoute();
const standing = ref(null);
const playersWithGoals = ref([]);
const loading = ref(true);

const loadStats = async () => {
  loading.value = true;
  const teamId = Number(route.params.id);
  
  try {
    // 1. Chiamo i dati (Classifica e Statistiche Giocatori)
    const [standingsData, playersStats] = await Promise.all([
      getStandings(),
      getStatsByTeamId(teamId)
    ]);

    // 2. Cerco la riga della classifica
    standing.value = standingsData.find(s => Number(s.teamId) === teamId);

    console.log("Dati ricevuti dal backend:", playersStats[0]);

    // 3. LOGICA MARCATORI
    playersWithGoals.value = playersStats
      .filter(p => p.stats.gol > 0) // Prendo solo chi ha segnato
      .map(p => ({
        id: p.playerId,
        name: `${p.nome} ${p.cognome}`,
        image: p.foto || null, 
        goals: p.stats.gol
      }))
      .sort((a, b) => b.goals - a.goals); // Ordino dal primo al meno prolifico

  } catch (error) {
    console.error("Errore nel caricamento statistiche:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadStats);
watch(() => route.params.id, loadStats);
</script>

<template>
  <div class="stats-tab">
    <div v-if="loading" class="loading-state">Elaborazione statistiche in corso...</div>
    
    <div v-else>
      <div v-if="standing" class="stats-grid">
        <TeamWinStats 
          :stats="{
            won: standing.matchWon,
            drawn: standing.matchDrawn,
            lost: standing.matchLost,
            total: standing.matchPlayed
          }" 
        />

        <TeamGoalBar 
          :goalsFor="standing.goals" 
          :goalsAgainst="standing.goalsConceded" 
        />
      </div>

      <div class="scorers-section" v-if="playersWithGoals.length > 0">
        <TeamScorersCard :players="playersWithGoals" />
      </div>

      <div v-else-if="!standing" class="no-data">
        Dati non disponibili per questa squadra.
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-tab {
  padding: 20px 5%;
}

.stats-grid {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.stats-grid > * {
  flex: 1;
  min-width: 320px;
}

.scorers-section {
  width: 100%;
  max-width: 800px; /* Evita che la classifica diventi troppo larga su desktop */
  margin: 0 auto;
}

.loading-state, .no-data {
  text-align: center;
  padding: 60px;
  color: #888;
  font-style: italic;
}
</style>