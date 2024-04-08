<template>
  <div>
    <h3>a tournament view</h3>
  </div>
</template>

<script setup lang="ts">
import type { DashboardTournament } from '@/Types'

interface Props {
  tournament: DashboardTournament
}

defineProps<Props>()
</script>

<style scoped lang="scss"></style>
