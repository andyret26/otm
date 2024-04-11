<template>
  <div>
    <h1>{{ team.teamName }}</h1>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '@/Types'

interface Props {
  team: Team
}

defineProps<Props>()
</script>

<style scoped></style>
