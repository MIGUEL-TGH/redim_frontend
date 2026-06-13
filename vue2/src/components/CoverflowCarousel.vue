<template>
  <div class="coverflow" :class="'coverflow--' + variant">
    <div
      class="coverflow-stage"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @pointerleave="onPointerUp"
    >
      <div
        v-for="(item, i) in items"
        :key="i"
        class="cf-card"
        :class="cardClass(i)"
        @click="onCardClick(i)"
      >
        <slot name="card" :item="item" :index="i" :active="i === activeIndex"></slot>
      </div>
    </div>

    <!-- Puntos de paginación -->
    <div class="coverflow-dots">
      <button
        v-for="(item, i) in items"
        :key="'dot-' + i"
        type="button"
        class="dot"
        :class="{ 'dot--active': i === activeIndex }"
        :aria-label="'Elemento ' + (i + 1)"
        @click="goTo(i)"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  // 1️⃣ Identificación
  name: 'CoverflowCarousel',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    items: {
      type: Array,
      default: () => []
    },
    variant: {
      type: String,
      default: 'video'
    }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      activeIndex: 0,
      dragStartX: null,
      dragDelta: 0,
      isDragging: false
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    goTo (index) {
      const total = this.items.length
      if (total === 0) {
        return
      }
      this.activeIndex = ((index % total) + total) % total
    },
    goNext () {
      this.goTo(this.activeIndex + 1)
    },
    goPrev () {
      this.goTo(this.activeIndex - 1)
    },
    cardClass (i) {
      // Pasarela de 5 tarjetas: 2 a la izquierda, centro y 2 a la derecha.
      // Nodos estables (key fija) y solo cambia la clase, para que la transición
      // funcione en ambos sentidos.
      const total = this.items.length
      const offset = (((i - this.activeIndex) % total) + total) % total
      if (offset === 0) {
        return 'is-active'
      }
      if (offset === 1) {
        return 'is-next'
      }
      if (offset === 2) {
        return 'is-next2'
      }
      if (offset === total - 1) {
        return 'is-prev'
      }
      if (offset === total - 2) {
        return 'is-prev2'
      }
      return 'is-hidden'
    },
    onCardClick (i) {
      // Cualquier tarjeta lateral visible pasa al centro
      if (this.isDragging) {
        return
      }
      if (i !== this.activeIndex) {
        this.goTo(i)
      }
    },
    onPointerDown (event) {
      this.dragStartX = event.clientX
      this.dragDelta = 0
      this.isDragging = false
    },
    onPointerMove (event) {
      if (this.dragStartX === null) {
        return
      }
      this.dragDelta = event.clientX - this.dragStartX
      if (Math.abs(this.dragDelta) > 8) {
        this.isDragging = true
      }
    },
    onPointerUp () {
      if (this.dragStartX === null) {
        return
      }
      const threshold = 60
      if (this.dragDelta <= -threshold) {
        this.goNext()
      } else if (this.dragDelta >= threshold) {
        this.goPrev()
      }
      this.dragStartX = null
      this.dragDelta = 0
      this.$nextTick(() => {
        this.isDragging = false
      })
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
  .coverflow {
    position: relative;
    z-index: 2;
    /* max-width: 1100px; */
    max-width: 800px;
    margin: 0 auto;
  }

  .coverflow-stage {
    position: relative;
    width: 100%;
    height: 420px;
    touch-action: pan-y;
    cursor: grab;
  }

  .coverflow-stage:active {
    cursor: grabbing;
  }

  .cf-card {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 380px;
    max-width: 80%;
    margin: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
    will-change: transform, opacity;
  }

  .cf-card.is-active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    z-index: 5;
  }

  .cf-card.is-prev {
    transform: translate(-108%, -50%) scale(0.8);
    opacity: 0.6;
    z-index: 4;
    cursor: pointer;
  }

  .cf-card.is-next {
    transform: translate(8%, -50%) scale(0.8);
    opacity: 0.6;
    z-index: 4;
    cursor: pointer;
  }

  .cf-card.is-prev2 {
    transform: translate(-162%, -50%) scale(0.62);
    opacity: 0.32;
    z-index: 3;
    cursor: pointer;
  }

  .cf-card.is-next2 {
    transform: translate(62%, -50%) scale(0.62);
    opacity: 0.32;
    z-index: 3;
    cursor: pointer;
  }

  .cf-card.is-hidden {
    transform: translate(-50%, -50%) scale(0.55);
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }

  /* Variante podcast: tarjetas más anchas y bajas (estilo audio).
     Pasarela compacta para que no se extienda mucho en los laterales.
     Las tarjetas se anclan ARRIBA del escenario (top: 0) para que el muñeco
     que viene detrás solape de forma predecible su parte inferior. */
  .coverflow--podcast .coverflow-stage {
    height: 210px;
  }

  .coverflow--podcast .cf-card {
    width: 440px;
    max-width: 80%;
    top: 0;
  }

  .coverflow--podcast .cf-card.is-active {
    transform: translate(-50%, 0) scale(1);
  }

  .coverflow--podcast .cf-card.is-prev {
    transform: translate(-78%, 0) scale(0.85);
  }

  .coverflow--podcast .cf-card.is-next {
    transform: translate(-22%, 0) scale(0.85);
  }

  .coverflow--podcast .cf-card.is-prev2 {
    transform: translate(-110%, 0) scale(0.7);
  }

  .coverflow--podcast .cf-card.is-next2 {
    transform: translate(10%, 0) scale(0.7);
  }

  .coverflow--podcast .cf-card.is-hidden {
    transform: translate(-50%, 0) scale(0.55);
  }

  /* ===============================
    PUNTOS DE PAGINACIÓN
  ================================ */
  .coverflow-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 24px;
    position: relative;
    z-index: 2;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    padding: 0;
    transition: background-color 0.25s ease, transform 0.25s ease;
  }

  .dot--active {
    background-color: #ffffff;
    transform: scale(1.2);
  }

  /* ===============================
    RESPONSIVIDAD
  ================================ */

  /* Mobile: solo la tarjeta central */
  @media (max-width: 575.98px) {
    .cf-card {
      width: 280px;
    }
    .cf-card.is-prev,
    .cf-card.is-next,
    .cf-card.is-prev2,
    .cf-card.is-next2 {
      transform: translate(-50%, -50%) scale(0.7);
      opacity: 0;
      pointer-events: none;
    }
    .coverflow--podcast .cf-card {
      width: 300px;
    }
  }

  /* Mobile landscape y Tablet: 3 tarjetas (se ocultan las externas) */
  @media (min-width: 576px) and (max-width: 991.98px) {
    .cf-card.is-prev2,
    .cf-card.is-next2 {
      transform: translate(-50%, -50%) scale(0.65);
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
