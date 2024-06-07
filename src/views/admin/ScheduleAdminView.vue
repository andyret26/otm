<template>
  <div class="page">
    <IconBtn
      class="stats__globe-btn"
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
import { isAuthorized } from '@/Api/OtmApi'
import IconBtn from '@/components/common/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const { isAuthenticated, idTokenClaims } = useAuth0()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const tourneyId = parseInt(route.path.split('/')[2])
const roundId = parseInt(route.path.split('/')[4])

onMounted(async () => {
  if (
    !isAuthenticated.value ||
    !(await isAuthorized(idTokenClaims.value!.__raw, tourneyId, ['admin', 'host', 'referee']))
  ) {
    router.push(`/tournament/${tourneyId}/round/${roundId}/stats`)
    toast.error('You are not authorized to view this page')
    return
  }
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

.stats__globe-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
