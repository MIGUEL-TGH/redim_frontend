<template>
  <div>
    <!-- TARJETA INSTITUCIONAL (abajo izquierda) -->
    <div class="map-card map-card-left">
      <img src="@/assets/logos/LOGOTIPO-COLOR.png" class="logo-project" alt="Logo Proyecto">
    </div>

    <!-- TARJETA ZOOM (abajo centro) -->
    <div class="map-card map-card-center d-flex align-center">
      <v-btn icon small @click="$emit('zoom-out')" aria-label="Alejar">
        <v-icon color="grey darken-2">mdi-minus</v-icon>
      </v-btn>

      <v-divider vertical class="mx-1"></v-divider>

      <v-btn icon small @click="$emit('go-home')" aria-label="Inicio">
        <v-icon color="grey darken-2">mdi-home</v-icon>
      </v-btn>

      <v-divider vertical class="mx-1"></v-divider>

      <v-btn icon small @click="$emit('zoom-in')" aria-label="Acercar">
        <v-icon color="grey darken-2">mdi-plus</v-icon>
      </v-btn>
    </div>

    <!-- TARJETA PROYECTO (abajo derecha) -->
    <div class="map-card map-card-right">
      <img src="@/assets/logos/NiñezPrimero-Placa.png" class="logo-dependences" alt="Logo Instituciones">
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
    /* bottom: -30px; */
    bottom: 0px;
    right: 0px;
  }

  /* ===============================
    LOGOS
  ================================ */
  /* .logo-project { height: 150px;}
  .logo-dependences { height: 100px; } */
  /* ===============================
    LOGOS BASE (Escritorio / Laptops)
  ================================ */
  /* Se agrega object-fit y max-width como medida de seguridad */
  .logo-project {
    height: 100px;
    max-width: 45vw;
    object-fit: contain;
    transition: height 0.3s ease;
  }

  .logo-dependences {
    height: 100px;
    max-width: 45vw;
    object-fit: contain;
    transition: height 0.3s ease;
  }

/* ===============================
    CONTROLES CENTRALES (ZOOM)
  ================================ */
  .map-card-center {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);

    /* Estilos visuales tipo píldora */
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    border-radius: 24px;
    padding: 4px 8px;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.08);
  }

  .map-card-center:hover {
    transform: translateX(-50%) translateY(-3px);
  }

  /* ===============================
    MEDIA QUERIES (Responsividad)
  ================================ */

  /* Tablets y Laptops pequeñas (Vuetify 'sm' y 'md' - hasta 960px) */
  @media (max-width: 960px) {
    .logo-project { height: 80px; }
    .logo-dependences { height: 70px; }

    .map-card-left { bottom: 15px; left: 15px; }
    .map-card-right { bottom: -25px; right: 5px; }
    .map-card-center { bottom: 15px; }
  }

  /* Teléfonos Móviles (Vuetify 'xs' - hasta 600px) */
  @media (max-width: 600px) {
    .logo-project { height: 60px; }
    .logo-dependences { height: 45px; }

    .map-card-left { bottom: 10px; left: 10px; }
    /* Le damos un poco más de margen al logo derecho en móviles para que respire */
    .map-card-right { bottom: -20px; right: 10px; }
    .map-card-center { bottom: 10px; }
  }
</style>
