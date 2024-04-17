<template>
  <div class="team-card">
    <h2 class="team-card__name">{{ team.teamName }}</h2>
    <div class="team-card__players">
      <div class="team-card__player-container" v-for="p in team.players" :key="p.id">
        <div class="team-card__p-header">
          <img class="team-card__p-img" :src="p.avatar_url" />
          <p :style="{ margin: '0px' }">{{ p.username }}</p>
          <img
            class="team-card__p-flag"
            :src="`https://flagcdn.com/${p.country_code.toLowerCase()}.svg`"
          />
        </div>
        <p class="team-card__p-rank">#{{ p.global_rank }}</p>
        <p class="team-card__p-discord">
          <v-icon name="fa-discord" />{{ p.discordUsername ? p.discordUsername : 'Unknown' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '@/Types'

interface Props {
  team: Team
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.team-card {
  background-color: var(--bg3);
  border-radius: var(--base-border-radius);
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__name {
    margin: 5px 0px;
  }

  &__players {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
  }

  &__player-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
  }

  &__p-header {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }

  &__p-img,
  &__p-flag {
    width: 20px;
    height: 20px;
  }

  &__p-rank,
  &__p-discord {
    color: #aaaaaa;
    margin: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-size: 12px;
  }
}
</style>
