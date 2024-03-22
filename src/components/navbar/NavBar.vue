<template>
  <div class="navbar">
    <div class="navbar__inner">
      <div class="navbar__left">
        <div class="navbar__logo-wrapper">
          <img class="navbar__logo" src="" alt="logo" />
        </div>
        <InputField icon-name="fa-search" placeholder="Search tournament..." v-model="searchText" />
      </div>

      <div class="navbar__right">
        <ProfileMenu v-if="isAuthenticated" :user="user" :logout="handleLogout" />
        <ButtonComp
          v-else
          class="navbar__login-btn"
          @click="loginWithPopup()"
          btn-text="Login"
          color="pink"
          text-color="black"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputField from '../general-purpose/InputField.vue'
import ButtonComp from '../general-purpose/ButtonComp.vue'
import ProfileMenu from './ProfileMenu.vue'
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

var { isAuthenticated, loginWithPopup, user, logout } = useAuth0()
const searchText = ref('')

const handleLogout = () => {
  logout({ logoutParams: { returnTo: window.location.origin } })
}
</script>

<style scoped lang="scss">
.navbar {
  background-color: #3d2832;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;

  &__inner {
    width: 100%;
    max-width: 1000px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
