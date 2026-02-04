<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getTeamById } from '@/services/teamsService'
  import { getStandings } from '@/services/standingsService';
  
  import TeamHeader from '@/components/teams/TeamHeader.vue'
  import TeamTabNav from '@/components/teams/TeamTabNav.vue'
  import AppNavbar from '@/components/layout/AppNavbar.vue'
  import AppFooter from '@/components/layout/AppFooter.vue'

  const route = useRoute()
  const team = ref(null)
  const teamStats = ref(null);

  onMounted(async () => {
    try {
      // recupero i dati della squadra e della classifica in parallelo
      const [teamData, allStandings] = await Promise.all([
        getTeamById(route.params.id),
        getStandings()
      ]);
      
      team.value = teamData;

      // Trovo l'indice della riga di classifica del team
      const index = allStandings.findIndex(s => s.teamId === teamData.teamId);
      if (index !== -1) {
        // Se trovato, creo un oggetto con i dati della squadra e la posizione in classifica
        teamStats.value = {
          ...allStandings[index],
          posizione: index + 1 // La posizione è l'indice + 1
        };
      }
    } catch (error) {
      console.error("Errore caricamento dati:", error);
    }
  });
</script>

<template>
  <div v-if="team" class="page-wrapper">
    <AppNavbar />
    
    <TeamHeader :team="team" :stats="teamStats" />    

    <TeamTabNav :teamId="team.teamId" />

    <!--Nel TeamTabNav ho diversi tag <router-link> che mi permettono di navigare tra i diversi tab
        il tag <router-view> sottostante mi permette di visualizzare sotto l'header il contenuto del tab -->
    <main class="tab-viewport">
      <router-view :team="team" />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
  .tab-viewport {
    padding: 40px 10%;
    background: #f9f9f9;
    min-height: 400px;
  }
</style>