<script setup>
import placeholderImg from '@/assets/players/placeholder.jpg';

defineProps({
  player: { type: Object, required: true },
  index: { type: Number, required: true }
});

const handleImageError = (e) => {
  e.target.src = placeholderImg;
};
</script>

<template>
  <div class="scorer-row">
    <div class="player-info">
      <span class="rank">{{ index + 1 }}</span>
      <div class="image-container">
        <img 
          :src="player.image || placeholderImg" 
          @error="handleImageError"
          class="player-img"
        >
      </div>
      <span class="player-name">{{ player.name }}</span>
    </div>
    <div class="goals-column">
      <span class="goals-value">{{ player.goals }}</span>
    </div>
  </div>
</template>

<style scoped>
.scorer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #f2f2f2;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.rank {
  font-weight: 700;
  color: #adb5bd;
  width: 25px;
  font-size: 0.85rem;
}

.image-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #eee;
}

.player-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.player-name {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #333;
}

.goals-column {
  width: 60px;
  text-align: center;
}

.goals-value {
  font-weight: 800;
  font-size: 1.1rem;
  color: #001f3f;
}
</style>