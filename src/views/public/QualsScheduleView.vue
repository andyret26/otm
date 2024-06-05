<template>
  <div class="schedule" v-if="round != null && tourney != null">
    <RouterLink :to="`/tournament/${tourney.id}`">
      <h1>{{ tourney!.name }}</h1>
    </RouterLink>
    <h2>{{ round!.name }} schedule</h2>
    <QualsSchedule
      v-if="qualsSchedule != null && qualsSchedule.length > 0"
      :quals-schedule="qualsSchedule"
      :is-team-tourney="tourney.teams.length > 0"
      :links-visible="round.isMpLinksPublic"
      :is-admin="false"
    />

    <div v-else>No Schedule</div>
    <IconBtn
      class="schedule__admin-btn"
      v-if="isAuthenticated"
      title="Admin view"
      @click="handleAdminClick"
      icon-name="md-adminpanelsettings"
      color="brown"
      text-color="black"
      :icon-size="1.2"
    />
  </div>
  <LoadingSpinner v-else />
</template>

<script setup lang="ts">
import { getQualifierSchedule, getRound, getTournamentById } from '@/Api/OtmApi'
import type { QualifierSchedule, Round, Tournament } from '@/Types'
import QualsSchedule from '@/components/schedule/QualsSchedule.vue'
import IconBtn from '@/components/common/IconBtn.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, idTokenClaims } = useAuth0()

const round = ref<Round | null>(null)
const tourney = ref<Tournament | null>(null)

const qualsSchedule = ref<QualifierSchedule[] | null>(null)

onMounted(async () => {
  const resp = await getRound(parseInt(route.path.split('/')[4]))
  const resp2 = await getTournamentById(parseInt(route.path.split('/')[2]))

  round.value = resp.data
  tourney.value = resp2

  var token = idTokenClaims.value ? idTokenClaims.value!.__raw : '0'
  qualsSchedule.value = (await getQualifierSchedule(round.value!.id, tourney.value!.id, token)).data
})

const handleAdminClick = async () => {
  router.push(`/tournament/${tourney.value!.id}/round/${round.value!.id}/quals-schedule/admin`)
}
</script>

<style scoped lang="scss">
.schedule {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  max-height: calc(100vh - 90px);
  max-width: 1000px;
  padding: 20px;

  &__admin-btn {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>
