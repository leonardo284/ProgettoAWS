<script setup>
import StandingsTable from '@/components/standings/StandingsTable.vue'
import { ref, onMounted } from 'vue'
import { getStandings } from '@/services/standingsService'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const standings = ref([])

onMounted(async () => {
  standings.value = await getStandings()
})
</script>

<template>
  <AppNavbar />
  <main class="container">
    <h1>Classifica Serie A</h1>
    <StandingsTable :standings="standings" />
  </main>
  <AppFooter />
</template>
