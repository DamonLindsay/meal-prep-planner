import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import TabsPage from '@/views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/dashboard'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/tabs/dashboard' },
      { path: 'dashboard', component: () => import('@/views/DashboardView.vue') },
      { path: 'meals', component: () => import('@/views/MealsView.vue') },
      { path: 'planner', component: () => import('@/views/PlannerView.vue') },
      { path: 'settings', component: () => import('@/views/SettingsView.vue') }
    ]
  }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})