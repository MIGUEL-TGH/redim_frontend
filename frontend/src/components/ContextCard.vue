<template>
  <div class="ctx-card" :class="{ 'ctx-card--expanded': expanded }">
    <!-- Cabecera de color con el título -->
    <div class="ctx-card-header" :style="{ backgroundColor: headerColor }">
      <span class="ctx-card-title">{{ title }}</span>
    </div>

    <!-- Cuerpo blanco con el texto -->
    <div class="ctx-card-body">
      <div class="ctx-card-text" v-html="body"></div>

      <button type="button" class="ctx-card-expand" :aria-label="'Expandir ' + title" @click="onExpand">
        <img :src="expandir" alt="">
      </button>
    </div>
  </div>
</template>

<script>
import expandir from '@/assets/contexto/expandir.png'

export default {
  // 1️⃣ Identificación
  name: 'ContextCard',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    title: {
      type: String,
      default: ''
    },
    body: {
      type: String,
      default: ''
    },
    headerColor: {
      type: String,
      default: '#342a83'
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      expandir
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    onExpand () {
      this.$emit('expand', this.title)
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
  /* Tarjeta del mockup 3.2: cabecera índigo + cuerpo claro.
     Escala fluida calcada del lienzo de 1920px (tarjeta de 686px). */
  .ctx-card {
    width: 100%;
    max-width: 686px;
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.25));
  }

  .ctx-card-header {
    position: relative;
    z-index: 2;
    border-radius: clamp(12px, 1.25vw, 24px);
    padding: 6% 10% 9%;
  }

  .ctx-card-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    letter-spacing: 1px;
    color: #efeee8;
    font-size: clamp(13px, 1.77vw, 34px);
    text-transform: uppercase;
  }

  .ctx-card-body {
    position: relative;
    z-index: 1;
    margin-top: clamp(-26px, -1.3vw, -14px);
    background-color: #f6f5f0;
    border-radius: clamp(12px, 1.2vw, 22px);
    padding: 5% 6% 9%;
  }

  .ctx-card-text {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(10px, 1.2vw, 23px);
    line-height: 1.4;
    text-align: justify;
  }

  /* Permite resaltar partes del texto con <strong> desde el padre */
  .ctx-card-text >>> strong {
    font-weight: 800;
  }

  .ctx-card-expand {
    position: absolute;
    right: 3%;
    bottom: 4%;
    width: clamp(22px, 1.9vw, 36px);
    height: clamp(22px, 1.9vw, 36px);
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .ctx-card-expand:hover {
    transform: scale(1.15);
  }

  .ctx-card-expand img {
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
