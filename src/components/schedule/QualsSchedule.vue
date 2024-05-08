<template>
  <div class="quals-schedule">
    <div
      class="quals-schedule__card"
      v-for="(qual, index) in qualsSchedule"
      :key="qual.id"
      :style="{ marginTop: isDateSwitch(index) ? '20px' : '0px' }"
    >
      <div class="quals-schedule__card-id card-field1">
        {{ qual.num }}
      </div>
      <div class="quals-schedule__card-date card-field2">
        ({{ getDate(qual.dateTime).split(' ')[0] }}) {{ getDate(qual.dateTime).split(' ')[1] }}
        {{ getDate(qual.dateTime).split(' ')[2] }}
      </div>
      <div class="quals-schedule__card-time card-field1">{{ getTime(qual.dateTime) }}</div>
      <div class="quals-schedule__card-ref card-field2">
        <div v-if="qual.referee">{{ qual.referee.username }}</div>
      </div>
      <div class="quals-schedule__card-teams card-field1" v-if="isTeamTourney">
        <div v-for="team in qual.teams" :key="team.id">{{ team.teamName }}</div>
      </div>
      <div class="quals-schedule__card-players card-field1" v-else>
        <div v-for="player in qual.players" :key="player.id">{{ player.username }}</div>
      </div>
      <div class="quals-schedule__card-edit">
        <IconBtn
          v-if="isAuthenticated"
          @click="
            () => {
              showEditRow = true
              currentEditRow = qual
            }
          "
          title="Edit row"
          icon-name="fa-edit"
          :size="23"
          :icon-size="0.9"
          color="none"
          text-color="white"
          :disabled="showEditRow"
        />
      </div>
    </div>
    <QualsRowEdit
      v-if="showEditRow"
      :quals-schedule="currentEditRow!"
      :handle-ref-add="handleAddReferee"
      @closeClicked="showEditRow = false"
    />
  </div>
</template>

<script setup lang="ts">
import IconBtn from '../common/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import {
  addQualsRef,
  getTournamentPlayerMin,
  getTournamentStaff,
  getTournementTeamsMin
} from '@/Api/OtmApi'
import { useRoute } from 'vue-router'
import type { Player, QualifierSchedule, ResponseError, Staff, Team } from '@/Types'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import QualsRowEdit from './QualsRowEdit.vue'

interface Props {
  isTeamTourney: boolean
  qualsSchedule: QualifierSchedule[]
}

const props = defineProps<Props>()

const { isAuthenticated, idTokenClaims } = useAuth0()
const route = useRoute()
const toast = useToast()
const TourneyId = parseInt(route.path.split('/')[2])

const particapents = ref<Player | Team | null>(null)
const staff = ref<Staff | null>(null)
const currentEditRow = ref<QualifierSchedule | null>(null)
const showEditRow = ref(false)

const isDateSwitch = (index: number): boolean => {
  if (index === 0) return false
  var curretDate = props.qualsSchedule[index].dateTime.split('T')[0]
  var previousDate = props.qualsSchedule[index - 1].dateTime.split('T')[0]
  return curretDate !== previousDate
}

const handleAddReferee = async (qualId: number) => {
  try {
    await addQualsRef(TourneyId, qualId, idTokenClaims.value!.__raw)
    toast.success('Referee added')

    // TODO Update qualsSchedule with new referee
  } catch (e) {
    const err = e as AxiosError<ResponseError>
    toast.error(err.response?.data.detail)
  }
}

const getDate = (dateString: string) => {
  const year = parseInt(dateString.split('-')[0])
  const month = parseInt(dateString.split('-')[1])
  const day = parseInt(dateString.split('-')[2])

  const date = new Date(year, month, day)

  return date.toDateString()
}
const getTime = (dateString: string) => {
  const [hour, min] = dateString.split('T')[1].split(':')
  return `${hour}:${min}`
}

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      var resp = await getTournamentStaff(TourneyId)
      staff.value = resp.data
      if (props.isTeamTourney) {
        var resp1 = await getTournementTeamsMin(TourneyId)
        particapents.value = resp1.data
      } else {
        var resp2 = await getTournamentPlayerMin(TourneyId)
        particapents.value = resp2.data
      }
    } catch (e) {
      var err = e as AxiosError<ResponseError>
      toast.error(err.response?.data.detail)
    }
  }
})
</script>

<style scoped lang="scss">
.quals-schedule {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-width: 100%;
  overflow-x: auto;

  height: 100%;
  overflow-y: auto;
}

.quals-schedule__card:nth-child(even) {
  filter: contrast(1.15);
}

.quals-schedule__card {
  display: flex;
  min-height: 30px;
  max-height: 30px;
  align-items: center;

  &-id {
    min-width: 30px;
  }

  &-date {
    min-width: 110px;
    font-family: monospace;
  }

  &-time {
    min-width: 50px;
    font-family: monospace;
  }

  &-ref {
    min-width: 75px;
  }

  &-teams,
  &-players {
    min-width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  &-edit {
    min-width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.card-field1 {
  height: 30px;
  background-color: var(--bg3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-field2 {
  height: 30px;
  background-color: var(--bg2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
