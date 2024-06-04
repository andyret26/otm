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
      <ButtonComp
        @click="handleUpdateClick"
        btn-text="Update"
        color="green"
        text-color="black"
        :disabled="btnDisabled"
      />
    </div>
    <div class="stats__players" v-if="!isTeamTourney">
      <TeamStatsHeader />

      <div class="stats__players-container">
        <div
          class="stats__players-row"
          :style="user.isKnockedOut ? { backgroundColor: 'var(--osu-red)' } : ''"
          v-for="(user, i) in userPlacements"
          :key="user.username"
        >
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
        <div
          class="stats__teams-row"
          :style="team.isKnockedOut ? { backgroundColor: 'var(--osu-red)' } : ''"
          v-for="(team, i) in teamPlacements"
          :key="team.teamName"
        >
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
import type { ResponseError, Round, TeamPlacement, UserPlacement } from '@/Types'
import IconBtn from '@/components/common/IconBtn.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { getRound, isAuthorized, knockout, setSeeds } from '@/Api/OtmApi'
import { onMounted, ref } from 'vue'
import SelectBox from '@/components/common/SelectBox.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, idTokenClaims } = useAuth0()
const toast = useToast()

const tourneyId = parseInt(route.path.split('/')[2])
const roundId = parseInt(route.path.split('/')[4])

const round = ref<Round | null>(null)
const userPlacements = ref<UserPlacement[]>([])
const teamPlacements = ref<TeamPlacement[]>([])
const isTeamTourney = ref(false)
const selectedNumQualifies = ref<string>('Not Set')

const btnDisabled = ref(false)

onMounted(async () => {
  if (
    !isAuthenticated.value ||
    !(await isAuthorized(idTokenClaims.value!.__raw, tourneyId, ['admin', 'host']))
  ) {
    router.push(`/tournament/${tourneyId}/round/${roundId}/stats`)
    return
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

const handleUpdateClick = async () => {
  console.log(userPlacements.value.slice(-1))

  btnDisabled.value = true
  const howManyQualsNum = parseInt(selectedNumQualifies.value.split(' ')[1])
  if (
    (isTeamTourney.value && howManyQualsNum > teamPlacements.value.length) ||
    (!isTeamTourney.value && howManyQualsNum > userPlacements.value.length)
  ) {
    toast.error('Cannot qualify more than the number of teams/players')
    btnDisabled.value = false
    return
  }

  const playerSeeds = isTeamTourney.value
    ? undefined
    : userPlacements.value.map((u, i) => {
        return {
          id: u.playerId,
          seed: i + 1
        }
      })

  const teamSeeds = isTeamTourney.value
    ? teamPlacements.value.map((t, i) => {
        return {
          id: t.teamId,
          seed: i + 1
        }
      })
    : undefined

  const playersToKnockout = isTeamTourney.value
    ? undefined
    : userPlacements.value.length - howManyQualsNum === 0
      ? []
      : userPlacements.value
          .slice(-(userPlacements.value.length - howManyQualsNum))
          .map((u) => u.playerId)

  const teamsToKnockout = !isTeamTourney.value
    ? undefined
    : teamPlacements.value.length - howManyQualsNum === 0
      ? []
      : teamPlacements.value
          .slice(-(teamPlacements.value.length - howManyQualsNum))
          .map((t) => t.teamId)

  try {
    await setSeeds(
      {
        HowManyQualifies: selectedNumQualifies.value,
        isTeamTourney: isTeamTourney.value,
        tournamentId: tourneyId,
        PlayerSeeds: playerSeeds,
        TeamSeeds: teamSeeds
      },
      idTokenClaims.value!.__raw
    )

    await knockout(
      {
        tournamentId: tourneyId,
        isTeamTourney: isTeamTourney.value,
        playerIds: playersToKnockout,
        teamIds: teamsToKnockout
      },
      idTokenClaims.value!.__raw
    )

    if (isTeamTourney.value) {
      teamPlacements.value.forEach((t) => {
        if (teamsToKnockout!.includes(t.teamId)) t.isKnockedOut = true
        else t.isKnockedOut = false
      })
    } else {
      userPlacements.value.forEach((p) => {
        if (playersToKnockout!.includes(p.playerId)) p.isKnockedOut = true
        else p.isKnockedOut = false
      })
    }

    toast.success('Seeds and knockouts updated')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response!.data.detail)
  } finally {
    btnDisabled.value = false
  }
}

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
      background-color: var(--bg3);

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

      &:nth-child(even) {
        filter: contrast(1.15);
      }
    }
  }
}
</style>
