<template>
  <RouterLink :to="`/tournament/${tournament.id}`" class="tournament-card">
    <div class="tournament-card__format">
      <div class="tournament-card__format-field">{{ tournament.format }}</div>
      <div class="tournament-card__format-field" v-if="tournament.isTeamTourney">
        Teams of {{ tournament.maxTeamSize }}
      </div>
    </div>
    <div class="tournament-card__name">{{ tournament.name }}</div>
    <div class="tournament-card__rank-range">{{ tournament.rankRange }}</div>
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
  max-height: 75px;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  padding: 0px 0px;

  &:hover {
    background-color: var(--bg2);
  }

  &__name {
    white-space: nowrap;
    font-size: 24px;
    font-weight: 900;
    width: 250px;
    text-wrap: wrap;
  }

  &__format {
    white-space: nowrap;
    width: 90px;
  }
  &__rank-range {
    white-space: nowrap;
    width: 90px;
  }
}

@media screen and (max-width: 600px) {
  .tournament-card {
    border-radius: var(--base-border-radius);
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 140px;
    padding: 10px;

    &__format {
      order: 2;
    }
  }
}
</style>
