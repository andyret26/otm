<template>
  <div class="map-card-header">
    <div class="map-card-header__add" v-if="showBtns"></div>
    <div class="map-card-header__map-id">Id</div>
    <div class="map-card-header__mod">Mod</div>

    <div class="map-card-header__banner-wrapper">Banner</div>

    <div class="map-card-header__title">Artist - Name [Diff]</div>

    <div class="map-card-header__field3 map-card-header__field">
      <span class="map-card-header__sr">SR</span>
      |
      <span class="map-card-header__bpm">BPM</span>
      |
      <span class="map-card-header__length">Time</span>
    </div>

    <div class="map-card-header__field2 map-card-header__field">
      <span class="map-card-header__cs">CS</span>
      |
      <span class="map-card-header__ar">AR</span>
      |
      <span class="map-card-header__od">OD</span>
    </div>

    <div class="map-card-header__mapper">Mapper</div>
    <div class="map-card-header__notes">Comment</div>
    <div class="map-card-header__remove" v-if="showBtns"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showBtns?: boolean
}

withDefaults(defineProps<Props>(), {
  showBtns: false
})
</script>

<style scoped lang="scss">
.map-card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  font-weight: 900;
  border-radius: var(base-border-radius);
  max-width: 1080px;
  min-width: 1080px;

  &__add {
    width: 50px;
    text-align: center;
  }

  &__map-id {
    width: 20px;
    text-align: center;
  }

  &__mod {
    width: 50px;
    height: 25px;
    border-radius: var(base-border-radius);
    text-align: center;
    font-weight: 900;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__banner-wrapper {
    width: 180px;
    height: 25px;
    border-radius: var(base-border-radius);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__banner-img {
    width: 100%;
    height: 100%;
    border-radius: var(base-border-radius);
  }

  &__title {
    width: 350px;

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

  &__remove {
    width: 50px;
    text-align: center;
  }
}
</style>
