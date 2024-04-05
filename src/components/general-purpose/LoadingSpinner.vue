<template>
  <div class="spinner" role="status"></div>
</template>

<style scoped lang="scss">
@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}
.spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  vertical-align: -0.125em;
  color: var(--osu-purple);
  border: 0.25em solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: 0.75s linear infinite spinner-border;
  animation: 0.75s linear infinite spinner-border;
}
</style>
