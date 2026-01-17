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
  const scrollAmount = direction === 'left' ? -345 : 345
  scrollContainer.value.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })
}
</script>

<template>
  <section class="home-teams">
    <div class="header-row">
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
      </div>

      <button class="nav-btn right" @click="scroll('right')">
        <span class="arrow-icon"></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.home-teams {
  padding: 30px 0;
  background: white;
}

.header-row {
  max-width: 1400px;
  margin: 0 auto 20px auto;
  padding: 0 20px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-row h2 {
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0;
}

.view-all {
  border: 1px solid #ddd;
  background: transparent;
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.teams-scroll-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 20px 30px 20px;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

.teams-scroll-container::-webkit-scrollbar { display: none; }

.home-team-card {
  flex: 0 0 320px;
  height: 360px !important; 
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: white;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn.left { left: -20px; }
.nav-btn.right { right: -20px; }

.arrow-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-top: 3px solid #1a1a1a;
  border-right: 3px solid #1a1a1a;
}

.left .arrow-icon { transform: rotate(-135deg); margin-left: 4px; }
.right .arrow-icon { transform: rotate(45deg); margin-right: 4px; }

@media (max-width: 1450px) {
  .nav-btn.left { left: 5px; }
  .nav-btn.right { right: 5px; }
}
</style>