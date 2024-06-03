<template>
  <LoadingSpinner v-if="round === null" />
  <div v-else-if="round.mappool[0].playerStats.length <= 0">No stats</div>
  <div class="stats" v-else>
    <div class="stats__header">
      <div class="stats__header-tournament">{{ round.tournament.name }}</div>
      <div class="stats__header-round">{{ round.name }} stats admin</div>
    </div>
    <div class="stats__qualifies" v-if="round.isQualifier">
      <div>How many qualifies</div>
      <SelectBox
        :options="['Not Set', 'Top 2', 'Top 4', 'Top 8', 'Top 16', 'Top 32', 'Top 64']"
        v-model="selectedNumQualifies"
        max-width="125px"
      />
      <ButtonComp btn-text="Set" color="green" text-color="black" />
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
      class="stats__public-btn"
      title="Admin view"
      @click="handlePublicClick"
      icon-name="fa-globe"
      color="blue"
      text-color="white"
      :icon-size="1.2"
    />
  </div>
</template>

<script setup lang="ts">
import { mapStatsToTeamPlacements, mapStatsToUserPlacements } from '@/Utils/HelperFunctions'
import TeamStatsHeader from '@/components/stats/TeamStatsHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import type { Round, TeamPlacement, UserPlacement } from '@/Types'
import IconBtn from '@/components/common/IconBtn.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { getRound, isAuthorized } from '@/Api/OtmApi'
import { onMounted, ref } from 'vue'
import SelectBox from '@/components/common/SelectBox.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, idTokenClaims } = useAuth0()

const tourneyId = parseInt(route.path.split('/')[2])
const roundId = parseInt(route.path.split('/')[4])

const round = ref<Round | null>(null)
const userPlacements = ref<UserPlacement[]>([])
const teamPlacements = ref<TeamPlacement[]>([])
const isTeamTourney = ref(false)
const selectedNumQualifies = ref<string>('Not Set')

onMounted(async () => {
  if (
    !isAuthenticated.value ||
    !(await isAuthorized(idTokenClaims.value!.__raw, tourneyId, ['admin', 'host']))
  ) {
    router.push(`/tournament/${tourneyId}/round/${roundId}/stats`)
  }

  const resp = await getRound(roundId)
  round.value = resp.data

  selectedNumQualifies.value = round.value.tournament.howManyQualifies
    ? round.value.tournament.howManyQualifies
    : 'Not Set'

  userPlacements.value = mapStatsToUserPlacements(resp.data.mappool, tourneyId)

  if (isTeamTourney.value) {
    teamPlacements.value = mapStatsToTeamPlacements(resp.data.mappool)
  }
})

const handlePublicClick = async () => {
  router.push(`/tournament/${tourneyId}/round/${roundId}/stats`)
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

  &__public-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  &__qualifies {
    display: flex;
    margin: auto;
    align-items: center;
    text-align: center;
    gap: 10px;
    margin-bottom: 20px;
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
