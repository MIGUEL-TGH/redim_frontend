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
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">Panel Redim</v-list-item-title>
          <v-list-item-subtitle>Menú Principal</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider> -->

      <v-list dense nav>
        <!-- <v-list-item v-for="item in allowedMenu" :key="item.module" :to="item.route" link> -->
        <v-list-item v-for="item in allowedMenu" :key="item.module" :to="item.route" link exact>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-divider class="mb-3"></v-divider>

          <div class="text-caption text-center mb-1 grey--text text--darken-2">
            Cierre por inactividad en: <strong>{{ formattedIdleTime }}</strong>
          </div>
          <!-- <v-progress-linear :value="idleProgress" :color="currentIdleTime < 60 ? 'red' : 'primary'" height="8" rounded striped class="mb-4"></v-progress-linear> -->
          <v-progress-linear :value="idleProgress" :color="currentIdleTime < 60 ? 'red' : 'primary'" height="8" rounded class="mb-4"></v-progress-linear>

          <div class="text-caption mb-1 grey--text text--darken-2" style="font-size: 0.70rem !important; line-height: 1.2;">
            <div class="d-flex justify-space-between">
              <span>Inicio: <strong>{{ tokenStartTimeFormatted }}</strong></span>
              <span>Fin: <strong>{{ tokenEndTimeFormatted }}</strong></span>
            </div>
            <div class="text-center mt-1">
              Expira en: <strong>{{ formattedTokenRemaining }}</strong>
            </div>
          </div>
          <!-- <v-progress-linear :value="tokenProgress" :color="tokenTimeRemaining < 120 ? 'orange' : 'teal'" height="8" rounded striped class="mb-4"></v-progress-linear> -->
          <v-progress-linear :value="tokenProgress" :color="tokenTimeRemaining < 120 ? 'orange' : 'teal'" height="8" rounded class="mb-4"></v-progress-linear>

          <div class="text-center mt-1 text-caption grey--text text--lighten-1" v-if="isRefreshingToken">
            <em>Renovando token...</em>
          </div>

        </div>
      </template>

    </v-navigation-drawer>

    <!-- <h1> DashBoard Welcome </h1> -->
    <router-view />
    <loader-comp />
    <view-notifications-comp ref="notifier"/>

  </div>
</template>
<script>
import { jwtDecode } from 'jwt-decode'

import { /* mapState, */ mapActions } from 'vuex'

import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'

import '@/assets/css/bootstrap.min.css'
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
    const maxIdle = parseInt(process.env.VUE_APP_MAX_IDLE_TIME || 600, 10)
    return {
      drawer_left_map: true,
      // Mapeo maestro de todas las rutas posibles del sistema
      masterMenu: [
        { title: 'Inicio', icon: 'mdi-view-dashboard', route: '/dashboard/', module: 'welcome' },
        { title: 'Población', icon: 'mdi-account-group', route: '/dashboard/indicators', module: 'indicators' },
        { title: 'Tipo de Delito', icon: 'mdi-shield-alert', route: '/dashboard/indicator_categories', module: 'indicator_categories' },
        { title: 'Info Tipo de Delito', icon: 'mdi-chart-box', route: '/dashboard/indicator_category_details', module: 'indicator_category_details' },
        { title: 'Centros', icon: 'mdi-office-building', route: '/dashboard/centers', module: 'centers' },
        { title: 'Estados', icon: 'mdi-map', route: '/dashboard/states', module: 'states' },
        { title: 'Países', icon: 'mdi-earth', route: '/dashboard/countries', module: 'countries' },
        { title: 'Sexo', icon: 'mdi-gender-male-female', route: '/dashboard/genders', module: 'genders' },
        { title: 'Años', icon: 'mdi-calendar-range', route: '/dashboard/years', module: 'years' }
      ],

      // Variables para inactividad
      maxIdleTime: maxIdle,
      currentIdleTime: maxIdle,
      idleInterval: null,
      // Eventos del DOM que consideramos "actividad"
      activityEvents: ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'],

      // Variables para el ciclo de vida del Token
      tokenIat: 0, // Hora de creación en segundos
      tokenExp: 0, // Hora de expiración en segundos
      currentAbsoluteTime: Math.floor(Date.now() / 1000), // Reloj global
      isRefreshingToken: false // Bandera para evitar peticiones múltiples
    }
  },
  computed: {
    allowedMenu () {
      return this.masterMenu.filter(item =>
        item.module === 'welcome' || this.$store.getters['storeDB/hasModuleAccess'](item.module)
      )
    },

    // --- COMPUTADAS DE INACTIVIDAD ---
    // Porcentaje para la barra de progreso de Vuetify
    idleProgress () {
      return (this.currentIdleTime / this.maxIdleTime) * 100
    },
    // Formatea los segundos a un formato visual amigable "MM:SS"
    formattedIdleTime () {
      const minutes = Math.floor(this.currentIdleTime / 60)
      const seconds = this.currentIdleTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    // --- NUEVAS: COMPUTADAS DEL TOKEN ---
    tokenTotalLifespan () {
      return this.tokenExp - this.tokenIat // Total de segundos que vive el token (ej. 3600)
    },
    tokenTimeElapsed () {
      const elapsed = this.currentAbsoluteTime - this.tokenIat
      return elapsed > 0 ? elapsed : 0
    },
    tokenTimeRemaining () {
      const remaining = this.tokenExp - this.currentAbsoluteTime
      return remaining > 0 ? remaining : 0
    },
    tokenProgress () {
      if (this.tokenTotalLifespan <= 0) return 0
      // Porcentaje de uso: va de 0% al 100%
      // return (this.tokenTimeElapsed / this.tokenTotalLifespan) * 100

      // Porcentaje de uso: va de 100% al 0%
      return (this.tokenTimeRemaining / this.tokenTotalLifespan) * 100
    },
    formattedTokenRemaining () {
      const minutes = Math.floor(this.tokenTimeRemaining / 60)
      const seconds = this.tokenTimeRemaining % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    tokenStartTimeFormatted () {
      if (!this.tokenIat) return '--:--'
      const date = new Date(this.tokenIat * 1000)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    tokenEndTimeFormatted () {
      if (!this.tokenExp) return '--:--'
      const date = new Date(this.tokenExp * 1000)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

  },

  // 4️⃣ Observadores
  watch: {
    '$store.state.storeDB.token': {
      immediate: true,
      handler (newToken) {
        if (newToken) {
          try {
            const decoded = jwtDecode(newToken)
            // console.log(decoded)
            this.tokenIat = decoded.iat
            this.tokenExp = decoded.exp
            this.isRefreshingToken = false // Se apaga la bandera al recibir el nuevo token
            this.currentAbsoluteTime = Math.floor(Date.now() / 1000) // Sincronizamos
          } catch (e) {
            console.error('Error decodificando token en el watcher', e)
          }
        }
      }
    }
  },

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    logout () {
      // Llamamos a la acción con su namespace
      this.$store.dispatch('storeDB/logout')
      this.$router.push('/administrator')
    },

    // Reinicia el contador cada vez que el usuario hace algo
    resetIdleTimer () {
      this.currentIdleTime = this.maxIdleTime
    },

    startIdleTracking () {
      this.activityEvents.forEach(event => {
        window.addEventListener(event, this.resetIdleTimer)
      })

      this.idleInterval = setInterval(() => {
        // 1. Reloj de Inactividad
        this.currentIdleTime -= 1
        if (this.currentIdleTime <= 0) {
          this.handleAutoLogout()
          return
        }

        // 2. Actualizar el reloj global del Token
        this.currentAbsoluteTime = Math.floor(Date.now() / 1000)

        // 3. Evaluar Renovación (A los 120 segundos o menos)
        // Usamos <= 120 y la bandera isRefreshingToken para no disparar 50 peticiones
        // mientras el servidor de PHP nos responde.
        if (this.tokenTimeRemaining <= 120 && this.currentIdleTime > 120 && !this.isRefreshingToken) {
          this.isRefreshingToken = true
          this.$store.dispatch('storeDB/silentRefresh').catch(() => {
            this.isRefreshingToken = false // Si falla, liberamos la bandera
          })
        }
      }, 1000)
    },

    stopIdleTracking () {
      this.activityEvents.forEach(event => {
        window.removeEventListener(event, this.resetIdleTimer)
      })
      clearInterval(this.idleInterval)
    },

    handleAutoLogout () {
      this.stopIdleTracking()
      this.$store.dispatch('storeNotif/warning', {
        message: 'Tu sesión se ha cerrado automáticamente por inactividad.'
      })
      this.$store.dispatch('storeDB/logout')
      this.$router.push('/administrator').catch(() => {})
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
  mounted () {
    // Iniciar el rastreo en cuanto el Dashboard se renderiza
    this.startIdleTracking()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
    // Si el usuario sale del dashboard por su cuenta, apagamos el reloj
    this.stopIdleTracking()
  },
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.
}
</script>
<style scoped>
  /* Personalizar estilos aquí */
  ::v-deep .v-list-item {
    text-decoration: none !important;
  }
</style>
