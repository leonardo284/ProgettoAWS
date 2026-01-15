<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

const team = computed(() => {
  if (!props.match?.squadre) return null;
  return props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta;
});
</script>

<template>
  <div class="timeline-card penalty-card" v-if="team">
    <div class="card-header">
      <div class="type-info">
        <div class="ball-icon">⚽</div>
        <span class="type-label">CALCIO DI RIGORE</span>
      </div>
      <div class="minute">{{ event.minuto }}'</div>
    </div>
    
    <div class="card-body">
      <div class="team-details">
        <img :src="team.logo" class="team-logo" />
        <span class="team-name">{{ team.nome }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.penalty-card {
  background: #1e1e1e;
  border-radius: 12px;
  border: 1px solid #333;
  margin-bottom: 15px;
  color: #fff;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid #333;
}

.type-info { display: flex; align-items: center; gap: 10px; }
.ball-icon { font-size: 1.1rem; }
.type-label { font-weight: 800; font-size: 0.8rem; letter-spacing: 1px; }
.minute { color: #888; font-weight: 600; }

.card-body { padding: 15px; }
.team-details { display: flex; align-items: center; gap: 12px; }
.team-logo { width: 28px; height: 28px; object-fit: contain; }
.team-name { font-size: 1rem; font-weight: 700; color: #eee; text-transform: uppercase; }
</style>