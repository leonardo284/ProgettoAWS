<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

// Service
import { getStandings } from '@/services/standingsService';
import { getMatchesByTeamId } from '@/services/matchesService';
import { getPlayersByTeamId } from '@/services/playersService';

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
    // 1. Carico tutto in parallelo
    const [standingsData, matches, allPlayers] = await Promise.all([
      getStandings(),
      getMatchesByTeamId(teamId),
      getPlayersByTeamId(teamId)
    ]);

    // 2. Cerco la riga della classifica
    standing.value = standingsData.find(s => Number(s.teamId) === teamId);

    // 3. LOGICA DI CALCOLO MARCATORI
    const goalMap = {};

    matches.forEach(match => {
      // Determino se la squadra visualizzata giocava in casa o trasferta
      const isCasa = match.squadre.casa.teamId === teamId;
      const ruoloCercato = isCasa ? 'casa' : 'trasferta';

      // Itero sugli eventi del match
      if (match.eventi && Array.isArray(match.eventi)) {
        match.eventi.forEach(evento => {
          // Controllo se è un GOAL fatto dalla squadra corrente
          if (evento.tipo === 'GOAL' && evento.squadra === ruoloCercato) {
            const pid = evento.playerId;
            goalMap[pid] = (goalMap[pid] || 0) + 1;
          }
        });
      }
    });

    // 4. Unisco i nomi dei giocatori ai gol calcolati
    playersWithGoals.value = allPlayers
      .map(p => {
        const goalsCount = goalMap[p.playerId] || 0;
        return {
          id: p.playerId,
          name: `${p.nome} ${p.cognome}`,
          image: p.foto, 
          goals: goalsCount
        };
      })
      .filter(p => p.goals > 0)
      .sort((a, b) => b.goals - a.goals);

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