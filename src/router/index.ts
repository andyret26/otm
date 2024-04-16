import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/user/:id',
      name: 'User',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: '/tournament/:id',
          name: 'Tournament',
          component: () => import('../views/TournamentView.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth0()
  if (!isAuthenticated.value && to.name == 'Dashboard') {
    return '/'
  }
})

export default router
