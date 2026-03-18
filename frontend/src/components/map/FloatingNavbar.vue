<template>
  <div class="navbar-wrapper" :class="{ 'is-mobile': $vuetify.breakpoint.smAndDown }">
    <v-btn large :color="isOpen ? '#3c3c3b' : '#ed712c'" dark class="menu-trigger-btn elevation-8" @click="isOpen = !isOpen">
      <v-icon left>{{ isOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      MENU
    </v-btn>

    <!-- <v-expand-x-transition v-if="!$vuetify.breakpoint.smAndDown">
      <div v-show="isOpen" class="nav-links-container elevation-4">
        <v-btn
          v-for="(item, i) in menuItems"
          :key="i"
          text
          class="nav-item-btn"
          :to="item.to"
        >
          {{ item.text }}
        </v-btn>
      </div>
    </v-expand-x-transition> -->

    <!-- <v-fade-transition v-if="$vuetify.breakpoint.smAndDown">
      <div v-show="isOpen" class="mobile-menu-overlay">
        <div class="mobile-links">
          <v-btn
            v-for="(item, i) in menuItems"
            :key="i"
            block
            x-large
            text
            dark
            @click="isOpen = false"
            :to="item.to"
          >
            {{ item.text }}
          </v-btn>
        </div>
      </div>
    </v-fade-transition> -->
  </div>
</template>

<script>
export default {
  // 1️⃣ Identificación
  name: 'InitComp',
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
      isOpen: false,
      menuItems: [
        { text: 'INICIO', to: '/' },
        { text: 'CONOCE', to: '/conoce' },
        { text: 'APRENDE', to: '/aprende' },
        { text: 'CONTACTA', to: '/contacta' },
        { text: 'REDIM', to: '/redim' }
      ]
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {},

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
  .navbar-wrapper {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100; /* Por encima del mapa y otros componentes */
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-trigger-btn {
  border-radius: 30px !important;
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.nav-links-container {
  background: white;
  border-radius: 30px;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-item-btn {
  color: #3c3c3b !important;
  font-weight: 600;
}

.nav-item-btn:hover {
  color: #276acc !important;
}

/* Responsividad Móvil */
.is-mobile {
  top: 15px;
  left: 15px;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(106, 61, 143, 0.95); /* Color primario con transparencia */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}

.mobile-links {
  text-align: center;
  width: 80%;
}
</style>
