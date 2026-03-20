<template>
  <div class="left-panel-wrapper">

    <transition name="slide-ribbon">
      <div v-if="!isOpen" class="ribbon-toggle elevation-4" @click="isOpen = true">
        <v-icon color="white" size="28">mdi-magnify</v-icon>
      </div>
    </transition>

    <transition name="slide-panel">
      <div v-if="isOpen" class="deck-container">

        <div class="card-pink elevation-6">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="white--text mb-0"></h3>
            <v-btn icon dark small @click="isOpen = false">
              <v-icon>mdi-close</v-icon>
               <!-- ocultar -->
            </v-btn>
          </div>

          <div class="mb-1">
            <label class="white--text font-weight-bold caption mb-1 d-block">Población*:</label>
            <v-select
              v-model="frmData.indicator_id" :items="indicators" multiple item-value="id" item-text="name" :rules="[v => (v && v.length > 0) || 'Campo obligatorio']"
              background-color="white" light solo flat dense hide-details="auto">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2" small label close color="#246257" class="white--text chip-select" @click:close="removeIndicator(item.id)">
                  <span>{{ item.id }}</span>
                </v-chip>
                <span v-if="index === 2" class="grey--text text-caption ml-1 font-weight-medium">
                  (+{{ frmData.indicator_id.length - 2 }} más)
                </span>
              </template>

              <template v-slot:append-outer>
                <v-icon large color="#efeee8" class="BtnHover mt-n1" @click="getCategories" title="Cargar categorías">
                  mdi-arrow-right-bold-box
                </v-icon>
              </template>

              <template v-slot:message="{ message }">
                <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
              </template>
            </v-select>
          </div>

          <div class="mb-1">
            <label class="white--text font-weight-bold caption mb-1 d-block">Entidad Federativa*:</label>
            <v-select v-model="frmData.state_id" :items="states" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isStateDisabled"
              background-color="white" light solo flat dense hide-details="auto">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text span-select">
                  (+{{ frmData.state_id.length - 1 }} más)
                </span>
              </template>

              <template v-slot:message="{ message }">
                <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
              </template>
            </v-select>
          </div>

          <div class="mb-1">
            <label class="white--text font-weight-bold caption mb-1 d-block">Año*:</label>
            <v-select v-model="frmData.year_id" :items="years" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isYearDisabled"
              background-color="white" light solo flat dense hide-details="auto">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ truncateText(item.title, 20) }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text span-select">
                  (+{{ frmData.year_id.length - 1 }} más)
                </span>
              </template>
              <template v-slot:message="{ message }">
                <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
              </template>
            </v-select>
          </div>

          <div class="mb-1">
            <label class="white--text font-weight-bold caption mb-1 d-block">Sexo*:</label>
            <v-select v-model="frmData.gender_id" :items="genders" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isGenderDisabled"
              background-color="white" light solo flat dense hide-details="auto">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ truncateText(item.title, 20) }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text span-select">
                  (+{{ frmData.gender_id.length - 1 }} más)
                </span>
              </template>
              <template v-slot:message="{ message }">
                <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
              </template>
          </v-select>
          </div>

        </div>

        <div class="card-white-wrapper">
          <div class="card-white elevation-4" :class="{ 'is-expanded': categoriesExpanded }">
            <div class="pa-4 pt-6"> <h4 class="mb-2" style="color: #6a3d8f;">Tipo de delito:</h4>
              <br>
              <br>
              <v-treeview
                selectable
                v-model="frmData.category_id"
                :items="categories"
                item-text="title"
                item-key="id"
                class="tree-compact custom-tree"
                selected-color="#b62b86"
                dense
              ></v-treeview>

              <!-- <v-btn color="#342a83" elevation="5" @click="submitFilters" block class="white--text" :disabled="btnSend">consultar</v-btn> -->
              <v-btn color="#342a83" elevation="5" @click="submitFilters" block class="white--text">consultar</v-btn>

            </div>
          </div>
        </div>

      </div>
    </transition>

  </div>
</template>
<script>

export default {
  // 1️⃣ Identificación
  name: 'LeftFilterDeck',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    indicators: { type: Array, default: () => [] },
    states: { type: Array, default: () => [] },
    years: { type: Array, default: () => [] },
    genders: { type: Array, default: () => [] },
    categories: { type: Array, default: () => [] }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      isOpen: true, // Controla el panel completo vs la cinta
      categoriesExpanded: true, // Controla si la tarjeta blanca está visible
      frmData: {
        indicator_id: [],
        category_id: [],
        year_id: [],
        gender_id: [],
        state_id: []
      },
      frmDisabled: {
        category: false
      },
      isUpdatingYear: false,
      isUpdatingCategory: false,
      isUpdatingGender: false,
      isUpdatingState: false,
      btnSend: true
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {
    'frmData.indicator_id' (newVal, oldVal) {
      // Nos aseguramos de tener la longitud, usando 0 si por alguna razón es undefined
      const newLength = newVal ? newVal.length : 0
      const oldLength = oldVal ? oldVal.length : 0

      // Condición 1: Se quedó vacío (!newLength)
      // Condición 2: El usuario desmarcó uno de la lista (newLength < oldLength)
      // if (!newLength || newLength < oldLength) { // solo cuando disminulle
      if (!newLength || newLength !== oldLength) { // cuando es diferente
        console.log('submit()--> deshabilitado')

        this.$nextTick(() => {
          // Deshabilitamos el botón de enviar
          this.btnSend = true

          // Opcional: Si quieres limpiar las categorías tal como lo haces en removeIndicator
          // this.categories = []
        })
      }
    },
    'frmData.year_id' (val) {
      if (this.isUpdatingYear) return

      this.isUpdatingYear = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.year_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan años normales
        this.frmData.year_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingYear = false
      })
    },
    'frmData.category_id' (val) {
      if (this.isUpdatingCategory) return

      this.isUpdatingCategory = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.category_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.category_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingCategory = false
      })
    },
    'frmData.state_id' (val) {
      if (this.isUpdatingState) return

      this.isUpdatingState = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.state_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.state_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingState = false
      })
    },
    'frmData.gender_id' (val) {
      if (this.isUpdatingGender) return

      this.isUpdatingGender = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.gender_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.gender_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingGender = false
      })
    }
  },

  // 5️⃣ Métodos
  methods: {
    getCategories () {
      // 1. Emitir evento para buscar las categorías reales en el backend (si aplica)
      this.$emit('fetch-categories', this.frmData)

      // 2. Desplegar la segunda tarjeta (efecto baraja)
      this.categoriesExpanded = true
    },
    submitFilters () {
      // Emitir el formulario completo al mapa
      this.$emit('submit', this.frmData)
      // Opcional: Contraer o cerrar panel después de aplicar
      // this.isOpen = false;
    },

    // ==============================================
    isYearDisabled (item) {
      // Si "Todos" está seleccionado, deshabilitar los demás
      if (this.frmData.year_id.includes(0)) {
        return item.id !== 0
      }

      // Si hay otros seleccionados, deshabilitar "Todos"
      // if (this.frmData.year_id.length > 0) {
      //   return item.id === 0
      // }

      return false
    },
    isCategoryDisabled (item) {
      if (this.frmData.category_id.includes(0)) {
        return item.id !== 0
      }

      return false
    },
    isStateDisabled (item) {
      if (this.frmData.state_id.includes(0)) {
        return item.id !== 0
      }

      return false
    },
    isGenderDisabled (item) {
      if (this.frmData.gender_id.includes(0)) {
        return item.id !== 0
      }

      return false
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
  /* Contenedor absoluto a la misma altura (20px) que el StackCards */
  .left-panel-wrapper {
    position: absolute;
    top: 90px;
    left: 0;
    z-index: 50;
    display: flex;
    align-items: flex-start;
  }

  /* ===============================
    CINTA (Ribbon)
  =============================== */
  .ribbon-toggle {
    /* background: linear-gradient(135deg, #b62b86 0%, #6a3d8f 100%); */
    /* background: linear-gradient(135deg, #b62b86  0%, #e30c7e 100%); */
    background: linear-gradient(90deg, #9C27B0 0%, #E91E63 100%);
    padding: 12px 15px 12px 10px;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    transition: width 0.3s ease;
  }
  .ribbon-toggle:hover {
    padding-right: 20px; /* Pequeño efecto al pasar el mouse */
  }

  /* ===============================
    TARJETAS APILADAS (Deck)
  =============================== */
  .deck-container {
    width: 350px;
    margin-left: 60px; /* Separación del borde de la pantalla */
    margin-top: -75px;
    display: flex;
    flex-direction: column;
  }

  /* Tarjeta 1: Rosa */
  .card-pink {
    /* background: linear-gradient(to bottom, #b62b86 10%, #e30c7e 100%); */
    /* background: linear-gradient(135deg, #9C27B0 0%, #E91E63 100%); */
    background: linear-gradient(to bottom, #b62b86 0%, #E91E63 100%);
    border-radius: 20px;
    padding: 20px;
    position: relative;
    z-index: 2; /* Siempre por encima de la tarjeta blanca */
  }

  /* Tarjeta 2: Blanca/Gris (Contenedor que oculta el desbordamiento) */
  .card-white-wrapper {
    position: relative;
    z-index: 1; /* Por debajo de la tarjeta rosa */
    margin-top: -20px; /* Sube el contenedor para solaparse por detrás del borde redondeado de la rosa */
    overflow: hidden; /* Clave para el efecto: esconde la tarjeta hasta que baje */
    border-radius: 0 0 20px 20px;
  }

  /* La tarjeta blanca en sí */
  .card-white {
    background-color: #efeee8;
    border-radius: 0 0 20px 20px;
    transform: translateY(-100%); /* Inicialmente escondida arriba (detrás de la rosa) */
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1); /* Transición suave */
  }

  /* Clase dinámica que baja la tarjeta blanca */
  .card-white.is-expanded {
    transform: translateY(0);
  }

  /* ===============================
    ANIMACIONES DE ENTRADA/SALIDA
  =============================== */
  .slide-ribbon-enter-active, .slide-ribbon-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .slide-ribbon-enter, .slide-ribbon-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-panel-enter-active, .slide-panel-leave-active {
    transition: transform 0.4s ease, opacity 0.4s ease;
  }
  .slide-panel-enter, .slide-panel-leave-to {
    transform: translateX(-50px);
    opacity: 0;
  }

  /* Estilos extra para Vuetify (opcional, para hacer los inputs más sutiles) */
  .custom-input :deep(.v-input__slot) {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  /* ===============================
    MEDIA QUERIES (Responsividad)
  =============================== */

  /* Tablets pequeñas y Móviles (hasta 768px) */
  @media (max-width: 768px) {
    .left-panel-wrapper {
      top: 80px; /* Un poco más pegado arriba en móviles */
      width: 100%; /* Toma todo el ancho disponible */
      padding-right: 20px; /* Evita que pegue con el borde derecho */
    }

    .deck-container {
      width: 100%; /* Expande las tarjetas */
      margin-left: 10px;
    }

    /* Opcional: Reducir un poco el padding interno para ahorrar espacio */
    .card-pink {
      padding: 15px;
    }
  }

  /* Móviles muy pequeños (hasta 480px) */
  @media (max-width: 480px) {
    .left-panel-wrapper {
      top: 80px; /* Pegado al header */
      padding-right: 10px;
    }
    .deck-container {
      margin-left: 10px;
      border-radius: 0; /* Quitar bordes redondos si ocupa toda la pantalla */
    }
    .card-pink, .card-white {
      border-radius: 15px 15px 15px 15px;
    }
  }

</style>
