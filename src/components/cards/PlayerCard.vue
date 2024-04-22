<template>
  <div class="player">
    <div class="player__header">
      <img class="player__img" :src="p.avatar_url" />
      <p :style="{ margin: '0px' }">{{ p.username }}</p>
      <img class="player__flag" :src="`https://flagcdn.com/${p.country_code.toLowerCase()}.svg`" />
    </div>
    <p class="player__rank">#{{ p.global_rank }}</p>
    <p class="player__discord">
      <v-icon name="fa-discord" />{{ p.discordUsername ? p.discordUsername : 'Unknown' }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@/Types'

interface Props {
  p: Player
}
defineProps<Props>()
</script>

<style scoped lang="scss">
.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background-color: var(--bg3);
  border-radius: var(--base-border-radius);
  padding: 10px;
  font-size: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }

  &__img,
  &__flag {
    width: 20px;
    border-radius: 999999px;
  }

  &__rank,
  &__discord {
    color: #aaaaaa;
    margin: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 12px;
  }
}
</style>
