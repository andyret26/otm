<template>
  <div class="team-card">
    <h2 class="team-card__name">{{ team.teamName }}</h2>
    <div class="team-card__players">
      <PlayerCard v-for="player in team.players" :key="player.id" :p="player" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '@/Types'
import PlayerCard from '@/components/cards/PlayerCard.vue'

interface Props {
  team: Team
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.team-card {
  background-color: var(--bg3);
  border-radius: var(--base-border-radius);
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__name {
    margin: 5px 0px;
  }

  &__players {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
  }
}
</style>
