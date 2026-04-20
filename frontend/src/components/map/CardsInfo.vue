<template>
  <div class="hover-popup-wrapper" v-show="hoverInfo.show">
    <div class="deck-container">
      Nueva ventana
      <!-- <div class="card-blue elevation-10">
        <div class="text-h6 font-weight-black mb-1">
          {{ hoverInfo.data ? hoverInfo.data.name : '...' }}
        </div>

        <div class="caption font-weight-bold mb-3 subtitle-text">
          SESNSP, Trata de personas de 0 a 17 años en México, 2025
        </div>

        <v-row class="ma-0 stats-row" dense align="center">
          <v-col cols="6" class="text-center pa-1 stats-border-right">
            <span class="text-subtitle-1 font-weight-bold">{{ hoverInfo.data ? hoverInfo.data.woman : 0 }}</span> <span class="caption">Mujeres</span>
          </v-col>
          <v-col cols="6" class="text-center pa-1">
            <span class="text-subtitle-1 font-weight-bold">{{ hoverInfo.data ? hoverInfo.data.man : 0 }}</span> <span class="caption">Hombres</span>
          </v-col>
        </v-row>

        <div class="text-right mt-2">
          <em class="source-text">SESNSP</em>
        </div>
      </div>

      <div class="card-white-wrapper elevation-5">
        <div class="card-white d-flex justify-center align-center">
          <span class="font-weight-bold">MÁS INFORMACIÓN +</span>
        </div>
      </div> -->

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
    // indicators: { type: Array, default: () => [] },
    // states: { type: Array, default: () => [] },
    // years: { type: Array, default: () => [] },
    // genders: { type: Array, default: () => [] },
    // categories: { type: Array, default: () => [] },
    hoverInfo: { type: Object, required: true, default: () => ({ show: false, data: null }) }
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
  watch: {
    // 'frmData.indicator_id' (newVal, oldVal) {
    //   // Nos aseguramos de tener la longitud, usando 0 si por alguna razón es undefined
    //   const newLength = newVal ? newVal.length : 0
    //   const oldLength = oldVal ? oldVal.length : 0

    //   // if (!newLength || newLength < oldLength) { // solo cuando disminulle
    //   if (!newLength || newLength !== oldLength) { // cuando es diferente
    //     this.$nextTick(() => {
    //       // Deshabilitamos el botón de enviar
    //       this.btnSend = true
    //       this.frmData.category_id = []
    //       this.$emit('clear-categories')
    //       this.categoriesExpanded = false
    //       this.activeToggle = false
    //       this.$emit('show-cards', false)
    //     })
    //   }
    // },
    // 'frmData.year_id' (val) {
    //   if (this.isUpdatingYear) return

    //   this.isUpdatingYear = true

    //   if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
    //     this.frmData.year_id = [0]
    //   } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan años normales
    //     this.frmData.year_id = val.filter(v => v !== 0)
    //   }

    //   this.$nextTick(() => {
    //     this.isUpdatingYear = false
    //   })
    // },
    // 'frmData.category_id' (val) {
    //   if (this.isUpdatingCategory) return
    //   this.isUpdatingCategory = true

    //   if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
    //     this.frmData.category_id = [0]
    //   } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
    //     this.frmData.category_id = val.filter(v => v !== 0)
    //   }

    //   this.$nextTick(() => {
    //     this.isUpdatingCategory = false
    //     this.activeToggle = false
    //   })
    // },
    // 'frmData.state_id' (val) {
    //   if (this.isUpdatingState) return

    //   this.isUpdatingState = true

    //   if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
    //     this.frmData.state_id = [0]
    //   } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
    //     this.frmData.state_id = val.filter(v => v !== 0)
    //   }

    //   this.$nextTick(() => {
    //     this.isUpdatingState = false
    //   })
    // },
    // 'frmData.gender_id' (val) {
    //   if (this.isUpdatingGender) return

    //   this.isUpdatingGender = true

    //   if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
    //     this.frmData.gender_id = [0]
    //   } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
    //     this.frmData.gender_id = val.filter(v => v !== 0)
    //   }

    //   this.$nextTick(() => {
    //     this.isUpdatingGender = false
    //   })
    // },
    // states: {
    //   immediate: true, // Se ejecuta apenas se crea el componente
    //   handler (newStates) {
    //     if (newStates && newStates.length > 0 && this.frmData.state_id.length === 0) {
    //       this.frmData.state_id = [0]
    //     }
    //   }
    // },
    // years: {
    //   immediate: true, // Se ejecuta apenas se crea el componente
    //   handler (newYears) {
    //     if (newYears && newYears.length > 0 && this.frmData.year_id.length === 0) {
    //       this.frmData.year_id = [0]
    //     }
    //   }
    // },
    // genders: {
    //   immediate: true, // Se ejecuta apenas se crea el componente
    //   handler (newGenders) {
    //     if (newGenders && newGenders.length > 0 && this.frmData.gender_id.length === 0) {
    //       this.frmData.gender_id = [0]
    //     }
    //   }
    // },
    // categories: {
    //   immediate: true, // Se ejecuta apenas se crea el componente
    //   async handler (newCategories) {
    //     if (!newCategories.length) {
    //       this.frmData.category_id = []
    //       this.btnSend = true
    //     } else if (newCategories && newCategories.length > 0) {
    //       this.btnSend = false
    //       const LeafIds = await this.getAllLeafIds(this.categories)
    //       this.frmData.category_id = LeafIds
    //     }
    //   }
    // }
  },

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
  width: 260px; /* Ajusta este ancho según necesites */
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

.subtitle-text {
  color: #efeee8; /* Blanco-gris para contrastar suavemente */
  line-height: 1.2;
}

.stats-row {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stats-border-right {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
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
  font-size: 12px;
}

</style>
<style>
</style>
