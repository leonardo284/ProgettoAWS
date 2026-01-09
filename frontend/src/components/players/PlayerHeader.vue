<script setup>
import { computed } from 'vue';

const props = defineProps({
  player: { type: Object, required: true }
});

// Calcolo dell'età
const playerAge = computed(() => {
  if (!props.player.dataNascita) return 'N/D';
  const birth = new Date(props.player.dataNascita);
  const diff = Date.now() - birth.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

// Colore di sfondo (puoi renderlo dinamico passando props.teamColor)
const headerStyle = computed(() => ({
  background: `linear-gradient(135deg, #0a3d91 0%, #001529 100%)`,
}));
</script>

<template>
  <header class="player-header" :style="headerStyle">
    <div class="header-container">
      
      <div class="player-main-info">
        <div class="photo-circle">
          <img :src="player.foto" :alt="player.cognome" />
        </div>
        
        <div class="text-identity">
          <span class="team-label">{{ player.currentTeam?.nome }}</span>
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
    .player-header {
    padding: 60px 10%;
    color: white;
    min-height: 350px;
    display: flex;
    align-items: center;
    }

    .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    }

    .player-main-info {
    display: flex;
    align-items: center;
    gap: 40px;
    }

    /* Cerchio contenitore */
    .photo-circle {
    width: 220px;         /* Aumentato leggermente per visibilità */
    height: 220px;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    
    /* Centratura Flexbox interna */
    display: flex;
    justify-content: center;
    align-items: center;
    }

    /* Immagine all'interno */
    .photo-circle img {
    width: 100%;
    height: 100%;
    
    /* object-fit: cover taglia l'immagine per riempire il cerchio senza deformarla */
    /* object-position: top è utile per i mezzibusti, così non taglia la testa */
    object-fit: cover;
    object-position: center top; 
    
    display: block;
    }

    /* Identità Testuale */
    .team-label {
    font-size: 1.1rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
    }

    .fullname {
    margin: 10px 0;
    line-height: 1;
    }

    .firstname {
    display: block;
    font-size: 1.5rem;
    font-weight: 300;
    text-transform: uppercase;
    }

    .lastname {
    display: block;
    font-size: 4rem;
    font-weight: 900;
    text-transform: uppercase;
    }

    .role-tag {
    display: inline-block;
    background: #00f2d3;
    color: #000;
    padding: 6px 16px;
    border-radius: 4px;
    font-weight: 800;
    font-size: 0.85rem;
    text-transform: uppercase;
    }

    /* Card Caratteristiche (Stile simile all'immagine caricata) */
    .physical-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 25px;
    border-radius: 16px;
    width: 320px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-row:last-child {
    border-bottom: none;
    }

    .stat-label {
    font-size: 0.75rem;
    font-weight: 600;
    opacity: 0.7;
    }

    .stat-value {
    font-weight: 700;
    font-size: 1.1rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
    .header-container {
        flex-direction: column;
        text-align: center;
        gap: 40px;
    }
    .player-main-info {
        flex-direction: column;
    }
    .lastname {
        font-size: 2.5rem;
    }
    }
</style>