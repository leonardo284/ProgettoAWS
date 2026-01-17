<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  team: { type: Object, required: true }
})

const router = useRouter()
const goToTeam = () => router.push(`/club/${props.team.teamId}`)

const cardStyle = computed(() => {
  const color1 = props.team.colori?.[0] || '#3b2c63'
  return {
    background: `linear-gradient(180deg, ${color1} 0%, #121212 100%)`,
    border: '3px solid rgba(255, 255, 255, 0.12)'
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
          📍 {{ team.stadio.citta }}
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
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: white;
  transition: all 0.3s ease;
  position: relative;
}

.team-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.team-card__row-logo {
  flex: 0 0 150px; /* Ridotto leggermente per l'altezza minore */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
}

.logo-img {
  max-width: 80%;
  max-height: 100px;
  object-fit: contain;
}

.team-card__content-overlay {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
}

.team-card__row-name h2 {
  margin: 0 0 5px 0;
  font-size: 1.4rem;
  font-weight: 800;
  text-transform: uppercase;
  text-align: center;
}

.team-card__row-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 0.85rem;
  opacity: 0.8;
  text-align: center;
}

.team-card__row-footer {
  background: rgba(0, 0, 0, 0.3);
}

.detail-button {
  width: 100%;
  padding: 15px;
  background: transparent;
  border: none;
  color: white;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>