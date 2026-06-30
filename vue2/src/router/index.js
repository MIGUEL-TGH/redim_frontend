import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/MainView.vue'
// import MapView from '../views/ArcGISMapView_v3.vue'
// import MapView from '../views/ArcGISMapView.vue'
import RoutesDashBoard from './RoutesDashBoard'
import store from '../store'
import axios from 'axios'

Vue.use(VueRouter)

const routes = [
  ...RoutesDashBoard,
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio', track: true, viewKey: 'home' }
  },
  // {
  //   path: '/',
  //   name: 'home',
  //   component: MapView,
  //   meta: { title: 'Mapa' }
  // },
  {
    path: '/mapa',
    name: 'MapView',
    component: () => import('../views/ArcGISMapView.vue'),
    meta: { title: 'Mapa', track: true, viewKey: 'mapa' }
  },
  {
    path: '/mapa_v1',
    name: 'MapViewV1',
    component: () => import('../views/ArcGISMapView_v3.vue'),
    meta: { title: 'Mapa V1' }
  },
  {
    path: '/administrator',
    name: 'LoginView',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Administrador' }
  },
  // ===================================================================================
  {
    path: '/contexto',
    name: 'ContextoView',
    component: () => import('../views/ContextoView.vue'),
    meta: { title: 'Contexto', track: true, viewKey: 'contexto' }
  },
  {
    path: '/voces',
    name: 'vocesView',
    component: () => import('../views/VocesView.vue'),
    meta: { title: 'Voces', track: true, viewKey: 'voces' }
  },
  {
    path: '/miradas',
    name: 'MiradasView',
    component: () => import('../views/MiradasView.vue'),
    meta: { title: 'Miradas', track: true, viewKey: 'miradas' }
  },
  {
    path: '/tv-ninez-primero',
    name: 'TVNinezPrimeroView',
    component: () => import('../views/TVView.vue'),
    meta: { title: 'TV Niñez Primero', track: true, viewKey: 'tv' }
  },
  {
    path: '/actuamos',
    name: 'ActuamosView',
    component: () => import('../views/UnderConstructionView.vue'),
    meta: { title: 'Actuamos', track: true, viewKey: 'actuamos' }
  },
  {
    path: '/recursos',
    name: 'RecursosView',
    component: () => import('../views/RecursosView.vue'),
    meta: { title: 'Recursos', track: true, viewKey: 'recursos' }
  },
  {
    path: '/transparencia',
    name: 'TransparenciaView',
    component: () => import('../views/UnderConstructionView.vue'),
    meta: { title: 'Transparencia', track: true, viewKey: 'transparencia' }
  },
  // ===================================================================================

  {
    path: '/charts',
    name: 'ChartsView',
    component: () => import('../views/testCharts.vue'),
    meta: { title: 'Gráficos' }
  },
  // --------------------------------------------------------------------------------
  // RUTA 404 (COMODÍN) - DEBE IR SIEMPRE AL FINAL
  // --------------------------------------------------------------------------------
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'No Encontrado' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// ======================================================================================================================================================
// Definimos el nombre base de tu sistema en una sola variable para facilitar su mantenimiento y consistencia en el título de las páginas
const baseTitle = 'Niñez Primero - REDIM' // 'Niños, Niñas y Adolescentes en México - REDIM'

router.beforeEach((to, from, next) => {
  // Verificamos si la ruta a la que vamos tiene un título en su meta
  const pageTitle = to.meta.title

  // Si tiene título, lo concatenamos. Si no, dejamos solo el base.
  if (pageTitle) {
    document.title = `${pageTitle} | ${baseTitle}`
  } else {
    document.title = baseTitle
  }

  // ¡Muy importante! Siempre debes llamar a next() para que la vista cargue
  next()
})

// ======================================================================================================================================================
// Guardián de navegación global para proteger rutas que requieren autenticación
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
      // console.log(hasAccess)
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

// ======================================================================================================================================================
// Contador de visitas de vistas públicas (escalable / auto-registrable).
// Cualquier ruta con meta.track + meta.viewKey se contabiliza automáticamente.
// La identidad es meta.viewKey (INMUTABLE): aunque cambie el título o el path,
// el histórico se conserva. NUNCA cambies un viewKey ya publicado.
function trackVisit (viewKey, path, label) {
  try {
    // Dedupe ligero por sesión: evita repetir la petición en la misma sesión/día.
    // El conteo "real" de visita única lo resuelve el backend por IP + día.
    const today = new Date().toISOString().slice(0, 10)
    const flag = `visit_${viewKey}_${today}`
    if (sessionStorage.getItem(flag)) return
    sessionStorage.setItem(flag, '1')
  } catch (e) {
    // sessionStorage puede no estar disponible (modo privado); seguimos igual.
  }

  const url = `${process.env.VUE_APP_API_SERVER}visits?type=hit`
  // Fire-and-forget: una visita nunca debe romper ni bloquear la navegación.
  axios.post(url, { viewKey, path, label }).catch(() => {})
}

router.afterEach((to) => {
  if (to.meta && to.meta.track && to.meta.viewKey) {
    trackVisit(to.meta.viewKey, to.path, to.meta.title)
  }
})

export default router
