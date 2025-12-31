<script setup>
import { ref, onMounted } from 'vue'
import { getLastMatches } from '@/services/matchesService'
import MatchCard from '@/components/matches/MatchCard.vue'


const matches = ref([])

onMounted(async () => {
  matches.value = await getLastMatches()
})
</script>

<template>
  <section class="last-matches">
    <MatchCard
      v-for="match in matches"
      :key="match.matchId"
      :match="match"
    />
  </section>
</template>

