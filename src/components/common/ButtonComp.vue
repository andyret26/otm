<template>
  <button
    class="btn"
    :disabled="props.disabled"
    :style="{
      backgroundColor: `var(--osu-${props.color})`,
      color: props.textColor
    }"
  >
    {{ props.btnText }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  btnText?: string
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'brown' | 'yellow'
  textColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'purple',
  textColor: 'white',
  btnText: 'BtnText',
  disabled: false
})
</script>

<style scoped lang="scss">
.btn {
  font-weight: bolder;
  font-size: 16px;
  padding: 5px 10px;
  border: none;
  border-radius: var(--base-border-radius);

  &:hover {
    cursor: pointer;
    filter: grayscale(0.25);
  }

  &:active {
    filter: grayscale(0);
  }

  &:disabled {
    cursor: not-allowed;
    filter: grayscale(0.75);
  }
}
</style>
