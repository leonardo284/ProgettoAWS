import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import StandingsPage from '@/pages/StandingPage.vue'
import CalendarPage from '@/pages/CalendarListPage.vue';

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
      component: () => import('@/pages/TeamDetailPage.vue'),
      children: [
        { path: '', name: 'TeamOverview', component: () => import('@/components/teams/tabs/TeamOverviewTab.vue') },
        { path: 'squadra', name: 'TeamSquad', component: () => import('@/components/teams/tabs/TeamSquadTab.vue') },
        { path: 'calendario', name: 'TeamMatches', component: () => import('@/components/teams/tabs/TeamMatchesTab.vue') },
        { path: 'statistiche', name: 'TeamStats', component: () => import('@/components/teams/tabs/TeamStatsTab.vue') }
      ]
    },
    {
      path: '/match/:id',
      name: 'MatchDetail',
      component: () => import('@/pages/MatchDetailPage.vue')
    },
    {
    path: '/calendario',
    name: 'Calendar',
    component: CalendarPage,
    meta: { title: 'Calendario e Risultati - Campionato 2025/2026' }
  },


  ]
})

export default router
