import { createRouter, createWebHistory } from 'vue-router'
import Stock from '../views/Stock.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'stock',
      component: Stock
    }
  ]
})

export default router
