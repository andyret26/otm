<template>
  <div v-if="round !== null" class="mappool">
    <h1>{{ tourney?.name }}</h1>
    <h2>{{ round.name }} mappool</h2>
    <div class="mappool__nav" v-if="isAuthenticated">
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
      :tournament-id="parseInt(route.path.split('/')[2])"
      :main-pool="round.mappool"
      @suggestion-to-pool="round?.mappool.push($event)"
    />

    <div class="mappool__maps-tab" v-if="activeBtn === 'Maps'">
      <MapCardHeader />
      <template v-if="round.mappool.length > 0">
        <div class="mappool__maps-container" group="maps">
          <MapCard v-for="map in poolSorted" :key="map.id" :map="map" :main-pool="round.mappool" />
        </div>
      </template>

      <template v-else>
        <p>No Maps</p>
      </template>
    </div>
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { getRound, getTournamentById } from '@/Api/OtmApi'
import { type Tournament, type Round, type Map } from '@/Types'
import ButtonComp from '@/components/common/ButtonComp.vue'
import MapSuggestions from '@/components/mappool/MapSuggestions.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import MapCard from '@/components/cards/MapCard.vue'
import MapCardHeader from '@/components/cards/MapCardHeader.vue'
import { useAuth0 } from '@auth0/auth0-vue'
const route = useRoute()
const { isAuthenticated } = useAuth0()

const activeBtn = ref<'Maps' | 'Suggestions'>('Maps')
const round = ref<Round | null>(null)
const tourney = ref<Tournament | null>(null)

onMounted(async () => {
  const resp = await getRound(parseInt(route.path.split('/')[4]))
  const resp2 = await getTournamentById(parseInt(route.path.split('/')[2]))

  round.value = resp.data
  tourney.value = resp2
})

const poolSorted = computed<Map[]>(() => {
  const modSort = (modPrefix: string) => {
    return round
      .value!.mappool.filter((map) => map.mod.startsWith(modPrefix))
      .sort((a, b) => a.mod.localeCompare(b.mod))
  }

  const modPrefixes = ['NM', 'HD', 'HR', 'DT', 'FM', 'TB']
  const res: Map[] = []

  modPrefixes.forEach((prefix) => {
    const filteredMaps = modSort(prefix)
    res.push(...filteredMaps)
  })

  return res
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

  &__maps-tab {
    max-width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    margin-top: 15px;
  }

  &__maps-container {
    display: flex;
    max-width: 100%;
    flex-direction: column;
    padding-bottom: 5px;
    gap: 5px;
  }
}
</style>
