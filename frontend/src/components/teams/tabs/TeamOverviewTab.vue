<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMatchesByTeamId } from '@/services/matchesService';
import { getStandings } from '@/services/standingsService';
import { getTeams } from '@/services/teamsService';
import MatchCard from '@/components/matches/MatchCard.vue';
import StandingsTable from '@/components/standings/StandingsTable.vue';

const props = defineProps({
  team: { type: Object, required: true }
});

const router = useRouter();
const lastMatches = ref([]);
const filteredStandings = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    
    // 1. Caricamento dati in parallelo
    const [matchesData, standingsData, teamsData] = await Promise.all([
      getMatchesByTeamId(props.team.teamId),
      getStandings(),
      getTeams()
    ]);

    // 2. Ultime 5 partite (filtrate per stato "FINITA" e ordinate per data decrescente)
    lastMatches.value = matchesData
      .filter(m => m.stato === 'FINITA')
      .sort((a, b) => new Date(b.dataOra) - new Date(a.dataOra))
      .slice(0, 5);

    // 3. Elaborazione classifica completa
    const fullStandings = standingsData.map((row, index) => { 
      const teamInfo = teamsData.find(t => t.teamId === row.teamId);
      return {
        ...row,
        realPosition: index + 1, 
        logo: teamInfo?.logo || '',
        nome: teamInfo?.nome || row.nome
      };
    });

    // 4. Calcolo classifica ristretta 
    const currentIndex = fullStandings.findIndex(s => s.teamId === props.team.teamId);
    if (currentIndex !== -1) {
      const start = Math.max(0, currentIndex - 3);
      const end = Math.min(fullStandings.length, currentIndex + 4);
      filteredStandings.value = fullStandings.slice(start, end);
    }

  } catch (error) {
    console.error("Errore nel caricamento dell'overview:", error);
  } finally {
    loading.value = false;
  }
});

const goToMatchDetail = (matchId) => {
  router.push(`/match/${matchId}`);
};
</script>

<template>
  <div class="overview-tab">
    <div v-if="loading" class="loading-state">Caricamento panoramica...</div>

    <div v-else class="content">
      <section class="section">
        <h2 class="section-title">Ultime Partite</h2>
        <div class="matches-list">
          <MatchCard 
            v-for="m in lastMatches" 
            :key="m.matchId" 
            :match="m" 
            class="clickable-card"
            @click="goToMatchDetail(m.matchId)"
          />
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Posizione in Classifica</h2>
        <div class="standings-mini">
          <StandingsTable 
            :standings="filteredStandings" 
            :highlightTeamId="team.teamId" 
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.overview-tab {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #001f3f;
  margin-bottom: 20px;
  text-transform: uppercase;
  border-left: 5px solid #0056b3;
  padding-left: 15px;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-card:hover {
  transform: scale(1.01);
}

.standings-mini {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
}

/* Rimuovo eventuali padding eccessivi della tabella se necessario */
:deep(.standings-table) {
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #666;
}
</style>