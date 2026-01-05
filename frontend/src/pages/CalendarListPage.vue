<script setup>
import { ref, onMounted } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import MatchCard from '@/components/matches/MatchCard.vue' // Percorso aggiornato

import { getMatchesByGiornata, groupMatchesByDate } from '@/services/matchesService'
import * as utilityService from '@/services/utilityService'

const currentDay = ref(1)
const groupedMatches = ref({})
const loading = ref(true)

const loadData = async (day) => {
  loading.value = true
  currentDay.value = day
  const data = await getMatchesByGiornata(day)
  groupedMatches.value = groupMatchesByDate(data)
  loading.value = false
}

onMounted(async () => {
  const day = await utilityService.getCurrentMatchday()
  await loadData(day)
})
</script>

<template>
  <AppNavbar />
  <main class="container">
    <div class="calendar-view">
      <h1 class="page-title">CALENDARIO E RISULTATI</h1>

      <div class="matchday-nav-wrapper">
        <div class="matchday-selector">
          <button @click="loadData(currentDay - 1)" :disabled="currentDay <= 1" class="nav-btn">&lt;</button>
          <span class="matchday-badge">MATCHDAY {{ currentDay }}</span>
          <button @click="loadData(currentDay + 1)" :disabled="currentDay >= 38" class="nav-btn">&gt;</button>
        </div>
      </div>

      <div v-if="!loading" class="calendar-content">
        <div v-for="(matches, date) in groupedMatches" :key="date" class="date-group">
          <div class="date-header-wrapper">
            <div class="date-badge">
              {{ utilityService.formatDateBadge(date) }}
            </div>
          </div>
          <MatchCard v-for="m in matches" :key="m.matchId" :match="m" @click="(id) => $router.push(`/match/${id}`)" />
        </div>
      </div>
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.matchday-nav-wrapper {
  display: flex;
  justify-content: center; /* Forza la centratura del selettore */
  margin: 3rem 0;
}

.matchday-selector {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #001c33 !important; /* Colore blu scuro forzato */
  padding: 0.8rem 2.5rem;
  border-radius: 50px;
  color: white;
}

.nav-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.date-header-wrapper {
  display: flex;
  justify-content: center;
  margin: 4rem 0 1.5rem 0;
}

.date-badge {
  background: #00f2d3 !important; /* Colore ciano forzato */
  color: #001c33;
  font-weight: 900;
  padding: 0.6rem 3rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-title { color: #001c33; font-weight: 900; margin-bottom: 2rem; }
</style>