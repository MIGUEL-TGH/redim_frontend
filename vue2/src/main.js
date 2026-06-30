import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false

// =========================================================
// =========================================================
// INTERCEPTOR GLOBAL DE AXIOS
// =========================================================

// Detecta los endpoints de autenticación para NO intentar renovar/redirigir sobre ellos
// (evita bucles infinitos: un 401 del propio /auth/refresh re-entraría al interceptor).
function isAuthEndpoint (url) {
  if (!url) return false
  return url.includes('/auth/login') || url.includes('/auth/refresh')
}

// Renovación serializada: si llegan varios 401 a la vez, comparten un único refresh
// en lugar de disparar N peticiones a /auth/refresh.
let refreshPromise = null
function refreshTokenOnce () {
  if (!refreshPromise) {
    refreshPromise = store.dispatch('storeDB/silentRefresh')
      .then(ok => ok === true)
      .catch(() => false)
      .finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

// Cierre de sesión + aviso + redirección (con dedupe del aviso ante 401 concurrentes).
let logoutNotified = false
function forceLogout (message) {
  store.dispatch('storeDB/logout')
  if (message && !logoutNotified) {
    logoutNotified = true
    store.dispatch('storeNotif/warning', { message })
    setTimeout(() => { logoutNotified = false }, 3000)
  }
  if (router.currentRoute.path !== '/administrator') {
    router.push('/administrator').catch(() => {})
  }
}

axios.interceptors.response.use(
  response => response, // Si la respuesta es exitosa (200-299)
  async error => {
    // Si no hay respuesta del servidor (error de red o Apache caído)
    if (!error.response) {
      store.dispatch('storeNotif/error', {
        message: 'Error de conexión con el servidor. Verifica tu internet.'
      })
      return Promise.reject(error)
    }

    const { status, data } = error.response
    const originalRequest = error.config
    const authEndpoint = isAuthEndpoint(originalRequest && originalRequest.url)

    // -----------------------------------------------------------------
    // 401: intento de renovación reactiva ANTES de cerrar la sesión.
    // (No aplica a /auth/login ni /auth/refresh, que maneja quien los llamó.)
    // -----------------------------------------------------------------
    if (status === 401 && !authEndpoint) {
      const canTryRefresh = store.getters['storeDB/isAuthenticated'] && !originalRequest._retry

      if (canTryRefresh) {
        originalRequest._retry = true // Marca para no reintentar en bucle
        const refreshed = await refreshTokenOnce()
        if (refreshed) {
          // Reinyectamos el token nuevo y reintentamos la petición original
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers['X-Authorization'] = `Bearer ${store.state.storeDB.token}`
          return axios(originalRequest)
        }
      }

      // No se pudo (o no se debía) renovar → cerrar sesión y redirigir
      forceLogout('Tu sesión ha expirado. Por favor, ingresa de nuevo.')
      return Promise.reject(error)
    }

    // Para endpoints de auth dejamos que el componente (LoginView) muestre el mensaje real
    if (authEndpoint) {
      return Promise.reject(error)
    }

    // -----------------------------------------------------------------
    // Resto de códigos: notificaciones genéricas
    // -----------------------------------------------------------------
    switch (status) {
      case 403: // Prohibido (Falta de permisos de módulo)
        store.dispatch('storeNotif/warning', {
          message: data.message || 'No tienes permisos para realizar esta acción.'
        })
        break

      case 422: // Errores de Validación (ValidationException)
        store.dispatch('storeNotif/warning', {
          message: data.message || 'Datos inválidos. Revisa los campos marcados.'
        })
        break

      case 404: // Recurso no encontrado
        store.dispatch('storeNotif/info', {
          message: data.message || 'El registro solicitado no existe.'
        })
        break

      case 500: // Error Crítico (DatabaseException / Throwable)
        store.dispatch('storeNotif/error', {
          message: 'Error interno del servidor. Contacta al administrador.'
        })
        break

      default:
        store.dispatch('storeNotif/error', {
          message: data.message || 'Ocurrió un error inesperado.'
        })
    }

    return Promise.reject(error)
  }
)

// =========================================================
// SINCRONIZACIÓN DE SESIÓN ENTRE PESTAÑAS
// =========================================================
// El evento 'storage' se dispara en las OTRAS pestañas cuando cambia localStorage.
// Así un login/logout/renovación en una pestaña se propaga al resto.
window.addEventListener('storage', (event) => {
  if (event.key !== 'token') return

  if (!event.newValue) {
    // Otra pestaña cerró sesión (o el token expiró) → cerramos aquí también
    store.dispatch('storeDB/logout')
    if (router.currentRoute.path !== '/administrator' &&
        router.currentRoute.matched.some(r => r.meta.requiresAuth)) {
      router.push('/administrator').catch(() => {})
    }
  } else if (event.newValue !== store.state.storeDB.token) {
    // Otra pestaña inició sesión o renovó el token → sincronizamos sin reescribir storage
    store.dispatch('storeDB/applyToken', event.newValue)
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
