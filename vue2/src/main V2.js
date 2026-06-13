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
  response => response,
  error => {
    // Verificamos que exista el error y sea un 401
    // if (error.response && error.response.status === 401) {
    //   const originalRequest = error.config

    //   // Si la petición NO iba dirigida al login, entonces es un token expirado/inválido
    //   if (!originalRequest.url.includes('auth/login')) {
    //     console.warn('Sesión expirada o token inválido detectado por Axios')

    //     store.dispatch('storeDB/logout')

    //     store.dispatch('storeNotif/warning', {
    //       message: 'Tu sesión ha expirado por inactividad o falta de permisos. Por favor, ingresa de nuevo.'
    //     })

    //     if (router.currentRoute.path !== '/administrator') {
    //       router.push('/administrator').catch(() => {})
    //     }
    //   }
    //   // Si la petición SÍ era del login, el interceptor la ignora
    //   // y deja que tu catch en LoginView.vue maneje el error de "Credenciales incorrectas"
    // }

    // return Promise.reject(error)
    // =======================================================================================

    const { status, data } = error.response
    switch (status) {
      case 401: // No autorizado / Token expirado
        store.dispatch('storeDB/logout')
        store.dispatch('storeNotif/error', {
          message: 'Tu sesión ha expirado. Por favor, ingresa de nuevo.'
        })
        router.push('/administrator')
        break

      case 422: // Errores de Validación (ValidationException en PHP)
        // Aquí puedes disparar una notificación que use el objeto 'errors' del backend
        store.dispatch('storeNotif/warning', {
          message: data.message || 'Revisa los campos del formulario.'
        })
        break

      case 403: // Prohibido (Sin permisos de módulo)
        store.dispatch('storeNotif/warning', {
          message: data.message || 'No tienes permisos para realizar esta acción.'
        })
        break

      case 500: // Error Crítico (DatabaseException o Throwable)
        store.dispatch('storeNotif/error', {
          message: 'Ocurrió un error en el servidor. Intenta más tarde.'
        })
        break

      default:
        store.dispatch('storeNotif/error', {
          message: data.message || 'Error inesperado de comunicación.'
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
