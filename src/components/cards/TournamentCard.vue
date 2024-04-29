<template>
  <RouterLink :to="`/tournament/${tournament.id}`" class="tournament-card">
    <div class="tournament-card__format">
      <p>{{ tournament.format }}</p>
      <p v-if="tournament.isTeamTourney">Teams of {{ tournament.maxTeamSize }}</p>
    </div>
    <h2 class="tournament-card__name">{{ tournament.name }}</h2>
    <p class="tournament-card__rank-range">{{ tournament.rankRange }}</p>
  </RouterLink>
</template>

<script setup lang="ts">
import type { Tournament } from '@/Types'
import { RouterLink } from 'vue-router'

interface Props {
  tournament: Tournament
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.tournament-card {
  background-color: var(--bg3);
  height: 75px;
  min-height: 75px;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  padding: 0 40px;

  &:hover {
    background-color: var(--bg2);
  }

  &__format {
    white-space: nowrap;
    width: 80px;
  }
  &__rank-range {
    white-space: nowrap;
    width: 80px;
  }
}

@media screen and (max-width: 600px) {
  .tournament-card {
    flex-direction: column;
    height: auto;
    border-radius: var(--base-border-radius);
    &__format {
      order: 2;
    }
  }
}
</style>
