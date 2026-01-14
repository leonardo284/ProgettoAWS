<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/layout/AppNavbar.vue';
import Footer from '@/components/layout/AppFooter.vue';
import ClubStatsTab from '@/components/stats/tabs/ClubStatsTab.vue';
import PlayersStatsTab from '@/components/stats/tabs/PlayersStatsTab.vue';

const activeMainTab = ref('club');

const tabWidth = 220; 
const gap = 40;

const indicatorStyle = computed(() => ({
  width: `${tabWidth}px`,
  transform: `translateX(${activeMainTab.value === 'club' ? 0 : tabWidth + gap}px)`
}));
</script>

<template>
  <div class="layout-wrapper">
    <Navbar />
    
    <main class="stats-page">
      <div class="main-header">
        <div class="tabs-row">
          <button 
            :class="['main-tab', { active: activeMainTab === 'club' }]"
            @click="activeMainTab = 'club'"
          > CLUB </button>
          <button 
            :class="['main-tab', { active: activeMainTab === 'players' }]"
            @click="activeMainTab = 'players'"
          > GIOCATORI </button>
          <div class="blue-line" :style="indicatorStyle"></div>
        </div>
      </div>

      <div class="main-content">
        <component :is="activeMainTab === 'club' ? ClubStatsTab : PlayersStatsTab" />
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.layout-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
.stats-page { padding: 40px 10%; background: #fdfdfd; flex-grow: 1; }
.main-header { border-bottom: 2px solid #eee; margin-bottom: 30px; position: relative; }
.tabs-row { display: flex; gap: 40px; position: relative; padding-bottom: 10px; }

.main-tab {
  background: none; border: none; font-size: 2.2rem; font-weight: 900;
  color: #ccc; cursor: pointer; transition: color 0.3s; padding: 0;
  width: 220px; text-align: center;
}
.main-tab.active { color: #003366; }

.blue-line {
  position: absolute; bottom: -2px; height: 6px; background: #003366;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 3px;
  left: 0;
}
</style>