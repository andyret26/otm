<template>
  <div class="tournament">
    <LoadingSpinner v-if="!tournament" />
    <div v-else class="tournament__container">
      <div class="tournament__header">
        <h1 class="tournament__header-text">{{ tournament?.name }}</h1>
        <div class="tournament__header-btns">
          <ButtonComp
            btn-text="Rounds"
            @click="(e) => handleBtnClick(e)"
            :color="activeBtn === 'Rounds' ? 'pink' : 'purple'"
          />
          <ButtonComp
            :btn-text="tournament!.isTeamTourney ? 'Teams' : 'Players'"
            @click="(e) => handleBtnClick(e)"
            :color="activeBtn === 'Teams' || activeBtn === 'Players' ? 'pink' : 'purple'"
          />
          <ButtonComp
            btn-text="Staff"
            @click="(e) => handleBtnClick(e)"
            :color="activeBtn === 'Staff' ? 'pink' : 'purple'"
          />
          <ButtonComp
            btn-text="Register"
            @click="(e) => handleBtnClick(e)"
            :color="activeBtn === 'Register' ? 'pink' : 'purple'"
          />
        </div>
      </div>

      <div class="tournament__devider"></div>

      <div v-if="activeBtn === 'Rounds'" class="tournament__tab-container">
        <p v-if="tournament.rounds.length <= 0">No Rounds</p>
        <IconBtn
          v-if="isAuthenticated"
          icon-name="fa-plus"
          color="green"
          text-color="black"
          title="Add round"
          @click="showCreateRound = true"
        />
        <div class="tournament__round-cards">
          <RoundCard
            v-for="round in tournament.rounds"
            :key="round.id"
            :round="round"
            :tournament-id="tournament.id"
          />
        </div>

        <CreateRound
          v-if="showCreateRound"
          @closeClicked="showCreateRound = false"
          :tournament-id="tournament.id"
          @roundCreated="handleRoundCreated"
        />
      </div>

      <div v-else-if="activeBtn === 'Teams'" class="tournament__tab-container">
        <p v-if="tournament.teams.length <= 0">No Teams</p>
        <div class="tournament__cards-container">
          <TeamCard v-for="team in tournament.teams" :key="team.id" :team="team" />
        </div>
      </div>

      <div v-else-if="activeBtn === 'Players'" class="tournament__tab-container">
        <p v-if="tournament.players.length <= 0">No Players</p>
        <div class="tournament__cards-container">
          <PlayerCard
            v-for="player in tournament.players"
            :key="player.playerId"
            :p="player.player"
          />
        </div>
      </div>

      <div v-else-if="activeBtn === 'Staff'" class="tournament__tab-container">
        <p v-if="tournament.staff.length <= 0">No Staff</p>
      </div>
      <div v-else-if="activeBtn === 'Register'">
        <RegisterParticipant
          :tournament="tournament"
          @team-reg-success="handleTeamRegSuccess"
          @player-reg-success="handlePlayerRegSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegisterParticipant from '@/components/tournament/RegisterParticipant.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CreateRound from '@/components/tournament/CreateRound.vue'
import type { Player, Round, Team, Tournament } from '@/Types'
import TeamCard from '@/components/tournament/TeamCard.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import PlayerCard from '@/components/cards/PlayerCard.vue'
import RoundCard from '@/components/cards/RoundCard.vue'
import IconBtn from '@/components/common/IconBtn.vue'
import { useRoute, useRouter } from 'vue-router'
import { getTournamentById } from '@/Api/OtmApi'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth0()

const tournament = ref<Tournament | null>(null)
const activeBtn = ref<string>('Rounds')
const showCreateRound = ref<boolean>(false)

onMounted(async () => {
  tournament.value = await getTournamentById(parseInt(route.path.split('/')[2]))
  tournament.value.rounds = tournament.value.rounds.reverse()
  activeBtn.value = route.hash.replace('#', '') || 'Rounds'
})

const handleBtnClick = (e: MouseEvent) => {
  const target = e.target as HTMLButtonElement
  activeBtn.value = target.innerText
  router.push({ hash: '#' + target.innerText })
}

const handleTeamRegSuccess = (teams: Team[]) => {
  tournament.value!.teams = teams
}

const handlePlayerRegSuccess = (player: Player) => {
  tournament.value!.players.push({
    player,
    isknockout: false,
    playerId: player.id,
    tournament: tournament.value!,
    tournamentId: tournament.value!.id
  })
}

const handleRoundCreated = (round: Round) => {
  tournament.value!.rounds = [round, ...tournament.value!.rounds]
  showCreateRound.value = false
}
</script>

<style scoped lang="scss">
.tournament {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  &__container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
  }

  &__header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__header-text {
    text-align: center;
  }

  &__header-btns {
    display: flex;
    gap: 10px;
  }

  &__devider {
    width: 100%;
    height: 2px;
    background-color: var(--osu-yellow);
  }

  &__cards-container {
    min-width: 340px;
    max-width: 1080px;
    max-height: 70vh;
    overflow-y: auto;
    margin: 0px 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }

  &__tab-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  &__round-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    max-width: 1080px;
  }
}
</style>
