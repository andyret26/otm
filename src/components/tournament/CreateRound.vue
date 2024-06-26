<template>
  <div class="create-round">
    <h2 class="create-round__header">Create round</h2>
    <div class="create-round__close">
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
      v-model="roundName"
      label-text="Round Name"
      :max-text-length="25"
    />

    <RadioGroup
      @change="
        (e) => {
          isQuals = e.value
          selectedRoundNum = isQuals === 'yes' ? '0' : '1'
          roundNumOpt = isQuals === 'yes' ? ['0'] : ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      "
      id="is-quals"
      :value="isQuals"
      :options="radioOptions"
      label="Qualifier round?"
      direction="row"
    />

    <SelectBox
      :options="roundNumOpt"
      label="Round number"
      v-model="selectedRoundNum"
      :disabled="isQuals === 'yes'"
    />

    <ButtonComp
      @click="handleCreateClick"
      btn-text="Create"
      color="green"
      text-color="black"
      :disabled="createDisabled"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonComp from '../common/ButtonComp.vue'
import InputField from '../common/InputField.vue'
import IconBtn from '../common/IconBtn.vue'
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import { AxiosError } from 'axios'
import { addRound } from '@/Api/OtmApi'
import type { RadioOption, ResponseError } from '@/Types'
import RadioGroup from '../common/RadioGroup.vue'
import SelectBox from '../common/SelectBox.vue'

interface Props {
  tournamentId: number
}
const props = defineProps<Props>()

const emit = defineEmits(['roundCreated', 'closeClicked'])
const { idTokenClaims } = useAuth0()
const toast = useToast()

const radioOptions = ref<RadioOption[]>([
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
])

const roundNumOpt = ref<string[]>(['0', '1', '2', '3', '4', '5', '6', '7', '8'])
const selectedRoundNum = ref<string>('1')

const isQuals = ref('no')
const roundName = ref('')
const createDisabled = ref(false)

const handleCreateClick = async () => {
  createDisabled.value = true
  try {
    const res = await addRound(
      props.tournamentId,
      roundName.value,
      isQuals.value === 'yes' ? true : false,
      parseInt(selectedRoundNum.value),
      idTokenClaims.value!.__raw
    )

    emit('roundCreated', res.data)
    toast.success('Round created')
  } catch (error) {
    const err = error as AxiosError<ResponseError>
    if (err.response?.status === 401) {
      toast.error('Unauthorized.\nAre you logged in?')
    } else {
      toast.error(err.response?.data.detail)
    }
  } finally {
    createDisabled.value = false
  }
}
</script>

<style scoped lang="scss">
.create-round {
  position: absolute;
  top: 100px;
  width: 300px;
  height: 300px;
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
