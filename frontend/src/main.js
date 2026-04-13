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
axios.interceptors.response.use(
  response => response, // Si la respuesta es exitosa (200-299)
  error => {
    // Si no hay respuesta del servidor (error de red o Apache caído)
    if (!error.response) {
      store.dispatch('storeNotif/error', {
        message: 'Error de conexión con el servidor. Verifica tu internet.'
      })
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Mapeo de errores según el código de estado HTTP enviado por PHP
    switch (status) {
      case 401: // No autorizado / Token expirado
        // Si no estamos ya en la pantalla de login, limpiamos y redirigimos
        if (router.currentRoute.path !== '/administrator') {
          store.dispatch('storeDB/logout')
          store.dispatch('storeNotif/warning', {
            message: 'Tu sesión ha expirado. Por favor, ingresa de nuevo.'
          })
          router.push('/administrator').catch(() => {})
        }
        break

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

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
