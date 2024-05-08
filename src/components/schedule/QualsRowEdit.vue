<template>
  <div class="quals-row-edit">
    <IconBtn
      class="quals-row-edit__close-btn"
      @click="$emit('closeClicked')"
      icon-name="fa-times"
      :color="'red'"
      :size="20"
      :icon-size="0.75"
    />
  </div>
</template>

<script setup lang="ts">
import type { QualifierSchedule } from '@/Types'
import IconBtn from '../common/IconBtn.vue'

interface Props {
  qualsSchedule: QualifierSchedule
  handleRefAdd: (qualId: number) => void
}

defineProps<Props>()
defineEmits(['closeClicked'])
</script>

<style scoped lang="scss">
.quals-row-edit {
  position: absolute;
  top: 125px;
  width: 300px;
  height: 300px;
  background-color: var(--bg2);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: var(--base-border-radius);
  box-shadow: var(--boxshadow-white);
  z-index: 5;

  &__close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
