import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/MainView.vue'
import RoutesDashBoard from './RoutesDashBoard'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  ...RoutesDashBoard,
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mapa',
    name: 'MapView',
    component: () => import('../views/ArcGISMapView.vue')
  },
  {
    path: '/administrator',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue')
  },
  // --------------------------------------------------------------------------------
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Guardián de navegación global
router.beforeEach((to, from, next) => {
  // Usamos el namespace del módulo (asumiendo que lo registraste como 'dashboard')
  const isAuthenticated = store.getters['storeDB/isAuthenticated']

  // Si la ruta requiere autenticación y no está logueado
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/administrator') // Lo mandamos a tu LoginView
  } else {
    // Protección a nivel de submódulo
    if (to.meta && to.meta.moduleName) {
      const hasAccess = store.getters['storeDB/hasModuleAccess'](to.meta.moduleName)
      if (hasAccess) {
        next()
      } else {
        // Si no tiene permiso para ese módulo, lo regresamos al inicio del dashboard
        next('/dashboard')
      }
    } else {
      next()
    }
  }
})

export default router
