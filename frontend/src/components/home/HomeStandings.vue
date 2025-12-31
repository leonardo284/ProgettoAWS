<script setup>
import { ref, onMounted } from 'vue'
import { getStandings } from '@/services/standingsService'

const standings = ref([])

onMounted(async () => {
  standings.value = await getStandings()
})
</script>

<template>
  <section>
    <h2>Classifica</h2>
    <StandingsTable :standings="standings" />
  </section>
</template>
