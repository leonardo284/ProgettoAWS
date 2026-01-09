<script setup>
import { computed } from 'vue'

const props = defineProps({
  team: { type: Object, required: true },
  stats: Object
});

// LOGICA DI CENTRATURA DELLO SFONDO
const headerStyle = computed(() => {
  const bgImage = props.team.banner || props.team.immagineCopertina || '';
  
  return {
    backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${bgImage}')`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: props.team.colori?.[0] || '#003366'
  };
});

</script>

<template>
  <header class="team-header" :style="headerStyle">
    <div class="header-content">
      <div class="main-info">
        <img :src="team.logo" :alt="team.nome" class="team-logo-big" />
        
        <div class="text-info">
          <span class="foundation">{{ team.stadio?.nome || 'Stadio' }}</span>
          <h1>{{ team.nome }}</h1>
          
          <div class="coach-section">
            <p class="label">Allenatore: {{ team.allenatore || 'Non assegnato' }}</p>
          </div>

          <div class="social-icons">
            <a v-for="(url, platform) in socialPlatforms" :key="platform" 
               :href="'https://' + url" target="_blank" class="social-link"
               v-html="socialIcons[platform]">
            </a>
          </div>
        </div>
      </div>

      <div class="center-actions" v-if="team.social?.sito">
        <a :href="'https://' + team.social.sito" target="_blank" class="btn-website">
          WEBSITE <span class="arrow-icon">↗</span>
        </a>
      </div>

      <div class="stats-card" v-if="stats">
        <div class="stat-line">
          <span>POSIZIONE IN CLASSIFICA</span> <strong>{{ stats.posizione }}</strong>
        </div>
        <div class="stat-line">
          <span>PARTITE GIOCATE</span> <strong>{{ stats.matchPlayed }}</strong>
        </div>
        <div class="stat-line">
          <span>PARTITE VINTE</span> <strong>{{ stats.matchWon }}</strong>
        </div>
        <div class="stat-line">
          <span>GOAL TOTALI</span> <strong>{{ stats.goals }}</strong>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.team-header { 
  height: 480px; 
  color: white; 
  display: flex; 
  align-items: flex-end; 
  padding: 40px 10%; 
  position: relative; 
  overflow: hidden; /* Evita che l'immagine "esca" dai bordi */
}

.header-content { 
  display: flex; 
  justify-content: space-between; 
  width: 100%; 
  align-items: flex-end; 
  margin-bottom: 30px; 
  z-index: 1; /* Assicura che il contenuto sia sopra lo sfondo */
}

/* Pulsante Ciano Website */
.center-actions { 
  position: absolute; 
  left: 50%; 
  bottom: 35px; 
  transform: translateX(-50%); 
}

.btn-website {
  background: #00f2d3; 
  color: #000; 
  padding: 12px 30px; 
  border-radius: 40px;
  text-decoration: none; 
  font-weight: 800; 
  font-size: 0.9rem;
  display: flex; 
  align-items: center; 
  gap: 10px; 
  transition: 0.3s;
}
.btn-website:hover { transform: scale(1.05); filter: brightness(1.1); }

/* Social Icons Style */
.social-icons { display: flex; gap: 12px; margin-top: 20px; }
.social-link { 
  width: 32px; 
  height: 32px; 
  color: white; 
  text-decoration: none; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  transition: 0.3s;
}
.social-link :deep(svg) { width: 100%; height: 100%; }
.social-link:hover { opacity: 0.7; transform: translateY(-2px); }

/* Card Statistiche */
.stats-card { 
  background: rgba(255, 255, 255, 0.1); 
  backdrop-filter: blur(15px); 
  border-radius: 16px; 
  padding: 25px; 
  width: 320px; 
  border: 1px solid rgba(255,255,255,0.1);
}
.stat-line { 
  display: flex; 
  justify-content: space-between; 
  padding: 12px 0; 
  border-bottom: 1px solid rgba(255,255,255,0.1); 
  font-size: 0.85rem; 
  font-weight: 700; 
}
.stat-line:last-child { border: none; }
.stat-line strong { font-size: 1.4rem; }

/* Tipografia */
.text-info { margin-left: 20px; }
.text-info h1 { 
  font-size: 4.5rem; 
  font-weight: 900; 
  text-transform: uppercase; 
  margin: 0; 
  line-height: 1; 
}
.foundation { font-weight: 700; opacity: 0.8; text-transform: uppercase; }
.coach-section { margin-top: 10px; }
.team-logo-big { width: 180px; height: 180px; object-fit: contain; }

.main-info { display: flex; align-items: center; }

@media (max-width: 1024px) {
  .team-header { padding: 40px 5%; height: auto; min-height: 480px; }
  .header-content { flex-direction: column; align-items: flex-start; gap: 30px; }
  .stats-card { width: 100%; }
  .center-actions { position: static; transform: none; margin-top: 20px; }
}
</style>