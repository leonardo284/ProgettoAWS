<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  player: { type: Object, required: true }
});

const router = useRouter();

const DEFAULT_IMAGE = '/src/assets/players/placeholder.jpg';

const getPlayerImage = (player) => {
  if (player.foto && player.foto.trim() !== "") {
    return player.foto;
  }
  return DEFAULT_IMAGE;
};

const handleImageError = (event) => {
  event.target.src = DEFAULT_IMAGE;
};

// Navigazione dinamica
const goToDetail = () => {
  router.push(`/player/${props.player.playerId}`);
};
</script>

<template>
  <div class="player-card" @click="goToDetail">
    <div class="player-image-container">
      <img 
        :src="getPlayerImage(player)" 
        @error="handleImageError"
        :alt="player.cognome"
        loading="lazy"
      >
      <div class="card-overlay"></div>
    </div>

    <div class="card-info">
      <div class="name-section">
        <span class="firstname">{{ player.nome }}</span>
        <span class="lastname">{{ player.cognome }}</span>
      </div>
      
      <div class="role-badge" :class="player.ruolo.toLowerCase()">
        {{ player.ruolo }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-card {
  height: 350px;
  background: #000; /* Fondo nero per evitare flash bianchi */
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.player-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 255, 255, 0.4);
}

/* Container immagine a tutto schermo */
.player-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.player-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Occupa tutta la card */
  object-position: center top;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 65%;
  background: linear-gradient(0deg, rgba(0,0,0,0.95) 10%, rgba(0,0,0,0.4) 60%, transparent 100%);
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 15px;
  z-index: 2; /* Sopra l'immagine */
}

.name-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.firstname {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

.lastname {
  font-size: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.role-badge {
  font-size: 0.7rem;
  padding: 4px 12px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Colori Ruoli */
.role-badge.portiere { background: #e67e22; color: #fff; }
.role-badge.difensore { background: #27ae60; color: #fff; }
.role-badge.centrocampista { background: #2980b9; color: #fff; }
.role-badge.attaccante { background: #c0392b; color: #fff; }
.role-badge.sconosciuto { background: #95a5a6; color: #fff; }
</style>