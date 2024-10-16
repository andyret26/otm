<template>
  <div class="contextmenu" :style="{ top: props.top + 'px', left: props.left + 'px' }">
    <button
      class="contextmenu__delete contextmenu__button"
      style="stroke-width: 2"
      @click="() => emit('deleteClicked')"
    >
      <v-icon name="oi-trash" style="stroke-width: 5" />
      <p>Delete</p>
    </button>
    <button
      class="contextmenu__edit contextmenu__button"
      style="stroke-width: 2"
      @click="() => emit('editClicked')"
    >
      <v-icon name="fa-edit" style="stroke-width: 5" />
      <p>Edit</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

interface Props {
  top: number
  left: number
  outsideClick: () => void
}

const props = defineProps<Props>()
const emit = defineEmits(['deleteClicked', 'editClicked'])

onMounted(() => {
  document.addEventListener('click', props.outsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', props.outsideClick)
})
</script>

<style scoped lang="scss">
.contextmenu {
  position: absolute;
  width: 150px; /* Adjust the size as needed */
  padding: 5px 0px;
  background-color: #fff; /* White background */
  border-radius: 5px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow effect */
  position: absolute;
  z-index: 1000; /* Ensure it appears above other content */

  &__button {
    font-weight: 900;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: unset;
    border: none;
  }

  &__delete {
    &:hover {
      background-color: var(--osu-red);
      color: white;
    }
  }

  &__edit {
    &:hover {
      background-color: var(--osu-blue);
      color: white;
    }
  }
}
</style>
