import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialog_loader: { actived: false, message: '' }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async setSleep (context, ms) {
      try {
        return new Promise(resolve => setTimeout(resolve, ms))
      } catch (error) {
        console.log(error)
      }
    }
  },
  modules: {
  }
})
