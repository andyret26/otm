<template>
  <div class="input" :style="{ maxWidth: props.maxWidth }">
    <label class="input__label" v-if="label" :for="id">{{ label }}</label>
    <input
      :id="id"
      class="input__field"
      type="text"
      v-model="model"
      :placeholder="props.placeholder"
      autocomplete="off"
      :style="{
        backgroundColor: props.bgColor,
        outline: validTextLength ? 'none' : '2px solid var(--osu-red)',
        marginTop: label ? '5px' : '0'
      }"
    />
    <div class="input__icon">
      <v-icon v-if="props.iconName" :name="props.iconName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const id = 'input-' + Math.random().toString(36).substring(2, 9)

interface Props {
  placeholder?: string
  iconName?: string
  bgColor?: string
  maxTextLength?: number
  label?: string
  maxWidth?: string
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: 'var(--bg3)',
  maxWidth: '200px'
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
  width: 100%;
  position: relative;
  border-radius: var(--base-border-radius);

  &__label {
    font-size: 15px;
    font-weight: 900;
  }

  &__field {
    box-sizing: border-box;
    border: none;
    color: inherit;
    width: 100%;
    padding: 10px 30px 10px 10px;
    border-radius: var(--base-border-radius);
    height: 40px;

    &:focus {
      outline: 1px solid #6b575e;
    }
  }

  &__icon {
    position: absolute;
    top: 25%;
    right: 10px;
  }
}
</style>
