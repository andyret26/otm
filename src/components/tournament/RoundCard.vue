<template>
  <div class="round">round</div>
</template>

<script setup lang="ts">
import type { Round } from '@/Types'

interface Props {
  round: Round
}

defineProps<Props>()
</script>

<style scoped></style>
