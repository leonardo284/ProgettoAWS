<script setup>
import { ref, onMounted } from 'vue'
import { getTeams } from '@/services/teamsService'
import TeamCard from '@/components/teams/TeamCard.vue'

const teams = ref([])
const scrollContainer = ref(null)

onMounted(async () => {
  teams.value = await getTeams()
})

const scroll = (direction) => {
  if (!scrollContainer.value) return
  // Scroll di 350px (larghezza card + gap)
  const scrollAmount = direction === 'left' ? -375 : 375
  scrollContainer.value.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
}
</script>

<template>
  <section class="home-teams">
    <div class="header-section">
      <div class="title-group">
        <h2>CLUB</h2>
        <button class="view-all" @click="$router.push('/club')">VEDI TUTTI</button>
      </div>
    </div>

    <div class="carousel-wrapper">
      <button class="nav-btn left" @click="scroll('left')">
        <span class="arrow-icon"></span>
      </button>

      <div class="teams-scroll-container" ref="scrollContainer">
        <TeamCard
          v-for="team in teams"
          :key="team.teamId"
          :team="team"
          class="home-team-card"
        />
        <div class="final-spacer"></div>
      </div>

      <button class="nav-btn right" @click="scroll('right')">
        <span class="arrow-icon"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.home-teams {
  padding: 40px 0;
  background: #ffffff;
  width: 100%;
  overflow: hidden;
}

.header-section {
  /* Allinea il titolo a sinistra con un padding del 5% */
  padding: 0 5%;
  margin-bottom: 20px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-section h2 {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}

.view-all {
  border: 1px solid #ddd;
  background: transparent;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
}

.teams-scroll-container {
  display: flex;
  /* Allineamento a sinistra */
  justify-content: flex-start; 
  gap: 25px;
  overflow-x: auto;
  /* Padding iniziale per allineare la prima card al titolo sopra */
  padding: 10px 5% 30px 5%; 
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.teams-scroll-container::-webkit-scrollbar {
  display: none;
}

.home-team-card {
  /* Dimensione fissa delle card */
  flex: 0 0 350px; 
  height: 420px !important;
}

.final-spacer {
  flex: 0 0 5%; /* Stesso spazio del padding iniziale */
}

/* Pulsanti di navigazione */
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn.left { left: 10px; }
.nav-btn.right { right: 10px; }

.arrow-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 3px solid #333;
  border-right: 3px solid #333;
}

.left .arrow-icon { transform: rotate(-135deg); margin-left: 4px; }
.right .arrow-icon { transform: rotate(45deg); margin-right: 4px; }

/* Responsive mobile */
@media (max-width: 768px) {
  .home-team-card {
    flex: 0 0 280px;
  }
  .nav-btn { display: none; } /* Nascondi frecce su mobile */
}
</style>