<script setup>
  defineProps({
    stats: {
      type: Object,
      default: () => ({ played: 0, minutes: 0, goals: 0, assists: 0 })
    }
  });
</script>

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


<style scoped>
  /* --- STILE DESKTOP --- */
  .stats-container { 
    margin-bottom: 30px; 
  }

  .section-title {
    text-align: center;
    color: #003366;
    font-weight: 800;
    margin-bottom: 25px;
    font-size: 1.1rem; 
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .stat-card {
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 12px;
    padding: 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    transition: transform 0.2s ease;
  }

  .stat-number {
    font-size: 1.8rem;
    font-weight: 900;
    color: #007bff;
    line-height: 1.1;
  }

  .stat-label {
    margin-top: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    color: #666;
    text-align: center;
  }

  /* --- RESPONSIVE PER TELEFONI --- */
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .stat-card {
      padding: 15px 5px;
    }

    .stat-number {
      font-size: 1.5rem;
    }

    .stat-label {
      font-size: 0.65rem;
      margin-top: 8px;
    }

    .section-title {
      font-size: 0.95rem;
      margin-bottom: 15px;
    }
  }


  @media (max-width: 380px) {
    .stat-number {
      font-size: 1.3rem;
    }
  }
</style>