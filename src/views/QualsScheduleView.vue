<template>
  <div class="schedule" v-if="round != null && tourney != null">
    <RouterLink :to="`/tournament/${tourney.id}`">
      <h1>{{ tourney!.name }}</h1>
    </RouterLink>
    <h2>{{ round!.name }} schedule</h2>
    <div
      class="schedule__add-extra"
      v-if="isAuthenticated && qualsSchedule !== null && qualsSchedule.length > 0"
    >
      <InputField v-model="ExDate" label="Date" placeholder="yyyy-MM-dd" />
      <InputField v-model="ExTime" label="Time" placeholder="hh:mm" />
      <ButtonComp
        class="schedule__add-extra-btn"
        @click="handleAddExtra"
        btn-text="Add extra time"
        color="green"
        text-color="black"
      />
    </div>
    <QualsSchedule
      v-if="qualsSchedule != null && qualsSchedule.length > 0"
      :quals-schedule="qualsSchedule"
      :is-team-tourney="tourney.teams.length > 0"
      @row-updated="handleRowUpdated"
    />
    <div class="schedule__generation" v-else-if="isAuthenticated">
      <div class="schedule__inputs">
        <InputField v-model="startDate" label="Start Date" placeholder="yyyy-MM-dd" />
        <InputField v-model="endDate" label="End Date" placeholder="yyyy-MM-dd" />
      </div>
      <ButtonComp @click="handleGenerateQuals" btn-text="Generate Schedule" />
    </div>
    <div v-else>No Schedule</div>
  </div>
</template>

<script setup lang="ts">
import {
  addQualsSchedule,
  generateQualsSchedule,
  getQualifierSchedule,
  getRound,
  getTournamentById
} from '@/Api/OtmApi'
import type { QsPost, QualifierSchedule, ResponseError, Round, Tournament } from '@/Types'
import { validDate, validTime } from '@/Utils/HelperFunctions'
import ButtonComp from '@/components/common/ButtonComp.vue'
import InputField from '@/components/common/InputField.vue'
import QualsSchedule from '@/components/schedule/QualsSchedule.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

const route = useRoute()
const { isAuthenticated, idTokenClaims } = useAuth0()
const toast = useToast()

const round = ref<Round | null>(null)
const tourney = ref<Tournament | null>(null)

const startDate = ref<string>('')
const endDate = ref<string>('')
const ExDate = ref<string>('')
const ExTime = ref<string>('')

const qualsSchedule = ref<QualifierSchedule[] | null>(null)

onMounted(async () => {
  const resp = await getRound(parseInt(route.path.split('/')[4]))
  const resp2 = await getTournamentById(parseInt(route.path.split('/')[2]))

  round.value = resp.data
  tourney.value = resp2

  qualsSchedule.value = (await getQualifierSchedule(round.value!.id)).data
})

const handleGenerateQuals = async () => {
  try {
    if (!validDate(startDate.value) || !validDate(endDate.value)) {
      toast.error('Invalid date format')
      return
    }
    const resp = await generateQualsSchedule(
      tourney.value!.id,
      round.value!.id,
      new Date(startDate.value!),
      new Date(endDate.value!),
      idTokenClaims.value!.__raw
    )
    qualsSchedule.value = resp.data
    toast.success('Schedule generated')
  } catch (e) {
    const err = e as AxiosError<ResponseError>
    toast.error(err.response?.data.detail)
  }
}

const handleRowUpdated = (updatedRow: QualifierSchedule) => {
  const index = qualsSchedule.value!.findIndex((qs) => qs.id === updatedRow.id)
  qualsSchedule.value![index] = updatedRow
}

const handleAddExtra = async () => {
  if (!validDate(ExDate.value)) {
    toast.error('Invalid date')
    return
  }
  if (!validTime(ExTime.value)) {
    toast.error('Invalid time')
    return
  }
  const ExNum = qualsSchedule.value!.filter((qs) => qs.num.substring(0, 2) === 'EX').length + 1
  const num = `EX${ExNum}`

  const dateTime = new Date(`${ExDate.value}T${ExTime.value}:00Z`)

  try {
    const qs: QsPost = {
      tourneyId: tourney.value!.id,
      roundId: round.value!.id,
      num,
      dateTime
    }
    const resp = await addQualsSchedule(qs, idTokenClaims.value!.__raw)
    qualsSchedule.value!.push(resp.data)
    toast.success('Extra time added')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  }
}
</script>

<style scoped lang="scss">
.schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100%;
  margin: 20px;
  max-height: calc(100vh - 110px);

  &__add-extra {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__add-extra-btn {
    margin-bottom: 7px;
  }

  &__generation {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__inputs {
    display: flex;
    gap: 10px;
  }
}
</style>
