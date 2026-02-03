<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    player: { type: Object, required: true },
    team: { type: Object, default: null }
  });

  const playerAge = computed(() => {
    if (!props.player.dataNascita) return 'N/D';
    const birth = new Date(props.player.dataNascita);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  });

  // Usiamo il LOGO invece del banner
  const teamLogo = computed(() => props.team?.logo || '');

  // Variabili CSS per il colore del team
  const headerStyle = computed(() => ({
    '--team-color': props.team?.colori?.[0] || '#0a192f'
  }));
</script>

<template>
  <header class="player-header" :style="headerStyle">
    
    <div v-if="teamLogo" 
         class="blur-bg" 
         :style="{ backgroundImage: `url(${teamLogo})` }">
    </div>

    <div class="header-overlay"></div>

    <div class="header-container">
      <div class="player-main-info">
        <div class="photo-circle">
          <img :src="player.foto" :alt="player.cognome" />
        </div>
        
        <div class="text-identity">
          <span class="team-label">{{ team?.nome || 'Svincolato' }}</span>
          <h1 class="fullname">
            <span class="firstname">{{ player.nome }}</span>
            <span class="lastname">{{ player.cognome }}</span>
          </h1>
          <div class="role-tag">{{ player.ruolo }}</div>
        </div>
      </div>

      <div class="physical-card">
        <div class="stat-row">
          <span class="stat-label">NAZIONALITÀ</span>
          <span class="stat-value">{{ player.nazionalita }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">ETÀ</span>
          <span class="stat-value">{{ playerAge }} anni</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">ALTEZZA</span>
          <span class="stat-value">{{ player.altezzaCm }} cm</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">PESO</span>
          <span class="stat-value">{{ player.pesoKg }} kg</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  /* --- STILE DESKTOP --- */
  .player-header {
    position: relative;
    padding: 60px 10%;
    color: white;
    min-height: 400px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: var(--team-color);
  }

  .blur-bg {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(1.1);
    width: 300px; height: 300px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(8px);
    z-index: 1;
    opacity: 0.3;
  }

  .header-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7));
    z-index: 2;
  }

  .header-container {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .player-main-info {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .photo-circle {
    width: 220px; height: 220px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }
  .photo-circle img { width: 100%; height: 100%; object-fit: cover; object-position: top; }

  /* --- TIPOGRAFIA UNIFORMATA --- */
  .text-identity { text-align: left; }

  .team-label { 
    font-weight: 700; 
    opacity: 0.8; 
    text-transform: uppercase; 
    font-size: 1.1rem; 
    display: block;
    margin-bottom: 5px;
  }

  .fullname { 
    margin: 0;
    padding: 0;
    line-height: 1;
  }

  .firstname, .lastname { 
    display: inline;
    font-size: 3.5rem; 
    font-weight: 900; 
    text-transform: uppercase; 
  }

  .lastname { margin-left: 10px; } 

  .role-tag {
    margin-top: 15px;
    display: inline-block;
    background: #00f2d3;
    color: #000;
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: 800;
  }

  /* Card Dati Fisici */
  .physical-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    padding: 30px;
    border-radius: 16px;
    width: 320px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-row {
    display: flex; justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .stat-row:last-child { border: none; }
  .stat-label { font-size: 0.75rem; font-weight: 600; opacity: 0.8; }
  .stat-value { font-weight: 700; font-size: 1.2rem; }

  /* --- RESPONSIVE MOBILE --- */
  @media (max-width: 1024px) {
    .header-container { flex-direction: column; text-align: center; gap: 30px; }
    .player-main-info { flex-direction: column; gap: 20px; }
    .text-identity { text-align: center; }
    .photo-circle { width: 160px; height: 160px; }

    .firstname, .lastname { 
      font-size: 2.2rem; 
      display: block; 
      margin-left: 0;
    }
    .team-label { font-size: 0.9rem; }
  }

  @media (max-width: 480px) {
    .firstname, .lastname { font-size: 1.8rem; }
    .photo-circle { width: 130px; height: 130px; }
  }
</style>