<template>
  <RouterLink :to="`/tournament/${tournament.id}`" class="tournament-card">
    <div class="tournament-card__format">
      <div class="tournament-card__format-field">{{ tournament.format }}</div>
      <div class="tournament-card__format-field" v-if="tournament.isTeamTourney">
        Teams of {{ tournament.maxTeamSize }}
      </div>
    </div>
    <div class="tournament-card__name">{{ tournament.name }}</div>
    <div class="tournament-card__rank-range">{{ tournament.rankRange }}</div>
    <IconBtn
      v-if="showBtns && isAuthenticated && tournament.hostId === osuId"
      class="tournament-card__delete"
      icon-name="fa-trash"
      color="red"
      :size="25"
      :icon-size="0.8"
      @click="handleDeleteClick($event, tournament.id)"
    />
  </RouterLink>
</template>

<script setup lang="ts">
import type { ResponseError, Tournament } from '@/Types'
import { RouterLink } from 'vue-router'
import IconBtn from '../common/IconBtn.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { deleteTournament } from '@/Api/OtmApi'
import type { AxiosError } from 'axios'
import { useToast } from 'vue-toastification'

interface Props {
  tournament: Tournament
  showBtns?: boolean
}

withDefaults(defineProps<Props>(), {
  showBtns: false
})
const emit = defineEmits(['tournamentDeleted'])

const { isAuthenticated, user, idTokenClaims } = useAuth0()
const toast = useToast()

let osuId: number | null = null
if (user.value && user.value.sub) {
  osuId = parseInt(user.value!.sub!.split('|')[2])
}

const handleDeleteClick = async (e: MouseEvent, id: number) => {
  e.preventDefault()
  try {
    if (!confirm('Are you sure you want to delete this tournament?')) return
    await deleteTournament(id, idTokenClaims.value!.__raw)
    toast.success('Tournament deleted')
    emit('tournamentDeleted', id)
  } catch (error) {
    const e = error as AxiosError<ResponseError>
    toast.error(e.response?.data.detail)
  }
}
</script>

<style scoped lang="scss">
.tournament-card {
  background-color: var(--bg3);
  height: 75px;
  min-height: 75px;
  max-height: 75px;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-evenly;
  padding: 0px 0px;
  position: relative;

  &:hover {
    background-color: var(--bg2);
  }

  &__name {
    white-space: nowrap;
    font-size: 24px;
    font-weight: 900;
    width: 250px;
    text-wrap: wrap;
  }

  &__format {
    white-space: nowrap;
    width: 90px;
  }
  &__rank-range {
    white-space: nowrap;
    width: 90px;
  }

  &__delete {
    position: absolute;
    right: -35px;
  }
}

@media screen and (max-width: 600px) {
  .tournament-card {
    border-radius: var(--base-border-radius);
    flex-direction: column;
    justify-content: space-evenly;
    min-height: 140px;
    padding: 10px;

    &__format {
      order: 2;
    }
  }
}
</style>
