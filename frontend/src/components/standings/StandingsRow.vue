<script setup>
import placeholderImg from '@/assets/players/placeholder.jpg';
import { computed } from 'vue';

const props = defineProps({
  row: Object,
  position: Number
});

const diffReti = computed(() => (props.row?.goals || 0) - (props.row?.goalsConceded || 0));

const getBadge = (res) => {
  if (res === 'W') return { class: 'w', txt: '✓' };
  if (res === 'L') return { class: 'l', txt: '✕' };
  if (res === 'D') return { class: 'd', txt: '−' };
  return { class: 'empty', txt: '' };
};

// Riempio gli slot da SINISTRA verso DESTRA
const formSlots = computed(() => {
  const realForm = props.row?.form || []; // es: ['W', 'D', 'W']
  const slots = [null, null, null, null, null];
  
  // Inserisco i risultati partendo dall'indice 0
  for (let i = 0; i < realForm.length && i < 5; i++) {
    slots[i] = realForm[i];
  }
  return slots; // Risultato: ['W', 'D', 'W', null, null]
});

// Calcolo l'indice dell'ultimo risultato reale per applicare il bordo
const lastRealIndex = computed(() => {
  const realForm = props.row?.form || [];
  if (realForm.length === 0) return -1;
  return Math.min(realForm.length - 1, 4); // L'indice dell'ultimo pallino colorato
});
</script>

<template>
  <tr class="t-row">
    <td class="txt-center">{{ position }}</td>
    <td class="td-team">
      <div class="team-flex">
        <div class="img-box">
          <img :src="row.logo || placeholderImg" class="mini-logo" @error="(e) => e.target.src = placeholderImg" />
        </div>
        <span class="name">{{ row.nome }}</span>
      </div>
    </td>
    <td class="txt-center">{{ row.matchPlayed || 0 }}</td>
    <td class="txt-center">{{ row.matchWon || 0 }}</td>
    <td class="txt-center">{{ row.matchDrawn || 0 }}</td>
    <td class="txt-center">{{ row.matchLost || 0 }}</td>
    <td class="txt-center">{{ row.goals || 0 }}</td>
    <td class="txt-center">{{ row.goalsConceded || 0 }}</td>
    <td class="txt-center">{{ diffReti }}</td>
    <td class="txt-center pts">{{ row.points || 0 }}</td>
    <td class="txt-center">
      <div class="f-flex">
        <div v-for="(res, i) in formSlots" 
             :key="i" 
             :class="['dot', res ? getBadge(res).class : 'empty', { 'last-active': i === lastRealIndex }]">
          {{ res ? getBadge(res).txt : '' }}
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.t-row td {
  padding: 12px 5px;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
}

.td-team { padding-left: 80px !important; }
.team-flex { display: flex; align-items: center; gap: 12px; }
.img-box { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
.mini-logo { max-width: 30px; max-height: 30px; object-fit: contain; }
.name { font-weight: 700; color: #222; }
.pts { font-weight: 900; color: #000; }
.txt-center { text-align: center; }

/* Stili Trend Ultime 5 */
.f-flex { display: flex; justify-content: center; gap: 6px; align-items: center; }

.dot {
  width: 22px; height: 22px; border-radius: 50%;
  color: white; font-size: 10px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box;
}

.w { background-color: #28a745; }
.l { background-color: #dc3545; }
.d { background-color: #6c757d; }
.empty { background-color: #eeeeee; border: 1px dashed #ccc; }

/* Bordo con effetto anello bianco*/
.last-active {
  border: 2px solid #222;
  outline: 2px solid white;
  outline-offset: -4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.pts { font-weight: 900; color: #000; }
.txt-center { text-align: center; }
.td-team { padding-left: 80px !important; }
.team-flex { display: flex; align-items: center; gap: 12px; }
.name { font-weight: 700; color: #222; }
.mini-logo { max-width: 30px; max-height: 30px; object-fit: contain; }
</style>