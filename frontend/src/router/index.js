import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/MainView.vue'
import MapView from '../views/ArcGISMapView.vue'
import RoutesDashBoard from './RoutesDashBoard'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  ...RoutesDashBoard,
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/mapa',
  //   name: 'MapView',
  //   component: () => import('../views/ArcGISMapView.vue')
  // },
  {
    path: '/',
    name: 'home',
    component: MapView
  },
  {
    path: '/administrator',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/charts',
    name: 'ChartsView',
    component: () => import('../views/testCharts.vue')
  },
  // --------------------------------------------------------------------------------
  // RUTA 404 (COMODÍN) - DEBE IR SIEMPRE AL FINAL
  // --------------------------------------------------------------------------------
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Guardián de navegación global
router.beforeEach((to, from, next) => {
  // 1. Obtenemos el estado de autenticación usando el namespace correcto 'storeDB'
  const isAuthenticated = store.getters['storeDB/isAuthenticated']

  // 2. Si el usuario ya está logueado e intenta ir al login (/administrator)
  if (to.path === '/administrator' && isAuthenticated) {
    next('/dashboard/') // Lo redirigimos al inicio de su panel
    return // Detenemos la ejecución de este ciclo
  }

  // 3. Si la ruta requiere autenticación y NO está logueado
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/administrator')
  } else {
    // 4. Protección a nivel de submódulo (si aplica)
    if (to.meta && to.meta.moduleName) {
      const hasAccess = store.getters['storeDB/hasModuleAccess'](to.meta.moduleName)
      if (hasAccess) {
        next()
      } else {
        // Si no tiene permiso para ese módulo, lo regresamos a la raíz del dashboard
        next('/dashboard/')
      }
    } else {
      next() // Permitir el paso para cualquier otra ruta pública
    }
  }
})

export default router
