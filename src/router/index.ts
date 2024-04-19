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
        }
      ]
    },
    {
      path: '/tournament/:id',
      name: 'Tournament',
      component: () => import('../views/TournamentView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/mappool',
      name: 'mappool',
      component: () => import('@/views/MappoolView.vue')
    },
    {
      path: '/tournament/:id/round/:name/stats',
      name: 'stats',
      component: () => import('@/views/StatsView.vue')
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
