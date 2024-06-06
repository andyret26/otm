<template>
  <div class="page">
    <IconBtn
      class="stats__admin-btn"
      v-if="isAuthenticated"
      title="Public view"
      @click="handlePublicClick"
      icon-name="fa-globe"
      color="blue"
      text-color="white"
      :icon-size="1.2"
    />
  </div>
</template>

<script setup lang="ts">
import { getRound, isAuthorized } from '@/Api/OtmApi'
import type { Round } from '@/Types'
import IconBtn from '@/components/common/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const { isAuthenticated, idTokenClaims } = useAuth0()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const tourneyId = parseInt(route.path.split('/')[2])
const roundId = parseInt(route.path.split('/')[4])

const round = ref<Round | null>(null)

onMounted(async () => {
  if (
    !isAuthenticated.value ||
    !(await isAuthorized(idTokenClaims.value!.__raw, tourneyId, ['admin', 'host']))
  ) {
    router.push(`/tournament/${tourneyId}/round/${roundId}/stats`)
    toast.error('You are not authorized to view this page')
    return
  }

  const resp = await getRound(roundId)
  round.value = resp.data
})

const handlePublicClick = () => {
  router.push(`/tournament/${tourneyId}/round/${roundId}/schedule`)
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;

  gap: 20px;
  max-height: calc(100vh - 110px);
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

.stats__admin-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
