<template>
  <div class="select" :style="{ maxWidth: props.maxWidth }">
    <label
      class="select__label"
      v-if="label"
      for="select"
      :style="{ color: disabled ? 'lightgray' : 'white' }"
      >{{ label }}</label
    >
    <select
      class="select__field"
      name="select"
      id="select"
      v-model="model"
      :disabled="disabled"
      :style="{ height: height }"
    >
      <option class="select__option" v-for="option in options" :value="option" :key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  options: string[]
  disabled?: boolean
  label?: string
  maxWidth?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  maxWidth: '200px',
  height: '40px'
})
const model = defineModel()
</script>

<style scoped lang="scss">
.select {
  width: 100%;
  &__label {
    font-size: 16px;
    margin-left: 5px;
  }
  &__field {
    width: 100%;
    margin-top: 5px;
    background-color: var(--bg3);
    color: inherit;
    border: none;
    border-radius: var(--base-border-radius);
    padding: 10px;
    font-size: 16px;
    font-family: inherit;
  }
}
</style>
