<script setup>
import { ref, onMounted, watch } from 'vue';
import StatsTable from '@/components/stats/tabs/StatsTable.vue';
import statsService from '@/services/statsService';

const activeSubTab = ref('gol');
const leaderboard = ref([]);
const loading = ref(false);

const tabs = [
  { id: 'gol', label: 'Gol' },
  { id: 'assist', label: 'Assist' },
  { id: 'yellow', label: 'Ammonizioni' },
  { id: 'red', label: 'Espulsioni' }
];

const loadData = async () => {
  loading.value = true;
  try {
    if (activeSubTab.value === 'gol') leaderboard.value = await statsService.getTopScorers();
    else if (activeSubTab.value === 'assist') leaderboard.value = await statsService.getTopAssists();
    else if (activeSubTab.value === 'yellow') leaderboard.value = await statsService.getTopYellowCards();
    else if (activeSubTab.value === 'red') leaderboard.value = await statsService.getTopRedCards();
  } catch (e) {
    leaderboard.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
watch(activeSubTab, loadData);
</script>

<template>
  <div class="players-tab">
    <div class="sub-nav">
      <button 
        v-for="t in tabs" :key="t.id"
        :class="['pill-btn', { active: activeSubTab === t.id }]"
        @click="activeSubTab = t.id"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-msg">Caricamento...</div>
      <div v-else-if="leaderboard.length === 0" class="loading-msg">Nessun dato trovato. Controlla le rotte del backend.</div>
      <StatsTable v-else :data="leaderboard" :statType="activeSubTab" />
    </div>
  </div>
</template>

<style scoped>
.sub-nav { display: flex; gap: 10px; margin-bottom: 20px; }
.pill-btn {
  background: #f0f0f0; border: none; padding: 8px 20px; border-radius: 20px;
  font-weight: 700; color: #666; cursor: pointer; transition: 0.3s;
}
.pill-btn.active { background: #003366; color: white; }
.table-container { background: white; border-radius: 12px; padding: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.loading-msg { padding: 40px; text-align: center; color: #999; }
</style>