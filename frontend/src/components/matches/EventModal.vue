<script setup>

const props = defineProps({
  isOpen: Boolean,
  match: Object
});

const emit = defineEmits(['close']);
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Nuovo Evento: {{ props.match?.squadre?.casa?.nome }} vs {{ props.match?.squadre?.trasferta?.nome }}</h3>
        <button @click="$emit('close')" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <p>Pannello di controllo eventi per il match ID: {{ props.match?._id }}</p>
        <div class="placeholder-form">
           <p>Il timer della partita è in gestione...</p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Annulla</button>
        <button class="btn-primary">Registra Evento</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999; 
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  color: #333;
}
.modal-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.btn-primary { background: #003366; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-secondary { background: #ccc; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer; }
</style>    