<script setup>
import { computed } from 'vue'

const props = defineProps({
  team: { type: Object, required: true },
  stats: Object
});

// Stile per la copertina
const headerStyle = computed(() => ({
  background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${props.team.immagineCopertina || ''}) center/cover`,
  backgroundColor: props.team.colori?.[0] || '#003366'
}));

// Mappatura degli SVG che mi hai fornito
const socialIcons = {
  twitter: `<svg viewBox="0 0 32 32" fill="none" class="border-current w-8 h-8"><circle cx="16" cy="16" r="15.5" stroke="currentColor"></circle><path d="M20.0258 10H22.1726L17.4825 15.0831L23 22H18.6799L15.2962 17.8049L11.4245 22H9.27646L14.2929 16.5631L9 10H13.4298L16.4883 13.8345L20.0258 10ZM19.2724 20.7815H20.4619L12.7834 11.1545H11.5069L19.2724 20.7815Z" fill="currentColor"></path></svg>`,
  facebook: `<svg viewBox="0 0 32 32" fill="none" class="border-current w-8 h-8"><circle cx="16" cy="16" r="15.5" stroke="currentColor"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M14.5449 19.4796C14.5449 18.3846 14.5383 17.2896 14.5515 16.1946C14.5515 16.0091 14.4985 15.9534 14.2996 15.9596C13.9351 15.9719 13.5705 15.9596 13.1993 15.9657C13.0535 15.9719 12.9939 15.9286 13.0005 15.7863C13.0071 15.1059 13.0071 14.4192 13.0005 13.7387C13.0071 13.6088 13.0403 13.5655 13.1861 13.5655C13.5573 13.5717 13.9351 13.5531 14.3063 13.5717C14.525 13.584 14.5648 13.5098 14.5648 13.3242C14.5515 12.8046 14.5515 12.2849 14.5648 11.7653C14.578 11.1281 14.7636 10.5342 15.168 10.0207C15.6717 9.3588 16.4008 9.06186 17.2426 9.02475C18.1043 8.98763 18.9726 9.00619 19.8409 9C19.9602 9 20 9.03712 20 9.14847C19.9934 9.84133 19.9934 10.528 20 11.2209C20 11.3446 19.9602 11.3817 19.8277 11.3817C19.4101 11.3755 18.9925 11.3817 18.5815 11.3817C18.0248 11.3817 17.6933 11.6477 17.6602 12.1612C17.6337 12.5695 17.6536 12.984 17.6403 13.3984C17.6337 13.5469 17.7331 13.5345 17.8325 13.5345C18.4622 13.5345 19.0985 13.5407 19.7282 13.5284C19.9138 13.5284 19.9735 13.5655 19.9536 13.7449C19.8741 14.4316 19.8078 15.1182 19.7415 15.8111C19.7282 15.9657 19.6487 15.9967 19.5029 15.9967C19.0058 15.9905 18.502 15.9905 18.0049 15.9967C17.6469 15.9967 17.6801 15.9472 17.6801 16.2874C17.6801 18.4341 17.6735 20.5745 17.6867 22.7212C17.6867 22.9501 17.6271 23.0057 17.3884 22.9995C16.5334 22.9872 15.6717 22.9872 14.8167 22.9995C14.578 23.0057 14.5383 22.9253 14.5383 22.7274C14.5449 21.6386 14.5449 20.556 14.5449 19.4796Z" fill="currentColor"></path></svg>`,
  youtube: `<svg viewBox="0 0 32 32" fill="none" class="border-current w-8 h-8"><circle cx="16" cy="16" r="15.5" stroke="currentColor"></circle><path d="M16 11C16 11 20.3516 11.0003 21.4365 11.2988C22.0349 11.4632 22.506 11.947 22.666 12.5615C22.9568 13.6756 22.957 16 22.957 16C22.957 16.0008 22.9567 18.3246 22.666 19.4385C22.506 20.053 22.0349 20.5367 21.4365 20.7012C20.3516 20.9996 16 21 16 21C15.9484 21 11.6429 20.9978 10.5645 20.7012C9.966 20.5367 9.49495 20.053 9.33496 19.4385C9.04434 18.3246 9.04395 16.0008 9.04395 16C9.04395 16 9.04429 13.6756 9.33496 12.5615C9.49495 11.947 9.96599 11.4632 10.5645 11.2988C11.6429 11.0021 15.9484 11 16 11ZM14.6963 18.3906L18.1748 16.2168L14.6963 14.043V18.3906Z" fill="currentColor"></path></svg>`,
  instagram: `<svg viewBox="0 0 32 32" fill="none" class="border-current w-8 h-8"><circle cx="16" cy="16" r="15.5" stroke="currentColor"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M16.0004 9.21191C14.1569 9.21191 13.9256 9.21997 13.2015 9.25292C12.4789 9.28602 11.9856 9.40042 11.554 9.56828C11.1076 9.74165 10.7289 9.97357 10.3516 10.351C9.974 10.7283 9.74208 11.107 9.56814 11.5533C9.39986 11.985 9.28531 12.4784 9.25278 13.2008C9.2204 13.9248 9.21191 14.1563 9.21191 15.9998C9.21191 17.8433 9.22012 18.0739 9.25292 18.798C9.28616 19.5206 9.40056 20.0138 9.56828 20.4454C9.7418 20.8919 9.97372 21.2706 10.3512 21.6479C10.7283 22.0255 11.107 22.2579 11.5532 22.4313C11.9851 22.5992 12.4785 22.7136 13.201 22.7467C13.925 22.7796 14.1562 22.7877 15.9996 22.7877C17.8432 22.7877 18.0739 22.7796 18.7979 22.7467C19.5205 22.7136 20.0144 22.5992 20.4463 22.4313C20.8926 22.2579 21.2707 22.0255 21.6479 21.6479C22.0254 21.2706 22.2574 20.8919 22.4313 20.4456C22.5982 20.0138 22.7127 19.5204 22.7467 18.7981C22.7792 18.0741 22.7877 17.8433 22.7877 15.9998C22.7877 14.1563 22.7792 13.925 22.7467 13.2009C22.7127 12.4783 22.5982 11.985 22.4313 11.5534C22.2574 11.107 22.0254 10.7283 21.6479 10.351C21.2703 9.97343 20.8927 9.74151 20.4458 9.56828C20.0131 9.40042 19.5196 9.28602 18.7969 9.25292C18.0729 9.21997 17.8424 9.21191 15.9983 9.21191H16.0004ZM19.6238 11.5619C19.1741 11.5619 18.8092 11.9264 18.8092 12.3762C18.8092 12.8259 19.1741 13.1907 19.6238 13.1907C20.0735 13.1907 20.4383 12.8259 20.4383 12.3762C20.4383 11.9265 20.0735 11.5616 19.6238 11.5616V11.5619ZM16.0004 12.5143C14.0753 12.5143 12.5145 14.0751 12.5145 16.0001C12.5145 17.9252 14.0753 19.4853 16.0004 19.4853C17.9255 19.4853 19.4857 17.9252 19.4857 16.0001C19.4857 14.0751 17.9254 12.5143 16.0003 12.5143H16.0004ZM16.0004 13.7374C17.25 13.7374 18.2631 14.7504 18.2631 16.0001C18.2631 17.2496 17.25 18.2627 16.0004 18.2627C14.7507 18.2627 13.7378 17.2496 13.7378 16.0001C13.7378 14.7504 14.7507 13.7374 16.0004 13.7374Z" fill="currentColor"></path></svg>`
};

// Escludiamo il sito dai cerchietti social
const socialPlatforms = computed(() => {
  if (!props.team.social) return {};
  const { sito, ...others } = props.team.social;
  return others;
});
</script>

<template>
  <header class="team-header" :style="headerStyle">
    <div class="header-content">
      <div class="main-info">
        <img :src="team.logo" :alt="team.nome" class="team-logo-big" />
        
        <div class="text-info">
          <span class="foundation">
            {{ team.fondazione || '----' }} | {{ team.stadio?.nome || 'Stadio' }}
          </span>
          <h1>{{ team.nome }}</h1>
          
          <div class="coach-section">
            <p class="label">Allenatore</p>
            <p class="name">{{ team.allenatore || 'Non assegnato' }}</p>
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
          WEBSITE 
          <span class="arrow-icon">↗</span>
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
  height: 480px; color: white; display: flex; align-items: flex-end; 
  padding: 40px 10%; position: relative; 
}

.header-content { 
  display: flex; justify-content: space-between; width: 100%; 
  align-items: flex-end; margin-bottom: 30px; 
}

/* Pulsante Ciano Website */
.center-actions { 
  position: absolute; left: 50%; bottom: 35px; transform: translateX(-50%); 
}

.btn-website {
  background: #00f2d3; color: #000; padding: 12px 30px; border-radius: 40px;
  text-decoration: none; font-weight: 800; font-size: 0.9rem;
  display: flex; align-items: center; gap: 10px; transition: 0.3s;
}
.btn-website:hover { transform: scale(1.05); filter: brightness(1.1); }

/* Social Icons Style */
.social-icons { display: flex; gap: 12px; margin-top: 20px; }
.social-link { 
  width: 32px; height: 32px; color: white; text-decoration: none; 
  display: flex; align-items: center; justify-content: center; transition: 0.3s;
}
.social-link :deep(svg) { width: 100%; height: 100%; }
.social-link:hover { opacity: 0.7; transform: translateY(-2px); }

/* Card Statistiche */
.stats-card { 
  background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); 
  border-radius: 16px; padding: 25px; width: 320px; border: 1px solid rgba(255,255,255,0.1);
}
.stat-line { 
  display: flex; justify-content: space-between; padding: 12px 0; 
  border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; font-weight: 700; 
}
.stat-line:last-child { border: none; }
.stat-line strong { font-size: 1.4rem; }

/* Tipografia */
.text-info h1 { font-size: 4.5rem; font-weight: 900; text-transform: uppercase; margin: 0; line-height: 1; }
.team-logo-big { width: 180px; height: 180px; object-fit: contain; }
</style>