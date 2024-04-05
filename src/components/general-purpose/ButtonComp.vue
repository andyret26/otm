<template>
  <button
    class="btn"
    :style="{ backgroundColor: `var(--osu-${props.color})`, color: props.textColor }"
  >
    {{ props.btnText }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  btnText: string
  color: 'purple' | 'blue' | 'green' | 'pink' | 'brown' | 'yellow'
  textColor: string
}

const props = defineProps<Props>()
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
}
</style>
