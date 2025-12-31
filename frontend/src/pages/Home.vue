<template>
  <AppNavbar />

  <main class="container">
    <HomeLastMatches />
    <HomeStandings />
    <HomeTeams />
  </main>

  <AppFooter />
</template>

<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

import HomeLastMatches from '@/components/home/HomeLastMatches.vue'
import HomeStandings from '@/components/home/HomeStandings.vue'
import HomeTeams from '@/components/home/HomeTeams.vue'
</script>



<!--<template>
  <div>
    <h1>HOME</h1>
    <p>Prova</p>
  </div>
</template>

<script setup>
</script>-->