<script setup>
import StandingsTable from '@/components/standings/StandingsTable.vue'
import { ref, onMounted } from 'vue'
import { getStandings } from '@/services/standingsService'
import { getTeams } from '@/services/teamsService' // Importiamo anche i team
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const standings = ref([])

onMounted(async () => {
  const [standingsData, teamsData] = await Promise.all([
    getStandings(),
    getTeams()
  ])

  standings.value = standingsData.map(row => {
    const teamInfo = teamsData.find(t => t.teamId === row.teamId)
    return {
      ...row,
      logo: teamInfo?.logo || '', // Aggiungiamo il logo mancante
      nome: teamInfo?.nome || row.nome // Ci assicuriamo che il nome sia corretto
    }
  })
})
</script>

<template>
  <AppNavbar />
  <main class="container">
    <h1 class="page-title">Classifica Serie A</h1>
    <StandingsTable :standings="standings" />
  </main>
  <AppFooter />
</template>

<style scoped>
.container { padding: 20px; background-color: #f8f9fa; min-height: 100vh; }
.page-title { margin-bottom: 20px; font-weight: 800; color: #1a1a1a; }
</style>