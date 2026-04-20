<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <custom-navbar />
      <v-spacer></v-spacer>
    </v-app-bar>

    <section>
      <div class="title-mod">
        <h2> Voces </h2>
      </div>
    </section>

</div>
</template>

<script>
import CustomNavbar from '@/components/map/CustomNavbar.vue'

export default {
  // 1️⃣ Identificación
  name: 'VocesView',
  components: {
    CustomNavbar
  }, // Importación de componentes hijos
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
  .title-mod h2{
    text-align: center;
    background-color: transparent;
    text-transform: uppercase;
    font-size: clamp(20px, 5vw, 40px);
    font-weight: normal;
    color: #78909C;

    word-break: break-word; /* permite que las palabras se dividan si es necesario */
    white-space: normal; /* permite los saltos de línea */
    line-height: 1.2; /* mejora el espaciado entre líneas */
    padding: 0 5px; /* opcional: margen interno para pantallas pequeñas */

    margin: 0px 0px 0px 0px;
  }
</style>
