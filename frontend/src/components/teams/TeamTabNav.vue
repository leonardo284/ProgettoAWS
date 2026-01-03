<script setup>
const props = defineProps({
  teamId: { type: [String, Number], required: true }
});
</script>

<template>
  <nav class="team-tabs">
    <div class="nav-container">
      <router-link :to="`/club/${teamId}`" exact-active-class="active">Overview</router-link>
      <router-link :to="`/club/${teamId}/squadra`" active-class="active">Squadra</router-link>
      <router-link :to="`/club/${teamId}/calendario`" active-class="active">Calendario e Risultati</router-link>
      <router-link :to="`/club/${teamId}/statistiche`" active-class="active">Statistiche</router-link>
    </div>
  </nav>
</template>

<style scoped>
.team-tabs { background: white; border-bottom: 1px solid #eee; sticky: top; z-index: 10; }
.nav-container { display: flex; gap: 40px; padding: 0 10%; }
.team-tabs a { 
  padding: 20px 0; 
  text-decoration: none; 
  color: #555; 
  font-weight: 700; 
  text-transform: uppercase; 
  font-size: 0.85rem;
  border-bottom: 4px solid transparent;
  transition: all 0.3s;
}
.team-tabs a.active { color: #003366; border-bottom-color: #003366; }
</style>