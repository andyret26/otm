import { createRouter, createWebHistory } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
