<script setup>
import { ref } from 'vue';
import MatchTimelineTab from '@/components/matches/tabs/timeline/MatchTimelineTab.vue';
import MatchLineupsTab from '@/components/matches/tabs/lineups/MatchLineupsTab.vue';
import MatchStatsTab from '@/components/matches/tabs/stats/MatchStatsTab.vue';

const props = defineProps({
  match: { type: Object, required: true }
});

const activeTab = ref('CRONACA');
const tabs = ['CRONACA', 'FORMAZIONI', 'STATISTICHE'];
</script>

<template>
  <div class="match-tabs-wrapper" v-if="match">
    <nav class="tabs-nav">
      <div 
        v-for="tab in tabs" 
        :key="tab"
        class="tab-btn"
        :class="{ 'active': activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </div>
    </nav>

    <div class="tabs-content">
      <Transition name="fade" mode="out-in">
        <div :key="activeTab">
          <MatchTimelineTab v-if="activeTab === 'CRONACA'" :match="match" />
          <MatchLineupsTab v-else-if="activeTab === 'FORMAZIONI'" :match="match" />
          <MatchStatsTab v-else-if="activeTab === 'STATISTICHE'" :match="match" />
        </div>
      </Transition>
    </div>
  </div>
</template>
<style scoped>
.match-tabs-wrapper {
  margin-top: 20px;
  background-color: #fff;
  border-radius: 12px;
  /* Bordi scuri e ben definiti */
  border: 2px solid #ddd; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tabs-nav { 
  display: flex; 
  background: #ffffff; 
  border-bottom: 2px solid #ddd; 
}

.tab-btn { 
  flex: 1; 
  padding: 18px 5px; 
  text-align: center; 
  cursor: pointer; 
  /* Testo grigio per tab inattivi */
  color: #888; 
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  border-bottom: 5px solid transparent;
  /* Separatore verticale sottile */
  border-right: 1px solid #eee;
}

.tab-btn:last-child { border-right: none; }

.tab-btn.active { 
  color: #000;
  /* Diventa grigio quando selezionato */
  background-color: #f2f2f2; 
  /* Barra nera spessa in basso */
  border-bottom: 5px solid #000; 
}

.tab-btn:hover:not(.active) {
  background-color: #fafafa;
  color: #555;
}

.tabs-content { 
  padding: 0; 
  background: #fff; 
  min-height: 250px;
}
</style>