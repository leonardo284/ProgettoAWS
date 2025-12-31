<script setup>
defineProps({
  team: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="team-card">
    <img :src="team.logo" :alt="team.nome" />
    <h3>{{ team.nome }}</h3>
  </div>
</template>
