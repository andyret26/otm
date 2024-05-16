<template>
  <div class="quals-row-edit">
    <div class="quals-row-edit__title">Id {{ qualsSchedule.num }}</div>
    <SelectBox
      :options="['None', ...staff.map((s) => s.username)]"
      :label="'Add referee'"
      v-model="selectedRef"
    />

    <div class="quals-row-edit__add-participant">
      <SelectBox
        :options="[
          'Select',
          ...participants.map((p) => ('username' in p ? p.username : p.teamName))
        ]"
        :label="participantLabel"
        v-model="selectedParticipant"
      />

      <IconBtn
        @click="handleAddParticipant"
        icon-name="fa-plus"
        title="Add participant"
        :color="'green'"
        text-color="black"
        :size="21"
        :icon-size="0.75"
        margin="0px 0px -20px 0px"
      />
    </div>

    <div class="quals-row-edit__particepants" v-if="participants.length >= 1">
      <div class="quals-row-edit__participants-label">
        {{ 'username' in participants[0] ? 'Players' : 'Teams' }}
      </div>
      <div class="quals-row-edit__participants-names-container">
        <div
          class="quals-row-edit__participants-names"
          v-for="name in addedParticipants"
          :key="name"
        >
          <div>
            {{ name }}
          </div>
          <div>
            <IconBtn
              @click="handleRemovePaticipant(name)"
              title="Remove participant"
              icon-name="fa-minus"
              :size="16"
              :icon-size="0.6"
              color="red"
            />
          </div>
        </div>
      </div>
    </div>
    <ButtonComp
      btn-text="Save changes"
      color="green"
      text-color="black"
      @click="handleSaveChanges"
    />
  </div>
</template>

<script setup lang="ts">
import type { Player, QsPut, QualifierSchedule, ResponseError, Staff, Team } from '@/Types'
import IconBtn from '../common/IconBtn.vue'
import SelectBox from '../common/SelectBox.vue'
import { computed, onMounted, ref } from 'vue'
import ButtonComp from '../common/ButtonComp.vue'
import { updateQualsSchedule } from '@/Api/OtmApi'
import type { AxiosError } from 'axios'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

interface Props {
  qualsSchedule: QualifierSchedule
  staff: Staff[]
  participants: Player[] | Team[]
}

const { idTokenClaims } = useAuth0()
const toast = useToast()
const route = useRoute()

const props = defineProps<Props>()
const emit = defineEmits(['rowUpdated'])

const selectedRef = ref<string>('None')
const selectedParticipant = ref<string>('Select')
const addedParticipants = ref<string[]>([])

const participantLabel = computed<string>(() => {
  if (props.participants.length <= 0) return 'Add Participant'
  else if ('username' in props.participants[0]) return 'Add Player'
  else return 'Add Team'
})

const handleAddParticipant = () => {
  if (
    selectedParticipant.value !== 'Select' &&
    !addedParticipants.value.includes(selectedParticipant.value)
  ) {
    addedParticipants.value.push(selectedParticipant.value)
  }

  selectedParticipant.value = 'Select'
}

const handleRemovePaticipant = (name: string) => {
  addedParticipants.value = addedParticipants.value.filter((n) => n !== name)
}

const handleSaveChanges = async () => {
  const qs: QsPut = {
    tourneyId: parseInt(route.path.split('/')[2]),
    scheduleId: props.qualsSchedule.id,
    refId:
      selectedRef.value === 'None'
        ? null
        : props.staff.find((s) => s.username === selectedRef.value)!.id,
    names: addedParticipants.value
  }

  try {
    const resp = await updateQualsSchedule(qs, idTokenClaims.value!.__raw)
    emit('rowUpdated', resp.data)
    toast.success('Schedule updated')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  }
}

onMounted(() => {
  if (props.qualsSchedule.referee) selectedRef.value = props.qualsSchedule.referee
  addedParticipants.value = props.qualsSchedule.names
})
</script>

<style scoped lang="scss">
.quals-row-edit {
  box-sizing: border-box;
  position: absolute;
  top: 125px;
  transform: translateX(-50%);
  left: 50%;
  width: 300px;
  height: 415px;
  background-color: var(--bg2);
  border-radius: var(--base-border-radius);
  box-shadow: var(--boxshadow-white);
  z-index: 5;
  display: flex;

  flex-direction: column;
  gap: 20px;
  padding: 20px;

  &__title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  &__add-participant {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__particepants {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__participants-label {
    font-size: 16px;
    margin-left: 5px;
  }

  &__participants-names-container {
    font-size: 12px;
    margin-left: 14px;
    display: flex;
    flex-wrap: wrap;

    gap: 5px;
    margin-right: 10px;
    max-height: 100px;
    overflow-y: auto;

    height: 100px;
  }
  &__participants-names {
    height: 16px;
    font-size: 12px;
    background-color: var(--bg3);
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    border-radius: var(--base-border-radius);
  }
}
</style>
