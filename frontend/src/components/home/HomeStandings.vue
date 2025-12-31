<template>
  <section>
    <h2>Classifica</h2>

    <StandingsTable :standings="standings" />
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StandingsTable from "@/components/standings/StandingsTable.vue";
import { getStandings } from "@/services/standingsService";

const standings = ref([]);

onMounted(async () => {
  standings.value = await getStandings();
});
</script>
