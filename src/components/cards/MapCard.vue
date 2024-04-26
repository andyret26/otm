<template>
  <div class="map-card">
    <p class="map-card__map-id">{{ map.id }}</p>
    <p class="map-card__mod" :style="{ backgroundColor: `var(--${map.mod.toLowerCase()}-color)` }">
      {{ map.mod }}
    </p>

    <div class="map-card__banner-wrapper">
      <img class="map-card__banner-img" :src="map.image" alt="banner" />
    </div>

    <a :href="map.url" class="map-card__title"
      >{{ map.artist }} - {{ map.name }} [{{ map.version }}]</a
    >

    <div class="map-card__field3 map-card__field">
      <span class="map-card__sr">{{ map.difficulty_rating }}</span>
      |
      <span class="map-card__bpm">{{ map.bpm.toFixed() }}</span>
      |
      <span class="map-card__length">{{ lengthInMin }}</span>
    </div>

    <div class="map-card__field2 map-card__field">
      <span class="map-card__cs">{{ map.cs }}</span>
      |
      <span class="map-card__ar">{{ map.ar }}</span>
      |
      <span class="map-card__od">{{ map.accuracy }}</span>
    </div>

    <p class="map-card__mapper">{{ map.mapper }}</p>
    <p class="map-card__notes">{{ map.notes }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Map } from '@/Types'
import { computed } from 'vue'

interface Props {
  map: Map
}
const props = defineProps<Props>()

const lengthInMin = computed(() => {
  const min = Math.floor(props.map.total_length / 60)
  const sec = props.map.total_length - 60 * min
  return `${min}:${sec.toString().padStart(2, '0')}`
})
</script>

<style scoped lang="scss">
.map-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: var(--bg3);
  width: fit-content;

  &__map-id {
    width: 20px;
    font-size: 11px;
    text-align: center;
    transform: rotate(-90deg);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__mod {
    width: 50px;
    height: 50px;
    border-radius: var(base-border-radius);
    text-align: center;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
  }

  &__banner-wrapper {
    width: 180px;
    height: 50px;
    border-radius: var(base-border-radius);
    background-color: var(--bg2);
  }

  &__banner-img {
    width: 100%;
    height: 100%;
    border-radius: var(base-border-radius);
  }

  &__title {
    width: 400px;
    max-width: 400px;
    min-width: 400px;

    font-weight: 900;
    text-align: center;
    padding: 0px 5px;
  }

  &__field {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__field3 {
    width: 150px;
  }

  &__field2 {
    width: 120px;
    background-color: var(--bg2);
  }

  &__sr,
  &__bpm,
  &__length {
    width: 45px;
    display: inline-block;
  }

  &__cs,
  &__ar,
  &__od {
    width: 30px;
    display: inline-block;
  }

  &__mapper {
    width: 100px;
    text-align: center;
  }

  &__notes {
    width: 100px;
    text-align: center;
  }
}
</style>
