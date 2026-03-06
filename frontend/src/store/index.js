import Vue from 'vue'
import Vuex from 'vuex'
import storeDashBoard from './storeDashBoard.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: null,
    urlParams: null,

    notifications: [],
    dialog_loader: { actived: false, message: '' }
  },
  getters: {
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
    // -------------------------------------------------------------------
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
    // -------------------------------------------------------------------
  },
  modules: {
    DB: storeDashBoard
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
