<script setup>
    import { ref, computed } from 'vue';
    import Navbar from '@/components/layout/AppNavbar.vue';
    import Footer from '@/components/layout/AppFooter.vue';
    import ClubStatsTab from '@/components/stats/tabs/ClubStatsTab.vue';
    import PlayersStatsTab from '@/components/stats/tabs/PlayersStatsTab.vue';

    const activeMainTab = ref('club');

    // Spostiamo la linea blu in base al tab attivo (0% o 100%)
    const indicatorStyle = computed(() => ({
      transform: `translateX(${activeMainTab.value === 'club' ? '0%' : '100%'})`
    }));
</script>
<template>
  <div class="layout-wrapper">
    <Navbar />
    
    <main class="stats-page">
      <div class="main-header">
        <div class="tabs-row">
          <button  :class="['main-tab', { active: activeMainTab === 'club' }]" @click="activeMainTab = 'club'"> 
          CLUB 
          </button>
          <button :class="['main-tab', { active: activeMainTab === 'players' }]" @click="activeMainTab = 'players'"> 
          GIOCATORI 
          </button>
          
          <div class="indicator-container">
            <div class="blue-line" :style="indicatorStyle"></div>
          </div>
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

  .stats-page { 
    padding: 40px 10%; 
    background: #fdfdfd; 
    flex-grow: 1; 
    transition: padding 0.3s;
  }

  .main-header { 
    border-bottom: 2px solid #eee; 
    margin-bottom: 30px; 
    position: relative; 
  }

  .tabs-row { 
    display: flex; 
    position: relative; 
    padding-bottom: 10px;
    max-width: 600px; /* Impedisce ai tab di diventare troppo larghi su desktop */
    margin: 0 auto;  /* Centra i tab nella pagina */
  }

  .main-tab {
    flex: 1; /* Ogni tab prende esattamente metà dello spazio disponibile */
    background: none; 
    border: none; 
    font-size: clamp(1.2rem, 5vw, 2.2rem); 
    font-weight: 900;
    color: #ccc; 
    cursor: pointer; 
    transition: color 0.3s; 
    padding: 10px 0;
    text-align: center;
    white-space: nowrap;
  }

  .main-tab.active { color: #003366; }

  /* Contenitore della linea blu */
  .indicator-container {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 6px;
    pointer-events: none;
  }

  .blue-line {
    width: 50%; /* Metà del contenitore totale */
    height: 100%;
    background: #003366;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 3px;
  }

  /* --- MEDIA QUERIES --- */
  @media (max-width: 768px) {
    .stats-page {
      padding: 20px 5%; /* Meno margine sui lati per il telefono */
    }
    
    .tabs-row {
      gap: 0; 
    }
  }

  @media (max-width: 480px) {
    .blue-line {
      height: 4px; /* Linea leggermente più sottile sui telefoni */
    }
  }
</style>