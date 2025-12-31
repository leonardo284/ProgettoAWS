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
  <section>
    <h2>Club</h2>
    <div class="teams-grid">
      <TeamCard
        v-for="team in teams"
        :key="team.teamId"
        :team="team"
      />
    </div>
  </section>
</template>
