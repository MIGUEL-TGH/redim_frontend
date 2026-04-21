
<!-- <template>
  <div class="hover-popup-wrapper">
    <div class="deck-container">
      Nueva ventana
    </div>
  </div>
</template> -->

<template>
  <div class="hover-popup-wrapper" v-show="hoverInfo && hoverInfo.show">
  <!-- <div class="hover-popup-wrapper"> -->
    <div class="deck-container">

      <div class="card-blue elevation-10">

        <div class="text-h6 mb-1 title-text">
          {{ hoverInfo.data ? hoverInfo.data.name.toUpperCase() : '...' }}
          <!-- PUEBLA -->
        </div>
        <div class="mb-1 subtitle-text">
          Trata de personas de 0 a 17 años en México, 2025
        </div>

        <v-row class="ma-0 stats-row" dense align="center" no-gutters>
          <v-col cols="6" class="text-center pa-1 stats-border-right">
            <span class="text-h6 font-weight-bold">
               {{ (hoverInfo.data && hoverInfo.data.woman) ? hoverInfo.data.woman : 0 }}
               <!-- 10 -->
            </span>
            <span class="text-h6"> MUJERES</span>
          </v-col>
          <v-col cols="6" class="text-center pa-1">
            <span class="text-h6 font-weight-bold">
               {{ (hoverInfo.data && hoverInfo.data.man) ? hoverInfo.data.man : 0 }}
                <!-- 25 -->
            </span>
            <span class="text-h6"> HOMBRES</span>
          </v-col>
        </v-row>

        <div class="text-right mt-1">
          <em class="source-text">SESNSP</em>
        </div>
      </div>

      <div class="card-white-wrapper elevation-5">
        <div class="card-white d-flex justify-center align-center">
          <span class="font-weight-bold">MÁS INFORMACIÓN +</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  // 1️⃣ Identificación
  name: 'HoverPopupCard',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    hoverInfo: {
      type: Object,
      required: false, // Lo cambiamos a false para evitar el warning
      default: () => ({ show: false, data: { name: '', woman: 0, man: 0 } })
    }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: { },

  // 5️⃣ Métodos
  methods: { },

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
.hover-popup-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  width: 325px; /* Ajusta este ancho según necesites */
  pointer-events: none; /* CRÍTICO: Evita que el cursor parpadee al chocar con el popup */
  z-index: 1000;
}

.deck-container {
  display: flex;
  flex-direction: column;
}

/* --- TARJETA AZUL --- */
.card-blue {
  background-color: #342a83;
  color: #ffffff;
  border-radius: 15px;
  padding: 15px;
  position: relative;
  z-index: 2; /* Siempre encima de la blanca */
}

.title-text {
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  overflow: hidden !important;
}

.subtitle-text {
  color: #efeee8; /* Blanco-gris para contrastar suavemente */
  line-height: 1.5;
  font-size: 0.7rem !important;
}

/* .stats-row {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
} */

.stats-border-right {
  border-right: 2px solid rgba(255, 255, 255, 0.2);
}

.source-text {
  font-size: 11px;
  opacity: 0.7;
}

/* --- TARJETA BLANCA --- */
.card-white-wrapper {
  background-color: #efeee8;
  border-radius: 0 0 15px 15px;
  margin-top: -15px; /* Sube la tarjeta blanca para esconderse bajo la azul */
  padding-top: 20px; /* Compensa el espacio comido por el margen negativo */
  padding-bottom: 8px;
  position: relative;
  z-index: 1; /* Por debajo de la tarjeta azul */
}

.card-white {
  color: #342a83; /* Texto azul para combinar */
  font-size: 15px;
}

</style>
