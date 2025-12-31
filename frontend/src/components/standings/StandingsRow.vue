<template>
  <tr>
    <td>{{ position }}</td>
    <td>{{ row.nome }}</td>
    <td>{{ row.matchPlayed }}</td>
    <td>{{ row.matchWon }}</td>
    <td>{{ row.matchDrawn }}</td>
    <td>{{ row.matchLost }}</td>
    <td>{{ row.goals }}</td>
    <td>{{ row.goalsConceded }}</td>
    <td>{{ row.points }}</td>
  </tr>
</template>

<script setup>
defineProps({
  row: {
    type: Object,
    required: true
  },
  position: {
    type: Number,
    required: true
  }
});
</script>
