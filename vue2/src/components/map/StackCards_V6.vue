<template>
  <div class="stack-wrapper">
    <div class="stack-container">
      <div v-for="(card, index) in cards" :key="index" class="stack-item" :class="{ 'is-active': activeIndex === index }" :style="getItemStyle(index)">
        <!-- :class="{ 'un-active': activeIndex != index }" -->
         <!-- :class="{ 'un-active': activeIndex !== index && index !== 0 }" -->
        <div
          class="stack-header"
          :class="{ 'un-active': shouldApplyUnactive(index) }"
          :style="{ background: card.gradient }"
          @click="toggle(index)"
        >
            <span class="stack-title">{{ card.title }}</span>

            <div class="icon-pill">
              <v-icon small :color="card.baseColor">
                {{ activeIndex === index ? 'mdi-minus' : 'mdi-plus' }}
              </v-icon>
            </div>
        </div>

        <v-expand-transition>
          <div v-show="activeIndex === index" class="stack-content">
            <slot :name="card.id">
              <div class="fake-content" style="padding: 15px;">
                <p>Estadísticas para {{ card.title }}</p>
                <div class="simple-bar" style="width: 80%"></div>
                <div class="simple-bar" style="width: 60%"></div>
                <div class="simple-bar" style="width: 40%"></div>
              </div>
            </slot>
          </div>
        </v-expand-transition>
      </div>
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
      overlapMargin: -30,
      cards: [
        {
          id: 'poblacion',
          title: 'Población total',
          baseColor: '#e255a1',
          gradient: 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)'
        },
        {
          id: 'pobreza',
          title: 'Índice de pobreza',
          baseColor: '#556cd6',
          gradient: 'linear-gradient(90deg, #2196F3 0%, #3F51B5 100%)'
        },
        {
          id: 'educacion',
          title: 'Cobertura educativa',
          baseColor: '#ff7a1a',
          gradient: 'linear-gradient(90deg, #FF9800 0%, #FF5722 100%)'
        },
        {
          id: 'internados',
          title: 'Señalados e Internados',
          baseColor: '#17b35f',
          gradient: 'linear-gradient(90deg, #4CAF50 0%, #009688 100%)'
        }
      ]
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    toggle (index) {
      // console.log(index)
      this.activeIndex = this.activeIndex === index ? null : index
    },
    getItemStyle (index) {
      const isFirst = index === 0
      // const isActive = this.activeIndex === index

      return {
        zIndex: this.cards.length - index,

        // Si es la primera, no lleva margen.
        // Si la anterior está abierta, tampoco debería encimarse tanto.
        marginTop: isFirst ? '0px' : `${this.overlapMargin}px`,

        // Añadimos una transición suave para el margen
        transition: 'margin 0.4s ease, transform 0.3s ease'
      }
    },
    shouldApplyUnactive (index) {
      // No aplicar si es el primero
      if (index === 0) return false
      // Aplicar solo si no es el activo
      return this.activeIndex !== index
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
/* Contenedor posicionado en el mapa (ArcGIS) */
.stack-wrapper {
  position: absolute;
  top: 10px;
  right: 0px;
  z-index: 1000; /* Asegurar que esté sobre el mapa */
  /* width: 320px; */
  width: 400px;
  font-family: 'Roboto', sans-serif;
}

.stack-container {
  display: flex;
  flex-direction: column;
}

.stack-item {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.stack-item:hover {
  transform: translateX(-20px);
}

/* Cuando una tarjeta está activa, le damos un poco más de sombra */
.stack-item.is-active {
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  margin-bottom: 10px;
  /* margin-top: 5px !important;*/  /* Evita que se vea encimada cuando está abierta */
  margin-top: 0 !important;
  /* margin-top: -25px !important; */
}

.stack-header {
  /* height: 50px; */
  height: 70px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: white;
}
.stack-header.un-active {
  height: 70px;
  padding-top: 30px;
}

.stack-title {
  font-weight: bold;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.icon-pill {
  background: white;
  width: 32px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stack-content {
  background: white;
  /* padding: 15px; */
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* Estilos de ejemplo para el contenido interno */
.fake-content {
  color: #444;
}

.simple-bar {
  height: 12px;
  background: #ff5252;
  margin: 10px 0;
  border-radius: 6px;
  opacity: 0.8;
}
</style>
