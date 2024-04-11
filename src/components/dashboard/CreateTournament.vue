<template>
  <div class="create-tournament">
    <h2 class="create-tournament__header">Create Tournament</h2>
    <div class="create-tournament__close">
      <IconBtn
        title="Close"
        @click="emit('closeClicked')"
        color="red"
        icon-name="fa-times"
        text-color="white"
        :size="20"
        :icon-size="0.75"
      />
    </div>
    <InputField
      :bg-color="'var(--bg3)'"
      placeholder="Name"
      v-model="name"
      label-text="Tournament Name"
    />
    <InputField :bg-color="'var(--bg3)'" placeholder="Forum post link" v-model="forumPostLink" />
    <RadioGroup
      :options="radioOptions"
      :value="selectedOption"
      id="radio-group-create-tournament"
      @change="
        (e) => {
          selectedOption = e.value
          formatDisabled = e.value === 'Solo'
        }
      "
    />
    <SelectBox
      label="Format"
      :options="formatOptions"
      v-model="selectedFormat"
      :disabled="formatDisabled"
    />
    <SelectBox
      label="Max team size"
      :options="maxTeamSizeOptions"
      v-model="seclectedTeamSize"
      :disabled="formatDisabled"
    />
    <InputField :bg-color="'var(--bg3)'" placeholder="Rank range" v-model="rankRange" />

    <ButtonComp @click="handleCreateClick" btn-text="Create" color="green" text-color="black" />
  </div>
</template>

<script setup lang="ts">
import ButtonComp from '../general-purpose/ButtonComp.vue'
import InputField from '../general-purpose/InputField.vue'
import IconBtn from '../general-purpose/IconBtn.vue'
import SelectBox from '../general-purpose/SelectBox.vue'
import { createTournament } from '@/Api/OthApi'
import { ref, watch } from 'vue'
import type { CreateTouernament, ResponseError } from '@/Types'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import { AxiosError } from 'axios'
import RadioGroup from '../general-purpose/RadioGroup.vue'

const emit = defineEmits(['tournamentCreated', 'closeClicked'])
const { idTokenClaims } = useAuth0()
const toast = useToast()

const radioOptions = [
  { label: 'Teams', value: 'Teams' },
  { label: 'Solo', value: 'Solo' }
]

const formatOptions = ['1v1', '2v2', '3v3', '4v4']
const maxTeamSizeOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const name = ref('')
const forumPostLink = ref('')
const selectedOption = ref<string>('Teams')
const selectedFormat = ref<'1v1' | '2v2' | '3v3' | '4v4'>('1v1')
const seclectedTeamSize = ref<string>('1')
const rankRange = ref('')
const formatDisabled = ref(selectedOption.value === 'Solo')

watch(selectedOption, (newVal) => {
  if (newVal === 'Solo') {
    selectedFormat.value = '1v1'
    seclectedTeamSize.value = '1'
    formatDisabled.value = true
  }
})

const handleCreateClick = async () => {
  console.log(selectedOption.value)
  const toastId = toast.info('Creating tournament...', {
    hideProgressBar: true,
    timeout: 0
  })

  const tournamentToCreate: CreateTouernament = {
    name: name.value,
    formuPostLink: forumPostLink.value,
    isTeamTourney: selectedOption.value === 'Teams',
    format: selectedFormat.value,
    maxTeamSize: parseInt(seclectedTeamSize.value),
    rankRange: rankRange.value
  }

  const token = idTokenClaims.value!.__raw

  try {
    await createTournament(tournamentToCreate, token)
    toast.dismiss(toastId)
    toast.success('Tournament created successfully')
    emit('tournamentCreated')
  } catch (e) {
    const err = e as AxiosError<ResponseError>
    toast.dismiss(toastId)
    toast.error(`Error: ${err.response!.data.detail}`)
  }
}
</script>

<style scoped lang="scss">
.create-tournament {
  position: absolute;
  width: 300px;
  height: 500px;
  top: 50%;
  margin-top: -130px;
  background-color: var(--bg2);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: var(--base-border-radius);
  box-shadow: var(--boxshadow-white);

  &__header {
    margin: 0;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
