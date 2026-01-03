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
  <section class="last-matches-section">
    <div class="horizontal-scroll">
      <MatchCard
        v-for="match in matches"
        :key="match.matchId"
        :match="match" 
      />
    </div>
  </section>
</template>

<style scoped>
.last-matches-section {
  padding: 20px 0;
  background-color: #f4f4f4; 
}

.horizontal-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 5px 20px 20px 20px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; 
}

.horizontal-scroll::-webkit-scrollbar {
  display: none;
}
</style>