<template>
  <div class="stack-container">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="stack-card"
      :class="{ open: activeIndex === index }"
      :style="cardPosition(index)"
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
        <div v-if="activeIndex === index" class="stack-content">
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
      activeIndex: 0,
      collapsedHeight: 65,
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

    cardPosition (index) {
      return {
        top: `${index * this.collapsedHeight}px`,
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
 .stack-container {
    position: relative;
    width: 340px;
    height: 420px; /* controla altura total visible */
  }

  /* TARJETA BASE */
  .stack-card {
    position: absolute;
    width: 100%;
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
    transition: all 0.35s cubic-bezier(.4, 0, .2, 1);
  }

  /* ALTURA CUANDO ESTÁ ABIERTA */
  .stack-card.open {
    height: 280px;
  }

  /* ALTURA CUANDO ESTÁ CERRADA */
  .stack-card:not(.open) {
    height: 80px;
  }

  /* HEADER */
  .stack-header {
    height: 80px;
    padding: 0 24px;
    font-size: 28px;
    font-weight: 500;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Botón circular blanco */
  .icon-pill {
    width: 44px;
    height: 28px;
    background: rgba(255,255,255,0.85);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* CONTENIDO */
  .stack-content {
    background: white;
    padding: 20px;
    border-top: 3px solid rgba(0,0,0,0.1);
  }

  /* Contenido simulado */
  .fake-content {
    height: 130px;
    border-radius: 14px;
    background: linear-gradient(
      145deg,
      #f2f2f2,
      #fafafa
    );
  }

  /* Animación */
  .expand-enter-active,
  .expand-leave-active {
    transition: opacity 0.25s ease;
  }

  .expand-enter,
  .expand-leave-to {
    opacity: 0;
  }
</style>
