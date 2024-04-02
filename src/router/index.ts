import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/:userId/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue')
    }
  ]
})

export default router
