import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/MainView.vue'
import RoutesDashBoard from './RoutesDashBoard'

Vue.use(VueRouter)

const routes = [
  ...RoutesDashBoard,
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/mapa',
    name: 'MapView',
    component: () => import('../views/ArcGISMapView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
