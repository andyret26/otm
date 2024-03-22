import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { FaSearch } from 'oh-vue-icons/icons'

addIcons(FaSearch)

const app = createApp(App)

app.use(router)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH_DOMAIN,
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID
  })
)

app.component('v-icon', OhVueIcon)

app.mount('#app')
