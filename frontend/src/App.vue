<template>
  <router-view />
</template>

<script setup>
</script>


<style> 
  /* non uso scoped perché deve applicarsi globalmente*/


  /* Regole globali applicate a tutta l'applicazione */

  /* Reset totale dei margini del browser */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* Forza l'uso dello stesso font su ogni elemento */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    height: 100%;
    /* Impedisce scroll orizzontali fastidiosi su mobile */
    overflow-x: hidden;
    background-color: #f8f9fa; /* Colore di sfondo neutro */
  }

  #app {
    width: 100%;
    min-height: 100vh;
  }

  /* Assicura che anche i bottoni e gli input ereditino il font Inter */
  button, input, select, textarea {
    font-family: inherit !important;
  }

  /* Nasconde eventuali elementi iniettati da estensioni che creano spazio bianco */
  plasmo-csui {
    display: none !important;
  }
</style>