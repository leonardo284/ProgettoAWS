<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TeamsGrid from '@/components/teams/TeamsGrid.vue'
</script>

<template>
  <AppNavbar />

  <main class="container">
    <h1>Club</h1>
    <TeamsGrid />
  </main>

  <AppFooter />
</template>
