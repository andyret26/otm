<template>
  <RouterLink :to="`/tournament/${tournament.id}`" class="tournament-card">
    <p class="tournament-card__name">{{ tournament.name }}</p>
  </RouterLink>
</template>

<script setup lang="ts">
import type { DashboardTournament } from '@/Types'
import { RouterLink } from 'vue-router'

interface Props {
  tournament: DashboardTournament
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.tournament-card {
  background-color: var(--bg3);
  height: 75px;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--bg2);
  }
}
</style>
