<template>
  <div class="container" style="padding: 100px 20px; text-align: center;">
    <h1>Dettaglio Partita</h1>
    <p>Stai visualizzando il match con ID: {{ $route.params.id }}</p>
    <router-link to="/">Torna alla Home</router-link>
  </div>
</template>