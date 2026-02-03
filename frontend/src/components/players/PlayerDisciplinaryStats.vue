<script setup>
  defineProps({
    yellowCards: { type: Number, default: 0 },
    redCards: { type: Number, default: 0 }
  });
</script>

<template>
  <div class="disciplinary-container">
    <div class="disciplinary-card-main">
      <h3 class="section-title">PROVVEDIMENTI DISCIPLINARI</h3>
      <div class="cards-wrapper">
        <div class="card-item">
          <div class="card-box yellow-border">
            <div class="icon-yellow"></div>
            <span class="card-count">{{ yellowCards }}</span>
          </div>
          <span class="card-label">Gialli</span>
        </div>
        <div class="card-item">
          <div class="card-box red-border">
            <div class="icon-red"></div>
            <span class="card-count">{{ redCards }}</span>
          </div>
          <span class="card-label">Rossi</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
  /* --- STILE DESKTOP --- */
  .disciplinary-card-main {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .section-title { 
    color: #003366; 
    font-weight: 800; 
    margin-bottom: 30px; 
    font-size: 1.1rem; 
    letter-spacing: 1px;
  }

  .cards-wrapper { 
    display: flex; 
    justify-content: center; 
    gap: 30px; 
  }

  .card-item { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    flex: 1;
    max-width: 180px;
  }

  .card-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 12px 25px; 
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    background: #fafafa;
    margin-bottom: 8px;
    width: 100%;
  }

  /* CARTELLINI PIÙ PICCOLI */
  .icon-yellow, .icon-red { 
    width: 18px; 
    height: 26px; 
    border-radius: 3px; 
    transform: rotate(5deg); 
  }
  .icon-yellow { background: #ffc107; box-shadow: 2px 2px 0 rgba(255, 193, 7, 0.2); }
  .icon-red { background: #dc3545; box-shadow: 2px 2px 0 rgba(220, 53, 69, 0.2); }

  .card-count { 
    font-size: 1.8rem;
    font-weight: 900; 
    color: #003366; 
  }

  .card-label { 
    font-size: 0.8rem;
    font-weight: 700; 
    color: #888; 
    text-transform: uppercase;
  }

  /* --- RESPONSIVE MOBILE --- */
  @media (max-width: 600px) {
    .disciplinary-card-main {
      padding: 20px;
    }

    .section-title {
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    .cards-wrapper {
      gap: 15px;
    }

    .card-box {
      padding: 10px 15px;
      gap: 10px;
    }

    .card-count {
      font-size: 1.4rem;
    }

    .icon-yellow, .icon-red {
      width: 14px;
      height: 20px;
    }

    .card-label {
      font-size: 0.7rem;
    }
  }
</style>