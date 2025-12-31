<template>
  <div class="team-card">
    <img v-if="team.logo" :src="team.logo" />
    <h3>{{ team.nome }}</h3>
  </div>
</template>
