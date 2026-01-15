<script setup>
import PlayerLineupRow from '@/components/matches/tabs/lineups/PlayerLineupRow.vue';

const props = defineProps({
  match: { type: Object, required: true }
});

const isEntered = (id) => props.match.eventi?.some(e => e.tipo === 'SOSTITUZIONE' && e.playerId === id);
</script>

<template>
  <div class="lineups-tab" v-if="match?.squadre">
    <div class="section-title">TITOLARI</div>
    <div class="grid">
      <div class="col">
        <PlayerLineupRow v-for="p in match.squadre.casa.formazione.titolari" :key="p.playerId"
          :player="p" :events="match.eventi" side="home" />
      </div>
      <div class="col">
        <PlayerLineupRow v-for="p in match.squadre.trasferta.formazione.titolari" :key="p.playerId"
          :player="p" :events="match.eventi" side="away" />
      </div>
    </div>

    <div class="section-title">PANCHINA</div>
    <div class="grid">
      <div class="col">
        <PlayerLineupRow v-for="p in match.squadre.casa.formazione.panchina" :key="p.playerId"
          :player="p" :events="match.eventi" :is-sub="true" :entered="isEntered(p.playerId)" side="home" />
      </div>
      <div class="col">
        <PlayerLineupRow v-for="p in match.squadre.trasferta.formazione.panchina" :key="p.playerId"
          :player="p" :events="match.eventi" :is-sub="true" :entered="isEntered(p.playerId)" side="away" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title { background: #f8f9fa; color: #888; text-align: center; padding: 8px; font-size: 0.7rem; font-weight: bold; }
.grid { display: grid; grid-template-columns: 1fr 1fr; }
.col:first-child { border-right: 1px solid #eee; }
</style>