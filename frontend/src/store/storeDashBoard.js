export default {
  namespaced: true,
  state: {
    notifications: []
  },
  getters: {
  },
  mutations: {
    // PUSH (state, payload) {
    //   const maxLength = 3
    //   if (state.notifications.length >= maxLength) {
    //     state.notifications.shift()
    //   }
    //   state.notifications.push(payload)
    // },
    // REMOVE (state, id) {
    //   state.notifications = state.notifications.filter(n => n.id !== id)
    // }
  },
  actions: {
    // notify ({ commit }, { message, type = 'info', duration = 3000, icon = '' }) {
    //   const id = Date.now() + Math.random()
    //   commit('PUSH', { id, message, type, icon })

    //   setTimeout(() => {
    //     commit('REMOVE', id)
    //   }, duration)
    // },
    // success (_, payload) {
    //   this.dispatch('DB/notify', { ...payload, type: 'success', icon: '✔' })
    // },
    // error (_, payload) {
    //   this.dispatch('DB/notify', { ...payload, type: 'error', icon: '✖' })
    // }
  },
  modules: { }
}
