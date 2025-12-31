<template>
  <div class="match-card">
    <div>{{ match.squadre.casa.nome }}</div>
    <strong>{{ match.risultato?.casa ?? '-' }} - {{ match.risultato?.trasferta ?? '-' }}</strong>
    <div>{{ match.squadre.trasferta.nome }}</div>
  </div>
</template>
