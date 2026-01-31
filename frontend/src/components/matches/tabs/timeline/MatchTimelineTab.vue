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

    // 1. Eventi reali (Aggiungiamo l'indice originale come backup se l'_id fallisse)
    let timeline = props.match.eventi.map((ev, index) => ({ 
      ...ev, 
      priority: 1,
      originalIndex: index // Backup per l'ordine di inserimento
    }));

    // ai 3 eventi fittizi che aggiungiamo noi per l'inizio partita, l'intervallo e la fine partita 
    // assegnamo degli id statici 'a', 'y' e 'z'in modo che comparandoli con gli id degli eventi reali (che sono ObjectId di MongoDB)
    // possiamo sempre garantire un ordinamento consistente anche in caso di eventi multipli allo stesso minuto



    // 2. FINE PARTITA (Priorità 3)
    if (props.match.stato === 'FINITA') {
      timeline.push({ tipo: 'FINE_PARTITA', minuto: 90, priority: 3, _id: 'z' });
    }

    // 3. INTERVALLO (Priorità 2)
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
        priority: 2, 
        risultatoMomento: risultatoIntervallo,
        _id: 'y'
      });
    }

    // 4. INIZIO PARTITA (Priorità 0)
    if (props.match.stato !== 'NON_INIZIATA') {
      timeline.push({ tipo: 'INIZIO_PARTITA', minuto: 0, priority: 0, _id: 'a' });
    }

    // ORDINAMENTO RAFFINATO
    return timeline.sort((a, b) => {
      // A. Ordina per minuto (Decrescente)
      if (b.minuto !== a.minuto) return b.minuto - a.minuto;

      // B. Ordina per priorità (Decrescente: FINE_PARTITA vince su eventi al 90')
      if (b.priority !== a.priority) return b.priority - a.priority;

      // C. Ordina per inserimento (Decrescente: l'ultimo cliccato sta sopra)
      // Se c'è l'ID di MongoDB (stringa), usiamo localeCompare
      if (a._id && b._id) {
        return String(b._id).localeCompare(String(a._id));
      }

      // D. Fallback: usa l'indice originale dell'array
      return b.originalIndex - a.originalIndex;
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