
export default {
  namespaced: true,
  state: {
    notifications: []
  },
  getters: { },
  mutations: {
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
  },
  actions: {
    notify ({ commit }, { message, type = 'info', duration = 3000, icon = '' }) {
      const id = Date.now() + Math.random()
      commit('PUSH', { id, message, type, icon })

      setTimeout(() => {
        commit('REMOVE', id)
      }, duration)
    },
    success (_, payload) {
      this.dispatch('storeNotif/notify', { ...payload, type: 'success', icon: '✔' })
    },
    error (_, payload) {
      this.dispatch('storeNotif/notify', { ...payload, type: 'error', icon: '✖' })
    },
    info (_, payload) {
      this.dispatch('storeNotif/notify', { ...payload, type: 'info', icon: 'ℹ' })
    },
    warning (_, payload) {
      this.dispatch('storeNotif/notify', { ...payload, type: 'warning', icon: '⚠' })
    }
  },
  modules: { }
}
