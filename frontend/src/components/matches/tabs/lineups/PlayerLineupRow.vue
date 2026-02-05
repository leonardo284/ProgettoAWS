<script setup>
  import placeholderImg from '@/assets/players/placeholder.jpg';

  const props = defineProps({
    player: { type: Object, required: true },
    side: { type: String, default: 'home' },  // 'home' o 'away' (per capire da che parte mostrare le icone)
    events: { type: Array, default: () => [] },
    isSub: { type: Boolean, default: false },
    entered: { type: Boolean, default: false }
  });

  // Mappa per convertire i ruoli abbreviati in nomi completi
  const roleMap = { 'P': 'Portiere', 'D': 'Difensore', 'C': 'Centrocampista', 'A': 'Attaccante' };

  // Funzioni per verificare la presenza di eventi specifici per il giocatore
  const hasExited = () => !props.isSub && props.events?.some(e => e.tipo === 'SOSTITUZIONE' && e.playerOutId === props.player.playerId);
  const hasYellow = () => props.events?.some(e => e.playerId === props.player.playerId && e.tipo === 'AMMONIZIONE');
  const hasRed = () => props.events?.some(e => e.playerId === props.player.playerId && e.tipo === 'ESPULSIONE');
</script>

<template>
  <div class="player-lineup-row" :class="[side]" v-if="player">
    
    <!-- Struttura differente per casa e trasferta per posizionare le icone correttamente -->

    <!-- Se è la squadra di casa, foto a sinistra e icone a destra -->
    <template v-if="side === 'home'">
      <div class="player-main">
        <img :src="player.foto || placeholderImg" class="player-img" />
        <div class="player-info">
          <span class="name">{{ player.nome }} {{ player.cognome || '' }}</span>
          <span class="full-role">{{ roleMap[player.ruolo] || player.ruolo }}</span>
        </div>
        <!-- Icone degli eventi (cartellini, sostituzioni) -->
        <div class="event-icons">
          <span v-if="hasYellow()" class="card yellow"></span>
          <span v-if="hasRed()" class="card red"></span>
          <span v-if="entered" class="arrow in">↑</span>
          <span v-if="hasExited()" class="arrow out">↓</span>
        </div>
      </div>
    </template>

    <!-- Se la squadra è di trasferta, foto a destra e icone a sinistra -->
    <template v-else>
      <div class="player-main">
        <div class="event-icons">
          <!-- Icone degli eventi (cartellini, sostituzioni) -->
          <span v-if="hasExited()" class="arrow out">↓</span>
          <span v-if="entered" class="arrow in">↑</span>
          <span v-if="hasRed()" class="card red"></span>
          <span v-if="hasYellow()" class="card yellow"></span>
        </div>
        <div class="player-info text-right">
          <span class="name">{{ player.nome }} {{ player.cognome || '' }}</span>
          <span class="full-role">{{ roleMap[player.ruolo] || player.ruolo }}</span>
        </div>
        <img :src="player.foto || placeholderImg" class="player-img" />
      </div>
    </template>
  </div>
</template>

<style scoped>
  /* --- STILE BASE (Desktop/Tablet) --- */
  .player-lineup-row { 
    display: flex; 
    align-items: center; 
    padding: 10px 12px; 
    border-bottom: 1px solid #eee; 
    background: #fff; 
    min-width: 0; 
  }

  .player-main { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    flex: 1; 
    min-width: 0;
  }

  .player-img { 
    width: 38px; 
    height: 38px; 
    border-radius: 50%; 
    object-fit: cover; 
    background: #f5f5f5; 
    border: 1px solid #ddd; 
    flex-shrink: 0; 
  }

  .player-info { 
    display: flex; 
    flex-direction: column; 
    flex: 1; 
    min-width: 0; 
  }

  .name { 
    font-size: 0.95rem; 
    font-weight: 700; 
    color: #000;
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;
  }

  .full-role { 
    font-size: 0.7rem; 
    color: #888; 
    text-transform: uppercase; 
    font-weight: 500;
  }

  .text-right { text-align: right; }

  .event-icons { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    flex-shrink: 0; 
  }

  .card { 
    width: 10px; 
    height: 14px; 
    border-radius: 2px; 
    border: 1px solid rgba(0,0,0,0.1);
    flex-shrink: 0;
  }

  .yellow { background: #ffcc00; }
  .red { background: #ff4d4d; }

  .arrow { font-weight: 900; font-size: 1.1rem; flex-shrink: 0; line-height: 1; }
  .in { color: #28a745; }
  .out { color: #e31b23; }

  /* --- OTTIMIZZAZIONE TELEFONO (Mobile) --- */
  @media (max-width: 600px) {
    .name {
      font-size: 1rem; 
    }
    .player-img {
      width: 42px;
      height: 42px;
    }
    .player-lineup-row {
      padding: 12px 15px; 
    }
  }
</style>