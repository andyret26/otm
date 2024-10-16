<template>
  <div class="round-card" @contextmenu="handleRightClick">
    <h2 class="round-card__name">{{ round.name }}</h2>
    <div class="round-card__links">
      <RouterLink :to="`/tournament/${tournamentId}/round/${round.id}/mappool`">
        <ButtonComp btn-text="Mappool" color="blue" />
      </RouterLink>
      <RouterLink :to="`/tournament/${tournamentId}/round/${round.id}/stats`">
        <ButtonComp btn-text="Stats" color="brown" />
      </RouterLink>
      <RouterLink
        v-if="round.isQualifier"
        :to="`/tournament/${tournamentId}/round/${round.id}/quals-schedule`"
      >
        <ButtonComp btn-text="Schedule" color="blue" />
      </RouterLink>
      <RouterLink v-else :to="`/tournament/${tournamentId}/round/${round.id}/schedule`">
        <ButtonComp btn-text="Schedule" color="blue" />
      </RouterLink>
    </div>
    <ContextMenu
      v-if="contextMenuIsOpen"
      :top="contextPosTop"
      :left="contextPosLeft"
      :outside-click="
        () => {
          contextMenuIsOpen = false
        }
      "
      @delete-clicked="
        () => {
          console.log('deleteClicked' + round.id)
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { Round } from '@/Types'
import ButtonComp from '€/common/ButtonComp.vue'
import ContextMenu from '../common/ContextMenu.vue'
import { ref, watch } from 'vue'

interface Props {
  round: Round
  tournamentId: number
  currentContextId: number | null | undefined
}

const props = defineProps<Props>()
const emit = defineEmits(['contextOpen'])

const contextMenuIsOpen = ref<boolean>(false)
const contextPosTop = ref<number>(10)
const contextPosLeft = ref<number>(10)

const handleRightClick = (e: MouseEvent) => {
  e.preventDefault()
  contextPosTop.value = e.clientY
  contextPosLeft.value = e.clientX
  contextMenuIsOpen.value = true
  emit('contextOpen', props.round.id)
}

watch(
  () => props.currentContextId,
  (newId) => {
    if (newId !== props.round.id) contextMenuIsOpen.value = false
  }
)
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
