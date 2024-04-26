<template>
  <div v-if="round !== null" class="mappool">
    <h1>{{ tourney?.name }}</h1>
    <h2>{{ round.name }} mappool</h2>
    <div class="mappool__nav">
      <ButtonComp
        @click="activeBtn = 'Maps'"
        btn-text="Maps"
        :color="activeBtn === 'Maps' ? 'pink' : 'purple'"
      />
      <ButtonComp
        @click="activeBtn = 'Suggestions'"
        btn-text="Suggestions"
        :color="activeBtn === 'Suggestions' ? 'pink' : 'purple'"
      />
    </div>
    <MapSuggestions
      v-if="activeBtn === 'Suggestions'"
      :suggestions="round.mapSuggestions"
      :round-id="parseInt(route.path.split('/')[4])"
      @added-suggestion="round?.mapSuggestions.push($event)"
    />
    <div class="mappool__maps-tab" v-if="activeBtn === 'Maps'">
      <div class="mappool__maps-container" v-if="round.mappool.length > 0">
        <MapCard v-for="map in round.mappool" :key="map.id" :map="map" />
      </div>
      <p v-else>No Maps</p>
    </div>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { getRound, getTournamentById } from '@/Api/OtmApi'
import { type Tournament, type Round } from '@/Types'
import ButtonComp from '@/components/common/ButtonComp.vue'
import MapSuggestions from '@/components/mappool/MapSuggestions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MapCard from '@/components/cards/MapCard.vue'
const route = useRoute()

const activeBtn = ref<'Maps' | 'Suggestions'>('Maps')
const round = ref<Round | null>(null)
const tourney = ref<Tournament | null>(null)

onMounted(async () => {
  const resp = await getRound(parseInt(route.path.split('/')[4]))
  const resp2 = await getTournamentById(parseInt(route.path.split('/')[2]))

  round.value = resp.data
  tourney.value = resp2
})
</script>

<style scoped lang="scss">
.mappool {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 20px;

  &__nav {
    display: flex;
    gap: 10px;
  }
}
</style>
