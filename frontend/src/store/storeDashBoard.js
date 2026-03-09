
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

// Esta función se ejecuta al cargar la app. Revisa si hay un token guardado.
const getInitialState = () => {
  const token = localStorage.getItem('token') || ''
  let user = null
  let permissions = []

  if (token) {
    try {
      const decoded = jwtDecode(token)
      // Validar si el token ya expiró
      const currentTime = Date.now() / 1000
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token')
        return { token: '', user: null, permissions: [], notifications: [] }
      }
      // Extraemos los datos del token
      user = decoded.data
      permissions = decoded.data.permissions || []
      // Dejamos configurado axios
      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    } catch (e) {
      localStorage.removeItem('token')
      return { token: '', user: null, permissions: [], notifications: [] }
    }
  }
  return { token, user, permissions, notifications: [] }
}

export default {
  namespaced: true,
  state: getInitialState(),
  getters: {
    isAuthenticated: state => !!state.token,
    // Verificamos si tiene acceso a un módulo específico
    hasModuleAccess: (state) => (moduleName) => {
      if (moduleName === 'welcome') return true // Todos acceden al inicio
      return state.permissions.some(p => p.module === moduleName)
    }
  },
  mutations: {
    SET_AUTH (state, { token, user, permissions }) {
      state.token = token
      state.user = user
      state.permissions = permissions
    },
    LOGOUT (state) {
      state.token = ''
      state.user = null
      state.permissions = []
    }
  },
  actions: {
    async login ({ commit }, credentials) {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}auth/login` // Ajusta tu URL
        const response = await axios.post(url, credentials)
        // console.log(response)
        if (response.data.success) {
          const { token, user } = response.data.result
          const decodedToken = jwtDecode(token)
          const permissions = decodedToken.data.permissions

          localStorage.setItem('token', token)
          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          axios.defaults.headers.common.Authorization = `Bearer ${token}`

          commit('SET_AUTH', { token, user, permissions })
          return true
        }
        return false
      } catch (error) {
        console.error('Error en login:', error)
        // console.log('Error expuesto')
        // this.$store.dispatch('storeNotif/warning', {
        //   message: 'Detectando errores'
        // })
        throw error
      }
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      // delete axios.defaults.headers.common['Authorization']
      delete axios.defaults.headers.common.Authorization
      commit('LOGOUT')
    }
  },
  modules: { }
}
