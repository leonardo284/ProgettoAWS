<script setup>
import { ref, onMounted } from 'vue'
import { getTeams } from '@/services/teamsService'
import TeamCard from '@/components/teams/TeamCard.vue'

const teams = ref([])

onMounted(async () => {
  teams.value = await getTeams()
})
</script>

<template>
  <section class="home-teams">
    <div class="header-row">
      <h2>CLUB</h2>
      <button class="view-all" @click="$router.push('/club')">VEDI TUTTI</button>
    </div>

    <div class="teams-container">
      <TeamCard
        v-for="team in teams.slice(0, 5)"
        :key="team.teamId"
        :team="team"
        class="home-team-card"
      />
    </div>
  </section>
</template>

<style scoped>
.home-teams {
  padding: 20px;
  background: white;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.view-all {
  border: 1px solid #ddd;
  background: transparent;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.teams-container {
  display: grid;
  /* Crea una riga orizzontale con 5 colonne uguali */
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.home-team-card {
  height: 340px !important;
}

/* Responsività: se lo schermo è piccolo, passa a scroll orizzontale */
@media (max-width: 900px) {
  .teams-container {
    display: flex;
    overflow-x: auto;
  }
  .home-team-card {
    min-width: 150px;
  }
}
</style>