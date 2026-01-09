<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import playerService from '@/services/playersService'; 
import PlayerHeader from '@/components/players/PlayerHeader.vue';

const route = useRoute();
const player = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await playerService.getPlayerById(route.params.id);
    player.value = data;
  } catch (error) {
    console.error("Errore nel recupero del giocatore:", error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="player-loader">
    <div class="spinner"></div>
    <p>Caricamento profilo atleta...</p>
  </div>
  
  <main v-else-if="player" class="player-detail">
    <PlayerHeader :player="player" />
    
    <div class="player-body-content">
      <section class="stats-overview">
         </section>
    </div>
  </main>

  <div v-else class="player-error">
    <h2>Atleta non trovato</h2>
    <router-link to="/club">Torna ai Club</router-link>
  </div>
</template>

<style scoped>
.player-loader { height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.player-body-content { padding: 40px 10%; }
</style>