<script setup>
defineProps({
  label: String,
  home: Number,
  away: Number
});
</script>

<template>
  <div class="stat-item">
    <div class="val-box">
      <div class="circle" :class="{ 'home-winner': home > away }">
        {{ home }}
      </div>
    </div>
    
    <div class="stat-label">{{ label }}</div>
    
    <div class="val-box">
      <div class="circle" :class="{ 'away-winner': away > home }">
        {{ away }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.stat-label {
  flex: 1;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 800;
  color: #333;
  text-transform: uppercase;
}

.val-box { width: 50px; display: flex; justify-content: center; }

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  /* Default senza sfondo: testo scuro */
  color: #333; 
  background-color: transparent;
  transition: all 0.3s ease;
}

/* Classi per il vincitore della statistica */
.home-winner {
  background-color: #e31b23; /* Rosso */
  color: #fff;
}

.away-winner {
  background-color: #343a40; /* Grigio Scuro */
  color: #fff;
}
</style>