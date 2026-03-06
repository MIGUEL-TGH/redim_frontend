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
          <v-icon small color="white">
            {{ activeIndex === index ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
        </div>
      </div>

      <transition name="expand">
        <div v-show="activeIndex === index" class="stack-content">
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
      overlap: 45, // cuánto se enciman
      cards: [
        { title: 'Población total', color: '#e85aac' },
        { title: 'Índice de pobreza', color: '#556cd6' },
        { title: 'Cobertura educativa', color: '#ff7a1a' },
        { title: 'Señalados e Internados', color: '#0db561' }
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
      if (index === 0) return {}

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
  width: 340px;
  position: relative;
}

/* Tarjetas */
.stack-card {
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Header */
.stack-header {
  height: 80px;
  /* height: 50px; */
  padding: 0 24px;
  font-size: 26px;
  font-weight: 500;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Botón blanco */
.icon-pill {
  width: 44px;
  height: 28px;
  background: rgba(255,255,255,0.85);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Contenido */
.stack-content {
  background: white;
  padding: 20px;
  border-top: 3px solid rgba(0,0,0,0.08);
}

.fake-content {
  height: 140px;
  border-radius: 14px;
  background: linear-gradient(145deg,#f3f3f3,#fafafa);
}

/* Animación suave */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
