import { type RouteRecordRaw } from 'vue-router'

const pickerRoutes: RouteRecordRaw[] = [
  {
    path: '/picker',
    name: 'Picker',
    component: () => import('../windows/PickerWindow.vue')
  }
]

export default pickerRoutes
