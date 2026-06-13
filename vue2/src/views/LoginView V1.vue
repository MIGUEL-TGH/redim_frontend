<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field label="Usuario" v-model="credentials.identifier" prepend-icon="mdi-account" type="text" required></v-text-field>
              <v-text-field label="Contraseña" v-model="credentials.password" prepend-icon="mdi-lock" type="password" required></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="handleLogin" :loading="loading">Ingresar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  // 1️⃣ Identificación
  name: 'LoginView',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      credentials: { identifier: '', password: '' },
      loading: false
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    async handleLogin () {
      this.loading = true
      // console.log('handleLogin()')
      try {
        const success = await this.$store.dispatch('dashboard/login', this.credentials)
        console.log(success)
        if (success) {
          // this.$router.push('/dashboard/administrator')
          this.$router.push('/dashboard/')
        }
      } catch (error) {
        alert('Credenciales incorrectas o error de red')
        this.$store.dispatch('warning', {
          message: 'Credenciales incorrectas o error de red'
        })
      } finally {
        this.loading = false
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {},
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
