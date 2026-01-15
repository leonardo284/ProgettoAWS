<script setup>
import { computed } from 'vue';
import TimelinePeriod from './TimelinePeriod.vue';
import TimelineGoal from './TimelineGoal.vue';
import TimelineSubstitution from './TimelineSubstitution.vue';
import TimelineCard from './TimelineCard.vue';
import TimelinePenalty from './TimelinePenalty.vue';

const props = defineProps({
  match: { type: Object, required: true }
});

// Ordine cronologico inverso (dal più recente al più vecchio)
const sortedEvents = computed(() => {
  if (!props.match?.eventi) return [];

  // 1. Prendo gli eventi reali e li ordino (dal più recente al più vecchio)
  let timeline = [...props.match.eventi].sort((a, b) => b.minuto - a.minuto);

  // 2. Inserisco "FINE PARTITA" se il match è finito
  if (props.match.stato === 'FINITA') {
    timeline.unshift({ tipo: 'FINE_PARTITA', minuto: 90 }); // unshift lo mette in cima
  }



  // 3. Inserisco "INIZIO PARTITA" in fondo
  timeline.push({ tipo: 'INIZIO_PARTITA', minuto: 0 });

  return timeline;
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