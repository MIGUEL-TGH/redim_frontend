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
    },
    async truncateText (text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    },
    async setNotifications (context, item) {
      try {
        console.log('setNotifications ()-->', this.$ref)
        // if (store.$notifier) {
        //   const ALERTS = {
        //     success: async () => { store.$notifier.success(item.message, item.ms, item.icon); },
        //     error: async () => { store.$notifier.error(item.message, item.ms); },
        //     info: async () => { store.$notifier.info(item.message, item.ms); },
        //     warning: async () => { store.$notifier.warning(item.message, item.ms); },
        //     notifySO: async () => {
        //       Notification.requestPermission()
        //         .then(permission => {
        //           if(permission === 'granted'){
        //               new Notification(item.message);
        //           }else{
        //               alert(item.message);
        //           }
        //         });
        //     }
        //     };
        //     ALERTS[item.type] ? await ALERTS[item.type]() : console.log('¡alert type not found!');
        // } else {
        //   console.warn("El notificador aún no está montado");
        // }
      } catch (error) {
        console.log(error)
        // console.log(error.response.data);
      }
      // finally { }
    }
  },
  modules: {
  }
})
