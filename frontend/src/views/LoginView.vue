<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <img src="@/assets/logos/LOGOTIPO-BLANCO.png" style="width: 100%; max-width: 60px; height: auto;">
      <!-- REDIM -->
      <!-- <v-spacer></v-spacer> -->
    </v-app-bar>

    <v-container class="fill-height wrapper" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar dark flat class="header-card">
              <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleLogin" ref="form" v-model="valid">
                <v-text-field label="Usuario" v-model="credentials.identifier" prepend-icon="mdi-account" type="text" :rules="[rules.required]" required></v-text-field>
                <v-text-field label="Contraseña" v-model="credentials.password" prepend-icon="mdi-lock" type="password" :rules="[rules.required]" required></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleLogin" :loading="loading" :disabled="!valid">
                Ingresar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <loader-comp />
    <view-notifications-comp ref="notifier"/>

  </div>
</template>

<script>
import { /* mapState, */ mapActions } from 'vuex'

import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'

import '@/assets/css/style_notifications.css'

export default {
  // 1️⃣ Identificación
  name: 'LoginView',
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
      valid: false, // Controla si el formulario pasó las validaciones
      credentials: { identifier: '', password: '' },
      loading: false,
      // Reglas de validación para Vuetify
      rules: {
        required: value => !!value || 'Este campo es requerido.'
      }
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    async handleLogin () {
      // Validamos que los campos no estén vacíos antes de ejecutar la petición
      if (!this.$refs.form.validate()) return

      this.loading = true

      try {
        // Ejecutamos la acción con el namespace 'dashboard'
        const success = await this.$store.dispatch('storeDB/login', this.credentials)

        if (success) {
          // Redirección exitosa al panel principal
          this.$router.push('/dashboard/')
        } else {
          // Si success es false (ej. credenciales inválidas controladas por el backend)
          this.showError('Credenciales incorrectas')
        }
      } catch (error) {
        // Error de red, caída del servidor, etc.
        // console.error('Error en LoginView:', error)
        this.showError('Credenciales incorrectas o error de red')
      } finally {
        this.loading = false
      }
    },

    // Método auxiliar para limpiar el código de la alerta
    showError (message) {
      // Opcional: alert nativo si lo prefieres para desarrollo
      // alert(message)

      // Llamada a tu sistema de notificaciones globales
      this.$store.dispatch('storeNotif/warning', {
        message: message
      })
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // console.log('INIT')
    // await this.setSleep(2500)
    // console.log('setSleep started')
    // this.$store.dispatch('storeNotif/success', {
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
  .app-bar-gradient {
    background: linear-gradient(
      to right,
      #2e91ce 0%,
      #342a83 25%,
      #6a3d8f 50%,
      #b62b86 75%,
      #ed712c 100%
    ) !important;
  }
  .wrapper {
    position: relative;
    width: 100%;
    height: 93vh;
  }
  .header-card {
    background: linear-gradient(90deg, #2196F3 0%, #3F51B5 100%)
  }

</style>
