<template>
  <div class="schedule" v-if="round != null && tourney != null">
    <h1>{{ tourney!.name }}</h1>
    <h2>{{ round!.name }} schedule</h2>
    <div v-if="qualsSchedule !== null || Schedule !== null">HERE IS THE SCHEDULE</div>
    <div v-else-if="isAuthenticated">
      <ButtonComp btn-text="Generate Round" />
      <ButtonComp btn-text="Generate Qualifiers" />
    </div>
    <div v-else>No Schedule</div>
  </div>
</template>

<script setup lang="ts">
import { getRound, getTournamentById } from '@/Api/OtmApi'
import type { Round, Tournament } from '@/Types'
import ButtonComp from '@/components/common/ButtonComp.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { isAuthenticated } = useAuth0()

const round = ref<Round | null>(null)
const tourney = ref<Tournament | null>(null)

const qualsSchedule = null
const Schedule = null

onMounted(async () => {
  const resp = await getRound(parseInt(route.path.split('/')[4]))
  const resp2 = await getTournamentById(parseInt(route.path.split('/')[2]))

  round.value = resp.data
  tourney.value = resp2
})
</script>

<style scoped lang="scss">
.schedule {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
