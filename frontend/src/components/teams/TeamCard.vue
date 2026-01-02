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
  // Se il secondo colore non c'è, uso il nero per garantire il contrasto in basso
  const color2 = props.team.colori?.[1] || '#0f0f0f'
  
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
  height: 340px; 
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

/* RIGA 1: Logo */
.team-card__row-logo {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.logo-img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

/* PROTEZIONE LEGGIBILITÀ */
.team-card__content-overlay {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
}

/* RIGA 2: Nome */
.team-card__row-name {
  text-align: center;
  margin-bottom: 5px;
}

.team-card__row-name h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* RIGA 3: Info */
.team-card__row-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.85rem;
  opacity: 0.95;
}

.stadium {
  font-weight: 600;
}

.city {
  display: flex;
  align-items: center;
  gap: 3px;
}

/* RIGA 4: Footer */
.team-card__row-footer {
  margin-top: auto;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-button {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: none;
  color: white;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.detail-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.pin {
  font-size: 0.9rem;
}
</style>
<!--<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  team: {
    type: Object,
    required: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const goToTeam = () => {
  if (props.clickable) {
    router.push(`/club/${props.team.teamId}`)
  }
}
</script>

<template>
  <div
    class="team-card"
    :class="{ clickable }"
    @click="goToTeam"
  >
    <img :src="team.logo" :alt="team.nome" />
    <h3>{{ team.nome }}</h3>
  </div>
</template>

<style scoped>
.team-card {
  padding: 1.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #0a3d91, #052b63);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.team-card img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.clickable {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}
</style>-->
