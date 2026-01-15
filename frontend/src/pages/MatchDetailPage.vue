<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppNavbar from '@/components/layout/AppNavbar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import MatchScoreboard from '@/components/matches/MatchScoreboard.vue';
import MatchTabs from '@/components/matches/tabs/MatchTabs.vue';
import matchService from '@/services/matchesService';

const route = useRoute();
const match = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const matchId = route.params.id;
    match.value = await matchService.getMatchById(matchId);
  } catch (error) {
    console.error("Errore recupero partita:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <AppNavbar />
  <main class="container">
    <div v-if="loading" class="loader">
      Caricamento in corso...
    </div>

    <template v-else-if="match">
      <MatchScoreboard :match="match" />
      <MatchTabs :match="match" />
    </template>

    <div v-else class="loader">
      Partita non trovata.
    </div>
  </main>
  <AppFooter />
</template>

<style scoped>
.container {
  min-height: 80vh;
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.loader {
  text-align: center;
  padding: 50px;
  color: #666;
}
</style>