<script setup>
defineProps({
  match: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="match-card">
    <strong>{{ match.squadre.casa.nome }}</strong>
    vs
    <strong>{{ match.squadre.trasferta.nome }}</strong>
  </div>
</template>
