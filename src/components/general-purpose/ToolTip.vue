<template>
  <div class="tooltip">
    <slot></slot>
    <div class="tooltip__text">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
}

defineProps<Props>()
</script>

<style scoped lang="scss"></style>
