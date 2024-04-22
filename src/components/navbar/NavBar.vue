<template>
  <div class="navbar">
    <div class="navbar__inner">
      <div class="navbar__left">
        <RouterLink class="navbar__logo-wrapper" to="/">
          <img class="navbar__logo" src="/Otm-logo.png" alt="logo" />
        </RouterLink>
        <InputField icon-name="fa-search" placeholder="Search tournament..." v-model="searchText" />
      </div>

      <div class="navbar__right">
        <ProfileMenu v-if="isAuthenticated" :user="user" :logout="handleLogout" />
        <ButtonComp
          v-else
          class="navbar__login-btn"
          @click="handleLogin"
          btn-text="Login"
          color="pink"
          text-color="black"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputField from '../common/InputField.vue'
import ButtonComp from '../common/ButtonComp.vue'
import ProfileMenu from './ProfileMenu.vue'
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { addHost } from '@/Api/OtmApi'

var router = useRouter()
var { isAuthenticated, loginWithPopup, user, logout, idTokenClaims } = useAuth0()
const searchText = ref('')

const handleLogin = async () => {
  await loginWithPopup()
  await addHost(user!.value!.sub!, idTokenClaims.value!.__raw)
  router.push(`/user/${user.value?.sub?.split('|')[2]}/dashboard`)
}
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

  &__logo-wrapper {
    color: white;
    cursor: pointer;
    width: 55px;
    height: 55px;
    border-radius: 99999px;
  }

  &__logo {
    width: inherit;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
