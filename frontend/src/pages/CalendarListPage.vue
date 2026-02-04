<script setup>
  import { ref, onMounted } from 'vue'
  import AppNavbar from '@/components/layout/AppNavbar.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'
  import MatchCard from '@/components/matches/MatchCard.vue' // Percorso aggiornato

  import { getMatchesByGiornata, groupMatchesByDate } from '@/services/matchesService'
  import * as utilityService from '@/services/utilityService'

  const currentDay = ref(1)
  const groupedMatches = ref({})
  const loading = ref(true)

  // Funzione per caricare i dati delle partite in base alla giornata passata
  const loadData = async (day) => {
    loading.value = true
    currentDay.value = day
    // Recupero le partite per la giornata specificata
    const data = await getMatchesByGiornata(day)
    // Raggruppo le partite per data
    groupedMatches.value = groupMatchesByDate(data)
    loading.value = false
  }

  onMounted(async () => {
    // recupero la giornata corrente
    const day = await utilityService.getCurrentMatchday()
    await loadData(day)
  })
</script>

<template>
  <AppNavbar />
  <main class="container">
    <div class="calendar-view">
      <h1 class="page-title">CALENDARIO E RISULTATI</h1>

      <!--Navigatore delle giornate-->
      <div class="matchday-nav-wrapper">
        <div class="matchday-selector">
          <button @click="loadData(currentDay - 1)" :disabled="currentDay <= 1" class="nav-btn">&lt;</button>
          <span class="matchday-badge">MATCHDAY {{ currentDay }}</span>
          <button @click="loadData(currentDay + 1)" :disabled="currentDay >= 38" class="nav-btn">&gt;</button>
        </div>
      </div>

      <!--Quando la pagina viene caricata per la prima volta, l'oggetto groupedMatches è inizialmente
       vuoto, senza l'if, Vue proverebbe a ciclare su un oggetto vuoto o non ancora popolato dal 
       service, per questo uso loading-->
      <div v-if="!loading" class="calendar-content">
        <div v-for="(matches, date) in groupedMatches" :key="date" class="date-group">
          <div class="date-header-wrapper">
            <div class="date-badge">
              {{ utilityService.formatDateBadge(date) }}
            </div>
          </div>
          <MatchCard v-for="m in matches" :key="m.matchId" :match="m" @click="(id) => $router.push(`/match/${id}`)" />
        </div>
      </div>
    </div>
  </main>
  <AppFooter />
</template>
<style scoped>
  .calendar-view {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .page-title { 
    color: #001c33; 
    font-weight: 900; 
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2.2rem;
  }

  /* Navigatore Giornate */
  .matchday-nav-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 3rem;
  }

  .matchday-selector {
    display: flex;
    align-items: center;
    gap: 2.5rem;
    background: #001c33 !important;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    color: white;
    box-shadow: 0 4px 15px rgba(0,28,51,0.2);
  }

  .nav-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.8rem;
    cursor: pointer;
    line-height: 1;
    transition: opacity 0.2s;
  }

  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .matchday-badge {
    font-weight: 900;
    letter-spacing: 1px;
    font-size: 1rem;
  }

  /* Gruppi Data */
  .date-header-wrapper {
    display: flex;
    justify-content: center;
    margin: 4rem 0 1.5rem 0;
  }

  .date-badge {
    background: #00f2d3 !important;
    color: #001c33;
    font-weight: 900;
    padding: 0.6rem 2.5rem;
    border-radius: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
    box-shadow: 0 2px 10px rgba(0,242,211,0.2);
  }

  /* --- RESPONSIVE MOBILE --- */
  @media (max-width: 768px) {
    .calendar-view {
      padding: 1rem 0.5rem;
    }

    .page-title {
      font-size: 1.6rem;
    }

    .matchday-selector {
      gap: 1.5rem;
      padding: 0.6rem 1.2rem;
      width: 90%;
      justify-content: space-between;
    }

    .date-header-wrapper {
      margin: 3rem 0 1rem 0;
    }

    .date-badge {
      width: 100%;
      text-align: center;
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  }
</style>