import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import CesiumBox from '@/views/cesium/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/cesium",
  },
  {
    path: "/cesium",
    name: "cesium",
    component: CesiumBox,
  },
  {
    path: "/VirtualScrolling",
    name: "VirtualScrolling",
    component: () => import("@/views/VirtualScrolling/VirtualScrolling.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
