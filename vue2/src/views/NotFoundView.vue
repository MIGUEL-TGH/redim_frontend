<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <v-icon size="100" color="grey lighten-1" class="mb-4">mdi-alert-circle-outline</v-icon>

        <h1 class="text-h2 font-weight-bold mb-2 primary--text">404</h1>
        <h2 class="text-h5 mb-6">Página no encontrada</h2>

        <p class="text-subtitle-1 text-grey-darken-1">
          El módulo o la dirección a la que intentas acceder no existe.
        </p>

        <p class="font-weight-medium mt-4">
          Redirigiendo en {{ timeLeft }} segundos...
        </p>

        <v-progress-linear
          v-model="progress"
          color="primary"
          height="12"
          striped
          rounded
          class="mt-2"
        ></v-progress-linear>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFoundView',
  data () {
    return {
      timeLeft: 5,
      interval: null,
      timer: null
    }
  },
  computed: {
    // Calcula el porcentaje de la barra (de 0% a 100% en 5 segundos)
    progress () {
      return ((5 - this.timeLeft) / 5) * 100
    }
  },
  mounted () {
    // 1. Iniciar el conteo regresivo para la interfaz
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1
      }
    }, 1000)

    // 2. Ejecutar la redirección a los 5 segundos exactos
    this.timer = setTimeout(() => {
      // Evaluamos la URL fallida para saber a dónde regresarlo
      const isDashboardRoute = this.$route.path.startsWith('/dashboard')

      if (isDashboardRoute) {
        this.$router.push('/dashboard/')
      } else {
        this.$router.push('/') // O a la ruta raíz que prefieras
      }
    }, 5000)
  },
  beforeDestroy () {
    // Limpieza de memoria crucial por si el usuario presiona "Atrás" antes de los 5 segundos
    clearInterval(this.interval)
    clearTimeout(this.timer)
  }
}
</script>
