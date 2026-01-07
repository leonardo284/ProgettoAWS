<script setup>
import { computed } from 'vue';

const props = defineProps({
  goalsFor: { type: Number, default: 0 },    // Riceve standing.goals
  goalsAgainst: { type: Number, default: 0 } // Riceve standing.goalsConceded
});

const totalGoals = computed(() => (props.goalsFor || 0) + (props.goalsAgainst || 0));

const forPercentage = computed(() => {
  if (totalGoals.value === 0) return 50;
  return (props.goalsFor / totalGoals.value) * 100;
});

const againstPercentage = computed(() => {
  if (totalGoals.value === 0) return 50;
  return (props.goalsAgainst / totalGoals.value) * 100;
});
</script>

<template>
  <div class="goal-card">
    <h3 class="card-title">MEDIA GOAL</h3>
    
    <div class="stats-wrapper">
      <div class="labels-top">
        <span class="label">GOL SUBITI</span>
        <span class="label">GOL FATTI</span>
      </div>

      <div class="bar-container">
        <div class="side left">
          <div 
            class="bar red-bar" 
            :style="{ width: againstPercentage + '%' }"
          >
            <span class="value">{{ goalsAgainst }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <div class="side right">
          <div 
            class="bar green-bar" 
            :style="{ width: forPercentage + '%' }"
          >
            <span class="value">{{ goalsFor }}</span>
          </div>
        </div>
      </div>
      
      </div>
  </div>
</template>

<style scoped>
.goal-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
  flex: 1;
}

.card-title {
  text-align: center;
  margin-bottom: 35px;
  font-weight: 800;
  color: #001f3f;
  letter-spacing: 1px;
}

.labels-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #a0a0a0;
}

.bar-container {
  display: flex;
  align-items: center;
  height: 50px;
  background: #f1f3f5;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.side {
  flex: 1;
  display: flex;
  height: 100%;
}

.side.left { justify-content: flex-end; } 
.side.right { justify-content: flex-start; }

.bar {
  display: flex;
  align-items: center;
  min-width: 45px;
  transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.red-bar {
  background: linear-gradient(90deg, #ff5f6d, #ff3131);
  border-radius: 30px 0 0 30px;
  justify-content: flex-start;
  padding-left: 20px;
}

.green-bar {
  background: linear-gradient(90deg, #2ecc71, #27ae60);
  border-radius: 0 30px 30px 0;
  justify-content: flex-end;
  padding-right: 20px;
}

.divider {
  width: 4px;
  height: 100%;
  background: white;
  z-index: 2;
}

.value {
  color: white;
  font-weight: 900;
  font-size: 1.2rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

.stats-wrapper {
  padding: 0 5px;
}
</style>