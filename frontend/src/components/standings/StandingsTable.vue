<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Squadra</th>
        <th>PG</th>
        <th>V</th>
        <th>N</th>
        <th>P</th>
        <th>GF</th>
        <th>GS</th>
        <th>PT</th>
      </tr>
    </thead>

    <tbody>
      <StandingRow
        v-for="(row, index) in standings"
        :key="row.teamId"
        :row="row"
        :position="index + 1"
      />
    </tbody>
  </table>
</template>

<script setup>
import StandingRow from "./StandingsRow.vue";

defineProps({
  standings: {
    type: Array,
    required: true
  }
});
</script>
