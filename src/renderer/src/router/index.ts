import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import pickerRoutes from './picker'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'MouseControl',
        component: () => import('../views/MouseControl.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/About.vue')
      }
    ]
  },
  ...pickerRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
