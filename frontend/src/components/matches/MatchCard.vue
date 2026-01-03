<script setup>
const props = defineProps({
  match: {
    type: Object,
    required: true
  }
})

// Formattazione: GIORNO MESE ANNO (es: 24 MAG 2025)
const formatDate = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('it-IT', options).toUpperCase();
}
</script>

<template>
  <router-link 
    :to="{ name: 'MatchDetail', params: { id: match.matchId } }" 
    class="match-link"
  >
    <div class="match-card">
      <div class="match-header">
        <span class="header-text">
          GIORNATA {{ match.giornata }} - {{ formatDate(match.dataOra) }}
        </span>
      </div>

      <div class="teams-container">
        <div class="team-row">
          <div class="team-info">
            <img :src="match.squadre.casa.logo" :alt="match.squadre.casa.nome" class="team-logo" />
            <span class="team-name">{{ match.squadre.casa.nome }}</span>
          </div>
          <span class="score">{{ match.risultato?.casa ?? '-' }}</span>
        </div>

        <div class="team-row">
          <div class="team-info">
            <img :src="match.squadre.trasferta.logo" :alt="match.squadre.trasferta.nome" class="team-logo" />
            <span class="team-name">{{ match.squadre.trasferta.nome }}</span>
          </div>
          <span class="score">{{ match.risultato?.trasferta ?? '-' }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.match-link {
  text-decoration: none; 
  color: inherit;
  flex: 0 0 280px; /* Larghezza card */
}

.match-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eef0f2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

/* Effetto hover per feedback al click */
.match-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.1);
  border-color: #003366;
}

.match-header {
  text-align: center;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.header-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #003366;
  letter-spacing: 0.5px;
}

.teams-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.team-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #222;
}

.score {
  font-weight: 800;
  font-size: 1.2rem;
  color: #000;
}
</style>