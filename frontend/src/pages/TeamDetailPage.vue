<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTeamById } from '@/services/teamsService'
import { getStandings } from '@/services/standingsService';
import TeamHeader from '@/components/teams/TeamHeader.vue'
import TeamTabNav from '@/components/teams/TeamTabNav.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'

const route = useRoute()
const team = ref(null)
const teamStats = ref(null);

onMounted(async () => {
  try {
    const [teamData, allStandings] = await Promise.all([
      getTeamById(route.params.id),
      getStandings()
    ]);
    
    team.value = teamData;

    // Trovo la posizione e le statistiche nel modello Standing
    const index = allStandings.findIndex(s => s.teamId === teamData.teamId);
    if (index !== -1) {
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

    <main class="tab-viewport">
      <router-view :team="team" />
    </main>
  </div>
</template>

<style scoped>
.tab-viewport {
  padding: 40px 10%;
  background: #f9f9f9;
  min-height: 400px;
}
</style>