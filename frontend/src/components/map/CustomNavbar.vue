<template>
  <div class="navbar-wrapper">

    <v-btn @click="isOpen = !isOpen" :class="['menu-btn', isOpen ? 'btn-open' : 'btn-closed']" elevation="0" height="40">
      MENU
      <!-- <v-icon right>{{ isOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon> -->
    </v-btn>

    <v-expand-transition>
      <div v-show="isOpen" class="dropdown-panel elevation-10">
        <v-list class="nav-list" color="transparent" dark>
          <v-list-item v-for="(item, i) in menuItems" :key="i" :to="item.to" exact link class="nav-item" dense @click="isOpen = false">
            <v-list-item-content>
              <v-list-item-title class="nav-text" :style="{ color: item.color }">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <br>
      </div>
    </v-expand-transition>

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
        { text: 'INICIO', to: '/', color: '#efeee8' },
        { text: 'CONTEXTO', to: '/contexto', color: '#efeee8' },
        { text: 'MAPA INTERACTIVO', to: '/mapa', color: '#efeee8' },
        { text: 'VOCES', to: '/voces', color: '#efeee8' },
        { text: 'MIRADAS', to: '/miradas', color: '#efeee8' },
        { text: 'TV NIÑEZ PRIMERO', to: '/tv-ninez-primero', color: '#efeee8' },
        { text: 'ACTUAMOS', to: '/actuamos', color: '#efeee8' },
        { text: 'RECURSOS', to: '/recursos', color: '#efeee8' },
        { text: 'TRANSPARENCIA', to: '/transparencia', color: '#276acc' }
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
  .navbar-wrapper {
    margin-right: 15px; /* Separación con el texto REDIM */
  }

  /* ===============================
    3. ESTILOS DEL BOTÓN MENU
  ================================ */
  .menu-btn {
    border-radius: 20px !important;
    font-weight: bold !important;
    letter-spacing: 1px;
    transition: all 0.3s ease;
  }

  /* Estado: NO VISIBLE (Azul, borde blanco, redondo) */
  .btn-closed {
    /* background-color: #276acc !important; */
    background-color: transparent !important;
    color: white !important;
    border: 2px solid white !important;
  }

  /* Estado: VISIBLE (Blanco, redondo) */
  .btn-open {
    background-color: white !important;
    color: #276acc !important;
    border: 2px solid white !important;
  }

  /* ===============================
    1 y 2. PANEL DESPLEGABLE (Morado, borde inf-der)
  ================================ */
  .dropdown-panel {
    position: fixed;
    top: 64px;
    left: 0;
    /* background-color: #342a83; */
    background-color: #342a83;
    border-radius: 0px 0px 50px 0px;
    z-index: 9999;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .nav-list {
    padding: 10px 0;
  }

  .nav-item::before {
    display: none !important; /* Quitar el color gris del elemento */
  }

  .nav-item {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;
    color: #ffffff; /* Aseguramos que el texto base sea blanco */
    transition: color 0.3s ease; /* Transición suave al cambiar de color */
  }

  .nav-item:hover {
    background-color: rgba(255, 255, 255, 0.15); /* Efecto hover sutil */
  }

  .v-list-item--active .nav-text {
    color: #ffffff !important; /* Naranja primario de Niñez Primero */
    font-weight: 900;
    /* text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5); */
    font-size: 1.15rem !important;
  }

  .nav-text {
    font-size: 1.1rem;
    font-weight: 600;
    text-align: center;

    word-break: break-word; /* permite que las palabras se dividan si es necesario */
    white-space: normal; /* permite los saltos de línea */
    line-height: 1.2; /* mejora el espaciado entre líneas */
    padding: 0 5px; /* opcional: margen interno para pantallas pequeñas */
  }

  .nav-item:hover .nav-text {
    filter: brightness(1.2);
    transform: scale(1.05);
  }
  /* ===============================
    4. RESPONSIVIDAD (Anchos y altos por dispositivo)
  ================================ */

  /* Teléfonos Móviles (hasta 600px) */
  @media (max-width: 600px) {
    .dropdown-panel {
      top: 56px;
      width: 50vw;
      border-radius: 0px 0px 50px 0px;
    }
    .nav-text {
      font-size: 0.6rem;
      padding: 5px;
    }
  }

  /* Tablets (601px a 960px) */
  @media (min-width: 601px) and (max-width: 960px) {
    .dropdown-panel {
      top: 56px;
      width: 20vw;
      border-radius: 0px 0px 45px 0px;
    }
    .nav-text {
      font-size: 0.9rem;
      padding: 5px;
    }
  }

  /* Laptops y Escritorio (mayor a 960px) */
  @media (min-width: 961px) {
    .dropdown-panel {
      width: 25vw;
      max-width: 250px;
      border-radius: 0px 0px 60px 0px;
    }
    .nav-text {
      font-size: 1.1rem !important; /* 1.25rem */
      padding: 2px 25px;
      line-height: 1.2 !important;
    }
  }
</style>
