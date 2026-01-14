<script setup>
defineProps({
  club: { type: Object, required: true },
  rank: { type: Number, required: true }
});
</script>

<template>
  <tr class="club-row">
    <td class="rank-cell">{{ rank }}</td>

    <td class="team-cell">
      <div class="team-info">
        <div class="logo-container">
          <img 
            v-if="club.logo" 
            :src="club.logo" 
            class="team-logo" 
            alt="logo"
          />
          <div v-else class="logo-placeholder"></div>
        </div>
        <span class="team-name">{{ club.nome }}</span>
      </div>
    </td>

    <td class="stat-cell">{{ club.matchPlayed }}</td>
    <td class="stat-cell points-cell">{{ club.points }}</td>
    <td class="stat-cell">{{ club.matchWon }}</td>
    <td class="stat-cell">{{ club.matchLost }}</td>
    <td class="stat-cell">{{ club.matchDrawn }}</td>
    <td class="stat-cell">{{ club.goals }}</td>

    <td class="stat-cell">
      <div class="card-box">
        <span class="mini-card yellow"></span>
        <span class="card-count">{{ club.yc || 0 }}</span>
      </div>
    </td>

    <td class="stat-cell">
      <div class="card-box">
        <span class="mini-card red"></span>
        <span class="card-count">{{ club.rc || 0 }}</span>
      </div>
    </td>
  </tr>
</template>

<style scoped>
/* Struttura riga */
.club-row td { 
  padding: 14px; 
  border-bottom: 1px solid #f0f0f0; 
  vertical-align: middle; 
  text-align: center; 
}

.rank-cell { 
  font-weight: 800; 
  color: #bbb; 
  width: 50px; 
}

.team-cell { 
  text-align: left !important; 
}

/* Allineamento Logo e Nome */
.team-info { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.logo-container {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.team-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 24px;
  height: 24px;
  background: #eee;
  border-radius: 50%;
}

.team-name { 
  font-weight: 800; 
  color: #003366; 
  text-transform: uppercase; 
  font-size: 0.95rem; 
}

/* Numeri e Punti */
.stat-cell { 
  font-weight: 600; 
  color: #444; 
}

.points-cell { 
  font-weight: 900; 
  color: #003366; 
  font-size: 1.1rem; 
}

/* Stile Mini-Card (Gialli/Rossi) */
.card-box { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px; 
}

.mini-card { 
  width: 8px; 
  height: 12px; 
  border-radius: 1px; 
  display: inline-block; 
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.yellow { background-color: #f1c40f; }
.red { background-color: #e74c3c; }

.card-count {
  font-weight: 700;
  color: #333;
  min-width: 15px;
}

/* Feedback visivo */
.club-row:hover { 
  background-color: #fafafa; 
}
</style>