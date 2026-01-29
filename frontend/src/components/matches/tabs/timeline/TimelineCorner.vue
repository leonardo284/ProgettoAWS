<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: { type: Object, required: true },
  match: { type: Object, required: true }
});

const team = computed(() => 
  props.event.squadraId === props.match.squadre.casa.teamId 
    ? props.match.squadre.casa 
    : props.match.squadre.trasferta
);
</script>

<template>
  <div class="timeline-card corner-card-light" v-if="team">
    <div class="time-column">
      <span class="minute-badge">{{ event.minuto }}'</span>
      <div class="line-connector"></div>
    </div>
    
    <div class="event-content">
      <div class="header-row">
        <span class="corner-icon">🚩</span>
        <span class="label">CALCIO D'ANGOLO</span>
      </div>

      <div class="card-body-inner">
        <div class="team-details">
          <div class="team-row">
            <img :src="team.logo" class="team-logo-inline" v-if="team.logo" />
            <span class="team-name">{{ team.nome }}</span>
          </div>
          <div class="event-desc">Tiro dalla bandierina assegnato</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.corner-card-light {
  display: flex;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.time-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.minute-badge {
  background: #0f172a;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
}

.event-content { flex: 1; }

.header-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.corner-icon { font-size: 0.9rem; }
.label { 
  font-size: 0.7rem; 
  font-weight: 800; 
  color: #94a3b8; 
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.team-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-logo-inline {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.team-name { 
  font-weight: 700; 
  color: #1e293b; 
  font-size: 1rem; 
  text-transform: uppercase;
}

.event-desc {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
}
</style>