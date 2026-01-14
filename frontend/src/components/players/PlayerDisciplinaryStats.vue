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
          <span class="card-label">Cartellini Gialli</span>
        </div>
        <div class="card-item">
          <div class="card-box red-border">
            <div class="icon-red"></div>
            <span class="card-count">{{ redCards }}</span>
          </div>
          <span class="card-label">Cartellini Rossi</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 }
});
</script>

<style scoped>
.disciplinary-card-main {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
}
.section-title { color: #003366; font-weight: 800; margin-bottom: 40px; }
.cards-wrapper { display: flex; justify-content: center; gap: 40px; }
.card-item { display: flex; flex-direction: column; align-items: center; }
.card-box {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 40px;
  border-radius: 15px;
  border: 1px solid #eee;
  margin-bottom: 10px;
}
.icon-yellow { width: 25px; height: 35px; background: #ffc107; border-radius: 4px; transform: rotate(10deg); }
.icon-red { width: 25px; height: 35px; background: #dc3545; border-radius: 4px; transform: rotate(10deg); }
.card-count { font-size: 2.5rem; font-weight: 900; color: #003366; }
.card-label { font-size: 0.9rem; font-weight: 600; color: #666; }
</style>