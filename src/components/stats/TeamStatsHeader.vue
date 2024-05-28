<template>
  <div class="team-stats-header">
    <div class="team-stats-header__seed">Seed</div>
    <div class="team-stats-header__name">Name</div>
    <div class="team-stats-header__norm">N-Score</div>
    <div class="team-stats-header__avg-placement">Avg. Place</div>
    <div class="team-stats-header__avg-score">Avg. Score</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.team-stats-header {
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  line-height: 16px;
  width: 500px;
  top: 0;
  background-color: var(--bg1);

  &__seed {
    width: 40px;
  }

  &__name {
    width: 200px;
  }

  &__norm {
    width: 75px;
  }

  &__avg-placement {
    width: 40px;
  }

  &__avg-score {
    width: 100px;
  }
}
</style>
