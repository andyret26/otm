<template>
  <div class="dashboard">
    <h3 v-if="dashboardData && dashboardData.length <= 0">You have no tournaments at the moment</h3>
    <IconBtn
      title="Create Tournament"
      @click="showCreateTournament = true"
      icon-name="fa-plus"
      color="green"
      text-color="black"
    />
    <LoadingSpinner v-if="!dashboardData" />
    <div v-if="dashboardData" class="dashboard__tournaments">
      <TournamentCard v-for="tourney in dashboardData" :key="tourney.id" :tournament="tourney" />
    </div>
    <CreateTournamet
      v-if="showCreateTournament"
      @tournament-created="handleTourneyCreated"
      @close-clicked="showCreateTournament = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import TournamentCard from '@/components/dashboard/TournamentCard.vue'
import IconBtn from '@/components/commone/IconBtn.vue'
import LoadingSpinner from '@/components/commone/LoadingSpinner.vue'
import CreateTournamet from '@/components/dashboard/CreateTournament.vue'
import { useRoute } from 'vue-router'
import type { Tournament } from '@/Types'
import { getDashboardData } from '@/Api/OthApi'
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const { user } = useAuth0()

const dashboardData = ref<Tournament[] | null>(null)
const showCreateTournament = ref(false)

watch(
  route,
  async () => {
    dashboardData.value = await getDashboardData(user.value!.sub!)
  },
  { immediate: true }
)

const handleTourneyCreated = async () => {
  dashboardData.value = null
  dashboardData.value = await getDashboardData(user.value!.sub!)
  showCreateTournament.value = false
}
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 50px;

  &__tournaments {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
  }
}
</style>
