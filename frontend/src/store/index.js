import Vue from 'vue'
import Vuex from 'vuex'

import storeDashBoard from './storeDashBoard.js'
import storeNotifications from './storeNotifications.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: null,
    urlParams: null,

    dialog_loader: { actived: false, message: '' }
  },
  getters: { },
  mutations: {

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
    }
  },
  modules: {
    storeDB: storeDashBoard,
    storeNotif: storeNotifications
  }
})
