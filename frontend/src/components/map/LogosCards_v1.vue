<template>
  <div>
    <!-- TARJETA INSTITUCIONAL (abajo izquierda) -->
    <div class="map-card map-card-left">
      <img src="@/assets/logos/LOGOTIPO-COLOR.png" class="logo-project">
    </div>

    <!-- TARJETA PROYECTO (abajo derecha) -->
    <div class="map-card map-card-right">
      <img src="@/assets/logos/NiñezPrimero-Placa.png" class="logo-dependences">
    </div>
  </div>
</template>

<script>

export default {
  // 1️⃣ Identificación
  name: 'LogosCardsComp',
  components: {}, // Importación de componentes hijos
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
  /* ===============================
    TARJETAS
  ================================ */
  /* .map-card {
    position: absolute;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    border-radius: 18px;
    padding: 16px   24px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.08);

    z-index: 10;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  } */

  .map-card {
    position: absolute;
    padding: 0px   0px;
    z-index: 10;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  /* Hover elegante */
  .map-card:hover {
    transform: translateY(-3px);
    /* background: rgba(255, 255, 255, 0.95); */
    /* backdrop-filter: blur(6px); */
    /* border-radius: 18px; */
    /* box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.08); */
  }

  /* Posiciones */
  .map-card-left {
    bottom: 20px;
    left: 20px;
  }

  .map-card-right {
    bottom: 0px;
    right: 0px;
  }

  /* ===============================
    LOGOS
  ================================ */

  .logo-project { height: 150px;}
  .logo-dependences { height: 100px; }
</style>
