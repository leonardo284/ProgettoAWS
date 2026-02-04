<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    match: { type: Object, required: true }
  });

  // variabile che indica se la partita è in corso
  const isLive = computed(() => {
    return props.match.stato === 'IN_CORSO_PRIMO_TEMPO' || props.match.stato === 'IN_CORSO_SECONDO_TEMPO';
  });

  // Funzione per ottenere il nome del giocatore dato l'ID e la squadra
  const getPlayerName = (playerId, teamKey) => {
    if (!props.match?.squadre?.[teamKey]?.formazione) return '...';
    const team = props.match.squadre[teamKey];
    // creo un array unico con titolari e panchina per cercare il giocatore
    const allPlayers = [...team.formazione.titolari, ...team.formazione.panchina];
    const player = allPlayers.find(p => p.playerId === playerId);
    return player ? player.nome : 'Giocatore';
  };

  // Funzione per ottenere la lista dei goal segnati da una squadra
  const getGoals = (teamId) => {
    if (!props.match?.eventi) return [];
    return props.match.eventi.filter(e => e.tipo === "GOAL" && e.squadraId === teamId);
  };
</script>

<template>
  <div class="scoreboard-container" v-if="match && match.squadre">
    
    <div v-if="isLive" class="live-status-corner">
      <div class="minute-display">{{ match.minutoCorrente || 0 }}'</div>
      <div class="live-progress-bar">
        <div class="moving-glow"></div>
      </div>
    </div>

    <div class="match-header">
      <span class="giornata">GIORNATA {{ match.giornata }}</span>
      <span class="stato-pill" :class="match.stato">
        {{ match.stato?.replace(/_/g, ' ') }}
      </span>
    </div>

    <div class="score-display">
      <div class="team-side">
        <img :src="match.squadre.casa.logo" class="team-logo" alt="logo casa">
        <h2 class="team-name">{{ match.squadre.casa.nome }}</h2>
      </div>

      <div class="score-numbers">
        <span class="big-score">{{ match.risultato.casa }}</span>
        <span class="divider">-</span>
        <span class="big-score">{{ match.risultato.trasferta }}</span>
      </div>

      <div class="team-side">
        <img :src="match.squadre.trasferta.logo" class="team-logo" alt="logo trasferta">
        <h2 class="team-name">{{ match.squadre.trasferta.nome }}</h2>
      </div>
    </div>

    <div class="scorers-footer">
      <div class="scorers-column home">
        <!-- lista dei goal segnatidalla squadra di casa -->
        <div v-for="goal in getGoals(match.squadre.casa.teamId)" :key="goal._id" class="goal-item">
          {{ getPlayerName(goal.playerId, 'casa') }} {{ goal.minuto }}' ⚽
        </div>
      </div>
      <div class="scorers-column away">
        <!-- lista dei goal segnatidalla squadra in trasferta -->
        <div v-for="goal in getGoals(match.squadre.trasferta.teamId)" :key="goal._id" class="goal-item">
          ⚽ {{ getPlayerName(goal.playerId, 'trasferta') }} {{ goal.minuto }}'
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .scoreboard-container {
    position: relative;
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    border: 2px solid #ddd; 
    box-shadow: 0 6px 15px rgba(0,0,0,0.1); 
    margin-bottom: 25px;
    color: #1a1a1a;
    overflow: hidden;
  }

  .live-status-corner {
    position: absolute;
    top: 15px;
    right: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .minute-display {
    font-size: 1.5rem;
    font-weight: 900;
    color: #28a745;
    line-height: 1;
  }

  .live-progress-bar {
    width: 45px;
    height: 4px;
    background: #e8e8e8;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
  }

  .moving-glow {
    position: absolute;
    height: 100%;
    width: 50%;
    background: #28a745;
    border-radius: 10px;
    animation: slide-infinite 1.5s ease-in-out infinite;
  }

  @keyframes slide-infinite {
    0% { left: -50%; }
    50% { left: 100%; }
    100% { left: -50%; }
  }

  .match-header {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    font-weight: 800;
    color: #555;
    font-size: 0.85rem;
  }

  .stato-pill {
    background: #f0f0f0;
    padding: 5px 12px;
    border-radius: 6px;
    font-weight: 700;
    border: 1px solid #ccc;
    text-transform: uppercase;
  }

  .stato-pill.IN_CORSO_PRIMO_TEMPO,
  .stato-pill.IN_CORSO_SECONDO_TEMPO {
    border-color: #28a745;
    color: #28a745;
    background: rgba(40, 167, 69, 0.1);
  }

  .score-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .team-side { flex: 1; text-align: center; }
  .team-logo { width: 85px; height: 85px; object-fit: contain; margin-bottom: 12px; }
  .team-name { font-size: 1.5rem; font-weight: 900; color: #000; }
  .score-numbers { display: flex; align-items: center; gap: 25px; }
  .big-score { font-size: 5rem; font-weight: 900; color: #000; }
  .divider { font-size: 2.5rem; color: #bbb; }

  .scorers-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 2px solid #eee; 
    padding-top: 25px;
    gap: 40px;
  }
  .scorers-column.home { text-align: right; }
  .scorers-column.away { text-align: left; }
  .goal-item { font-size: 0.95rem; font-weight: 700; color: #333; margin-bottom: 6px; }

  @media (max-width: 600px) {
    .scoreboard-container {
      padding: 15px; /* Riduciamo il padding interno del box */
      margin-bottom: 15px;
    }

    /* Testata: giornata e stato */
    .match-header {
      gap: 8px;
      margin-bottom: 15px;
      font-size: 0.7rem; /* Font molto piccolo per le info secondarie */
    }

    .stato-pill {
      padding: 3px 8px;
    }

    /* Punteggio e Loghi */
    .score-display {
      gap: 5px;
      margin-bottom: 15px;
    }

    .team-logo {
      width: 45px;   /* Loghi più piccoli */
      height: 45px;
      margin-bottom: 5px;
    }

    .team-name {
      font-size: 0.85rem; /* Evito che i nomi lunghi vadano a capo male */
      line-height: 1.1;
    }

    .score-numbers {
      gap: 10px; /* Avvicino i numeri del punteggio */
    }

    .big-score {
      font-size: 2.2rem; 
    }

    .divider {
      font-size: 1.5rem;
    }

    /* Marcatori (Scorers) */
    .scorers-footer {
      padding-top: 15px;
      gap: 15px; 
    }

    .goal-item {
      font-size: 0.75rem; /* Font piccolo per i nomi dei marcatori */
      margin-bottom: 4px;
      white-space: nowrap; /* Evita che il nome vada a capo rompendo il layout */
      overflow: hidden;
      text-overflow: ellipsis; /* Se il nome è troppo lungo, mette i puntini */
    }

    /* Minuto Live */
    .live-status-corner {
      top: 10px;
      right: 10px;
    }
    
    .minute-display {
      font-size: 1.1rem;
    }
  }
</style>