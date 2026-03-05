<template>
  <div class="stack-container">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="stack-card"
      :class="{ open: activeIndex === index }"
      :style="stackStyle(index)"
    >
      <div
        class="stack-header"
        :style="{ background: card.color }"
        @click="toggle(index)"
      >
        <span>{{ card.title }}</span>

        <div class="icon-pill">
          <v-icon x-small color="white">
            {{ activeIndex === index ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
        </div>
      </div>

      <transition name="expand">
        <div
          v-show="activeIndex === index"
          class="stack-content"
        >
          <div class="fake-content"></div>
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
      activeIndex: 0,
      overlap: 42, // cuánto se enciman
      cards: [
        { title: 'Población total', color: '#e255a1' },
        { title: 'Índice de pobreza', color: '#556cd6' },
        { title: 'Cobertura educativa', color: '#ff7a1a' },
        { title: 'Señalados e Internados', color: '#17b35f' }
      ]
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    toggle (index) {
      this.activeIndex = index
    },

    stackStyle (index) {
      if (index === 0) return { zIndex: 10 }

      return {
        marginTop: `-${this.overlap}px`,
        zIndex: 10 - index
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
.stack-container {
  width: 320px;
}

/* Tarjeta base */
.stack-card {
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.18);
  transition: all 0.3s ease;
}

/* Header tipo pestaña */
.stack-header {
  height: 52px;
  padding: 0 18px;
  font-size: 18px;
  font-weight: 500;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Botón pequeño */
.icon-pill {
  width: 36px;
  height: 22px;
  background: rgba(255,255,255,0.85);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenido */
.stack-content {
  background: white;
  padding: 16px;
}

.fake-content {
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(145deg,#f2f2f2,#fafafa);
}

/* Animación suave */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
