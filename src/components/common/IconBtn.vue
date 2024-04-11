<template>
  <button
    class="btn"
    :style="{
      backgroundColor: `var(--osu-${props.color})`,
      color: props.textColor,
      '--size': props.size + 'px'
    }"
  >
    <v-icon :name="props.iconName" :scale="props.iconSize" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  iconName: string
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'brown' | 'yellow' | 'red'
  textColor?: string
  size?: number
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 35,
  iconSize: 1,
  color: 'blue',
  textColor: 'white'
})
</script>

<style scoped lang="scss">
.btn {
  --size: 35px;
  font-weight: bolder;
  font-size: 16px;

  height: var(--size);
  width: var(--size);

  padding: 5px 10px;
  border: none;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    filter: brightness(1.3);
  }

  &:active {
    filter: brightness(1.1);
  }
}
</style>
