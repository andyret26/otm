<template>
  <button
    class="btn"
    :style="{
      backgroundColor: `var(--osu-${props.color})`,
      color: props.textColor,
      '--size': props.size + 'px'
    }"
  >
    <v-icon :name="props.iconName" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  iconName: string
  color: 'purple' | 'blue' | 'green' | 'pink' | 'brown' | 'yellow'
  textColor: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 35
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
}
</style>
