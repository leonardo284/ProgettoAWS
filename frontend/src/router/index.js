import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import StandingsPage from '@/pages/StandingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/classifica',
      name: 'standings',
      component: StandingsPage
    },
    {
      path: '/club',
      name: 'teams',
      component: () => import('@/pages/TeamsPage.vue')
    },
    {
      path: '/club/:id',
      name: 'TeamDetail',
      component: () => import('@/pages/TeamDetailPage.vue')
    }

  ]
})

export default router
