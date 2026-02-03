<script setup>
  import placeholderImg from '@/assets/players/placeholder.jpg';

  const props = defineProps({
    data: { type: Array, required: true },
    statType: { type: String, required: true }
  });

  const getColumnLabel = () => {
    const labels = {
      'gol': 'GOL',
      'assist': 'ASSIST',
      'yellow': 'AMMONIZIONI',
      'red': 'ESPULSIONI'
    };
    return labels[props.statType] || 'TOTALE';
  };

  const getStatValue = (p) => {
    if (!p.stats) return 0;
    switch (props.statType) {
      case 'gol': return p.stats.gol || 0;
      case 'assist': return p.stats.assist || 0;
      case 'yellow': return p.stats.ammonizioni || 0;
      case 'red': return p.stats.espulsioni || 0;
      default: return 0;
    }
  };
</script>

<template>
  <table class="white-table">
    <thead>
      <tr>
        <th class="rank-col">#</th>
        <th class="player-header">GIOCATORE</th>
        <th class="text-center stat-header">{{ getColumnLabel() }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, index) in data" :key="p._id || index">
        <td class="rank-cell">{{ index + 1 }}</td>
        <td class="player-cell">
          <img 
            :src="p.foto || placeholderImg" 
            class="avatar" 
            @error="(e) => e.target.src = placeholderImg"
          />
          <div class="info">
            <span class="name">{{ p.nome }} {{ p.cognome }}</span>
            <span class="team">{{ p.teamNome || 'Serie A' }}</span>
          </div>
        </td>
        <td class="value-cell text-center">
          {{ getStatValue(p) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
  .white-table { 
    width: 100%; 
    border-collapse: collapse; 
    background: white; 
    table-layout: auto; 
  }

  th { 
    text-align: left; 
    padding: 12px 10px; 
    color: #aaa; 
    font-size: 0.7rem; 
    font-weight: 800;
    border-bottom: 2px solid #f2f2f2; 
    text-transform: uppercase;
  }

  .stat-header {
    white-space: nowrap;
    width: 100px;
  }

  td { 
    padding: 10px; 
    border-bottom: 1px solid #f8f8f8; 
    vertical-align: middle; 
  }

  .rank-col { width: 35px; }
  .rank-cell { font-weight: 800; color: #ddd; text-align: center; }

  .player-cell { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
  }

  .avatar { 
    width: 38px; 
    height: 38px; 
    border-radius: 50%; 
    object-fit: cover; 
    flex-shrink: 0;
    border: 1px solid #f0f0f0;
  }

  .info { 
    display: flex; 
    flex-direction: column;
  }

  .name { 
    font-weight: 700; 
    color: #333; 
    font-size: 0.9rem; 
    line-height: 1.2;
    white-space: normal; 
    word-break: break-word;
  }

  .team { font-size: 0.65rem; color: #999; text-transform: uppercase; }

  .value-cell { 
    font-size: 1.3rem; 
    font-weight: 900; 
    color: #003366; 
  }

  .text-center { text-align: center; }

  /* --- RESPONSIVE MOBILE --- */
  @media (max-width: 600px) {
    td, th { padding: 10px 5px; }

    .avatar { 
      width: 32px; 
      height: 32px; 
    }
    .name { font-size: 0.85rem; }
    .stat-header { width: 85px; }
    th { font-size: 0.6rem; }
  }

  @media (max-width: 380px) {
    .avatar { width: 28px; height: 28px; }
    .stat-header { width: 75px; }
  }
</style>