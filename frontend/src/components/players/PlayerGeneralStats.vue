<template>
  <div class="stats-container">
    <h3 class="section-title">STATISTICHE GENERALI</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-number">{{ stats.played || 0 }}</span>
        <span class="stat-label">PARTITE GIOCATE</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ stats.minutes || 0 }}</span>
        <span class="stat-label">MINUTI GIOCATI</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ stats.goals || 0 }}</span>
        <span class="stat-label">GOL</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">{{ stats.assists || 0 }}</span>
        <span class="stat-label">ASSIST</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({ played: 0, minutes: 0, goals: 0, assists: 0 })
  }
});
</script>

<style scoped>
.stats-container { margin-bottom: 40px; }
.section-title {
  text-align: center;
  color: #003366;
  font-weight: 800;
  margin-bottom: 30px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.stat-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}
.stat-number {
  font-size: 3rem;
  font-weight: 900;
  color: #007bff;
  line-height: 1;
}
.stat-label {
  margin-top: 15px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #003366;
}
</style>