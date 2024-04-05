<template>
  <div class="create-tournament">
    <h2 class="create-tournament__header">Create Tournament</h2>
    <div class="create-tournament__close">
      <IconBtn
        @click="emit('closeClicked')"
        color="red"
        icon-name="fa-times"
        text-color="white"
        :size="20"
        :icon-size="0.75"
      />
    </div>
    <InputField :bg-color="'var(--bg3)'" placeholder="Name" v-model="name" />
    <InputField :bg-color="'var(--bg3)'" placeholder="Forum post link" v-model="forumPostLink" />
    <ButtonComp @click="handleCreateClick" btn-text="Create" color="green" text-color="black" />
  </div>
</template>

<script setup lang="ts">
import ButtonComp from '../general-purpose/ButtonComp.vue'
import InputField from '../general-purpose/InputField.vue'
import IconBtn from '../general-purpose/IconBtn.vue'
import { createTournament } from '@/Api/OthApi'
import { ref } from 'vue'
import type { CreateTouernament, ResponseError } from '@/Types'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from 'vue-toastification'
import { AxiosError } from 'axios'

const emit = defineEmits(['tournamentCreated', 'closeClicked'])
const { idTokenClaims } = useAuth0()
const toast = useToast()

const name = ref('')
const forumPostLink = ref('')

const handleCreateClick = async () => {
  const toastId = toast.info('Creating tournament...', {
    hideProgressBar: true,
    timeout: 0
  })

  const tournamentToCreate: CreateTouernament = {
    name: name.value,
    formuPostLink: forumPostLink.value
  }

  const token = idTokenClaims.value!.__raw

  try {
    await createTournament(tournamentToCreate, token)
    toast.dismiss(toastId)
    toast.success('Tournament created successfully')
    emit('tournamentCreated')
  } catch (e) {
    const err = e as AxiosError<ResponseError>
    toast.dismiss(toastId)
    toast.error(`Error: ${err.response!.data.detail}`)
  }
}
</script>

<style scoped lang="scss">
.create-tournament {
  position: absolute;
  width: 300px;
  height: 260px;
  top: 50%;
  margin-top: -130px;
  background-color: var(--bg2);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: var(--base-border-radius);
  box-shadow: var(--boxshadow-white);

  &__header {
    margin: 0;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
