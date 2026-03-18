<template>
  <div class="custom-navbar-wrapper">
    <v-expand-x-transition>
      <div v-show="isOpen && !$vuetify.breakpoint.smAndDown" class="nav-links-pill mr-3 elevation-2">
        <v-btn
          v-for="(item, i) in menuItems"
          :key="i"
          text
          rounded
          class="nav-item-btn"
        >
          {{ item.text }}
        </v-btn>
      </div>
    </v-expand-x-transition>

    <v-menu
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="isOpen"
      bottom
      left
      offset-y
      transition="slide-y-transition"
      content-class="mobile-menu-dropdown"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          :class="['menu-toggle-btn', isOpen ? 'btn-open' : 'btn-closed']"
          rounded
          elevation="0"
          height="40"
        >
          MENU
          <v-icon right>{{ isOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
        </v-btn>
      </template>

      <v-list class="mobile-nav-list">
        <v-list-item v-for="(item, i) in menuItems" :key="i" link>
          <v-list-item-title class="mobile-nav-text">{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-else
      @click="isOpen = !isOpen"
      :class="['menu-toggle-btn', isOpen ? 'btn-open' : 'btn-closed']"
      rounded
      elevation="0"
      height="40"
    >
      MENU
      <v-icon right>{{ isOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  // 1️⃣ Identificación
  name: 'CustomNavbar',
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
  .custom-navbar-wrapper {
  display: flex;
  align-items: center;
}

/* ===============================
   CONTENEDOR DE ENLACES (ESCRITORIO)
================================ */
.nav-links-pill {
  display: flex;
  background-color: white;
  border-radius: 20px; /* Bordes redondos como pastilla */
  padding: 0 10px;
  white-space: nowrap;
}

.nav-item-btn {
  color: #3c3c3b !important; /* Color gris oscuro de tu paleta tercearia */
  font-weight: 700 !important;
  letter-spacing: 0.5px;
  margin: 0 2px;
}

.nav-item-btn:hover {
  color: #276acc !important; /* Azul primario al pasar el mouse */
  background-color: rgba(39, 106, 204, 0.1);
}

/* ===============================
   DISEÑO DEL BOTÓN "MENU"
================================ */
.menu-toggle-btn {
  font-weight: bold !important;
  letter-spacing: 1px;
  transition: all 0.3s ease-in-out;
  border-radius: 20px !important; /* Bordes redondos */
  padding: 0 20px !important;
}

/* Estado: NO VISIBLE (Azul con borde blanco) */
.btn-closed {
  background-color: #276acc !important; /* Azul de tu paleta primaria */
  color: white !important;
  border: 2px solid white !important;
}

/* Estado: VISIBLE (Blanco) */
.btn-open {
  background-color: white !important; /* Blanco */
  color: #276acc !important; /* Texto azul para que se lea sobre blanco */
  border: 2px solid white !important; /* Mantiene la estructura */
}

/* ===============================
   MENÚ DESPLEGABLE (MÓVILES)
================================ */
.mobile-menu-dropdown {
  border-radius: 15px !important;
  margin-top: 15px;
}

.mobile-nav-list {
  background-color: white;
  padding: 10px 0;
}

.mobile-nav-text {
  color: #3c3c3b;
  font-weight: bold;
  text-align: center;
  font-size: 16px;
}
</style>
