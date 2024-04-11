<template>
  <div class="input">
    <input
      id="input"
      class="input__field"
      type="text"
      v-model="model"
      :placeholder="props.placeholder"
      autocomplete="off"
      :style="{
        backgroundColor: props.bgColor,
        outline: validTextLength ? 'none' : '2px solid var(--osu-red)'
      }"
    />
    <div class="input__icon">
      <v-icon v-if="props.iconName" :name="props.iconName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  placeholder?: string
  iconName?: string
  bgColor?: string
  maxTextLength?: number
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: 'var(--bg3)'
})
const model = defineModel()

const validTextLength = computed<boolean>(() => {
  const modelText = model.value as string

  if (props.maxTextLength && modelText.length > props.maxTextLength) {
    return false
  }
  return true
})
</script>

<style scoped lang="scss">
.input {
  display: flex;
  align-items: center;
  max-width: 200px;
  position: relative;
  border-radius: var(--base-border-radius);

  &__field {
    border: none;
    color: inherit;
    width: 100%;
    padding: 10px 30px 10px 10px;
    border-radius: var(--base-border-radius);

    &:focus {
      outline: 1px solid #6b575e;
    }
  }

  &__icon {
    position: absolute;
    right: 10px;
  }
}
</style>
