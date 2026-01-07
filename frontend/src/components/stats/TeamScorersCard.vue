<script setup>
import { computed } from 'vue';
import ScorerRow from './ScorerRow.vue';

const props = defineProps({
  players: { type: Array, default: () => [] }
});

const topScorers = computed(() => {
  return [...props.players]
    .filter(p => p.goals > 0)
    .sort((a, b) => b.goals - a.goals);
});
</script>

<template>
  <div class="scorers-card shadow-sm">
    <div class="card-header">
      <h3 class="m-0">Marcatori Squadra</h3>
    </div>

    <div class="table-header">
      <div class="header-left">
        <span class="col-label">#</span>
        <span class="col-label player-label">GIOCATORE</span>
      </div>
      <div class="header-right">
        <span class="col-label">GOAL</span>
      </div>
    </div>

    <div class="scorers-list" v-if="topScorers.length > 0">
      <ScorerRow 
        v-for="(player, index) in topScorers" 
        :key="player.id" 
        :player="player"
        :index="index"
      />
    </div>
    
    <div v-else class="no-data">
      Nessun marcatore trovato.
    </div>
  </div>
</template>

<style scoped>
.scorers-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
  margin-top: 25px;
}

.card-header {
  padding: 20px;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #001f3f;
  text-transform: uppercase;
}

.table-header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.col-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #aaa;
  letter-spacing: 1px;
}

.header-left { display: flex; }
.player-label { margin-left: 45px; }
.header-right { width: 60px; text-align: center; }

.no-data {
  padding: 40px;
  text-align: center;
  color: #999;
}
</style>