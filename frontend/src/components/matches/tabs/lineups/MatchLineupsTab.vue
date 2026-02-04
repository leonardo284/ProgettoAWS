<script setup>
  import { ref } from 'vue';
  import PlayerLineupRow from '@/components/matches/tabs/lineups/PlayerLineupRow.vue';

  const props = defineProps({
    match: { type: Object, required: true }
  });

  // Stato per il selettore mobile: 'home' o 'away'
  const squadraAttiva = ref('home');

  // Funzione per verificare se un giocatore in panchina è entrato in campo
  const isEntered = (id) => props.match.eventi?.some(e => e.tipo === 'SOSTITUZIONE' && e.playerId === id);
</script>

<template>
  <div class="lineups-tab" v-if="match?.squadre">
    
    <!-- sul telefono compaiono due buttons per indicare la squadra per cui mostrare i giocatori-->
    <div class="team-selector-mobile">
      <button :class="{ active: squadraAttiva === 'home' }" @click="squadraAttiva = 'home'">
        {{ match.squadre.casa.nome }}
      </button>
      <button :class="{ active: squadraAttiva === 'away' }" @click="squadraAttiva = 'away'">
        {{ match.squadre.trasferta.nome }}
      </button>
    </div>

    <div class="section-title">TITOLARI</div>
    <div class="grid">
      <!-- Mostro prima i titolari delle due squadre -->
      <div class="col" :class="{ 'hidden-mobile': squadraAttiva !== 'home' }">
        <PlayerLineupRow v-for="p in match.squadre.casa.formazione.titolari" :key="p.playerId"
          :player="p" :events="match.eventi" side="home" />
      </div>
      <div class="col" :class="{ 'hidden-mobile': squadraAttiva !== 'away' }">
        <PlayerLineupRow v-for="p in match.squadre.trasferta.formazione.titolari" :key="p.playerId"
          :player="p" :events="match.eventi" side="away" />
      </div>
    </div>

    <div class="section-title">PANCHINA</div>
    <div class="grid">
      <!-- Poi mostro i panchinari delle due squadre -->
      <div class="col" :class="{ 'hidden-mobile': squadraAttiva !== 'home' }">
        <PlayerLineupRow v-for="p in match.squadre.casa.formazione.panchina" :key="p.playerId"
          :player="p" :events="match.eventi" :is-sub="true" :entered="isEntered(p.playerId)" side="home" />
      </div>
      <div class="col" :class="{ 'hidden-mobile': squadraAttiva !== 'away' }">
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

  /* Stili Selettore Mobile */
  .team-selector-mobile {
    display: none; /* Nascosto su desktop */
    grid-template-columns: 1fr 1fr;
    background: #eee;
    padding: 4px;
    gap: 4px;
  }

  .team-selector-mobile button {
    padding: 10px;
    border: none;
    background: transparent;
    font-weight: bold;
    font-size: 0.8rem;
    text-transform: uppercase;
    cursor: pointer;
    color: #666;
  }

  .team-selector-mobile button.active {
    background: #fff;
    color: #003366;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    .team-selector-mobile { display: grid; }
    .grid { grid-template-columns: 1fr; }
    .col:first-child { border-right: none; }
    
    /* Nasconde la colonna non selezionata su mobile */
    .hidden-mobile {
      display: none;
    }
  }
</style>