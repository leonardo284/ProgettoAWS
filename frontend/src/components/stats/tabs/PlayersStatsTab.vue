<script setup>
  import { ref, onMounted, watch } from 'vue';
  import StatsTable from '@/components/stats/tabs/StatsTable.vue';
  import statsService from '@/services/statsService';

  // Stato per il tab secondario attivo (gol, assist, ecc.)
  const activeSubTab = ref('gol');
  const leaderboard = ref([]);
  const loading = ref(false);

  const tabs = [
    { id: 'gol', label: 'Gol' },
    { id: 'assist', label: 'Assist' },
    { id: 'yellow', label: 'Ammonizioni' },
    { id: 'red', label: 'Espulsioni' }
  ];

  // funzione per caricare i dati in base al tab secondario attivo
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
  // Ricarica i dati quando il tab secondario cambia
  watch(activeSubTab, loadData);
</script>
<template>
  <div class="players-tab">
    <div class="sub-nav-wrapper">
      <div class="sub-nav">
        <!-- Ciclo i tabs secondari -->
        <button 
          v-for="t in tabs" :key="t.id"
          :class="['pill-btn', { active: activeSubTab === t.id }]"
          @click="activeSubTab = t.id"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-msg">
        <div class="spinner"></div>
        <p>Caricamento...</p>
      </div>
      <div v-else-if="leaderboard.length === 0" class="loading-msg">
        Nessun dato trovato.
      </div>
      <StatsTable v-else :data="leaderboard" :statType="activeSubTab" />
    </div>
  </div>
</template>

<style scoped>
  /* Wrapper per lo scroll */
  .sub-nav-wrapper {
    width: 100%;
    overflow-x: auto; /* Abilita lo scroll orizzontale */
    white-space: nowrap; /* Impedisce ai bottoni di andare a capo */
    margin-bottom: 15px;
    /* Nasconde la scrollbar su diversi browser per un look pulito */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }

  .sub-nav-wrapper::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .sub-nav {
    display: inline-flex; 
    gap: 8px; 
    padding: 4px 0;
  }

  .pill-btn {
    background: #f4f4f4;
    border: 1px solid #eee;
    padding: 6px 14px; 
    border-radius: 30px;
    font-size: 0.85rem; 
    font-weight: 700;
    color: #777;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0; 
  }

  .pill-btn:hover {
    background: #ebebeb;
  }

  .pill-btn.active {
    background: #003366;
    color: white;
    border-color: #003366;
    box-shadow: 0 2px 8px rgba(0, 51, 102, 0.2);
  }

  .table-container {
    background: white;
    border-radius: 12px;
    padding: 5px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    border: 1px solid #eee;
  }

  .loading-msg {
    padding: 40px;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
  }

  /* Spinner opzionale per il caricamento */
  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #003366;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
  }

  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* Ottimizzazione Mobile */
  @media (max-width: 600px) {
    .pill-btn {
      padding: 5px 12px;
      font-size: 0.75rem;
    }
  }
</style>