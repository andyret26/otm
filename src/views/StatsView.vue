<template>
  <LoadingSpinner v-if="round === null" />
  <div v-else-if="round.mappool[0].playerStats.length <= 0">No stats</div>
  <div class="stats" v-else>
    <div class="stats__header">
      <div class="stats__header-tournament">{{ round.tournament.name }}</div>
      <div class="stats__header-round">{{ round.name }} stats</div>
    </div>
    <div class="stats__players" v-if="!isTeamTourney">
      <div class="stats__players-row" v-for="user in userPlacements" :key="user.username">
        <div>{{ user.username }}</div>
        <div>{{ user.totalNormScore }}</div>
        <div>{{ user.isKnockedOut }}</div>
      </div>
    </div>
    <div class="stats__teams" v-else>
      <TeamStatsHeader />
      <div class="stats__teams-container">
        <div class="stats__teams-row" v-for="(team, i) in teamPlacements" :key="team.teamName">
          <div class="stats__teams-row-seed">{{ i + 1 }}</div>
          <div class="stats__teams-row-name">{{ team.teamName }}</div>
          <div class="stats__teams-row-norm">{{ team.totalNormScore }}</div>
          <div class="stats__teams-row-avg-placement">{{ team.avgPlacement }}</div>
          <div class="stats__teams-row-avg-score">
            {{ team.avgScore.toLocaleString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRound } from '@/Api/OtmApi'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Round, TeamPlacement, UserPlacement } from '@/Types'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { mapStatsToTeamPlacements, mapStatsToUserPlacements } from '@/Utils/HelperFunctions'
import TeamStatsHeader from '@/components/stats/TeamStatsHeader.vue'
const route = useRoute()
const tourneyId = parseInt(route.path.split('/')[2])
const roundId = parseInt(route.path.split('/')[4])

const round = ref<Round | null>(null)
const userPlacements = ref<UserPlacement[]>([])
const teamPlacements = ref<TeamPlacement[]>([])
const isTeamTourney = ref(false)

onMounted(async () => {
  const resp = await getRound(roundId)
  round.value = resp.data
  isTeamTourney.value = resp.data.tournament.isTeamTourney

  userPlacements.value = mapStatsToUserPlacements(resp.data.mappool, tourneyId)
  if (isTeamTourney.value) {
    teamPlacements.value = mapStatsToTeamPlacements(resp.data.mappool)
  }
})
</script>

<style scoped lang="scss">
.stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: calc(100vh - 110px);

  margin: 20px;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;

    &-tournament {
      font-size: 24px;
    }

    &-round {
      font-size: 20px;
    }
  }

  &__players {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-row {
      display: flex;
      justify-content: space-between;
    }
  }

  &__teams {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: auto;
    max-width: 100%;

    &-container {
      display: flex;
      flex-direction: column;
      gap: 5px;

      width: 520px;
    }

    &-row {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      text-align: center;
      width: 500px;

      &-seed {
        min-width: 40px;
      }

      &-name {
        min-width: 200px;
      }

      &-norm {
        min-width: 75px;
      }

      &-avg-placement {
        min-width: 40px;
      }

      &-avg-score {
        min-width: 100px;
      }

      &:nth-child(odd) {
        background-color: var(--bg2);
      }
      &:nth-child(even) {
        background-color: var(--bg3);
      }
    }
  }
}
</style>
