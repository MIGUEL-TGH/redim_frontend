<template>
  <div>
    <v-app-bar app dark elevation="10" color="#ec1e4c" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
      <v-toolbar-title>REDIM</v-toolbar-title>
      <v-spacer></v-spacer>
        <!-- <img src="@/assets/logos/redim_logo.png" style="width: 100%; max-width: 60px; height: auto;"> -->
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1">
      <!-- <h5>Barra de Navegación</h5>
      <br> -->
      <!-- <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Panel Redim</v-list-item-title>
          <v-list-item-subtitle>Menú Principal</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider> -->

      <v-list dense nav>
        <v-list-item v-for="item in allowedMenu" :key="item.module" :to="item.route" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

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
      drawer_left_map: true,
      // Mapeo maestro de todas las rutas posibles del sistema
      masterMenu: [
        { title: 'Inicio', icon: 'mdi-view-dashboard', route: '/dashboard/', module: 'welcome' }, // Puedes ajustar este módulo
        { title: 'Indicadores', icon: 'mdi-chart-bar', route: '/dashboard/indicators', module: 'indicators' },
        { title: 'Centros', icon: 'mdi-domain', route: '/dashboard/centers', module: 'centers' },
        { title: 'Estados', icon: 'mdi-map-marker', route: '/dashboard/states', module: 'states' },
        { title: 'Países', icon: 'mdi-earth', route: '/dashboard/countries', module: 'countries' },
        { title: 'Géneros', icon: 'mdi-gender-male-female', route: '/dashboard/genders', module: 'genders' },
        { title: 'Años', icon: 'mdi-calendar', route: '/dashboard/years', module: 'years' }
      ]
    }
  },
  computed: {
    allowedMenu () {
      return this.masterMenu.filter(item =>
        item.module === 'welcome' || this.$store.getters['storeDB/hasModuleAccess'](item.module)
      )
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    logout () {
      // Llamamos a la acción con su namespace
      this.$store.dispatch('dashboard/logout')
      this.$router.push('/administrator')
    }
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
