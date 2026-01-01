<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="navbar__logo">
      <RouterLink to="/" class="logo-link">Serie A</RouterLink>
    </div>

    <nav class="navbar__menu">
      <RouterLink to="/calendario">Calendario e Risultati</RouterLink>
      <RouterLink to="/classifica">Classifica</RouterLink>
      <RouterLink to="/statistiche">Statistiche</RouterLink>
      <RouterLink to="/club">Club</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #0a3d91;
  color: white;
}

.navbar__logo {
  font-size: 1.3rem;
  font-weight: bold;
}

.logo-link {
  color: white;
  text-decoration: none;
}

.navbar__menu {
  display: flex;
  gap: 1.5rem;
}

.navbar__menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.navbar__menu a:hover {
  text-decoration: underline;
}

/* evidenzia link attivo */
.navbar__menu a.router-link-active {
  text-decoration: underline;
}
</style>
