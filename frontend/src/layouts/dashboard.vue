<template>
  <div>
    <v-app-bar app dark elevation="10" color="#ec1e4c" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
      <v-toolbar-title>REDIM</v-toolbar-title>
      <v-spacer></v-spacer>
        <img src="@/assets/logos/redim_logo.png" style="width: 100%; max-width: 60px; height: auto;">
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1">
      <h5>Barra de Navegación</h5>
    </v-navigation-drawer>

    <!-- <h1> DashBoard Welcome </h1> -->
    <router-view />
    <loader-comp />
    <view-notifications-comp ref="notifier"/>

    <!-- <v-main>
      <h1> DashBoard Welcome </h1>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main> -->

  </div>
</template>
<script>
import { /* mapState, */ mapActions } from 'vuex'

import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'

import '@/assets/css/bootstrap.min.css'
// import '@/assets/css/style_dashboard.css'
import '@/assets/css/style_dashboard.css'
import '@/assets/css/style_notifications.css'

export default {
  // 1️⃣ Identificación
  name: 'LegacyLayoutDashBoard',
  components: { // Importación de componentes hijos
    LoaderComp,
    viewNotificationsComp
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
      drawer_left_map: true
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ])
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // await this.setSleep(1000)
    // this.$store.dispatch('success', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('error', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('info', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('warning', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('success', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('error', {
    //   message: 'Error desde dashboard/years'
    // })
    // await this.setSleep(1000)
    // this.$store.dispatch('info', {
    //   message: 'Error desde dashboard/years'
    // })
  },
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
<style scoped>
  /* Personalizar estilos aquí */
</style>
