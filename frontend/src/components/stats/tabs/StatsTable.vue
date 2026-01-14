<script setup>
import placeholderImg from '@/assets/players/placeholder.jpg';

const props = defineProps({
  data: { type: Array, required: true },
  statType: { type: String, required: true }
});

const getColumnLabel = () => {
  const labels = {
    'gol': 'GOALS',
    'assist': 'ASSISTS',
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
        <th>GIOCATORE</th>
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
.white-table { width: 100%; border-collapse: collapse; background: white; }

th { 
  text-align: left; 
  padding: 15px; 
  color: #999; 
  font-size: 0.75rem; 
  font-weight: 700;
  border-bottom: 2px solid #f2f2f2; 
}

td { 
  padding: 12px 15px; 
  border-bottom: 1px solid #f8f8f8; 
  vertical-align: middle; 
}

/* Centratura */
.text-center { text-align: center; }

.rank-col { width: 50px; text-align: center; }
.rank-cell { font-weight: 800; color: #ccc; font-size: 1.1rem; }

.player-cell { display: flex; align-items: center; gap: 15px; }
.avatar { 
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  object-fit: cover; 
  background: #eee; 
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
}

.info { display: flex; flex-direction: column; }
.name { display: block; font-weight: 700; color: #333; font-size: 1.05rem; line-height: 1.2; }
.team { font-size: 0.8rem; color: #999; text-transform: uppercase; margin-top: 2px; }

/* Colonna Valore Statistica */
.stat-header { width: 120px; }
.value-cell { 
  font-size: 1.8rem; 
  font-weight: 900; 
  color: #003366; 
  width: 120px;
}

tr:hover { background-color: #fafafa; }
</style>