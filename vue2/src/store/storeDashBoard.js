
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
      // console.log('decoded', decoded)

      // Validar si el token ya expiró
      const currentTime = Date.now() / 1000
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token')
        return { token: '', user: null, permissions: [], notifications: [] }
      }
      // Se extraen los datos del token
      user = decoded.data
      permissions = decoded.data.permissions || []

      // Configuración de axios para incluir el token en cada petición
      // axios.defaults.headers.common.Authorization = `Bearer ${token}`
      axios.defaults.headers.common['X-Authorization'] = `Bearer ${token}`
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
    // Verifica si tiene acceso a un módulo específico
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
    // Aplica un token al estado: lo decodifica, configura axios y actualiza el store.
    // NO escribe en localStorage (de eso se encarga quien obtuvo el token).
    // Centraliza la lógica usada por login, silentRefresh y la sincronización entre pestañas.
    applyToken ({ commit }, token) {
      const decoded = jwtDecode(token)
      const permissions = decoded.data.permissions || []
      axios.defaults.headers.common['X-Authorization'] = `Bearer ${token}`
      commit('SET_AUTH', { token, user: decoded.data, permissions })
    },
    async login ({ dispatch }, credentials) {
      // Sin try/catch a propósito: dejamos que el error (401 credenciales, 403 inactivo,
      // error de red) se propague a la vista para mostrar el mensaje real del backend.
      const url = `${process.env.VUE_APP_API_SERVER}auth/login`
      const response = await axios.post(url, credentials)
      if (response.data.success) {
        const { token } = response.data.result
        localStorage.setItem('token', token)
        dispatch('applyToken', token)
        return true
      }
      return false
    },
    logout ({ commit }) {
      localStorage.removeItem('token')
      // delete axios.defaults.headers.common.Authorization
      delete axios.defaults.headers.common['X-Authorization']
      commit('LOGOUT')
    },
    async silentRefresh ({ dispatch, commit }) {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}auth/refresh`
        // Axios inyecta el token actual gracias a defaults.headers
        const response = await axios.post(url, {})
        if (response.data.success) {
          const { token } = response.data.result
          // Se sobrescribe el token viejo con el nuevo
          localStorage.setItem('token', token)
          dispatch('applyToken', token)
          return true
        }
        return false
      } catch (error) {
        // Si falla (ej. el backend rechazó el token viejo), limpiamos la sesión
        commit('LOGOUT')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['X-Authorization']
        return false
      }
    }
  },
  modules: { }
}
