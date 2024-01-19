import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const map = () => import('@/components/map/index.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'map',
    component: map
  },
  {
    path: '/cesium',
    name: 'cesium',
    component: () => import('@/views/cesium/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
