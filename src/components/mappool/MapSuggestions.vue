<template>
  <div class="suggestions">
    <h3>Suggest map</h3>
    <div class="suggestions__inputs">
      <InputField label="Map Id" placeholder="Map Id" v-model="mapId" />
      <SelectBox label="Mod" :options="modOptions" v-model="selectedMod" />
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
        v-for="map in suggestions"
        :key="map.id + map.mod"
        :map="map"
        :main-pool="mainPool"
        :show-btns="true"
        @suggestion-to-pool="$emit('suggestionToPool', $event)"
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

interface Props {
  suggestions: Map[]
  mainPool: Map[]
  roundId: number
  tournamentId: number
}
const props = defineProps<Props>()
const emit = defineEmits(['addedSuggestion', 'suggestionToPool'])
const { idTokenClaims } = useAuth0()
const toast = useToast()

const modOptions = ref(['NM', 'HD', 'HR', 'DT', 'FM', 'TB', 'EZ'])
const addBtnDisabled = ref<boolean>(false)

const mapId = ref<string>()
const selectedMod = ref('NM')
const notes = ref<string>()

const handleSuggestMap = async () => {
  addBtnDisabled.value = true
  try {
    const resp = await addMapSuggestion(
      props.roundId,
      {
        tournamentId: props.tournamentId,
        roundId: props.roundId,
        mapId: parseInt(mapId.value!),
        mod: selectedMod.value,
        notes: notes.value
      },
      idTokenClaims.value?.__raw!
    )
    emit('addedSuggestion', resp.data)
    toast.success('Map suggestion added')
  } catch (error) {
    console.log(error)
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
    justify-content: center;
    align-items: end;
    gap: 10px;
  }

  &__card-container {
    display: flex;
    max-width: 100%;
    flex-direction: column;
    margin-top: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 5px;
  }
}
</style>
