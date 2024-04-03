<template>
  <div class="profile-menu">
    <button class="profile-menu__btn" @click="isMenuOpen = !isMenuOpen">
      <img :src="user?.picture" alt="profile" class="profile-menu__img" />
    </button>
    <div class="profile-menu__dropdown" v-if="isMenuOpen" @click="isMenuOpen = false">
      <div class="profile-menu__list">
        <RouterLink class="profile-menu__item" :to="`/user/${user?.sub?.split('|')[2]}/dashboard`"
          >Dashboard
        </RouterLink>

        <RouterLink class="profile-menu__item" to="/">Profile</RouterLink>
        <RouterLink class="profile-menu__item" to="/">Settings</RouterLink>
        <button class="profile-menu__item" @click="logout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@auth0/auth0-vue'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  user?: User
  logout: () => void
}

defineProps<Props>()

const isMenuOpen = ref(false)

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.profile-menu')) {
      isMenuOpen.value = false
    }
  })
})
</script>

<style scoped lang="scss">
.profile-menu {
  position: relative;
  &__btn {
    height: 55px;
    border: none;
    padding: 0;
    border-radius: 9999px;
  }

  &__img {
    height: inherit;
    border-radius: inherit;
  }

  &__dropdown {
    background-color: var(--bg3);
    position: absolute;
    right: 0px;
    top: 64px;
    border-radius: var(--base-border-radius);
  }

  &__list {
    list-style-type: none;
    padding: 0;
    width: 150px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__item {
    width: 100%;
    max-width: 150px;
    padding: 10px 0px;
    text-align: center;
    color: var(--text1);
    cursor: pointer;
    background-color: inherit;
    border: none;
    text-decoration: none;

    &:hover {
      background-color: var(--bg2);
      position: relative;
      &::before {
        position: absolute;
        left: 20px;
        top: 9px;
        content: '';
        width: 5px;
        height: 15px;
        background-color: var(--osu-green);
        border-radius: 3px;
      }
    }

    &:focus {
      box-sizing: border-box;
      outline: 1px solid var(--osu-blue);
      border-radius: var(--base-border-radius);
    }
  }
}
</style>
