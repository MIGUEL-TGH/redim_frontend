<template>
  <div class="tv-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <!-- ===== Escenario TV (blanco arriba, verde con festón abajo) ===== -->
    <section class="tv-stage">
      <!-- Zona superior blanca: título + mariposas -->
      <div class="tv-stage-top">
        <img :src="tituloTv" class="tv-title-img" alt="TV">
        <img :src="mariposa1" class="tv-butterfly tv-butterfly--left" alt="" aria-hidden="true">
        <img :src="mariposa2" class="tv-butterfly tv-butterfly--right" alt="" aria-hidden="true">
      </div>

      <!-- Zona verde con festón -->
      <div class="tv-green">
        <!-- Ilustración de la TV con reproductor de YouTube -->
        <div class="tv-illustration">
          <div class="tv-frame" :style="{ backgroundImage: 'url(' + tvFrame + ')' }">
            <div class="tv-screen">
              <iframe
                :src="embedUrl(featuredVideo.youtubeId)"
                title="Reproductor de video destacado"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <!-- EXPLORA: título + subtítulo + botones de redes -->
        <div class="explora">
          <div class="explora-inner">
            <div class="explora-text">
              <img :src="tituloExplora" class="explora-title-img" alt="Explora">
              <p class="explora-subtitle">
                Contenidos audiovisuales para <br>
                entender, prevenir y actuar.
              </p>
            </div>
            <div class="explora-buttons">
              <a v-for="(net, i) in socialButtons" :key="i" :href="net.url" target="_blank" rel="noopener" class="explora-btn">
                {{ net.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Banda de personajes -->
        <img :src="childrens" class="explora-childrens" alt="" aria-hidden="true">

        <!-- Carrusel pasarela (coverflow) -->
        <div class="coverflow">
          <div
            class="coverflow-stage"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
            @pointerleave="onPointerUp"
          >
            <figure
              v-for="(video, i) in videos"
              :key="i"
              class="cf-card"
              :class="cardClass(i)"
              @click="onCardClick(i)"
            >
              <div class="cf-video">
                <iframe
                  v-if="i === activeIndex"
                  :src="embedUrl(video.youtubeId)"
                  :title="video.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <img v-else :src="thumbUrl(video.youtubeId)" :alt="video.title" loading="lazy">
              </div>
              <figcaption class="cf-caption">
                <span class="cf-title">{{ video.title }}</span>
                <span class="cf-date">{{ video.date }}</span>
                <span class="cf-channel">{{ video.channel }}</span>
              </figcaption>
            </figure>
          </div>
        </div>

        <!-- Puntos de paginación -->
        <div class="coverflow-dots">
          <button
            v-for="(v, i) in videos"
            :key="i"
            type="button"
            class="dot"
            :class="{ 'dot--active': i === activeIndex }"
            :aria-label="'Video ' + (i + 1)"
            @click="goTo(i)"
          ></button>
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
import tituloTv from '@/assets/tv/titulo-tv.png'
import tituloExplora from '@/assets/tv/titulo-explora.png'
import tvFrame from '@/assets/tv/tv-frame.png'
import mariposa1 from '@/assets/tv/mariposa-1.png'
import mariposa2 from '@/assets/tv/mariposa-2.png'
import childrens from '@/assets/tv/childrens.png'

export default {
  // 1️⃣ Identificación
  name: 'TVView',
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
      tituloTv,
      tituloExplora,
      tvFrame,
      mariposa1,
      mariposa2,
      childrens,
      activeIndex: 0,
      dragStartX: null,
      dragDelta: 0,
      isDragging: false,
      socialButtons: [
        { label: 'YOUTUBE', url: 'https://www.youtube.com/@REDIMAC' },
        { label: 'FACEBOOK', url: 'https://www.facebook.com/REDIMAC' },
        { label: 'TIKTOK', url: 'https://www.tiktok.com/@redimac' }
      ],
      videos: []
    }
  },
  computed: {
    featuredVideo () {
      return this.videos[this.activeIndex] || { youtubeId: '', title: '' }
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    embedUrl (id) {
      return `https://www.youtube.com/embed/${id}?rel=0`
    },
    thumbUrl (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    },
    goTo (index) {
      const total = this.videos.length
      this.activeIndex = (index + total) % total
    },
    goNext () {
      this.goTo(this.activeIndex + 1)
    },
    goPrev () {
      this.goTo(this.activeIndex - 1)
    },
    cardClass (i) {
      // Clase de posición de cada tarjeta respecto a la activa.
      // Se renderizan TODAS las tarjetas con nodos estables (key fija) y solo
      // cambia la clase, de modo que la transición funcione en ambos sentidos.
      // Pasarela de 5 tarjetas: 2 a la izquierda, centro y 2 a la derecha.
      const total = this.videos.length
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
      // Evita cambiar de tarjeta si el gesto fue un arrastre.
      // Cualquier tarjeta lateral visible pasa al centro.
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
      // Restablece el indicador de arrastre tras el ciclo de clic
      this.$nextTick(() => {
        this.isDragging = false
      })
    },
    loadData () {
      const placeholderId = 'aqz-KE-bpKQ'
      const list = []
      for (let i = 0; i < 8; i++) {
        list.push({
          youtubeId: placeholderId,
          title: 'REDIM: Reportaje sobre trata y reclutamiento de niñas, niños y adolescentes',
          date: '26 DE ENERO 2021',
          channel: 'REDIM'
        })
      }
      this.videos = list
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
    Azul #276acc · Azul oscuro #342a83 · Verde #5db43d
    Naranja #ed712c · Crema #efeee8
  ================================ */
  .tv-page {
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
    ESCENARIO TV
  ================================ */
  .tv-stage {
    position: relative;
    background-color: #efeee8;
  }

  .tv-stage-top {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    height: 385px;
    z-index: 1;
  }

  .tv-title-img {
    position: absolute;
    top: 16px;
    left: 24px;
    width: 110px;
    max-width: 22vw;
    height: auto;
    z-index: 4;
  }

  .tv-butterfly {
    position: absolute;
    height: auto;
    z-index: 4;
    pointer-events: none;
  }

  /* Izquierda de la TV, debajo de las letras TV */
  .tv-butterfly--left {
    /* width: 150px; */
    width: 250px;
    left: 20px;
    top: 150px;
  }

  /* Derecha de la TV */
  .tv-butterfly--right {
    /* width: 200px; */
    width: 350px !important;
    right: 20px;
    /* top: 40px; */
    top: 30px;
  }

  /* ===============================
    ZONA VERDE (fondo festoneado)
  ================================ */
  .tv-green {
    position: relative;
    display: flow-root;
    /* Dos capas de fondo:
       1) El festón (imagen) arriba a todo el ancho.
       2) Un degradado de relleno: transparente arriba (para que los óvalos del
          festón se vean contra el crema y no sobre verde) y #3AA935 abajo,
          para que en tablet/móvil no aparezca el fondo crema bajo la imagen. */
    background-image:
      url('~@/assets/tv/fondo-tv.png'),
      linear-gradient(to bottom, rgba(58, 169, 53, 0) 0%, rgba(58, 169, 53, 0) 6%, #3AA935 15%);
    background-repeat: no-repeat, no-repeat;
    background-position: top center, top center;
    background-size: 100% auto, 100% 100%;
    padding: 0 24px 64px;
  }

  /* ===============================
    ILUSTRACIÓN DE LA TV + REPRODUCTOR
  ================================ */
  .tv-illustration {
    position: relative;
    z-index: 3;
    width: 540px;
    max-width: 90%;
    /* La TV mide ~458px de alto (540 * 462/545). margin-top -343 ≈ 75% de la
       altura queda sobre el blanco y 25% sobre el verde, como en el mockup */
    margin: -300px auto 0;
  }

  .tv-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 545 / 462;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  /* Pantalla de la TV: zona donde va el iframe (porcentajes del marco) */
  .tv-screen {
    position: absolute;
    left: 9%;
    top: 22%;
    width: 84.5%;
    height: 58%;
    border-radius: 15px;
    overflow: hidden;
    background-color: #000;
  }

  .tv-screen iframe {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ===============================
    EXPLORA
  ================================ */
  .explora {
    position: relative;
    z-index: 2;
    padding-top: 120px;
  }

  .explora-inner {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    flex-wrap: wrap;
  }

  .explora-title-img {
    width: 400px;
    max-width: 70vw;
    height: auto;
  }

  .explora-subtitle {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    color: #342a83;
    font-size: clamp(15px, 2.2vw, 22px);
    line-height: 1.3;
    margin: 8px 0 0;
  }

  .explora-buttons {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 230px;
  }

  .explora-btn {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: center;
    text-decoration: none;
    color: #276acc;
    background: #ffffff;
    border-radius: 24px;
    padding: 12px 28px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s ease, color 0.2s ease;
  }

  .explora-btn:hover {
    transform: translateY(-2px);
    color: #342a83;
  }

  /* ===============================
    BANDA DE PERSONAJES
  ================================ */
  .explora-childrens {
    display: block;
    width: 1100px;
    max-width: 92%;
    height: auto;
    margin: 24px auto 8px;
    position: relative;
    z-index: 2;
  }

  /* ===============================
    CARRUSEL PASARELA (COVERFLOW)
  ================================ */
  .coverflow {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
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
    max-width: 78%;
    margin: 0;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    transition: transform 0.4s ease, opacity 0.4s ease;
    will-change: transform, opacity;
  }

  .cf-card.is-active {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    z-index: 5;
  }

  /* Laterales internos (1.º a cada lado) */
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

  /* Laterales externos (2.º a cada lado) */
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

  /* Tarjetas fuera de vista: ocultas en el centro, listas para transicionar */
  .cf-card.is-hidden {
    transform: translate(-50%, -50%) scale(0.55);
    opacity: 0;
    z-index: 1;
    pointer-events: none;
  }

  .cf-video {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 8px;
    overflow: hidden;
    background-color: #c4c4c4;
  }

  .cf-video iframe,
  .cf-video img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border: none;
  }

  .cf-caption {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }

  .cf-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    font-style: italic;
    color: #342a83;
    font-size: clamp(13px, 1.6vw, 15px);
    line-height: 1.2;
  }

  .cf-date {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 600;
    color: #3c3c3b;
    font-size: clamp(11px, 1.4vw, 13px);
    margin-top: 8px;
  }

  .cf-channel {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #3c3c3b;
    font-size: clamp(11px, 1.4vw, 13px);
  }

  /* ===============================
    PUNTOS DE PAGINACIÓN
  ================================ */
  .coverflow-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
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
    /* La TV mide ~250px de alto aquí (ancho limitado por el padding);
       margin-top -187 ≈ 75% sobre el blanco y 25% sobre el verde */
    .tv-stage-top {
      height: 215px;
    }
    .tv-illustration {
      margin-top: -187px;
    }
    .tv-title-img {
      width: 80px;
      top: 12px;
    }
    .tv-butterfly--left {
      width: 80px;
      top: 95px;
    }
    .tv-butterfly--right {
      width: 90px !important;
      top: 20px;
    }
    .explora-inner {
      justify-content: center;
      text-align: center;
    }
    .explora-text {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .explora-buttons {
      width: 100%;
      align-items: stretch;
    }
    .coverflow-stage {
      height: 360px;
    }
    .cf-card {
      width: 280px;
    }
    /* Móvil: solo la tarjeta central */
    .cf-card.is-prev,
    .cf-card.is-next,
    .cf-card.is-prev2,
    .cf-card.is-next2 {
      transform: translate(-50%, -50%) scale(0.7);
      opacity: 0;
      pointer-events: none;
    }
    .footer-bar {
      flex-direction: column;
      text-align: center;
      gap: 6px;
    }
  }

  /* Mobile landscape (hereda altura/margen base 385/-343) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .tv-butterfly--left {
      width: 100px;
    }
    .tv-butterfly--right {
      width: 200px !important;
      top: 100px !important;
    }
    .cf-card {
      width: 320px;
    }
    .cf-card.is-prev {
      transform: translate(-105%, -50%) scale(0.75);
    }
    .cf-card.is-next {
      transform: translate(5%, -50%) scale(0.75);
    }
    /* Solo 3 tarjetas: se ocultan las externas */
    .cf-card.is-prev2,
    .cf-card.is-next2 {
      transform: translate(-50%, -50%) scale(0.65);
      opacity: 0;
      pointer-events: none;
    }
    .explora-inner {
      justify-content: center;
      text-align: center;
    }
  }

  /* Tablet (hereda altura/margen base 385/-343) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .tv-butterfly--left {
      width: 150px;
    }
    .tv-butterfly--right {
      width: 250px !important;
      /* top: 30px !important; */
    }
    /* Solo 3 tarjetas: se ocultan las externas */
    .cf-card.is-prev2,
    .cf-card.is-next2 {
      transform: translate(-50%, -50%) scale(0.65);
      opacity: 0;
      pointer-events: none;
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .tv-butterfly--right {
      width: 180px;
    }
  }

  /* Extra Large Screens (hereda altura/margen base 385/-343) */
  @media (min-width: 1200px) {
    .tv-butterfly--right {
      width: 220px;
    }
  }
</style>
