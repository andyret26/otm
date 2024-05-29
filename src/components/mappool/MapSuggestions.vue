<template>
  <div class="suggestions">
    <h3>Suggest map</h3>
    <div class="suggestions__inputs">
      <InputField label="Map Id" placeholder="Map Id" v-model="mapId" />
      <SelectBox label="Mod" :options="modOptions" v-model="selectedMod" max-width="75px" />
      <InputField placeholder="#" v-model="modNumber" max-width="75px" label="Number" />
      <InputField label="Comment" placeholder="Comment" v-model="notes" />
      <IconBtn
        @click="handleSuggestMap"
        icon-name="fa-plus"
        color="green"
        text-color="black"
        title="Suggest Map"
        :disabled="addBtnDisabled"
      />
    </div>
    <div v-if="suggestions.length > 0" class="suggestions__card-container">
      <MapCardHeader :show-btns="true" />
      <MapCard
        v-for="map in sortPool(suggestions)"
        :key="map.id + map.mod"
        :map="map"
        :main-pool="mainPool"
        :show-btns="true"
        @suggestion-to-pool="$emit('suggestionToPool', $event)"
        @remove-suggestion-from-pool="$emit('removeSuggestionFromPool', $event)"
      />
    </div>
    <p v-else>No suggestions made</p>
  </div>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/IconBtn.vue'
import InputField from '@/components/common/InputField.vue'
import SelectBox from '../common/SelectBox.vue'
import { ref } from 'vue'
import type { Map, ResponseError } from '@/Types'
import { addMapSuggestion } from '@/Api/OtmApi'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import type { AxiosError } from 'axios'
import MapCard from '../cards/MapCard.vue'
import MapCardHeader from '../cards/MapCardHeader.vue'
import { sortPool } from '@/Utils/HelperFunctions'

interface Props {
  suggestions: Map[]
  mainPool: Map[]
  roundId: number
  tournamentId: number
}
const props = defineProps<Props>()
const emit = defineEmits(['addedSuggestion', 'suggestionToPool', 'removeSuggestionFromPool'])
const { idTokenClaims } = useAuth0()
const toast = useToast()

const modOptions = ref(['NM', 'HD', 'HR', 'DT', 'FM', 'TB', 'EZ'])
const addBtnDisabled = ref<boolean>(false)

const mapId = ref<string>()
const selectedMod = ref('NM')
const modNumber = ref<string>()
const notes = ref<string>()

const handleSuggestMap = async () => {
  addBtnDisabled.value = true
  //check if modNumber is a number
  if (isNaN(parseInt(modNumber.value!))) {
    toast.error('Mod number must be a number')
    addBtnDisabled.value = false
    return
  }
  try {
    const resp = await addMapSuggestion(
      props.roundId,
      {
        tournamentId: props.tournamentId,
        roundId: props.roundId,
        mapId: parseInt(mapId.value!),
        mod: selectedMod.value + modNumber.value,
        notes: notes.value
      },
      idTokenClaims.value?.__raw!
    )
    emit('addedSuggestion', resp.data)
    toast.success('Map suggestion added')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  } finally {
    addBtnDisabled.value = false
  }
}
</script>

<style scoped lang="scss">
.suggestions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__inputs {
    display: flex;
    align-items: end;
    gap: 10px;
  }

  &__card-container {
    display: flex;
    max-width: 100%;
    flex-direction: column;
    justify-content: start;
    align-items: flex-start;

    margin-top: 20px;
    overflow-x: auto;
    padding-bottom: 5px;
    gap: 5px;
  }
}
</style>
