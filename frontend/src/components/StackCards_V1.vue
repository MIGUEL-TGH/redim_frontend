<template>
  <div class="stack-container">
    <div v-for="(card, index) in cards" :key="index" class="stack-card" :class="{ open: card.open }" :style="stackStyle(index)" >
      <div class="stack-header" @click="toggle(index)">
        <span>{{ card.title }}</span>
        <v-icon small>
          {{ card.open ? 'mdi-minus' : 'mdi-plus' }}
        </v-icon>
      </div>

      <transition name="expand">
        <div v-if="card.open" class="stack-content">
          <!-- SOLO DISEÑO POR AHORA -->
          <div class="fake-content">
            Contenido estadístico aquí
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>

export default {
  // 1️⃣ Identificación
  name: 'StackCardsComp',
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
      cards: [
        { title: 'Población total', open: true },
        { title: 'Índice de pobreza', open: false },
        { title: 'Cobertura educativa', open: false }
      ]
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    toggle (index) {
      this.cards[index].open = !this.cards[index].open
    },
    stackStyle (index) {
      return {
        top: `${index * 8}px`,
        zIndex: 100 - index
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
  /* #map-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
  }

  #viewDiv {
    width: 100%;
    height: 100%;
  }

  .stats-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 320px;
    z-index: 10;
  } */

  .stack-container {
    position: relative;
  }

  .stack-card {
    position: relative;
    background: white;
    border-radius: 12px;
    border: 2px solid #e0e0e0;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .stack-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  }

  .stack-header {
    padding: 12px 16px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stack-content {
    padding: 16px;
    border-top: 1px solid #eee;
  }

  .fake-content {
    height: 100px;
    background: linear-gradient(135deg, #f5f5f5, #fafafa);
    border-radius: 8px;
  }
  /* ----------------------------------------------------------------------------------------- */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.25s ease;
  }

  .expand-enter,
  .expand-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
</style>
