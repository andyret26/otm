import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/public/HomeView.vue')
    },
    {
      path: '/user/:id',
      name: 'User',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('../views/admin/DashboardView.vue')
        }
      ]
    },
    {
      path: '/tournament/:id',
      name: 'Tournament',
      component: () => import('../views/public/TournamentView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/mappool',
      name: 'Mappool',
      component: () => import('@/views/public/MappoolView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/stats',
      name: 'Stats',
      component: () => import('@/views/public/StatsView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/schedule',
      name: 'Schedule',
      component: () => import('@/views/public/ScheduleView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/quals-schedule',
      name: 'Quals-schedule',
      component: () => import('@/views/public/QualsScheduleView.vue')
    }, // ##### ADMIN ROUTES #####
    {
      path: '/tournament/:id/round/:roundId/quals-schedule/admin',
      name: 'Quals-schedule-admin',
      component: () => import('@/views/admin/QualsScheduleAdminView.vue')
    },
    {
      path: '/tournament/:id/round/:roundId/stats/admin',
      name: 'Stats-admin',
      component: () => import('@/views/admin/StatsAdminView.vue')
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
