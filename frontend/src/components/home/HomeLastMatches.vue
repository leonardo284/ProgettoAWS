<script setup>
import { ref, onMounted } from 'vue'
import { getLastMatches } from '@/services/matchesService'
import MatchCard from '@/components/matches/MatchCardHome.vue'

const matches = ref([])

onMounted(async () => {
  const data = await getLastMatches()
  // Raddoppio l'array per creare l'effetto loop infinito senza interruzioni
  matches.value = [...data, ...data]
})
</script>

<template>
  <section class="last-matches-section">
    <div class="carousel-container">
      <div class="ticker-wrapper">
        <div class="ticker-content">
          <MatchCard
            v-for="(match, index) in matches"
            :key="`${match.matchId}-${index}`"
            :match="match" 
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.last-matches-section {
  padding: 20px 0;
  background-color: #f8f9fa;
  overflow: hidden; /* Fondamentale per non mostrare lo scroll */
  border-bottom: 1px solid #ddd;
}

.carousel-container {
  position: relative;
  width: 100%;
}

.ticker-wrapper {
  display: flex;
  width: fit-content;
}

.ticker-content {
  display: flex;
  gap: 16px;
  padding: 10px 0;
  /* L'animazione: dura 40 secondi, lineare, infinita */
  animation: ticker 40s linear infinite;
}

/* Quando l'utente passa il mouse, il movimento si ferma per permettere il click */
.ticker-content:hover {
  animation-play-state: paused;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    /* Si sposta esattamente della metà (perché abbiamo raddoppiato l'array) */
    transform: translateX(-50%);
  }
}

:deep(.match-link) {
  flex: 0 0 280px;
}
</style>