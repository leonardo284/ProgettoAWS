<script setup>
import StandingsTable from '@/components/standings/StandingsTable.vue'
import { ref, onMounted } from 'vue'
import { getStandings } from '@/services/standingsService'
import { getTeams } from '@/services/teamsService'

const standings = ref([])

onMounted(async () => {
  // 1. Recupero dati in parallelo per velocizzare il caricamento
  const [standingsData, teamsData] = await Promise.all([
    getStandings(),
    getTeams()
  ])

  standings.value = standingsData.map(row => {
    // Cerco i dati del club per recuperare il logo URL
    const teamInfo = teamsData.find(t => 
      t.teamId === row.teamId || 
      t.nome.trim().toLowerCase() === (row.squadra || row.nome || "").trim().toLowerCase()
    )
    
    return {
      ...row, // Mantiene PG, V, N, P, PT, ecc.
      logo: teamInfo?.logo || '', 
      squadra: row.squadra || teamInfo?.nome || row.nome 
    }
  })
})
</script>

<template>
  <section class="home-standings">
    <div class="standings-card">
      <div class="blue-header">
        <div class="fake-logo">A</div>
        <h3>CLASSIFICA</h3>
        <button class="arrow-btn" @click="$router.push('/classifica')">→</button>
      </div>

      <div class="table-dark-bg">
        <StandingsTable :standings="standings.slice(0, 5)" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-standings {
  margin: 20px 0;
}

.standings-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.blue-header {
  background: #0084f4;
  color: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.fake-logo {
  width: 24px;
  height: 24px;
  background: white;
  color: #0084f4;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
}

.arrow-btn {
  margin-left: auto;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-weight: bold;
}

.table-dark-bg {
  background-color: #121212;
}
</style>