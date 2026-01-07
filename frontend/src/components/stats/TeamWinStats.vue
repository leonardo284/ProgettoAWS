<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  }
});


const colors = {
  won: '#00D2FF',   // Azzurro Ciano brillante
  drawn: '#7A9CC6', // Blu Avio spento (grigiastro)
  lost: '#001F3F'   // Blu Notte molto scuro
};

const chartData = computed(() => ({
  datasets: [
    {
      // Ordine: Vinte (Azzurro), Pareggi (Grigio/Blu), Perse (Scuro)
      backgroundColor: [colors.won, colors.drawn, colors.lost],
      data: [props.stats.won, props.stats.drawn, props.stats.lost],
      borderWidth: 0,
      cutout: '80%',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      titleFont: { size: 14, weight: 'bold' },
      padding: 12,
      cornerRadius: 8
    }
  }
};
</script>

<template>
  <div class="stats-card">
    <h3 class="stats-title">PARTITE GIOCATE</h3>
    
    <div class="content-wrapper">
      <div class="chart-container">
        <Doughnut v-if="stats.total > 0" :data="chartData" :options="chartOptions" />
        <div class="chart-center-text">
          <span class="big-number">{{ stats.total }}</span>
          <span class="label">TOTALI</span>
        </div>
      </div>

      <div class="custom-legend">
        <div class="legend-row">
          <span class="val">{{ stats.lost }}</span>
          <span class="txt">PERSE</span>
          <div class="bar bg-lost"></div>
        </div>
        <div class="legend-row">
          <span class="val">{{ stats.drawn }}</span>
          <span class="txt">PAREGGI</span>
          <div class="bar bg-drawn"></div>
        </div>
        <div class="legend-row">
          <span class="val">{{ stats.won }}</span>
          <span class="txt">VINTE</span>
          <div class="bar bg-won"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  max-width: 450px;
  border: 1px solid #f0f0f0;
}

.stats-title {
  text-align: center;
  margin-bottom: 30px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #001f3f;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.chart-container {
  position: relative;
  width: 160px;
  height: 160px;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.big-number {
  display: block;
  font-size: 2.2rem;
  font-weight: 900;
  line-height: 1;
  color: #1a1a1a;
}

.label {
  font-size: 0.75rem;
  color: #999;
  font-weight: 700;
  text-transform: uppercase;
}

.custom-legend {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.legend-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.val { font-size: 1.1rem; font-weight: 900; width: 25px; text-align: right; }
.txt { font-size: 0.8rem; color: #666; width: 75px; font-weight: 700; }

.bar {
  width: 45px;
  height: 10px;
  border-radius: 5px;
}


.bg-won { background-color: #00D2FF; }   /* Azzurro vivo */
.bg-drawn { background-color: #7A9CC6; } /* Blu Grigio */
.bg-lost { background-color: #001F3F; }  /* Blu Notte */
</style>