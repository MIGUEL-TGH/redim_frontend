<template>
  <div class="notifications">
    <br>
    <br>
    <transition-group name="slide" tag="div">
      <div v-for="n in notifications" :key="n.id" :class="['notification', n.type]" style="background-color: #282925ff;">
        <v-icon class="BtnHover notify-icon" color="white"> {{ n.icon }} </v-icon>
        <span> {{ n.message }} </span>
        <v-icon class="BtnHover close-icon" color="white" @click="closeNotify(n.id)"> mdi-close-circle </v-icon>
      </div>
    </transition-group>
  </div>
</template>
<script>
// import { mapState } from 'vuex'

export default {
  name: 'viewNotificationsComp',
  components: { // Importación de componentes hijos
  },
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      notifications: []
    }
  },
  computed: {
    // this.$store.$notifier = this
  },

  // 4️⃣ Observadores
  watch: { },

  // 5️⃣ Métodos
  methods: {
    notify (message, type = 'info', duration = 3000, icon = '') {
      const maxLength = 3
      if (this.notifications.length >= maxLength) {
        // cola --> FIFO (First In, First Out) eliminar primero en entrar
        // pila --> LIFO (Last In, First Out) eliminar ultimo en entrar
        this.notifications.splice(0, 1) // FIFO
      }

      const id = Date.now() + Math.random()
      this.notifications.push({ id, message, type, icon })
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id)
      }, duration)
    },
    success (msg, duration = 3000, icon = '✔') {
      this.notify(msg, 'success', duration, icon)
    },
    error (msg, duration = 3000, icon = '✖') {
      this.notify(msg, 'error', duration, icon)
    },
    info (msg, duration = 3000, icon = 'ℹ') {
      this.notify(msg, 'info', duration, icon)
    },
    warning (msg, duration = 3000, icon = '⚠') {
      this.notify(msg, 'warning', duration, icon)
    },
    closeNotify (id) {
      // Eliminar Registro
      const index = this.notifications.findIndex(item => item.id === id)
      this.notifications.splice(index, 1)
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {},
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.

}
</script>
<style scoped></style>
