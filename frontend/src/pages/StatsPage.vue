<template>
  <div class="stats-page">
    <h1>Statistiche Campionato 2025/2026</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Classifica Marcatori</h3>
        <div v-for="(player, index) in topScorers" :key="player.id" class="stat-row">
          <span>{{ index + 1 }}. {{ player.nome }}</span>
          <strong>{{ player.gol }}</strong>
        </div>
      </div>

      <div class="stat-card">
        <h3>Classifica Assist</h3>
        <div v-for="(player, index) in topAssist" :key="player.id" class="stat-row">
          <span>{{ index + 1 }}. {{ player.nome }}</span>
          <strong>{{ player.assist }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page { padding: 40px 10%; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 20px; }
.stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
h1 { color: #003366; }
</style>