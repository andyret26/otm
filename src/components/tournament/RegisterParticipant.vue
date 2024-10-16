<template>
  <div class="register">
    <InputField
      v-if="props.tournament.isTeamTourney"
      class="register__team-name"
      v-model="teamName"
      placeholder="Team name"
      label="Team name"
      :max-text-length="25"
    />
    <div class="register__player-inputs" v-for="(pi, i) in playerInputs" :key="i">
      <p class="register__player-label">Player {{ i + 1 }}</p>
      <div class="register__player-fields">
        <InputField :error="userIdErrors[i]" v-model="pi.osuUserId" placeholder="Osu user id" />
        <InputField v-model="pi.discordUsername" placeholder="Discord username" />
      </div>
    </div>

    <ButtonComp
      v-if="tournament.isTeamTourney"
      btn-text="Register"
      color="green"
      text-color="black"
      @click="handleRegisterTeam"
      :disabled="regBtnDisabled"
    />

    <ButtonComp
      v-else
      btn-text="Register"
      color="green"
      text-color="black"
      @click="handleRegisterPlayer"
      :disabled="regBtnDisabled"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlayerRegister, ResponseError, Tournament } from '@/Types'
import InputField from '../common/InputField.vue'
import { onMounted, ref, watch } from 'vue'
import ButtonComp from '../common/ButtonComp.vue'
import { registerPlayer, registerTeam } from '@/Api/OtmApi'
import type { AxiosError } from 'axios'
import { useToast } from 'vue-toastification'

interface Props {
  tournament: Tournament
}
const props = defineProps<Props>()
const emit = defineEmits(['team-reg-success', 'player-reg-success'])
const toast = useToast()

const teamName = ref('')
const playerInputs = ref<PlayerRegister[]>([])
const regBtnDisabled = ref(false)
const userIdErrors = ref<boolean[]>([])

onMounted(() => {
  for (let i = 0; i < props.tournament.maxTeamSize; i++) {
    playerInputs.value?.push({
      osuUserId: '',
      discordUsername: ''
    })

    userIdErrors.value.push(false)
  }
  console.log(userIdErrors)
})

watch(
  playerInputs,
  () => {
    playerInputs.value.forEach((v, i) => {
      if (v.osuUserId === '') userIdErrors.value[i] = false
      else if (isNaN(parseInt(v.osuUserId))) userIdErrors.value[i] = true
      else userIdErrors.value[i] = false
    })
  },
  { deep: true }
)

const handleRegisterTeam = async () => {
  regBtnDisabled.value = true
  playerInputs.value = playerInputs.value.map((pi) => {
    return {
      ...pi,
      osuUserId: pi.osuUserId
    }
  })

  if (props.tournament.isTeamTourney) {
    try {
      const resp = await registerTeam({
        tournamentId: props.tournament.id,
        teamName: teamName.value,
        players: playerInputs.value
      })
      toast.success('Team registered successfully')
      emit('team-reg-success', resp.data.teams)
    } catch (e) {
      const err = e as AxiosError<ResponseError>
      toast.error(err.response?.data.detail)
    } finally {
      regBtnDisabled.value = false
    }
  }
}

const handleRegisterPlayer = async () => {
  regBtnDisabled.value = true

  try {
    const resp = await registerPlayer(props.tournament.id, {
      osuUserId: playerInputs.value[0].osuUserId,
      discordUsername: playerInputs.value[0].discordUsername
    })
    toast.success('Player registered successfully')
    emit('player-reg-success', resp.data)
  } catch (e) {
    var err = e as AxiosError<ResponseError>
    toast.error(err.response?.data.detail)
  } finally {
    regBtnDisabled.value = false
  }
}
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
