<template>
  <div class="input">
    <input
      id="input"
      class="input__field"
      type="text"
      v-model="model"
      :placeholder="props.placeholder"
      autocomplete="off"
      :style="{ backgroundColor: props.bgColor }"
    />
    <div class="input__icon">
      <v-icon v-if="props.iconName" :name="props.iconName" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  iconName?: string
  bgColor?: string
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: 'var(--bg3)'
})
const model = defineModel()
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
