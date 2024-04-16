<template>
  <div class="register">
    <InputField
      v-if="props.tournament.isTeamTourney"
      class="register__team-name"
      v-model="teamName"
      placeholder="Team name"
      label="Team name"
    />
    <div class="register__player-inputs" v-for="(pi, i) in playerInputs" :key="i">
      <p class="register__player-label">Player {{ i + 1 }}</p>
      <div class="register__player-fields">
        <InputField v-model="pi.osuUserId" placeholder="Osu user id" />
        <InputField v-model="pi.discordUsername" placeholder="Discord username" />
      </div>
    </div>

    <ButtonComp
      v-if="tournament.isTeamTourney"
      btn-text="Register"
      color="green"
      text-color="black"
      @click="handleRegisterTeam"
    />
    <ButtonComp
      v-else
      btn-text="Register"
      color="green"
      text-color="black"
      @click="handleRegisterPlayer"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlayerRegister, Tournament } from '@/Types'
import InputField from '../common/InputField.vue'
import { onMounted, ref } from 'vue'
import ButtonComp from '../common/ButtonComp.vue'
import { registerTeam } from '@/Api/OthApi'

interface Props {
  tournament: Tournament
}
const props = defineProps<Props>()

const teamName = ref('')
const playerInputs = ref<PlayerRegister[]>([])

onMounted(() => {
  for (let i = 0; i < props.tournament.maxTeamSize; i++) {
    playerInputs.value?.push({
      osuUserId: '',
      discordUsername: ''
    })
  }
})

const handleRegisterTeam = async () => {
  // convert osuUserIdToNumber
  playerInputs.value = playerInputs.value.map((pi) => {
    return {
      ...pi,
      osuUserId: Number(pi.osuUserId)
    }
  })

  if (props.tournament.isTeamTourney) {
    const resp = await registerTeam({
      tournamentId: props.tournament.id,
      teamName: teamName.value,
      players: playerInputs.value
    })

    if (resp.status === 200) {
      console.log('Team registered')
      //TODO: emit added team to parent component to update tournament data
    }
  }
}

const handleRegisterPlayer = () => {}
</script>

<style scoped lang="scss">
.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &__team-name {
    align-self: flex-start;
  }

  &__player-label {
    font-size: 15px;
    margin-bottom: 5px;
    font-weight: 900;
  }

  &__player-fields {
    display: flex;
    gap: 10px;
  }
}
</style>
