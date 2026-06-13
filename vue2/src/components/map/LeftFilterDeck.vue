<template>
  <div class="left-panel-wrapper">

    <transition name="slide-ribbon">
      <div v-if="!isOpen" class="ribbon-toggle elevation-10" @click="isOpen = true">
        <v-icon color="white" size="28">mdi-magnify</v-icon>
      </div>
    </transition>

    <transition name="slide-panel">
      <div v-if="isOpen" class="deck-container">
        <div class="card-pink elevation-10">
          <div class="d-flex justify-end mb-1">
            <v-btn dark small outlined @click="isOpen = false" class="btn-closed">
               OCULTAR
            </v-btn>
          </div>
          <v-form ref="form_item">
            <v-row dense class="ma-0">

              <v-col cols="12" class="py-1 pr-1 pl-1">
                <label class="white--text font-weight-bold caption mb-1 d-block">Población*:</label>
                <!-- <label class="white--text font-weight-bold caption mb-1 d-block">Delitos*:</label> -->
                <v-select
                  v-model="frmData.indicator_id" :items="indicators" multiple item-value="id" item-text="name" :rules="[v => (v && v.length > 0) || 'Campo obligatorio']"
                  class="frm-select" item-color="#b62b86" light solo flat dense hide-details="auto"
                  :menu-props="{ zIndex: '9999', offsetY: true, contentClass: 'menu-indicadores' }"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index < 2" small label color="#b62b86" class="white--text chip-select" close @click:close="removeIndicator(item.id)">
                       <span>{{ truncateText(removeEnumerator(item.name), 8) }}</span>
                    </v-chip>
                    <span v-if="index === 2" class="grey--text text-caption ml-1 font-weight-medium">
                      (+{{ frmData.indicator_id.length - 2 }} más)
                    </span>
                  </template>

                  <template v-slot:append-outer>
                    <v-btn dark small outlined class="btn-closed" @click="getCategories" title="Cargar categorías">
                        Aplicar
                    </v-btn>
                  </template>

                  <template v-slot:message="{ message }">
                    <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="4" class="py-1 pl-1 pr-1">
                <label class="white--text font-weight-bold caption mb-1 d-block">Estado*:</label>
                  <v-select v-model="frmData.state_id" :items="states" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isStateDisabled"
                    class="frm-select" item-color="#b62b86" light solo flat dense hide-details="auto"
                    :menu-props="{ zIndex: '9999', offsetY: true, contentClass: 'menu-indicadores' }"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="item.id === 0" small label color="#b62b86" class="chip-select" text-color="white">
                        <span>{{ item.title }}</span>
                      </v-chip>
                      <v-chip v-else-if="index === 0" small label color="#b62b86" class="chip-select" text-color="white">
                        <span>{{ item.iso_code }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text span-select">
                        (+{{ frmData.state_id.length - 1 }})
                      </span>
                    </template>

                    <template v-slot:message="{ message }">
                      <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
                    </template>
                  </v-select>
              </v-col>

              <v-col cols="4" class="py-1 pr-1 pl-1">
                <label class="white--text font-weight-bold caption mb-1 d-block">Año*:</label>
                <v-select v-model="frmData.year_id" :items="years" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isYearDisabled"
                  class="frm-select" item-color="#b62b86" light solo flat dense hide-details="auto"
                  :menu-props="{ zIndex: '9999', offsetY: true, contentClass: 'menu-indicadores' }"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0" small label color="#b62b86" class="chip-select" text-color="white">
                      <span>{{ item.title }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text span-select">
                      (+{{ frmData.year_id.length - 1 }})
                    </span>
                  </template>
                  <template v-slot:message="{ message }">
                    <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="4" class="py-1 pl-1 pr-1">
                <label class="white--text font-weight-bold caption mb-1 d-block">Sexo*:</label>
                <v-select v-model="frmData.gender_id" :items="genders" multiple item-value="id" item-text="title" :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isGenderDisabled"
                    class="frm-select" item-color="#b62b86" light solo flat dense hide-details="auto"
                    :menu-props="{ zIndex: '9999', offsetY: true, contentClass: 'menu-indicadores' }"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="item.id === 0" small label color="#b62b86" class="chip-select" text-color="white">
                        <span>{{ item.title }}</span>
                      </v-chip>
                      <v-chip v-else-if="index === 0" small label color="#b62b86" class="chip-select" text-color="white">
                        <span>{{ truncateText(item.title, 2) }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text span-select">
                        (+{{ frmData.gender_id.length - 1 }})
                      </span>
                    </template>
                    <template v-slot:message="{ message }">
                      <span class="yellow--text text--lighten-3 font-weight-bold">{{ message }}</span>
                    </template>
                </v-select>
              </v-col>

            </v-row>
          </v-form>
        </div>

        <div class="card-white-wrapper">
          <div class="card-white" :class="{ 'is-expanded': categoriesExpanded, 'elevation-2': categoriesExpanded }">
            <div class="pa-4 pt-6"> <h4 class="mb-2" style="color: #6a3d8f;">TIPO DE DELITO:</h4>
              <!-- <v-treeview
                selectable
                v-model="frmData.category_id"
                :items="categories"
                item-text="title"
                item-key="id"
                class="tree-compact custom-tree"
                selected-color="#b62b86"
                dense>
              </v-treeview> -->

              <v-treeview
                selectable
                v-model="frmData.category_id"
                :items="categories"
                item-text="title"
                item-key="id"
                class="tree-compact custom-tree"
                selected-color="#b62b86"
                on-icon="mdi-minus"
                off-icon="mdi-plus"
                indeterminate-icon="mdi-minus"
                dense>
              </v-treeview>

              <div class="d-flex justify-end mt-2">
                <v-btn color="#342a83" elevation="5" @click="submitFilters" class="white--text btn-consult" :disabled="btnSend">
                  CONSULTAR
                  <v-icon right dark>mdi-arrow-bottom-right-thick</v-icon>
                </v-btn>
              </div>
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
      isOpen: false, // Controla el panel completo vs la cinta
      categoriesExpanded: false, // Controla si la tarjeta blanca está visible
      frmData: {
        // group_by: '',
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
      btnSend: false,
      activeToggle: false

    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {
    'frmData.indicator_id' (newVal, oldVal) {
      // Nos aseguramos de tener la longitud, usando 0 si por alguna razón es undefined
      const newLength = newVal ? newVal.length : 0
      const oldLength = oldVal ? oldVal.length : 0

      // if (!newLength || newLength < oldLength) { // solo cuando disminulle
      if (!newLength || newLength !== oldLength) { // cuando es diferente
        this.$nextTick(() => {
          // Deshabilitamos el botón de enviar
          this.btnSend = true
          this.frmData.category_id = []
          this.$emit('clear-categories')
          this.categoriesExpanded = false
          this.activeToggle = false
          this.$emit('show-cards', false)
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
        this.activeToggle = false
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
    },
    states: {
      immediate: true, // Se ejecuta apenas se crea el componente
      handler (newStates) {
        if (newStates && newStates.length > 0 && this.frmData.state_id.length === 0) {
          this.frmData.state_id = [0]
        }
      }
    },
    years: {
      immediate: true, // Se ejecuta apenas se crea el componente
      handler (newYears) {
        if (newYears && newYears.length > 0 && this.frmData.year_id.length === 0) {
          this.frmData.year_id = [0]
        }
      }
    },
    genders: {
      immediate: true, // Se ejecuta apenas se crea el componente
      handler (newGenders) {
        if (newGenders && newGenders.length > 0 && this.frmData.gender_id.length === 0) {
          this.frmData.gender_id = [0]
        }
      }
    },
    categories: {
      immediate: true, // Se ejecuta apenas se crea el componente
      async handler (newCategories) {
        if (!newCategories.length) {
          this.frmData.category_id = []
          this.btnSend = true
        } else if (newCategories && newCategories.length > 0) {
          this.btnSend = false
          const LeafIds = await this.getAllLeafIds(this.categories)
          this.frmData.category_id = LeafIds
        }
      }
    }
  },

  // 5️⃣ Métodos
  methods: {
    removeEnumerator (text) {
      return text.replace(/^\d+\.\s*/, '')
    },
    truncateText (text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    },
    removeIndicator (idToRemove) {
      // console.log('removeIndicator')
      // Filtramos el array del v-model para excluir el ID que el usuario cerró
      this.frmData.indicator_id = this.frmData.indicator_id.filter(
        id => id !== idToRemove
      )
      this.btnSend = true
      this.$emit('clear-categories')
      this.categoriesExpanded = false
      this.activeToggle = false
      this.$emit('show-cards', false) // Emitimos el evento para ocultar las tarjetas si se quita un indicador
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
    },

    // ==============================================
    getAllLeafIds (nodes, result = []) {
      nodes.forEach(node => {
        if (node.children && node.children.length) {
          this.getAllLeafIds(node.children, result)
        } else {
          result.push(node.id)
        }
      })
      return result
    },
    getCategories () {
      // 1. Validar IDs de indicadores seleccionados
      const sendData = this.frmData.indicator_id
      if (!sendData.length) {
        this.$store.dispatch('storeNotif/error', {
          message: 'Debe de seleccionar al menos algún tipo de población para solicitar tipos de delitos asociados'
        })
        return
      }

      // 2. Emitir evento para buscar las categorías reales en el backend (si aplica)
      this.$emit('fetch-categories', sendData) // this.frmData

      // 3. Desplegar la segunda tarjeta (efecto baraja)
      this.categoriesExpanded = true
    },
    // ==============================================
    submitFilters () {
      // Validar Campos vacios
      if (!this.$refs.form_item.validate()) {
        this.$store.dispatch('storeNotif/error', {
          message: '¡Favor de seleccionar las opciones obligatorias para generar la consulta!'
        })
        return ''
      }

      const categoryID = this.frmData.category_id
      if (!categoryID.length) {
        this.$store.dispatch('storeNotif/error', {
          message: 'Debe seleccionar al menos algún tipo de delito'
        })
        return
      }

      // Emitir el formulario completo al mapa
      this.$emit('submit', this.frmData)
      // this.isOpen = false; // Contraer o cerrar panel después de aplicar
    },
    async reset () {
      this.$refs.form_checker.reset()
      setTimeout(() => {
        this.$refs.txt_exp.focus()
      }, '100')
    },
    onSubmit (e) {
      if (!this.htmlSubmit) {
        e.preventDefault()
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
  /* general ======================================================================================================= */
  /* Contenedor absoluto a la misma altura (20px) que el StackCards */
  .left-panel-wrapper {
    position: absolute;
    top: 90px;
    left: 0;
    /* z-index: 5; */
    display: flex;
    align-items: flex-start;
  }

  /* ===============================
    CINTA (Ribbon)
  =============================== */
  .ribbon-toggle {
    background: linear-gradient(90deg, #9C27B0 0%, #E91E63 100%);
    padding: 12px 15px 12px 10px;
    border-radius: 0 20px 20px 0;
    cursor: pointer;
    transition: width 0.3s ease;
    /* Separación del borde de la pantalla */
    margin-left: 0px;
    margin-top: -80px;
  }
  .ribbon-toggle:hover {
    padding-right: 18px; /* Pequeño efecto al pasar el mouse */
  }

  /* ===============================
    TARJETAS APILADAS (Deck)
  =============================== */
  .deck-container {
    width: 410px;
    /* Separación del borde de la pantalla */
    margin-left: 20px;
    margin-top: -70px;
    display: flex;
    flex-direction: column;
  }

  /* Tarjeta 1: Rosa */
  .card-pink {
    /* background: linear-gradient(to bottom, #b62b86 10%, #e30c7e 100%); */
    /* background: linear-gradient(135deg, #9C27B0 0%, #E91E63 100%); */
    background: linear-gradient(to bottom, #b62b86 0%, #E91E63 100%);
    border-radius: 20px;
    padding: 18px;
    position: relative;
    z-index: 2; /* Siempre por encima de la tarjeta blanca */
  }

  /* Tarjeta 2: Blanca/Gris (Contenedor que oculta el desbordamiento) */
  .card-white-wrapper {
    position: relative;
    z-index: 1; /* Por debajo de la tarjeta rosa */
    margin-top: -20px; /* Sube el contenedor para solaparse por detrás del borde redondeado de la rosa */
    /* padding-bottom: 30px; */
    padding: 5px;
    overflow: hidden; /* Clave para el efecto: esconde la tarjeta hasta que baje */
    border-radius: 0 0 20px 20px;
  }

  /* La tarjeta blanca en sí */
  .card-white {
    background-color: #efeee8; /* efeee8 dfdad0*/
    border-radius: 0 0 20px 20px;
    transform: translateY(-100%); /* Inicialmente escondida arriba (detrás de la rosa) */
    /* transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1); Transición suave */
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s;
  }

  /* Clase dinámica que baja la tarjeta blanca */
  .card-white.is-expanded {
    transform: translateY(0);
  }

  /* Boton de cerrar */
  .btn-closed {
    border-radius: 10px !important;
    font-weight: bold !important;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    background-color: transparent !important;
    color: white !important;
    border: 1px solid white !important;
  }

  .btn-consult {
    border-radius: 10px !important;
    font-weight: bold !important;
    letter-spacing: 1px;
    text-transform: uppercase;
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

   /* treeview ======================================================================================================= */

  ::v-deep .select-compacto .v-input__append-outer {
    margin-left: 2px !important;
  }

  /* ================================ treeview ================================ */
  /* Label tipo v-text-field */
  .tree-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }

  /* Contenedor general */
  .tree-compact {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    max-height: 190px;
    overflow-y: auto;
  }

  /* Cada nodo */
  .tree-compact ::v-deep .v-treeview-node__root {
    min-height: 20px !important;
    padding: 0 4px !important;
  }

  /* Texto del nodo */
  .tree-compact ::v-deep .v-treeview-node__label {
    font-size: 12px;
    line-height: 1.2 !important;
  }
  /* ================================ Checkbox ================================ */
  /* Checkbox */
  /* .tree-compact ::v-deep .v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
  } */

  /* Iconos (expand + checkbox) */
  /* .tree-compact ::v-deep .v-icon {
    font-size: 20px !important;
  } */

  /* .tree-compact ::v-deep .v-treeview-node__checkbox {
    width: 10px !important;
    transform: scale(0.85) !important;
  } */

  /* ================================ Checkbox (Píldoras UX) ================================ */
  /* 1. Damos forma de "píldora" directamente al checkbox */
  .tree-compact ::v-deep .v-treeview-node__checkbox {
    width: 36px !important;       /* Ancho del botón */
    height: 18px !important;      /* Alto del botón */
    border-radius: 10px !important; /* Bordes redondos */
    font-size: 14px !important;   /* Tamaño del signo + o - */
    display: inline-flex !important; /* inline-flex ayuda a centrar mejor el icono */
    align-items: center !important;
    justify-content: center !important;
    margin-right: 8px !important; /* Separación con el texto del delito */
    transform: none !important;   /* Evita que Vuetify lo haga pequeño */
  }

  /* 2. Estado NO SELECCIONADO (Icono +). Nota: SIN ESPACIO entre las clases */
  .tree-compact ::v-deep .v-treeview-node__checkbox.mdi-plus {
    background-color: #efeee8 !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important; /* Borde negro al 20% */
    color: rgba(0, 0, 0, 0.4) !important; /* Signo + en gris oscuro */
  }

  /* 3. Estado SELECCIONADO e INDETERMINADO (Icono -). Nota: SIN ESPACIO entre las clases */
  .tree-compact ::v-deep .v-treeview-node__checkbox.mdi-minus {
    background-color: #f44336 !important; /* Rojo */
    border: 1px solid #f44336 !important;
    color: #ffffff !important; /* Signo - en blanco */
  }

  /* -------------------------------------------------------------------------------- */
  /* Botón del icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle {
    width: 25px;
    height: 25px;
  }

  /* Icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle .v-icon {
    font-size: 20px !important;
  }

  /* Estado activo (seleccionado / focus) */
  .tree-compact ::v-deep .v-treeview-node__toggle.v-btn--active {
    border-radius: 50%;
  }

  /* ======================================================================================================= */

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

  /* v-select ============================================================================================================ */
  .frm-select ::v-deep .v-input__control>.v-input__slot {
    padding: 0 0 0 5px !important;
    background-color: #dedddc !important;

  }
  .chip-select {
    font-size: 11px !important;
    padding: 0 10px;
    margin: 0 1px !important;
    text-overflow: ellipsis;
    border-radius: 10px !important;
  }
  .span-select {
    font-size: 12px;
    padding: 0 0 0 2px !important;
  }

</style>
<style>
   /* 1. Aplicamos tu color con la opacidad de 0.2 (20%) */
  .menu-indicadores .v-list-item--active {
    background-color: rgba(182, 43, 134, 0.2) !important;
  }
  /* 2. Quitamos el cuadro gris por defecto de Vuetify */
  .menu-indicadores .v-list-item--active::before {
    display: none !important;
  }
  /* 3. Aseguramos el color magenta del texto */
  .menu-indicadores .v-list-item--active .v-list-item__title,
  .menu-indicadores .v-list-item--active .v-list-item__content {
    color: #b62b86 !important;
  }
  /* ========================================================================================= */

</style>
