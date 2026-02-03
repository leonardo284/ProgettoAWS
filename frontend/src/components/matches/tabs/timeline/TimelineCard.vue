<script setup>
  import { computed } from 'vue';
  import placeholderImg from '@/assets/players/placeholder.jpg';

  const props = defineProps({
    event: { type: Object, required: true },
    match: { type: Object, required: true }
  });

  const getPlayerData = (playerId) => {
    if (!props.match?.squadre || !playerId) return null;
    const allPlayers = [
      ...props.match.squadre.casa.formazione.titolari,
      ...props.match.squadre.casa.formazione.panchina,
      ...props.match.squadre.trasferta.formazione.titolari,
      ...props.match.squadre.trasferta.formazione.panchina
    ];
    return allPlayers.find(p => p.playerId === playerId);
  };

  const player = computed(() => getPlayerData(props.event.playerId));
  const isYellow = computed(() => props.event.tipo === 'AMMONIZIONE');

  const team = computed(() => 
    props.event.squadraId === props.match.squadre.casa.teamId 
      ? props.match.squadre.casa 
      : props.match.squadre.trasferta
  );
</script>

<template>
  <div class="timeline-card booking-card-light" v-if="player">
    <div class="time-column">
      <span class="minute-badge">{{ event.minuto }}'</span>
      <div class="line-connector"></div>
    </div>
    
    <div class="event-content">
      <div class="header-row">
        <div class="card-icon" :class="isYellow ? 'yellow' : 'red'"></div>
        <span class="label">
          {{ isYellow ? 'CARTELLINO GIALLO' : 'CARTELLINO ROSSO' }}
        </span>
      </div>

      <div class="card-body-inner">
        <div class="player-details">
          <div class="player-name">{{ player.nome }}</div>
          
          <div class="team-info">
            <img :src="team.logo" class="team-logo-inline" v-if="team.logo" />
            <span class="team-details">{{ team.nome }} · {{ player.ruolo }}</span>
          </div>
        </div>

        <div class="photo-container">
          <img 
            :src="player.foto || placeholderImg" 
            class="player-photo" 
            :class="isYellow ? 'border-yellow' : 'border-red'"
            @error="(e) => e.target.src = placeholderImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .booking-card-light {
    display: flex;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin: 12px 0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  /* Colonna Minuto a sinistra */
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

  /* Icona cartellino stilizzata */
  .card-icon {
    width: 10px;
    height: 14px;
    border-radius: 2px;
  }
  .yellow { background-color: #facc15; }
  .red { background-color: #ef4444; }

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

  .player-name { 
    font-weight: 700; 
    color: #1e293b; 
    font-size: 1.1rem; 
    line-height: 1.2; 
  }

  /* Info squadra sotto il nome */
  .team-info {
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

  .team-details {
    font-size: 0.75rem;
    color: #64748b;
  }

  .photo-container {
    width: 52px;
    height: 52px;
  }

  .player-photo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    background: #f1f5f9;
    border: 2px solid transparent;
  }

  /* Bordi dinamici in base al cartellino */
  .border-yellow { border-color: #facc15; }
  .border-red { border-color: #ef4444; }
</style>