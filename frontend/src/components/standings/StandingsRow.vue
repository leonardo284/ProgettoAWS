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
    return { class: 'd', txt: '−' };
  };
</script>

<template>
  <tr class="t-row">
    <td class="txt-center">{{ position }}</td>
    
    <td class="td-team">
      <div class="team-flex">
        <div class="img-box">
          <img 
            v-if="row.logo" 
            :src="row.logo" 
            class="mini-logo"
            @error="(e) => e.target.src = placeholderImg" 
          />
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
        <span v-for="(res, i) in (row.form || ['W','D','L','W','W'])" 
              :key="i" 
              :class="['dot', getBadge(res).class]">
          {{ getBadge(res).txt }}
        </span>
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

/* Centratura contenuto Squadra */
.td-team {
  padding-left: 80px !important;
}

.team-flex {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* DIMENSIONI FISSE PER LOGHI*/
.img-box {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-logo {
  max-width: 30px;
  max-height: 30px;
  object-fit: contain;
}

.name {
  font-weight: 700;
  color: #222;
}

.pts {
  font-weight: 900;
  color: #000;
}

.txt-center { text-align: center; }

/* Forma */
.f-flex { display: flex; justify-content: center; gap: 4px; }
.dot {
  width: 20px; height: 20px; border-radius: 50%;
  color: white; font-size: 10px; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
}
.w { background: #28a745; }
.l { background: #dc3545; }
.d { background: #6c757d; }
</style>