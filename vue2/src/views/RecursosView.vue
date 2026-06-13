<template>
  <div class="recursos-page">

    <header-comp/>

    <!-- ===== Hero: logo + título ===== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <img :src="imagotipoColor" class="hero-logo" alt="Logo Niñez Primero">

          <div class="hero-title">
            <img :src="tituloRecursos" class="hero-title-img" alt="Recursos">
            <p class="hero-subtitle">Documentos,<br>herramientas y<br>materiales</p>
          </div>
        </div>
        <img :src="mariposaRecursos" class="hero-mariposas" alt="" aria-hidden="true">

      </div>
    </section>

    <!-- ===== Banner morado con dato ===== -->
    <section class="stat-banner">
      <div class="stat-inner">
        <div class="stat-content">
          <p class="stat-text">
            En México,<br>
            <strong>1 de cada 100 mil niñas, niños y adolescentes eran víctimas de trata</strong>
            de personas durante 2024.
          </p>
          <p class="stat-text">
            Y <strong>entre 145 mil y 250 mil están en riesgo de ser reclutados</strong>
            y utilizados por grupos delictivos.
          </p>
        </div>
        <img :src="identidadRecursos" class="stat-illustration" alt="" aria-hidden="true">
      </div>
    </section>

    <!-- ===== Listado de recursos descargables ===== -->
    <section class="resources">
      <div class="resources-inner">
        <div v-for="(item, i) in resources" :key="i" class="resource-card">
          <div class="resource-info">
            <h3 class="resource-title">{{ item.title }}</h3>
            <p class="resource-subtitle">{{ item.subtitle }}</p>
          </div>
          <button class="resource-download" type="button" :aria-label="'Descargar ' + item.title" @click="downloadResource(item)">
            <img :src="botonDescargar" class="resource-download-img" alt="Descargar">
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Pie de página ===== -->
    <!-- <footer class="footer-bar">
      <span class="footer-text">CIUDAD DE MÉXICO. COL. NO.</span>
      <router-link to="/transparencia" class="footer-text footer-link">AVISO DE PRIVACIDAD</router-link>
    </footer> -->
    <footer class="footer-bar">
      <span class="footer-text">CIUDAD DE MÉXICO. COL. NO.</span>
      <router-link to="/transparencia" class="footer-text footer-link">AVISO DE PRIVACIDAD</router-link>
    </footer>
  </div>
</template>

<script>
// import CustomNavbar from '@/components/CustomNavbar.vue'
import HeaderComp from '@/components/HeaderComp.vue'
import imagotipoColor from '@/assets/recursos/imagotipo-color.png'
import isotipoBlanco from '@/assets/recursos/isotipo-blanco.png'
import tituloRecursos from '@/assets/recursos/titulo-recursos.png'
import botonDescargar from '@/assets/recursos/boton-descargar.png'
import mariposaRecursos from '@/assets/recursos/mariposa-recursos.png'
import identidadRecursos from '@/assets/recursos/identidad-recursos.png'

export default {
  // 1️⃣ Identificación
  name: 'RecursosView',
  components: {
    // CustomNavbar
    HeaderComp
  }, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      imagotipoColor,
      isotipoBlanco,
      tituloRecursos,
      botonDescargar,
      mariposaRecursos,
      identidadRecursos,
      resources: [
        { title: 'Infografías digitales', subtitle: 'Tipo carrusel', file: '' },
        { title: 'Presentaciones digitales', subtitle: 'Tipo slides', file: '' },
        { title: 'Carteles de impresión', subtitle: 'Tamaño 60x90cm', file: '' },
        { title: 'Material didáctico', subtitle: 'Tamaño carta', file: '' },
        { title: 'Personajes', subtitle: 'Imagen PNG', file: '' }
      ]
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    downloadResource (item) {
      // Si el recurso tiene un archivo asociado, se descarga; si no, se notifica
      // console.log(`Intentando descargar recurso: ${item.title}`)
      // if (item.file) {
      //   window.open(item.file, '_blank')
      // } else {
      //   console.warn(`Recurso aún no disponible: ${item.title}`)
      // }
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
  /* ===============================
    Paleta del proyecto
    Crema #efeee8 · Azul #342a83 · Morado #6a3d8f
    Azul claro #2e91ce · Naranja #ed712c · Amarillo #f9cd35
  ================================ */
  .recursos-page {
    background-color: #efeee8;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-bar-gradient {
    background: linear-gradient(
      to right,
      #2e91ce 0%,
      #342a83 25%,
      #6a3d8f 50%,
      #b62b86 75%,
      #ed712c 100%
    ) !important;
  }

  .navbar-isotipo {
    height: 34px;
    width: auto;
    margin-right: 8px;
  }

  /* ===============================
    HERO
  ================================ */
  .hero {
    position: relative;
    background-color: #efeee8;
    padding: 40px 24px 32px;
    overflow: hidden;
  }

  .hero-inner {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    position: relative;
    z-index: 2;
  }

  .hero-logo {
    width: 230px;
    max-width: 40vw;
    height: auto;
  }

  .hero-title {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .hero-title-img {
    width: 280px;
    max-width: 50vw;
    height: auto;
  }

  .hero-subtitle {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 900;
    color: #342a83;
    font-size: clamp(14px, 2.2vw, 20px);
    line-height: 1.2;
    margin: 8px 0 0;
  }

  .hero-mariposas {
    display: block;
    width: 440px;
    max-width: 60%;
    height: auto;
    margin: -80px 0 0 auto;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  /* ===============================
    BANNER MORADO (dato)
  ================================ */
  .stat-banner {
    position: relative;
    background-image: url('~@/assets/recursos/fondo-morado.png');
    background-size: cover;
    background-position: center;
    background-color: #6a3d8f;
    padding: 48px 24px;
    padding-top: 70px;
    overflow: hidden;
  }

  .stat-inner {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .stat-content {
    position: relative;
    z-index: 2;
  }

  .stat-text {
    font-family: 'Noto Sans', sans-serif;
    color: #ffffff;
    font-size: clamp(15px, 2vw, 20px);
    font-weight: 400;
    line-height: 1.4;
    margin: 0 0 16px;
    max-width: 60%;
  }

  .stat-text strong {
    font-weight: 700;
  }

  .stat-illustration {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 280px;
    max-width: 38vw;
    height: auto;
    z-index: 1;
    pointer-events: none;
  }

  /* ===============================
    TARJETAS DE RECURSOS
  ================================ */
  .resources {
    background-image: url('~@/assets/recursos/fondo-descargables.png');
    background-size: cover;
    background-position: center;
    background-repeat: repeat;
    background-color: #ffffff;
    padding: 48px 24px;
  }

  .resources-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .resource-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: #f6f5f0;
    border: 1px solid #c4ac9c;
    border-radius: 18px;
    padding: 20px 24px;
    box-shadow: 0 4px 10px rgba(60, 60, 59, 0.08);
  }

  .resource-info {
    text-align: left;
  }

  .resource-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    color: #342a83;
    font-size: clamp(16px, 2.2vw, 22px);
    line-height: 1.2;
    margin: 0;
  }

  .resource-subtitle {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #686d4a;
    font-size: clamp(13px, 1.8vw, 17px);
    margin: 4px 0 0;
  }

  .resource-download {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .resource-download:hover {
    transform: scale(1.05);
  }

  .resource-download:focus-visible {
    outline: 3px solid #342a83;
    outline-offset: 2px;
    border-radius: 8px;
  }

  .resource-download-img {
    width: 150px;
    height: auto;
    display: block;
  }

  /* ===============================
    PIE DE PÁGINA
  ================================ */
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    /* background: linear-gradient(
      to right,
      #2e91ce 0%,
      #342a83 25%,
      #6a3d8f 50%,
      #b62b86 75%,
      #ed712c 100%
    ); */
    background: #342a83;
    padding: 14px 24px;
    height: 80px;
  }

  .footer-text {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 600;
    color: #ffffff;
    font-size: clamp(10px, 1.4vw, 13px);
    letter-spacing: 0.5px;
    text-decoration: none;
  }

  .footer-link:hover {
    text-decoration: underline;
  }

  /* ===============================
    RESPONSIVIDAD
  ================================ */

  /* Mobile */
  @media (max-width: 575.98px) {
    .hero-content {
      flex-direction: column;
      gap: 12px;
    }
    .hero-logo {
      width: 180px;
      max-width: 60vw;
    }
    .hero-title {
      align-items: center;
      text-align: center;
    }
    .hero-title-img {
      max-width: 70vw;
    }
    .hero-mariposas {
      position: static;
      display: block;
      width: 80vw;
      margin: 16px auto 0;
    }
    .stat-text {
      max-width: 100%;
    }
    .stat-illustration {
      position: static;
      transform: none;
      display: block;
      width: 200px;
      max-width: 70vw;
      margin: 24px auto 0;
    }
    .resource-card {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    .resource-info {
      text-align: center;
    }
    .resource-download {
      align-self: center;
    }
    .resource-download-img {
      width: 140px;
    }
    .footer-bar {
      flex-direction: column;
      text-align: center;
      gap: 6px;
    }
  }

  /* Mobile landscape */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .hero-content {
      gap: 20px;
    }
    .hero-mariposas {
      width: 45vw;
    }
    .stat-text {
      max-width: 65%;
    }
    .resource-download-img {
      width: 130px;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .hero-mariposas {
      width: 40vw;
    }
    .stat-illustration {
      width: 240px;
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .hero-mariposas {
      width: 340px;
    }
  }

  /* Extra Large Screens */
  @media (min-width: 1200px) {
    .hero {
      padding: 56px 24px 40px;
    }
    .hero-logo {
      width: 260px;
    }
    .hero-title-img {
      width: 320px;
    }
  }
</style>
