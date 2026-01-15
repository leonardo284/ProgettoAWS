<script setup>
import { computed } from 'vue';
import StatRow from './StatRow.vue';

const props = defineProps({
  match: { type: Object, required: true }
});

const getStat = (tipo, teamId) => {
  if (!props.match?.eventi) return 0;
  return props.match.eventi.filter(e => e.tipo === tipo && e.squadraId === teamId).length;
};

const stats = computed(() => {
  const hId = props.match.squadre.casa.teamId;
  const aId = props.match.squadre.trasferta.teamId;
  return {
    falli: { h: getStat('FALLO', hId), a: getStat('FALLO', aId) },
    gialli: { h: getStat('AMMONIZIONE', hId), a: getStat('AMMONIZIONE', aId) },
    rossi: { h: getStat('ESPULSIONE', hId), a: getStat('ESPULSIONE', aId) },
    angoli: { h: getStat('ANGOLO', hId), a: getStat('ANGOLO', aId) },
    rigori: { h: getStat('RIGORE', hId), a: getStat('RIGORE', aId) }
  };
});
</script>

<template>
  <div class="stats-wrapper" v-if="match">
    <div class="stats-list">
      <StatRow label="Falli Commessi" :home="stats.falli.h" :away="stats.falli.a" />
      <StatRow label="Ammonizioni" :home="stats.gialli.h" :away="stats.gialli.a" />
      <StatRow label="Espulsioni" :home="stats.rossi.h" :away="stats.rossi.a" />
      <StatRow label="Calci d'angolo" :home="stats.angoli.h" :away="stats.angoli.a" />
      <StatRow label="Rigori" :home="stats.rigori.h" :away="stats.rigori.a" />
    </div>
  </div>
</template>

<style scoped>
.stats-wrapper { padding: 30px; background: #fff; }
.stats-list { max-width: 600px; margin: 0 auto; }
</style>