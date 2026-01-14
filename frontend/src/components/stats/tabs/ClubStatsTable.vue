<script setup>
import ClubStatsRow from './ClubStatsRow.vue';

defineProps({
  clubs: { type: Array, required: true }
});
</script>
<template>
  <div class="table-container">
    <table class="club-table">
      <thead>
        <tr>
          <th class="rank-col">#</th>
          <th class="text-left">CLUB</th>
          <th title="Partite Giocate">PG</th>
          <th title="Punti Totali">PTS</th>
          <th title="Vittorie (Wins)">W</th>
          <th title="Sconfitte (Losses)">L</th>
          <th title="Pareggi (Draws)">D</th>
          <th title="Gol Fatti">G</th>
          <th title="Cartellini Gialli (Yellow Cards)">YC</th>
          <th title="Cartellini Rossi (Red Cards)">RC</th>
        </tr>
      </thead>
      <tbody>
        <ClubStatsRow 
          v-for="(club, index) in clubs" 
          :key="club.teamId || club._id" 
          :club="club" 
          :rank="index + 1" 
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Stile per indicare all'utente che l'intestazione è interattiva */
.club-table th[title] {
  cursor: help;
  border-bottom: 2px solid #eee;
  text-decoration: underline dotted #ccc; /* Opzionale: aggiunge una riga punteggiata sotto */
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  overflow-x: auto;
  margin-top: 20px;
}

.club-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.club-table th {
  padding: 18px 10px;
  background: #fcfcfc;
  color: #888;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
}

.text-left { text-align: left !important; }
.rank-col { width: 60px; }
</style>