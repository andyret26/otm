<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Welcome to Osu! Tournament Maker</h1>
      <h3 class="home__subtext">Create and manage your own tournament by logging in.</h3>
      <h3 class="home__subtext home__subtext--emphasis">or</h3>
      <h3 class="home__subtext">
        Participate in a fun tournament by searching for one down below.
      </h3>
    </div>

    <div class="home__divider"></div>

    <div class="home__content">
      <InputField icon-name="fa-search" placeholder="Search tournament..." v-model="searchText" />
      <div class="home__tournaments-container">
        <TournamentCard
          v-for="tournament in filteredTournaments"
          :key="tournament.id"
          :tournament="tournament"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAllTournaments } from '@/Api/OtmApi'
import type { Tournament } from '@/Types'
import TournamentCard from '@/components/cards/TournamentCard.vue'
import InputField from '@/components/common/InputField.vue'
import { computed, onMounted, ref } from 'vue'

const searchText = ref('')
const tournaments = ref<Tournament[]>([])
const filteredTournaments = computed<Tournament[]>(() =>
  tournaments.value.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchText.value.toLowerCase())
  )
)

onMounted(async () => {
  tournaments.value = await getAllTournaments()
})
</script>

<style scoped lang="scss">
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;

  &__subtext {
    margin: 3px;
  }

  &__divider {
    width: 100%;
    height: 2px;
    background-color: var(--osu-yellow);
    margin: 30px 0;
  }

  &__content {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__tournaments-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-height: 45vh;

    gap: 10px;
    overflow-y: auto;
    border-radius: 20px;
    margin: 15px;
    padding: 5px;
  }
}
</style>
