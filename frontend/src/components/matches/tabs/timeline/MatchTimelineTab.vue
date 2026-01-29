<script setup>
  import { computed } from 'vue';
  import TimelinePeriod from './TimelinePeriod.vue';
  import TimelineGoal from './TimelineGoal.vue';
  import TimelineSubstitution from './TimelineSubstitution.vue';
  import TimelineCard from './TimelineCard.vue';
  import TimelinePenalty from './TimelinePenalty.vue';
  import TimelineCorner from './TimelineCorner.vue';
  import TimelineFoul from './TimelineFoul.vue';

  const props = defineProps({
    match: { type: Object, required: true }
  });

  // Ordine cronologico inverso (dal più recente al più vecchio)
const sortedEvents = computed(() => {
  if (!props.match?.eventi) return [];

  // 1. Eventi reali (Priorità base 1)
  let timeline = props.match.eventi.map(ev => ({ ...ev, priority: 1 }));

  // 2. FINE PARTITA (Priorità 3 -> Sta sopra tutto al 90')
  if (props.match.stato === 'FINITA') {
    timeline.push({ tipo: 'FINE_PARTITA', minuto: 90, priority: 3 });
  }

  // 3. INTERVALLO 
  const statiPostPrimoTempo = ['FINE_PRIMO_TEMPO', 'IN_CORSO_SECONDO_TEMPO', 'FINITA'];
  if (statiPostPrimoTempo.includes(props.match.stato)) {
    const risultatoIntervallo = props.match.eventi.reduce((acc, ev) => {
      if (ev.tipo === 'GOAL' && ev.minuto <= 45) {
        if (ev.squadraId === props.match.squadre.casa.teamId) acc.casa++;
        else acc.trasferta++;
      }
      return acc;
    }, { casa: 0, trasferta: 0 });

    timeline.push({ 
      tipo: 'INTERVALLO', 
      minuto: 45, 
      priority: 2, // PRIORITÀ ALTA per stare SOPRA gli eventi del 45'
      risultatoMomento: risultatoIntervallo 
    });
  }

  // 4. INIZIO PARTITA (Priorità 0 -> Sta sotto tutto al minuto 0)
  if (props.match.stato !== 'NON_INIZIATA') {
    timeline.push({ tipo: 'INIZIO_PARTITA', minuto: 0, priority: 0 });
  }

  // Ordinamento: Minuto Decrescente, poi Priorità Decrescente
  return timeline.sort((a, b) => {
    if (b.minuto !== a.minuto) return b.minuto - a.minuto;
    return b.priority - a.priority;
  });
});
</script>

<template>
  <div class="timeline-container">
    <div v-if="sortedEvents.length > 0">
      <template v-for="event in sortedEvents" :key="event._id || event.minuto">
        
        <TimelinePeriod 
          v-if="['INIZIO_PARTITA', 'INTERVALLO', 'FINE_PARTITA'].includes(event.tipo)" 
          :event="event" 
          :match="match" 
        />

        <TimelineGoal 
          v-else-if="event.tipo === 'GOAL'" 
          :event="event" 
          :match="match" 
        />

        <TimelinePenalty 
          v-else-if="event.tipo === 'RIGORE'" 
          :event="event" 
          :match="match" 
        />

        <TimelineSubstitution 
          v-else-if="event.tipo === 'SOSTITUZIONE'" 
          :event="event" 
          :match="match" 
        />

        <TimelineCorner 
          v-else-if="event.tipo === 'ANGOLO'" 
          :event="event" 
          :match="match" 
        />

        <TimelineFoul 
          v-else-if="event.tipo === 'FALLO'" 
          :event="event" 
          :match="match" 
        />

        <TimelineCard 
          v-else-if="event.tipo === 'AMMONIZIONE' || event.tipo === 'ESPULSIONE'" 
          :event="event" 
          :match="match" 
        />

      </template>
    </div>
    <div v-else class="empty-state">
      Nessun evento disponibile per questa partita.
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  padding: 15px;
  /* Sfondo chiaro neutro per far risaltare le card bianche e azzurrine */
  background: #f5f5f7; 
  min-height: 100vh;
}

.empty-state {
  color: #999;
  text-align: center;
  margin-top: 60px;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>