<template>
  <LoadingSpinner v-if="round === null" />
  <div v-else-if="round.mappool[0].playerStats.length <= 0">No stats</div>
  <div class="stats" v-else>
    <div class="stats__header">
      <div class="stats__header-tournament">{{ round.tournament.name }}</div>
      <div class="stats__header-round">{{ round.name }} stats</div>
    </div>
    <div class="stats__players" v-if="!isTeamTourney">
      <TeamStatsHeader />

      <div class="stats__players-container">
        <div class="stats__players-row" v-for="(user, i) in userPlacements" :key="user.username">
          <div class="stats__players-row-seed">{{ i + 1 }}</div>
          <div class="stats__players-row-name">{{ user.username }}</div>
          <div class="stats__players-row-norm">{{ user.totalNormScore }}</div>
          <div class="stats__players-row-avg-placement">{{ user.avgPlacement }}</div>
          <div class="stats__players-row-avg-score">{{ user.avgScore.toLocaleString() }}</div>
        </div>
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

    <IconBtn
      class="stats__admin-btn"
      v-if="isAuthenticated"
      title="Admin view"
      @click="handleAdminClick"
      icon-name="md-adminpanelsettings"
      color="brown"
      text-color="black"
      :icon-size="1.2"
    />
  </div>
</template>

<script setup lang="ts">
import { mapStatsToTeamPlacements, mapStatsToUserPlacements } from '@/Utils/HelperFunctions'
import TeamStatsHeader from '@/components/stats/TeamStatsHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import IconBtn from '@/components/common/IconBtn.vue'
import type { Round, TeamPlacement, UserPlacement } from '@/Types'
import { useAuth0 } from '@auth0/auth0-vue'
import { getRound } from '@/Api/OtmApi'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth0()

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

const handleAdminClick = () => {
  router.push(`/tournament/${tourneyId}/round/${roundId}/stats/admin`)
}
</script>

<style scoped lang="scss">
.stats {
  position: relative;
  display: flex;
  flex-direction: column;

  max-height: calc(100vh - 110px);
  padding: 20px;
  max-width: 1000px;

  margin: auto;

  &__admin-btn {
    position: absolute;
    top: 20px;
    right: 20px;
  }

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

  &__teams,
  &__players {
    display: flex;
    flex-direction: column;
    margin: auto;
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
