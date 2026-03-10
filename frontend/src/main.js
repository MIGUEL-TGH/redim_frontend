import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false

// =========================================================
// INTERCEPTOR GLOBAL DE AXIOS
// =========================================================
// axios.interceptors.response.use(
//   // Si la respuesta es exitosa (código 2xx), simplemente la dejamos pasar
//   response => response,

//   // Si hay un error en la respuesta
//   error => {
//     // Verificamos si el error existe y si el código HTTP es 401 (Unauthorized)
//     if (error.response && error.response.status === 401) {
//       console.warn('Sesión expirada o token inválido detectado por Axios')

//       // 1. Ejecutamos la acción de logout de tu store (limpia localStorage y estado)
//       store.dispatch('storeDB/logout')

//       // 2. Opcional pero recomendado: Disparamos una notificación usando tu store de notificaciones
//       store.dispatch('storeNotif/warning', {
//         message: 'Tu sesión ha expirado por inactividad. Por favor, ingresa de nuevo.'
//       })

//       // 3. Redirigimos al administrador (login), validando que no estemos ya ahí
//       // El .catch(() => {}) evita un error en consola si Vue Router intenta ir a la misma ruta
//       if (router.currentRoute.path !== '/administrator') {
//         router.push('/administrator').catch(() => {})
//       }
//     }

//     // Retornamos el error para que tus catch(error) en los mixins o componentes sigan funcionando
//     return Promise.reject(error)
//   }
// )
// =========================================================
// =========================================================
// INTERCEPTOR GLOBAL DE AXIOS
// =========================================================
axios.interceptors.response.use(
  response => response,
  error => {
    // Verificamos que exista el error y sea un 401
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config

      // Si la petición NO iba dirigida al login, entonces es un token expirado/inválido
      if (!originalRequest.url.includes('auth/login')) {
        console.warn('Sesión expirada o token inválido detectado por Axios')

        store.dispatch('storeDB/logout')

        store.dispatch('storeNotif/warning', {
          message: 'Tu sesión ha expirado por inactividad o falta de permisos. Por favor, ingresa de nuevo.'
        })

        if (router.currentRoute.path !== '/administrator') {
          router.push('/administrator').catch(() => {})
        }
      }
      // Si la petición SÍ era del login, el interceptor la ignora
      // y deja que tu catch en LoginView.vue maneje el error de "Credenciales incorrectas"
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
