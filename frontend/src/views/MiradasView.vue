<template>
  <div class="miradas-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <!-- ===== Hero: título + personaje ===== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <img :src="tituloMiradas" class="hero-title-img" alt="Miradas">
          <p class="hero-subtitle">
            Es un compromiso con la protección <br>
            y el bienestar de la niñez y la <br>
            adolescencia en México.
          </p>
        </div>
        <img :src="amorMiradas" class="hero-character" alt="" aria-hidden="true">
      </div>
    </section>

    <!-- ===== Banner: Concurso de fotografía ===== -->
    <section class="contest" :style="{ backgroundImage: 'url(' + fondoConcurso + ')' }">
      <div class="contest-overlay"></div>
      <div class="contest-inner">
        <img :src="tituloConcurso" class="contest-title-img" alt="Concurso de fotografía">
        <div class="contest-buttons">
          <button v-for="(btn, i) in contestButtons" :key="i" type="button" class="contest-btn" @click="goContest(btn.action)">
            {{ btn.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Carrusel: 3 tarjetas destacadas ===== -->
    <section class="carousel">
      <br>
      <div class="carousel-inner">
        <img :src="mariposa2" class="carousel-butterfly carousel-butterfly--right" alt="" aria-hidden="true">
        <img :src="mariposa1" class="carousel-butterfly carousel-butterfly--left" alt="" aria-hidden="true">

        <div class="carousel-track">
          <figure v-for="(item, i) in carouselPage" :key="i" class="carousel-card">
            <div class="carousel-photo">
              <img :src="item.image" :alt="item.title" loading="lazy">
            </div>
            <figcaption class="carousel-caption">
              <span class="caption-title">{{ item.title }}</span>
              <span class="caption-name">{{ item.name }}</span>
              <span class="caption-age">{{ item.age }} años</span>
            </figcaption>
          </figure>
        </div>

        <div class="carousel-dots">
          <button
            v-for="n in carouselPages"
            :key="n"
            type="button"
            class="dot"
            :class="{ 'dot--active': n - 1 === carouselIndex }"
            :aria-label="'Página ' + n"
            @click="carouselIndex = n - 1"
          ></button>
        </div>
      </div>
    </section>

    <!-- ===== Galería: grid de 8 tarjetas con paginación ===== -->
    <section class="gallery">
      <br>
      <div class="gallery-inner">
        <div class="gallery-grid">
          <figure v-for="(item, i) in galleryPage" :key="i" class="gallery-card">
            <div class="gallery-photo">
              <img :src="item.image" :alt="item.title" loading="lazy">
            </div>
            <figcaption class="gallery-caption">
              <span class="caption-title">{{ item.title }}</span>
              <span class="caption-name">{{ item.name }}</span>
              <span class="caption-age">{{ item.age }} años</span>
            </figcaption>
          </figure>
        </div>

        <div class="gallery-pagination">
          <button type="button" class="page-arrow" :disabled="galleryIndex === 0" aria-label="Anterior" @click="prevGalleryPage">
            &lsaquo;
          </button>
          <button
            v-for="n in galleryPages"
            :key="n"
            type="button"
            class="page-number"
            :class="{ 'page-number--active': n - 1 === galleryIndex }"
            @click="galleryIndex = n - 1"
          >
            {{ n }}
          </button>
          <button type="button" class="page-arrow" :disabled="galleryIndex === galleryPages - 1" aria-label="Siguiente" @click="nextGalleryPage">
            &rsaquo;
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Pie de página ===== -->
    <footer class="footer-bar">
      <span class="footer-text">CIUDAD DE MÉXICO. COL. NO.</span>
      <router-link to="/transparencia" class="footer-text footer-link">AVISO DE PRIVACIDAD</router-link>
    </footer>
  </div>
</template>

<script>
import HeaderComp from '@/components/HeaderComp.vue'
import tituloMiradas from '@/assets/miradas/titulo-miradas.png'
import amorMiradas from '@/assets/miradas/amor-miradas.png'
import tituloConcurso from '@/assets/miradas/titulo-concurso.png'
import fondoConcurso from '@/assets/miradas/fondo-concurso.png'
import mariposa1 from '@/assets/miradas/mariposa-1.png'
import mariposa2 from '@/assets/miradas/mariposa-2.png'

export default {
  // 1️⃣ Identificación
  name: 'MiradasView',
  components: {
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
      tituloMiradas,
      amorMiradas,
      tituloConcurso,
      fondoConcurso,
      mariposa1,
      mariposa2,
      carouselPerPage: 3,
      carouselIndex: 0,
      galleryPerPage: 8,
      galleryIndex: 0,
      contestButtons: [
        { label: 'CONVOCATORIA', action: 'convocatoria' },
        { label: 'BASES', action: 'bases' },
        { label: 'FECHAS', action: 'fechas' },
        { label: 'REGISTRO', action: 'registro' }
      ],
      carouselItems: [],
      galleryItems: []
    }
  },
  computed: {
    carouselPages () {
      return Math.ceil(this.carouselItems.length / this.carouselPerPage)
    },
    carouselPage () {
      const start = this.carouselIndex * this.carouselPerPage
      return this.carouselItems.slice(start, start + this.carouselPerPage)
    },
    galleryPages () {
      return Math.ceil(this.galleryItems.length / this.galleryPerPage)
    },
    galleryPage () {
      const start = this.galleryIndex * this.galleryPerPage
      return this.galleryItems.slice(start, start + this.galleryPerPage)
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    buildImage (id, width, height) {
      // Imagen aleatoria de marcador de posición (placeholder)
      return `https://picsum.photos/seed/miradas-${id}/${width}/${height}`
    },
    goContest (action) {
      // Pendiente: enrutar a la sección correspondiente del concurso
      console.warn(`Sección del concurso aún no disponible: ${action}`)
    },
    prevGalleryPage () {
      if (this.galleryIndex > 0) {
        this.galleryIndex -= 1
      }
    },
    nextGalleryPage () {
      if (this.galleryIndex < this.galleryPages - 1) {
        this.galleryIndex += 1
      }
    },
    loadData () {
      // Tarjetas destacadas del carrusel (3 por página)
      const featured = [
        { title: '"Niñez Libre"', name: 'María Laura', age: 8 },
        { title: '"Libres de violencia"', name: 'José Emilio', age: 14 },
        { title: '"Derechos humanos"', name: 'Karla Ximena', age: 11 }
      ]
      const carousel = []
      for (let i = 0; i < 12; i++) {
        const base = featured[i] || { title: '"Una niña en un este mundo"', name: 'Mario Torres', age: 11 }
        carousel.push({ ...base, image: this.buildImage(`c${i}`, 400, 560) })
      }
      this.carouselItems = carousel

      // Tarjetas de la galería (8 por página)
      const gallery = []
      for (let i = 0; i < 24; i++) {
        gallery.push({
          title: '"Una niña en un este mundo"',
          name: 'Mario Torres',
          age: 11,
          image: this.buildImage(`g${i}`, 400, 400)
        })
      }
      this.galleryItems = gallery
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {
    this.loadData()
  },
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
    Crema #efeee8 · Azul #342a83 · Magenta #b62b86
    Naranja #ed712c · Gris foto #c4ac9c
  ================================ */
  .miradas-page {
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

  /* ===============================
    HERO
  ================================ */
  .hero {
    background-color: #efeee8;
    padding: 40px 24px 32px;
  }

  .hero-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-text {
    max-width: 560px;
  }

  .hero-title-img {
    width: 400px;
    max-width: 70vw;
    height: auto;
  }

  .hero-subtitle {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    color: #342a83;
    font-size: clamp(14px, 2vw, 19px);
    line-height: 1.35;
    margin: 12px 0 0;
  }

  .hero-character {
    width: 450px;
    max-width: 38vw;
    height: auto;
    flex-shrink: 0;
  }

  /* ===============================
    CONCURSO DE FOTOGRAFÍA
  ================================ */
  .contest {
    position: relative;
    background-size: cover;
    background-position: center;
    padding: 64px 24px;
    overflow: hidden;
  }

  .contest-overlay {
    position: absolute;
    inset: 0;
    /* background: rgba(52, 42, 131, 0.35); */
    z-index: 1;
  }

  .contest-inner {
    position: relative;
    z-index: 2;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .contest-title-img {
    width: 360px;
    max-width: 80vw;
    height: auto;
    margin-bottom: 28px;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
  }

  .contest-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
  }

  .contest-btn {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    letter-spacing: 1px;
    color: #ffffff;
    background: transparent;
    border: 2px solid #ffffff;
    border-radius: 30px;
    padding: 12px 32px;
    min-width: 240px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .contest-btn:hover {
    background: #ffffff;
    color: #342a83;
  }

  .contest-btn:focus-visible {
    outline: 3px solid #f9cd35;
    outline-offset: 2px;
  }

  /* ===============================
    CARRUSEL (3 tarjetas)
  ================================ */
  .carousel {
    position: relative;
    background-color: #efeee8;
    padding: 48px 24px 24px;
    overflow: hidden;
  }

  .carousel-inner {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: 0 auto;
  }

  .carousel-butterfly {
    position: absolute;
    width: 95px;
    height: auto;
    z-index: 1;
    pointer-events: none;
  }

  /* Izquierda: alineada en la parte inferior izquierda de las tarjetas */
  .carousel-butterfly--left {
    left: -100px;
    bottom: -20px;
    width: 180px !important;
  }

  /* Derecha: alineada en la parte superior derecha de las tarjetas */
  .carousel-butterfly--right {
    right: -120px;
    top: -50px;
  }

  .carousel-track {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.35));
  }

  .carousel-card {
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .carousel-photo {
    width: 100%;
    aspect-ratio: 3 / 4;
    background-color: #c4ac9c;
    border-radius: 8px;
    overflow: hidden;
  }

  .carousel-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .carousel-caption {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 12px;
  }

  /* ===============================
    PUNTOS DE PAGINACIÓN (carrusel)
  ================================ */
  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 28px;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background-color: #c4ac9c;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.25s ease, transform 0.25s ease;
  }

  .dot--active {
    background-color: #686d4a;
    transform: scale(1.15);
  }

  /* ===============================
    GALERÍA (grid 8 tarjetas)
  ================================ */
  .gallery {
    background-color: #efeee8;
    padding: 24px 24px 56px;
  }

  .gallery-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .gallery-card {
    margin: 0;
    background-color: #ffffff;
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(60, 60, 59, 0.12);
    display: flex;
    flex-direction: column;
  }

  .gallery-photo {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #c4ac9c;
    border-radius: 8px;
    overflow: hidden;
  }

  .gallery-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .gallery-caption {
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 10px;
  }

  /* ===============================
    LEYENDAS DE TARJETAS
  ================================ */
  .caption-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    font-style: italic;
    color: #342a83;
    font-size: clamp(12px, 1.6vw, 15px);
    line-height: 1.2;
  }

  .caption-name {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 500;
    color: #3c3c3b;
    font-size: clamp(11px, 1.4vw, 14px);
    margin-top: 2px;
  }

  .caption-age {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #686d4a;
    font-size: clamp(11px, 1.4vw, 14px);
  }

  /* ===============================
    PAGINACIÓN NUMÉRICA (galería)
  ================================ */
  .gallery-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 36px;
  }

  .page-arrow,
  .page-number {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    min-width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #c4ac9c;
    background-color: #ffffff;
    color: #342a83;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-arrow {
    font-size: 20px;
    line-height: 1;
  }

  .page-number--active {
    background-color: #b62b86;
    border-color: #b62b86;
    color: #ffffff;
  }

  .page-arrow:hover:not(:disabled),
  .page-number:hover {
    border-color: #b62b86;
  }

  .page-arrow:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ===============================
    PIE DE PÁGINA
  ================================ */
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: linear-gradient(
      to right,
      #2e91ce 0%,
      #342a83 25%,
      #6a3d8f 50%,
      #b62b86 75%,
      #ed712c 100%
    );
    padding: 14px 24px;
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
    .hero-inner {
      flex-direction: column;
      text-align: center;
    }
    .hero-text {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hero-character {
      width: 180px;
      max-width: 55vw;
    }
    .carousel-track {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .carousel-butterfly {
      display: none;
    }
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .footer-bar {
      flex-direction: column;
      text-align: center;
      gap: 6px;
    }
  }

  /* Mobile landscape */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .carousel-track {
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .carousel-butterfly {
      width: 60px;
    }
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .hero-title-img {
      width: 250px;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    .carousel-butterfly {
      width: 70px;
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .gallery-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Extra Large Screens */
  @media (min-width: 1200px) {
    .carousel-butterfly {
      width: 110px;
    }
  }
</style>
