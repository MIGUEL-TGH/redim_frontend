<template>
  <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <custom-navbar />
      <!-- <span class="ml-2 font-weight-bold">REDIM</span> -->
      <v-spacer></v-spacer>
      <img src="@/assets/logos/Isologo.png" alt="Logo Niñez Primero">
    </v-app-bar>
</template>

<script>
import CustomNavbar from '@/components/CustomNavbar.vue'

export default {
  // 1️⃣ Identificación
  name: 'TemplateView',
  components: { // Importación de componentes hijos
    CustomNavbar
  },
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {}
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {},

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
