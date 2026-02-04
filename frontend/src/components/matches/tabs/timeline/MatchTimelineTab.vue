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

  // array di eventi ordinati per la timeline
  const sortedEvents = computed(() => {
    if (!props.match?.eventi) return [];

    // creo un array timeline temporaneo che uso per inseririci tutti gli eventi già presenti
    // (la partita potrebbe essere già in corso oppure anche già finita)
    // e poi a seconda dello stato della partita aggiungo degli "eventi fittizi" che non verranno 
    // salvati sul db ma che servono a mostrare poi i componenti che indicano l'inizio, l'intervallo 
    // e la fine della partita. Infatti ad ogni evento di questo array assegno una priorità che userò
    // per l'ordinamento finale, perché potrei avere degli eventi al minuto 45 ad esempio, però questi eventi
    // devono comparire sotto il componente che indica l'intervallo. 

    // creo array timeline in cui inserisco gli eventi esistenti e a cui dò priorità 1
    let timeline = props.match.eventi.map((ev, index) => ({ 
      ...ev, 
      priority: 1,
      originalIndex: index // Backup per l'ordine di inserimento
    }));

    // ai 3 eventi fittizi che aggiungo per l'inizio partita, l'intervallo e la fine partita 
    // assegnamo degli id statici 'a', 'y' e 'z'in modo che comparandoli con gli id degli eventi reali 
    // (che sono ObjectId di MongoDB)
    // così posso sempre garantire un ordinamento consistente anche in caso di eventi multipli allo stesso minuto

    // Se la aprtita è finita inserisco nell'array di eventi l'evento di fine partita con priorità 3
    if (props.match.stato === 'FINITA') {
      timeline.push({ tipo: 'FINE_PARTITA', minuto: 90, priority: 3, _id: 'z' });
    }

    // array che contiene gli stati della partita successivi al primo tempo
    const statiPostPrimoTempo = ['FINE_PRIMO_TEMPO', 'IN_CORSO_SECONDO_TEMPO', 'FINITA'];
    
    // se la partita è almeno al secondo tempo, inserisco l'evento di intervallo con priorità 2
    if (statiPostPrimoTempo.includes(props.match.stato)) {
      // mi calcolo il risultato alla fine del primo tempo sommando i goal segnati fino al minuto 45
      const risultatoIntervallo = props.match.eventi.reduce((acc, ev) => {
        if (ev.tipo === 'GOAL' && ev.minuto <= 45) {
          if (ev.squadraId === props.match.squadre.casa.teamId) acc.casa++;
          else acc.trasferta++;
        }
        return acc;
      }, { casa: 0, trasferta: 0 });

      // aggiungo all'array timeline l'evento fittizio INTERVALLO
      timeline.push({ 
        tipo: 'INTERVALLO', 
        minuto: 45, 
        priority: 2, 
        risultatoMomento: risultatoIntervallo,
        _id: 'y'
      });
    }

    // aggiungo all'array timeline l'evento fittizio INIZIO PARTITA (Priorità 0 perché deve stare in fondo)
    if (props.match.stato !== 'NON_INIZIATA') {
      timeline.push({ tipo: 'INIZIO_PARTITA', minuto: 0, priority: 0, _id: 'a' });
    }

    // ordino l'array timeline in base a:
    // 1. Minuto (decrescente)
    // 2. Priorità (decrescente)
    // 3. Inserimento usando l'id MongoDB (decrescente)
    return timeline.sort((a, b) => {
      // Ordina per minuto (Decrescente)
      if (b.minuto !== a.minuto) return b.minuto - a.minuto;

      // Ordina per priorità (Decrescente: FINE_PARTITA vince su eventi al 90')
      if (b.priority !== a.priority) return b.priority - a.priority;

      // Ordina per inserimento (Decrescente: l'ultimo inserito sta sopra)
      // Se c'è l'ID di MongoDB (stringa), usiamo localeCompare
      if (a._id && b._id) {
        return String(b._id).localeCompare(String(a._id));
      }

      // Fallback: usa l'indice originale dell'array
      return b.originalIndex - a.originalIndex;
    });
  });
</script>

<template>
  <div class="timeline-container">
    <!-- Se ci sono eventi, li mostro ordinati -->
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