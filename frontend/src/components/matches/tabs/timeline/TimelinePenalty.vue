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
  <div class="timeline-card penalty-card-light" v-if="team">
    <div class="time-column">
      <span class="minute-badge">{{ event.minuto }}'</span>
    </div>
    
    <div class="event-content">
      <div class="header-row">
        <span class="ball-icon">⚽</span>
        <span class="label">CALCIO DI RIGORE</span>
      </div>

      <div class="card-body-inner">
        <div class="team-details-group">
          <div class="team-display-name">{{ team.nome }}</div>
          
          <div class="team-info-row">
            <img :src="team.logo" class="team-logo-inline" v-if="team.logo" />
            <span class="team-details-text">Squadra assegnataria</span>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>


<style scoped>
  .penalty-card-light {
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
    gap: 8px;
    margin-bottom: 8px;
  }

  .ball-icon { font-size: 1rem; }

  .label { 
    font-size: 0.7rem; 
    font-weight: 800; 
    color: #94a3b8; 
    letter-spacing: 0.05em; 
    text-transform: uppercase;
  }

  .card-body-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Stile nome squadra come player-name */
  .team-display-name { 
    font-weight: 700; 
    color: #1e293b; 
    font-size: 1.1rem; 
    line-height: 1.2; 
    text-transform: uppercase;
  }

  .team-info-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }

  .team-logo-inline {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .team-details-text {
    font-size: 0.75rem;
    color: #64748b;
  }

  .icon-placeholder {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
  }

  .big-icon {
    font-size: 1.5rem;
  }
</style>