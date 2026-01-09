<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  team: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function goToTeam() {
  router.push(`/club/${props.team.teamId}`)
}

const cardStyle = computed(() => {
  const color1 = props.team.colori?.[0] || '#3b2c63'
  return {
    background: `linear-gradient(180deg, ${color1} 0%, #121212 100%)`,
    border: '4px solid rgba(255, 255, 255, 0.15)'
  }
})
</script>

<template>
  <div class="team-card" :style="cardStyle">
    
    <div class="team-card__row-logo">
      <img :src="team.logo" :alt="team.nome" class="logo-img" />
    </div>

    <div class="team-card__content-overlay">
      <div class="team-card__row-name">
        <h2>{{ team.nome }}</h2>
      </div>

      <div class="team-card__row-info">
        <span class="stadium">{{ team.stadio?.nome }}</span>
        <span v-if="team.stadio?.citta" class="city">
          <span class="pin">📍</span> {{ team.stadio.citta }}
        </span>
      </div>
    </div>

    <div class="team-card__row-footer">
      <button class="detail-button" @click="goToTeam">
        CLUB INFO →
      </button>
    </div>

  </div>
</template>

<style scoped>
.team-card {
  width: 100%;
  height: 360px; 
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0 12px 24px rgba(0,0,0,0.4);
  transition: all 0.3s ease;
  position: relative;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.6);
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.team-card__row-logo {
  flex: 0 0 140px; /* Altezza fissa per l'area logo */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.logo-img {
  max-width: 100%;
  max-height: 100px; /* Limita l'altezza effettiva dell'immagine */
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* Contenuto centrale */
.team-card__content-overlay {
  flex: 1; /* Occupa lo spazio rimanente spingendo il footer giù */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  overflow: hidden; /* Evita che testi lunghi rompano il layout */
}

.team-card__row-name {
  text-align: center;
  margin-bottom: 5px;
}

.team-card__row-name h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 900;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-card__row-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Cambiato a column per evitare sovrapposizioni */
  gap: 4px;
  font-size: 0.8rem;
  opacity: 0.85;
}

/* RIGA 4: Footer bloccato in fondo */
.team-card__row-footer {
  margin-top: auto; /* Trucco flex per ancorare al fondo */
  background: rgba(0, 0, 0, 0.4); /* Più scuro per leggibilità */
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-button {
  width: 100%;
  padding: 16px;
  background: transparent;
  border: none;
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
}

.detail-button:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>