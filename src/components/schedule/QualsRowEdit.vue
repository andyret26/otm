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
    <SelectBox
      :options="['None', ...staff.map((s) => s.username)]"
      :label="'Add referee'"
      @selected="handleRefAdd"
      v-model="selectedRef"
    />

    <InputField v-model="participantSearch" label="Add participant" />
  </div>
</template>

<script setup lang="ts">
import type { Player, QualifierSchedule, Staff, Team } from '@/Types'
import IconBtn from '../common/IconBtn.vue'
import SelectBox from '../common/SelectBox.vue'
import { ref } from 'vue'
import InputField from '../common/InputField.vue'

interface Props {
  qualsSchedule: QualifierSchedule
  staff: Staff[]
  participants: Player[] | Team[]
  handleRefAdd: (qualId: number) => void
}

defineProps<Props>()
defineEmits(['closeClicked'])

const selectedRef = ref<string>('None')
const participantSearch = ref<string>('')
</script>

<style scoped lang="scss">
.quals-row-edit {
  box-sizing: border-box;
  position: absolute;
  top: 125px;
  transform: translateX(-50%);
  left: 50%;
  width: 300px;
  height: 300px;
  background-color: var(--bg2);
  border-radius: var(--base-border-radius);
  box-shadow: var(--boxshadow-white);
  z-index: 5;
  display: flex;

  flex-direction: column;
  gap: 10px;
  padding: 20px;

  &__close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
