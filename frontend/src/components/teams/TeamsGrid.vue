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
  <div class="teams-grid">
    <TeamCard
      v-for="team in teams"
      :key="team.teamId"
      :team="team"
    />
  </div>
</template>

<style scoped>
.teams-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
@media (max-width: 1200px) {
  .teams-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .teams-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>
