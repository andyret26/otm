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
      />
    </div>
    <div v-if="suggestions.length > 0" class="suggestions__card-container">
      <p v-for="map in suggestions" :key="map.id">{{ map.name }}</p>
    </div>
    <p v-else>No suggestions made</p>
  </div>
</template>

<script setup lang="ts">
import IconBtn from '@/components/common/IconBtn.vue'
import InputField from '@/components/common/InputField.vue'
import SelectBox from '../common/SelectBox.vue'
import { ref } from 'vue'
import type { Map } from '@/Types'
import { addMapSuggestion } from '@/Api/OtmApi'
import { useAuth0 } from '@auth0/auth0-vue'

interface Props {
  suggestions: Map[]
  roundId: number
}
const props = defineProps<Props>()
const { idTokenClaims } = useAuth0()

const modOptions = ref(['NM', 'HD', 'HR', 'DT', 'FM', 'TB', 'EZ'])

const mapId = ref<string>()
const selectedMod = ref('NM')
const notes = ref<string>()

const handleSuggestMap = () => {
  console.log('Suggesting map')
  addMapSuggestion(
    props.roundId,
    {
      mapId: parseInt(mapId.value!),
      mod: selectedMod.value,
      notes: notes.value
    },
    idTokenClaims.value?.__raw!
  )
}
</script>

<style scoped lang="scss">
.suggestions {
  &__inputs {
    display: flex;
    justify-content: center;
    align-items: end;
    gap: 10px;
  }
}
</style>
