<template>
  <div class="dashboard">
    <h3 v-if="dashboardData.length <= 0">You have no tournaments at the moment</h3>
    <div v-else></div>
    <IconBtn @click="handleCreate" icon-name="fa-plus" color="green" text-color="black" />
  </div>
</template>

<script setup lang="ts">
import { getDashboardData } from '@/Api/OthApi'
import type { DashboardTournament } from '@/Types'
import IconBtn from '@/components/general-purpose/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'

const { user } = useAuth0()

const dashboardData = ref<DashboardTournament[]>([])

onMounted(async () => {
  await getDashboardData(user.value!.sub!)
})

const handleCreate = () => {
  console.log('Create tournament')
}
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
