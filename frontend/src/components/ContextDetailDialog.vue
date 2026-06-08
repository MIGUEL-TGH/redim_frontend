<template>
  <!-- Overlay oscuro a pantalla completa (inspirado en StateDetailsDialog.vue) -->
  <div class="ctx-overlay" v-show="dialog" @click.self="close">
    <div class="ctx-dialog" role="dialog" aria-modal="true" :aria-label="item ? item.title : ''">
      <!-- Cabecera de color con el título -->
      <div class="ctx-dialog-header" :style="{ backgroundColor: (item && item.headerColor) ? item.headerColor : '#342a83' }">
        <span class="ctx-dialog-title">{{ item ? item.title : '' }}</span>

        <button type="button" class="ctx-dialog-close" aria-label="Cerrar" @click="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <!-- Cuerpo claro con el texto ampliado -->
      <div class="ctx-dialog-body">
        <div class="ctx-dialog-text" v-html="item ? item.body : ''"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // 1️⃣ Identificación
  name: 'ContextDetailDialog',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => null
    }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {}
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {
    // Bloquea el scroll del fondo mientras el diálogo está abierto
    dialog (isOpen) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : ''
      }
    }
  },

  // 5️⃣ Métodos
  methods: {
    close () {
      this.$emit('update:dialog', false)
    },
    onKeydown (event) {
      // Permite cerrar el diálogo con la tecla Escape
      if (event.key === 'Escape' && this.dialog) {
        this.close()
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeydown)
    document.body.style.overflow = ''
  },
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.
}
</script>

<style scoped>
  /* Overlay que oscurece el fondo y centra el diálogo */
  .ctx-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .ctx-dialog {
    width: 100%;
    max-width: 560px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.35));
  }

  /* Cabecera de color */
  .ctx-dialog-header {
    position: relative;
    z-index: 2;
    border-radius: 16px;
    padding: 22px 56px 34px 28px;
  }

  .ctx-dialog-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 900;
    letter-spacing: 1px;
    color: #efeee8;
    font-size: clamp(16px, 2.4vw, 22px);
    text-transform: uppercase;
  }

  .ctx-dialog-close {
    position: absolute;
    top: 12px;
    right: 16px;
    width: 34px;
    height: 34px;
    border: none;
    background: none;
    color: #efeee8;
    font-size: 28px;
    line-height: 1;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .ctx-dialog-close:hover {
    transform: scale(1.15) rotate(90deg);
  }

  /* Cuerpo claro con desplazamiento si el texto es largo */
  .ctx-dialog-body {
    position: relative;
    z-index: 1;
    margin-top: -18px;
    background-color: #f6f5f0;
    border-radius: 14px;
    padding: 28px 26px 26px;
    overflow-y: auto;
  }

  .ctx-dialog-text {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(13px, 1.6vw, 16px);
    line-height: 1.55;
    text-align: justify;
  }

  /* Permite resaltar partes del texto con <strong> desde el padre */
  .ctx-dialog-text >>> strong {
    font-weight: 800;
  }

  /* ===============================
    RESPONSIVIDAD
  ================================ */
  /* Mobile */
  @media (max-width: 575.98px) {
    .ctx-dialog-header {
      padding: 18px 50px 30px 22px;
    }
    .ctx-dialog-body {
      padding: 24px 20px 22px;
    }
  }
</style>
