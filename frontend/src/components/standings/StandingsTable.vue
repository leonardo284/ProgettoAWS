<script setup>
import StandingsRow from "./StandingsRow.vue";

const props = defineProps({
  standings: {
    type: Array,
    required: true,
    default: () => []
  },
  highlightTeamId: {
    type: [String, Number],
    default: null
  }
});
</script>

<template>
  <div class="table-wrapper">
    <table class="s-table">
      <thead>
        <tr>
          <th style="width: 50px">#</th>
          <th class="th-team">SQUADRA</th>
          <th class="th-data">PG</th>
          <th class="th-data">V</th>
          <th class="th-data">N</th>
          <th class="th-data">P</th>
          <th class="th-data">GF</th>
          <th class="th-data">GS</th>
          <th class="th-data">DR</th>
          <th class="th-data">PT</th>
          <th style="width: 150px">ULTIME 5</th>
        </tr>
      </thead>
      <tbody>
        <StandingsRow
          v-for="(row, index) in standings"
          :key="row.teamId || index"
          :class="{ 'highlighted-row': row.teamId === highlightTeamId }"
          :row="row"
          :position="row.realPosition"  
        />
      </tbody>
    </table>
  </div>
</template>
<style scoped>

  /* Il selettore :deep() è necessario perché StandingsRow è un componente figlio */
  :deep(.highlighted-row) {
    background-color: rgba(0, 210, 255, 0.25) !important; 
    /* Bordo laterale scuro per dare profondità */
    border-left: 6px solid #001f3f !important;
    transition: background-color 0.2s ease;
  }

  :deep(.highlighted-row td) {
    font-weight: 700 !important;
    color: #001f3f !important;
  }

  .highlighted-row {
    background-color: #00f2ff33 !important; /* Colore evidenziatore (azzurrino dell'Inter in foto) */
    font-weight: bold;
  }

  .table-wrapper {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow-x: auto;
  }

  .s-table {
    width: 100%;
    border-collapse: collapse;
  }

  .s-table th {
    padding: 15px 5px;
    border-bottom: 2px solid #eee;
    font-weight: 800;
    color: #000;
    text-align: center;
  }

  /* Centratura Intestazione Squadra */
  .th-team {
    text-align: left !important;
    padding-left: 80px !important; /* Sposta il testo verso il centro */
  }

  .th-data {
    width: 50px;
  }
</style>