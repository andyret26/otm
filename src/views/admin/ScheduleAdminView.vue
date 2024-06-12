<template>
  <div class="page">
    <LoadingSpinner v-if="round === null" />
    <div class="schedule" v-else>
      <div class="schedule__header">
        <h1>{{ round.tournament.name }}</h1>
        <h2>{{ round.name }} schedule admin</h2>
      </div>
      <div class="schedule__generate">
        <div class="schedule__gen-inputs">
          <InputField v-model="startDate" label="Start Date" placeholder="yyyy-MM-dd" />
          <InputField v-model="endDate" label="End Date" placeholder="yyyy-MM-dd" />
        </div>
        <ButtonComp
          @click="handleGenerateBtnClick"
          btn-text="Generate schedule"
          :disabled="btnDisabled"
        />
      </div>
      <div>
        <div v-for="s in round.schedules" :key="s.id">{{ s.name1 }} vs {{ s.name2 }}</div>
      </div>
    </div>
    <IconBtn
      class="schedule__globe-btn"
      v-if="isAuthenticated"
      title="Public view"
      @click="handlePublicClick"
      icon-name="fa-globe"
      color="blue"
      text-color="white"
      :icon-size="1.2"
    />
    <BackBtn
      class="schedule__back-btn"
      v-if="isAuthenticated"
      title="Public view"
      @click="$router.push(`/tournament/${tourneyId}`)"
      color="yellow"
      text-color="black"
      :icon-size="1.2"
    />
  </div>
</template>

<script setup lang="ts">
import { generateSchedule, getRound, isAuthorized } from '@/Api/OtmApi'
import type { ResponseError, Round } from '@/Types'
import { validDate } from '@/Utils/HelperFunctions'
import BackBtn from '@/components/common/BackBtn.vue'
import ButtonComp from '@/components/common/ButtonComp.vue'
import IconBtn from '@/components/common/IconBtn.vue'
import InputField from '@/components/common/InputField.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import type { AxiosError } from 'axios'
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
const btnDisabled = ref<boolean>(false)

const startDate = ref<string>('')
const endDate = ref<string>('')

onMounted(async () => {
  if (
    !isAuthenticated.value ||
    !(await isAuthorized(idTokenClaims.value!.__raw, tourneyId, ['admin', 'host', 'referee']))
  ) {
    router.push(`/tournament/${tourneyId}/round/${roundId}/schedule`)
    toast.error('You are not authorized to view this page')
    return
  }

  const resp = await getRound(roundId)
  round.value = resp.data
})

const handleGenerateBtnClick = async () => {
  btnDisabled.value = true
  try {
    if (!validDate(startDate.value) || !validDate(endDate.value)) {
      btnDisabled.value = false
      return toast.error('Invalid date format')
    }

    const rsp = await generateSchedule(
      tourneyId,
      roundId,
      new Date(startDate.value),
      new Date(endDate.value),
      idTokenClaims.value!.__raw
    )
    round.value!.schedules = rsp.data
    toast.success('Schedule generated')
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  } finally {
    btnDisabled.value = false
  }
}

const handlePublicClick = () => {
  router.push(`/tournament/${tourneyId}/round/${roundId}/schedule`)
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  display: flex;
  flex-direction: column;

  gap: 20px;
  max-height: calc(100vh - 110px);
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

.schedule {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__generate {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__gen-inputs {
    display: flex;
    gap: 20px;
  }
}

.schedule__globe-btn {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>
