<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TeamsGrid from '@/components/teams/TeamsGrid.vue'
</script>

<template>
  <AppNavbar />

  <main class="full-width-container">
    <h1 class="page-title">Club</h1>
    <TeamsGrid />
  </main>

  <AppFooter />
</template>

<style scoped>
.full-width-container {
  max-width: 100%; 
  margin: 0 auto;
  padding: 2rem 0; 
  min-height: 80vh;
}

.page-title {
  padding-left: 20px; 
  margin-bottom: 2rem;
  font-weight: bold;
}
</style>