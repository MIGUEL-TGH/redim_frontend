import Vue from 'vue'
import Vuex from 'vuex'

import storeDashBoard from './storeDashBoard.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // login
    // token: localStorage.getItem('token') || '',
    // user: null,
    // permissions: [],

    url: null,
    urlParams: null,

    notifications: [],
    dialog_loader: { actived: false, message: '' }
  },
  getters: {
    // login
    // isAuthenticated: state => !!state.token,
    // userPermissions: state => state.permissions,
    // hasModuleAccess: (state) => (moduleName) => {
    //   return state.permissions.some(p => p.module === moduleName)
    // }
  },
  mutations: {
    // -------------------------- notifications -----------------------------------------
    PUSH (state, payload) {
      const maxLength = 2
      if (state.notifications.length >= maxLength) {
        // cola --> FIFO (First In, First Out) eliminar primero en entrar
        // pila --> LIFO (Last In, First Out) eliminar ultimo en entrar
        // state.notifications.shift()      // FIFO
        state.notifications.splice(0, 1) // FIFO
      }
      state.notifications.push(payload)
    },
    REMOVE (state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    }
    // -------------------------- login ----------------------------------------
    // AUTH_SUCCESS (state, { token, user, permissions }) {
    //   state.token = token
    //   state.user = user
    //   state.permissions = permissions
    // },
    // LOGOUT (state) {
    //   state.token = ''
    //   state.user = null
    //   state.permissions = []
    // }

  },
  actions: {
    // -------------------------------------------------------------------
    async setSleep (context, ms) {
      try {
        return new Promise(resolve => setTimeout(resolve, ms))
      } catch (error) {
        console.log(error)
      }
    },
    async truncateText (context, { text, maxLength }) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    },
    async getParams ({ state }, event) {
      state.url = new URL(window.location)
      state.urlParams = await new URLSearchParams(state.url.search)
    },

    // -------------------------- notifications -----------------------------------------
    notify ({ commit }, { message, type = 'info', duration = 3000, icon = '' }) {
      const id = Date.now() + Math.random()
      commit('PUSH', { id, message, type, icon })

      setTimeout(() => {
        commit('REMOVE', id)
      }, duration)
    },
    success (_, payload) {
      this.dispatch('notify', { ...payload, type: 'success', icon: '✔' })
    },
    error (_, payload) {
      this.dispatch('notify', { ...payload, type: 'error', icon: '✖' })
    },
    info (_, payload) {
      this.dispatch('notify', { ...payload, type: 'info', icon: 'ℹ' })
    },
    warning (_, payload) {
      this.dispatch('notify', { ...payload, type: 'warning', icon: '⚠' })
    }
    // -------------------------- login ----------------------------------------
    // async login ({ commit }, credentials) {
    //   try {
    //     const response = await axios.post('http://192.168.100.20/redim_backend/api/auth/login', credentials)
    //     if (response.data.success) {
    //       const { token, user } = response.data.result

    //       // Decodificar el token para extraer los permisos
    //       const decodedToken = jwtDecode(token)
    //       const permissions = decodedToken.data.permissions
    //       console.log(permissions)
    //       // Guardar en localStorage y configurar Axios
    //       localStorage.setItem('token', token)
    //       // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //       axios.defaults.headers.common.Authorization = `Bearer ${token}`
    //       commit('AUTH_SUCCESS', { token, user, permissions })
    //       return true
    //     }
    //     return false
    //   } catch (error) {
    //     console.error('Error en login:', error)
    //     throw error
    //   }
    // },
    // logout ({ commit }) {
    //   localStorage.removeItem('token')
    //   // delete axios.defaults.headers.common['Authorization']
    //   delete axios.defaults.headers.common.Authorization
    //   commit('LOGOUT')
    // }

    // -------------------------------------------------------------------

  },
  modules: {
    // DB: storeDashBoard
    dashboard: storeDashBoard
  }
  // actions: {
  //   async truncateText (text, maxLength) {
  //     if (text.length > maxLength) {
  //       return text.substring(0, maxLength) + '...'
  //     }
  //     return text
  //   }
  // }
})
