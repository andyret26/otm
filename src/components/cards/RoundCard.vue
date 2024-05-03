<template>
  <div class="round-card">
    <h2 class="round-card__name">{{ round.name }}</h2>
    <div class="round-card__links">
      <RouterLink :to="`/tournament/${tournamentId}/round/${round.id}/mappool`">
        <ButtonComp btn-text="Mappool" color="blue" />
      </RouterLink>
      <RouterLink :to="`/tournament/${tournamentId}/round/${round.id}/stats`">
        <ButtonComp btn-text="Stats" color="brown" />
      </RouterLink>
      <RouterLink :to="`/tournament/${tournamentId}/round/${round.id}/schedule`">
        <ButtonComp btn-text="Schedule" color="blue" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Round } from '@/Types'
import ButtonComp from '../common/ButtonComp.vue'

interface Props {
  round: Round
  tournamentId: number
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.round-card {
  text-align: center;
  min-width: 300px;
  background-color: var(--bg3);
  padding: 15px 0px;

  display: flex;
  flex-direction: column;
  gap: 15px;

  &__name {
    margin: 0;
  }

  &__links {
    display: flex;
    justify-content: space-evenly;
  }
}
</style>
