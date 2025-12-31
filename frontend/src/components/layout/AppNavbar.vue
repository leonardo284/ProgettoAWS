<template>
  <header class="navbar">
    <div class="navbar__logo">
      <span>Serie A</span>
    </div>

    <nav class="navbar__menu">
      <a href="#">Calendario e Risultati</a>
      <a href="#">Classifica</a>
      <a href="#">Statistiche</a>
      <a href="#">Club</a>
    </nav>
  </header>
</template>

<script setup>
</script>

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
</style>
