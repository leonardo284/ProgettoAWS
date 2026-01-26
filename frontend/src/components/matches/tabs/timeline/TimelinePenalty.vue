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
.penalty-card {  background: #ffffff; 
  border-radius: 12px;
  border: 1px solid #e0e0e0; 
  margin-bottom: 15px;
  color: #1a1a1a; 
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: #f8f9fa; 
  border-bottom: 1px solid #eeeeee;
}

.type-info { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.ball-icon { 
  font-size: 1.1rem; 
}

.type-label { 
  font-weight: 800; 
  font-size: 0.8rem; 
  letter-spacing: 1px;
  color: #333; 
}

.minute { 
  color: #666; 
  font-weight: 600; 
}

.card-body { 
  padding: 15px; 
}

.team-details { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.team-logo { 
  width: 28px; 
  height: 28px; 
  object-fit: contain; 
}

.team-name { 
  font-size: 1rem; 
  font-weight: 700; 
  color: #111; 
  text-transform: uppercase; 
}
</style>