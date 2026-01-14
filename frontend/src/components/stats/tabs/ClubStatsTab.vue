<script setup>
import { ref, onMounted } from 'vue';
import statsService from '@/services/statsService';
import ClubStatsTable from '@/components/stats/tabs/ClubStatsTable.vue';

const clubs = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    clubs.value = await statsService.getClubRankings();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="!loading">
    <ClubStatsTable :clubs="clubs" />
  </div>
  <div v-else class="loader">Caricamento statistiche...</div>
</template>