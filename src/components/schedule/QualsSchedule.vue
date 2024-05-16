<template>
  <div class="quals-schedule">
    <QualsRowHeader />
    <div
      class="quals-schedule__card"
      v-for="(qual, index) in qualsSchedule"
      :key="qual.id"
      :style="{
        marginBottom: isDateSwitch(index) && qual.num.substring(0, 2) !== 'EX' ? '20px' : '0px'
      }"
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
        <div v-if="qual.referee">{{ qual.referee }}</div>
      </div>
      <div class="quals-schedule__card-names card-field1">
        <div v-for="name in qual.names" :key="name">{{ name }}</div>
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
      v-if="showEditRow && staff !== null && particapents !== null"
      :quals-schedule="currentEditRow!"
      :staff="staff"
      :participants="particapents"
      @row-updated="handleRowUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import IconBtn from '../common/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { getTournamentPlayerMin, getTournamentStaff, getTournementTeamsMin } from '@/Api/OtmApi'
import { useRoute } from 'vue-router'
import type { Player, QualifierSchedule, ResponseError, Staff, Team } from '@/Types'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import QualsRowEdit from './QualsRowEdit.vue'
import QualsRowHeader from './QualsRowHeader.vue'

interface Props {
  isTeamTourney: boolean
  qualsSchedule: QualifierSchedule[]
}

const props = defineProps<Props>()
const emit = defineEmits(['rowUpdated'])

const { isAuthenticated } = useAuth0()
const route = useRoute()
const toast = useToast()
const TourneyId = parseInt(route.path.split('/')[2])

const particapents = ref<Player[] | Team[] | null>(null)
const staff = ref<Staff[] | null>(null)
const currentEditRow = ref<QualifierSchedule | null>(null)
const showEditRow = ref(false)

const isDateSwitch = (index: number): boolean => {
  if (index > props.qualsSchedule.length - 2) return false
  var curretDate = props.qualsSchedule[index].dateTime.split('T')[0]
  var nextDate = props.qualsSchedule[index + 1].dateTime.split('T')[0]
  if (
    props.qualsSchedule[index].num.substring(0, 2) !== 'EX' &&
    props.qualsSchedule[index + 1].num.substring(0, 2) === 'EX'
  )
    return true
  return curretDate !== nextDate
}

const handleRowUpdated = (updatedRow: QualifierSchedule) => {
  emit('rowUpdated', updatedRow)
  showEditRow.value = false
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
  min-height: 40px;
  max-height: 40px;
  align-items: center;

  &-id {
    min-width: 35px;
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

  &-names {
    box-sizing: border-box;
    font-size: 12px;
    min-width: 400px;
    max-width: 400px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0px 10px;
    padding: 3px;
  }

  &-edit {
    min-width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.card-field1 {
  height: 40px;
  background-color: var(--bg3);
  display: flex;
  justify-content: center;
  align-items: center;
}
.card-field2 {
  height: 40px;
  background-color: var(--bg2);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
