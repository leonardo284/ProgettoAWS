<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMatchesByTeamId } from '@/services/matchesService';
import { 
  groupMatchesByDate, 
  formatDateBadge, 
  getCurrentMatchday 
} from '@/services/utilityService';
import MatchCard from '@/components/matches/MatchCard.vue';

const props = defineProps({
  team: { type: Object, required: true }
});

const router = useRouter();
const matches = ref([]);
const currentMatchday = ref(0);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    // Recupera ogni match della squadra e la giornata attuale del campionato
    const [matchesData, matchday] = await Promise.all([
      getMatchesByTeamId(props.team.teamId),
      getCurrentMatchday()
    ]);
    
    matches.value = matchesData;
    currentMatchday.value = matchday;
  } catch (error) {
    console.error("Errore caricamento dati calendario:", error);
  } finally {
    loading.value = false;
  }
});

// Raggruppa ogni match per data usando l'utility service
const groupedMatches = computed(() => {
  return groupMatchesByDate(matches.value);
});

// Funzione per navigare al dettaglio del match
const goToMatchDetail = (matchId) => {
  router.push(`/match/${matchId}`);
};
</script>

<template>
  <div class="matches-tab">
    <div v-if="loading" class="loading-state">
      Caricamento calendario...
    </div>

    <div v-else class="calendar-container">
      <div 
        v-for="(dayMatches, date) in groupedMatches" 
        :key="date" 
        class="date-group"
        :class="{ 'is-current': dayMatches[0].giornata === currentMatchday }"
      >
        <div class="date-header">
          <h3 class="date-title">{{ formatDateBadge(date) }}</h3>
          
          <span v-if="dayMatches[0].giornata === currentMatchday" class="next-label">
            Prossima Partita
          </span>
        </div>

        <div class="matches-list">
          <MatchCard 
            v-for="m in dayMatches" 
            :key="m.matchId" 
            :match="m" 
            class="clickable-card"
            @click="goToMatchDetail(m.matchId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matches-tab {
  max-width: 900px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 60px;
  font-weight: 600;
  color: #666;
}

.date-group {
  margin-bottom: 25px;
  padding: 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

/* Stile per la giornata corrente */
.is-current {
  background: #001f3f; 
  border-color: #003366;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-3px);
}

.date-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.date-title {
  font-size: 1rem;
  font-weight: 800;
  color: #333;
  margin: 0;
  text-transform: uppercase;
}

.is-current .date-title {
  color: #ffffff;
}

.next-label {
  background: #ffcc00;
  color: #001f3f;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 900;
  text-transform: uppercase;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Rende esplicito che la card è cliccabile */
.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.clickable-card:hover {
  transform: scale(1.01);
}

/* Forza lo stile delle card dentro la sezione scura */
.is-current :deep(.match-card) {
  background: white;
  border: none;
}
</style>