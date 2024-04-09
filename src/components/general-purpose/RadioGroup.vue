<template>
  <div class="radio-group">
    <legend v-if="label" class="radio-group__label">{{ label }}</legend>
    <div class="radio-group__fields">
      <div
        class="radio-group__field"
        v-for="option in options"
        :key="option.label"
        tabindex="0"
        @keypress="(e) => handleFieldKeypress(e, option)"
      >
        <input
          class="radio-group__input"
          :id="`${id}-${option.value}`"
          :name="id"
          type="radio"
          @change="updateValue(option)"
          :checked="value === option.value"
        />
        <label class="radio-group__input-label" :for="`${id}-${option.value}`">
          {{ option.label }}
        </label>
        <span class="radio-group__checkbox" type="button"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RadioOption } from '@/Types'
interface Props {
  id: string
  label?: string
  value: string
  options: RadioOption[]
}
defineProps<Props>()

const emit = defineEmits(['change'])

const updateValue = (newValue: RadioOption) => {
  emit('change', newValue)
}

const handleFieldKeypress = (e: KeyboardEvent, option: RadioOption) => {
  if (e.key === 'Enter') {
    updateValue(option)
  }
}
</script>

<style scoped lang="scss">
.radio-group {
  &__label {
    margin-bottom: 5px;
    font-weight: 900;
    font-size: 16px;
  }
  &__fields {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 5px;
    position: relative;

    &:focus-visible {
      outline: none;
    }
  }

  &__checkbox {
    box-sizing: border-box;
    position: absolute;
    width: 15px;
    height: 15px;
    padding: 2px;
    background-color: var(--bg3);
    border-radius: 999999px;
    border: 2px solid var(--osu-pink);
  }

  &__input {
    display: none;
  }
  &__input-label {
    cursor: pointer;
    padding-left: 20px;
    z-index: 3;
  }
}

.radio-group__field .radio-group__input:checked ~ .radio-group__checkbox {
  background-color: var(--osu-pink);
}
.radio-group__input-label:hover + .radio-group__checkbox {
  background-color: var(--bg1);
}
</style>
