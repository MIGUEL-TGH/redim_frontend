<template>
  <div class="inicio-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <div class="inicio-frame">
      <!-- ===== Sección 1: Hero armable "Niñez Primero" (juego de arrastrar letras) ===== -->
      <section class="hero-section" aria-label="Juego: arma el título Niñez Primero">
        <div ref="canvas" class="hero-canvas" :class="{ 'is-complete': allPlaced }">
          <!-- Silueta gris: objetivo donde se pegan las letras -->
          <img
            class="hero-armable"
            :style="armableStyle"
            :src="ninezArmable"
            alt=""
            aria-hidden="true"
            draggable="false"
          >
          <!-- Piezas arrastrables (letras y mariposas a escala 1:1 del mockup) -->
          <img
            v-for="piece in pieces"
            :key="piece.id"
            class="hero-piece"
            :class="{ 'is-dragging': drag && drag.id === piece.id, 'is-placed': piece.placed }"
            :style="pieceStyle(piece)"
            :src="piece.src"
            :alt="piece.alt"
            draggable="false"
            @pointerdown="startDrag(piece, $event)"
            @pointermove="onDrag(piece, $event)"
            @pointerup="endDrag(piece, $event)"
            @pointercancel="endDrag(piece, $event)"
          >
        </div>
      </section>

      <!-- ===== Sección 2: Banner MAPA INTERACTIVO (FondoBanner + personaje) ===== -->
      <section class="banner-section">
        <img class="banner-fondo" :src="fondoBanner" alt="" aria-hidden="true" draggable="false">
        <div class="banner-text">
          <h1 class="banner-title">
            <span class="banner-title-l1">MAPA</span>
            <span class="banner-title-l2">INTERACTIVO</span>
          </h1>
          <router-link to="/mapa" class="banner-explorar">EXPLORAR</router-link>
        </div>
        <img class="banner-personaje" :src="identidadInicio" alt="" aria-hidden="true" draggable="false">
      </section>

      <!-- ===== Sección 3: EQUIPO (imagotipo + tarjetas de aliados) ===== -->
      <section class="equipo-section">
        <img class="equipo-titulo" :src="equipoTitulo" alt="EQUIPO" draggable="false">
        <img class="equipo-imagotipo" :src="imagotipoColor" alt="Niñez Primero: niñez protegida, libre y digna" draggable="false">

        <a class="equipo-card equipo-card--ue" href="https://european-union.europa.eu/index_es" target="_blank" rel="noopener noreferrer">
          <img class="equipo-logo equipo-logo--ue" :src="logoUe" alt="Financiado por la Unión Europea" draggable="false">
        </a>
        <a class="equipo-card equipo-card--redim" href="https://derechosinfancia.org.mx" target="_blank" rel="noopener noreferrer">
          <img class="equipo-logo equipo-logo--redim" :src="logoRedim" alt="REDIM, Red por los Derechos de la Infancia en México" draggable="false">
        </a>
        <a class="equipo-card equipo-card--cam" href="https://www.centromontesinos.com" target="_blank" rel="noopener noreferrer">
          <img class="equipo-logo equipo-logo--cam" :src="logoCam" alt="CAM, Centro de Estudios Sociales y Culturales Antonio de Montesinos, A.C." draggable="false">
        </a>

        <img class="equipo-mariposa-1" :src="mariposaEquipo1" alt="" aria-hidden="true" draggable="false">
        <img class="equipo-mariposa-2" :src="mariposaEquipo2" alt="" aria-hidden="true" draggable="false">

        <p class="equipo-quote">
          Juntos y Juntas, con amor, dignidad y compromiso, podemos
          construir un mundo donde la niñez y adolescencia, nunca más
          sean despojadas de su futuro.
        </p>
      </section>
    </div>

    <!-- ===== Pie de página (índigo plano, según mockup) ===== -->
    <footer class="footer-bar">
      <span class="footer-text">CIUDAD DE MÉXICO. COL. NO.</span>
      <router-link to="/transparencia" class="footer-text footer-link">AVISO DE PRIVACIDAD</router-link>
    </footer>
  </div>
</template>

<script>
import HeaderComp from '@/components/HeaderComp.vue'
import fondoBanner from '@/assets/inicio/fondo-banner.png'
import identidadInicio from '@/assets/inicio/identidad-inicio.png'
import ninezArmable from '@/assets/inicio/ninez-primero-armable.png'
import equipoTitulo from '@/assets/inicio/equipo-titulo.png'
import imagotipoColor from '@/assets/inicio/imagotipo-color.png'
import logoUe from '@/assets/inicio/logo-ue.png'
import logoRedim from '@/assets/inicio/logo-redim.png'
import logoCam from '@/assets/inicio/logo-cam.png'
import mariposaEquipo1 from '@/assets/inicio/mariposa-equipo-1.png'
import mariposaEquipo2 from '@/assets/inicio/mariposa-equipo-2.png'
import letraN from '@/assets/inicio/letra-n.png'
import letraI1 from '@/assets/inicio/letra-i-1.png'
import letraEnie from '@/assets/inicio/letra-enie.png'
import letraE1 from '@/assets/inicio/letra-e-1.png'
import letraZ from '@/assets/inicio/letra-z.png'
import letraP from '@/assets/inicio/letra-p.png'
import letraR1 from '@/assets/inicio/letra-r-1.png'
import letraI2 from '@/assets/inicio/letra-i-2.png'
import letraM from '@/assets/inicio/letra-m.png'
import letraE2 from '@/assets/inicio/letra-e-2.png'
import letraR2 from '@/assets/inicio/letra-r-2.png'
import letraO from '@/assets/inicio/letra-o.png'
import mariposa1 from '@/assets/inicio/mariposa-1.png'
import mariposa2 from '@/assets/inicio/mariposa-2.png'
import mariposa3 from '@/assets/inicio/mariposa-3.png'

// Lienzo de diseño del hero (mockup 3.1 a 1920px; hero: y 111-1140 → alto 1029)
const DESIGN_W = 1920
const DESIGN_H = 1029
// Distancia máxima (px de diseño) entre centros para "pegar" la pieza en su sitio
const SNAP_DIST = 80
// Margen mínimo al reubicar piezas dispersas dentro del lienzo
const EDGE_MARGIN = 10

// Silueta gris "NIÑEZ-PRIMERO-Armable" colocada 1:1 en el mockup
const ARMABLE = { x: 483, y: 281, w: 964, h: 457 }

// Piezas a escala 1:1 del mockup. (x, y) = centro actual; (sx, sy) = centro
// disperso inicial; (tx, ty) = centro del objetivo gris en la silueta.
const PIECES = [
  { id: 'n', alt: 'Letra N', w: 145, h: 208, sx: 432, sy: 228, tx: 710, ty: 397 },
  { id: 'i1', alt: 'Letra i de Niñez', w: 39, h: 187, sx: 251, sy: 532, tx: 826, ty: 403 },
  { id: 'enie', alt: 'Letra ñ', w: 124, h: 231, sx: 1215, sy: 768, tx: 931, ty: 393 },
  { id: 'e1', alt: 'Letra e de Niñez', w: 149, h: 152, sx: 1459, sy: 228, tx: 1058, ty: 424 },
  { id: 'z', alt: 'Letra z', w: 182, h: 190, sx: 1708, sy: 345, tx: 1207, ty: 403 },
  { id: 'p', alt: 'Letra P', w: 153, h: 220, sx: 405, sy: 717, tx: 589, ty: 631 },
  { id: 'r1', alt: 'Primera letra r de Primero', w: 87, h: 177, sx: 238, sy: 810, tx: 723, ty: 625 },
  { id: 'i2', alt: 'Letra i de Primero', w: 39, h: 187, sx: 541, sy: 790, tx: 803, ty: 621 },
  { id: 'm', alt: 'Letra m', w: 188, h: 178, sx: 650, sy: 250, tx: 943, ty: 633 },
  { id: 'e2', alt: 'Letra e de Primero', w: 150, h: 152, sx: 1441, sy: 760, tx: 1104, ty: 620 },
  { id: 'r2', alt: 'Segunda letra r de Primero', w: 87, h: 177, sx: 1533, sy: 457, tx: 1225, ty: 616 },
  { id: 'o', alt: 'Letra o', w: 133, h: 154, sx: 1675, sy: 609, tx: 1310, ty: 632 },
  { id: 'mar1', alt: 'Mariposa naranja grande', w: 121, h: 111, sx: 232, sy: 238, tx: 541, ty: 467 },
  { id: 'mar2', alt: 'Mariposa naranja pequeña', w: 91, h: 65, sx: 1649, sy: 139, tx: 1334, ty: 372 },
  { id: 'mar3', alt: 'Mariposa naranja mediana', w: 115, h: 100, sx: 1675, sy: 776, tx: 1390, ty: 501 }
]

const PIECE_SOURCES = {
  n: letraN,
  i1: letraI1,
  enie: letraEnie,
  e1: letraE1,
  z: letraZ,
  p: letraP,
  r1: letraR1,
  i2: letraI2,
  m: letraM,
  e2: letraE2,
  r2: letraR2,
  o: letraO,
  mar1: mariposa1,
  mar2: mariposa2,
  mar3: mariposa3
}

export default {
  // 1️⃣ Identificación
  name: 'MainView',
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
      fondoBanner,
      identidadInicio,
      ninezArmable,
      equipoTitulo,
      imagotipoColor,
      logoUe,
      logoRedim,
      logoCam,
      mariposaEquipo1,
      mariposaEquipo2,
      // Zoom del juego: 1 en escritorio/tablet; >1 en móvil para que las
      // piezas sigan siendo manipulables con el dedo
      zoom: 1,
      // Estado del arrastre en curso: { id, dx, dy } (offset al centro)
      drag: null,
      pieces: PIECES.map(piece => ({
        ...piece,
        src: PIECE_SOURCES[piece.id],
        x: piece.sx,
        y: piece.sy,
        placed: false
      }))
    }
  },
  computed: {
    // Verdadero cuando todas las piezas están pegadas en su lugar
    allPlaced () {
      return this.pieces.every(piece => piece.placed)
    },
    // Posición/tamaño de la silueta gris según el zoom actual
    armableStyle () {
      const tl = this.zoomPoint({ x: ARMABLE.x + ARMABLE.w / 2, y: ARMABLE.y + ARMABLE.h / 2 })
      const w = ARMABLE.w * this.zoom
      const h = ARMABLE.h * this.zoom
      return {
        left: ((tl.x - w / 2) / DESIGN_W) * 100 + '%',
        top: ((tl.y - h / 2) / DESIGN_H) * 100 + '%',
        width: (w / DESIGN_W) * 100 + '%'
      }
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    // Zoom según el ancho de ventana (móvil agranda las piezas del juego)
    layoutZoom () {
      const width = window.innerWidth
      if (width < 576) {
        return 1.7
      }
      if (width < 768) {
        return 1.45
      }
      return 1
    },
    // Transforma un punto del lienzo base aplicando el zoom desde el centro
    zoomPoint (point) {
      return {
        x: DESIGN_W / 2 + (point.x - DESIGN_W / 2) * this.zoom,
        y: DESIGN_H / 2 + (point.y - DESIGN_H / 2) * this.zoom
      }
    },
    // Centro del objetivo (silueta gris) de una pieza con el zoom actual
    targetCenter (piece) {
      return this.zoomPoint({ x: piece.tx, y: piece.ty })
    },
    // Mantiene el centro de la pieza dentro del lienzo
    clampCenter (piece, x, y) {
      const halfW = (piece.w * this.zoom) / 2
      const halfH = (piece.h * this.zoom) / 2
      return {
        x: Math.min(Math.max(x, halfW + EDGE_MARGIN), DESIGN_W - halfW - EDGE_MARGIN),
        y: Math.min(Math.max(y, halfH + EDGE_MARGIN), DESIGN_H - halfH - EDGE_MARGIN)
      }
    },
    // Recoloca todas las piezas al cambiar el zoom (rotación / resize)
    applyLayout () {
      this.zoom = this.layoutZoom()
      this.drag = null
      this.pieces.forEach(piece => {
        const base = piece.placed
          ? this.targetCenter(piece)
          : this.zoomPoint({ x: piece.sx, y: piece.sy })
        const pos = piece.placed ? base : this.clampCenter(piece, base.x, base.y)
        piece.x = pos.x
        piece.y = pos.y
      })
    },
    onResize () {
      if (this.layoutZoom() !== this.zoom) {
        this.applyLayout()
      }
    },
    // Estilo de cada pieza (posiciones en % para mantener la responsividad)
    pieceStyle (piece) {
      const w = piece.w * this.zoom
      const h = piece.h * this.zoom
      return {
        left: ((piece.x - w / 2) / DESIGN_W) * 100 + '%',
        top: ((piece.y - h / 2) / DESIGN_H) * 100 + '%',
        width: (w / DESIGN_W) * 100 + '%'
      }
    },
    // Convierte coordenadas del puntero a coordenadas del lienzo de diseño
    toDesignPoint (event) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const scale = rect.width ? DESIGN_W / rect.width : 1
      return {
        x: (event.clientX - rect.left) * scale,
        y: (event.clientY - rect.top) * scale
      }
    },
    startDrag (piece, event) {
      if (piece.placed) {
        return
      }
      if (event.preventDefault) {
        event.preventDefault()
      }
      if (event.pointerId !== undefined && event.target && event.target.setPointerCapture) {
        event.target.setPointerCapture(event.pointerId)
      }
      const point = this.toDesignPoint(event)
      this.drag = { id: piece.id, dx: point.x - piece.x, dy: point.y - piece.y }
    },
    onDrag (piece, event) {
      if (!this.drag || this.drag.id !== piece.id) {
        return
      }
      const point = this.toDesignPoint(event)
      const pos = this.clampCenter(piece, point.x - this.drag.dx, point.y - this.drag.dy)
      piece.x = pos.x
      piece.y = pos.y
    },
    endDrag (piece, event) {
      if (!this.drag || this.drag.id !== piece.id) {
        return
      }
      if (event.pointerId !== undefined && event.target && event.target.releasePointerCapture) {
        event.target.releasePointerCapture(event.pointerId)
      }
      this.drag = null
      // Si la pieza queda cerca de su silueta, se "pega" en su lugar
      const target = this.targetCenter(piece)
      const distance = Math.hypot(piece.x - target.x, piece.y - target.y)
      if (distance <= SNAP_DIST * this.zoom) {
        piece.x = target.x
        piece.y = target.y
        piece.placed = true
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {
    this.applyLayout()
    window.addEventListener('resize', this.onResize)
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.
}
</script>

<style scoped>
  /* ===============================
    Paleta (1.2 GUIA PRELIMINAR): Crema #efeee8 · Azul #342a83 · Morado #6a3d8f
    Magenta #b62b86 · Naranja #ed712c · Azul botones #3667b0
    Las posiciones/proporciones provienen del mockup 3.1 (lienzo de 1920px):
    hero 111-1140 · banner 1140-2308 · equipo 2308-3476 · footer 3476-3667
  ================================ */
  .inicio-page {
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

  .inicio-frame {
    position: relative;
    max-width: 1920px;
    margin: 0 auto;
  }

  /* ===============================
    HERO: juego de letras armables (lienzo 1920 × 1029 del mockup)
  ================================ */
  .hero-section {
    position: relative;
    background-color: #efeee8;
  }

  .hero-canvas {
    position: relative;
    aspect-ratio: 1920 / 1029;
    overflow: hidden;
    touch-action: none;
  }

  .hero-armable {
    position: absolute;
    height: auto;
    pointer-events: none;
    user-select: none;
  }

  .hero-piece {
    position: absolute;
    height: auto;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    z-index: 2;
    transition: left 0.25s ease, top 0.25s ease, transform 0.15s ease, filter 0.15s ease;
  }

  .hero-piece.is-dragging {
    cursor: grabbing;
    z-index: 30;
    transform: scale(1.06);
    filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
    transition: transform 0.15s ease, filter 0.15s ease;
  }

  .hero-piece.is-placed {
    cursor: default;
    animation: pieza-pegada 0.45s ease;
  }

  @keyframes pieza-pegada {
    0% {
      transform: scale(1.18);
    }
    60% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Festejo sutil al completar el armable */
  .hero-canvas.is-complete .hero-piece {
    animation: festejo 0.9s ease;
  }

  @keyframes festejo {
    0%,
    100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-3%) rotate(-2deg);
    }
    60% {
      transform: translateY(2%) rotate(2deg);
    }
  }

  /* ===============================
    BANNER MAPA INTERACTIVO (lienzo 1920 × 1168 del mockup)
    El FondoBanner original va recortado igual que en el diseño:
    escala 152.14%, desplazado -378px en X y -315px en Y.
  ================================ */
  .banner-section {
    position: relative;
    aspect-ratio: 1920 / 1168;
    overflow: hidden;
  }

  .banner-fondo {
    position: absolute;
    left: -19.6875%;
    top: -26.97%;
    width: 152.14%;
    height: auto;
    pointer-events: none;
    user-select: none;
  }

  .banner-text {
    position: absolute;
    left: 8.23%;
    top: 43.3%;
    z-index: 2;
  }

  .banner-title {
    margin: 0;
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #ffffff;
    line-height: 1;
  }

  /* Tamaños/tracking calibrados contra el texto blanco del mockup
     (MAPA: caja 590×163 px · INTERACTIVO: caja 867×110 px a 1920px) */
  .banner-title-l1 {
    display: block;
    font-size: clamp(32px, 10.99vw, 211px);
    letter-spacing: -0.028em;
  }

  .banner-title-l2 {
    display: block;
    font-size: clamp(22px, 7.45vw, 143px);
    letter-spacing: -0.032em;
    margin-top: -0.53vw;
  }

  .banner-explorar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2.1vw;
    margin-left: -0.57vw;
    width: 21.5vw;
    max-width: 413px;
    height: 5.2vw;
    max-height: 100px;
    background-color: #ffffff;
    border-radius: 999px;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 900;
    font-size: clamp(11px, 2.03vw, 39px);
    color: #3667b0;
    text-decoration: none;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .banner-explorar:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
  }

  /* Personaje mariposa monarca (Identidad-Inicio, 1:1 con el mockup) */
  .banner-personaje {
    position: absolute;
    left: 57.03%;
    top: 22.52%;
    width: 40.05%;
    height: auto;
    z-index: 1;
    pointer-events: none;
    user-select: none;
  }

  /* ===============================
    EQUIPO (lienzo 1920 × 1168 del mockup)
  ================================ */
  .equipo-section {
    position: relative;
    aspect-ratio: 1920 / 1168;
    background-color: #efeee8;
  }

  .equipo-titulo {
    position: absolute;
    left: 9.27%;
    top: 15.15%;
    width: 29.79%;
    height: auto;
  }

  .equipo-imagotipo {
    position: absolute;
    left: 8.7%;
    top: 29.79%;
    width: 29.74%;
    height: auto;
  }

  /* Tarjetas blancas con esquinas asimétricas (hoja) como el mockup */
  .equipo-card {
    position: absolute;
    width: 20%;
    aspect-ratio: 384 / 317;
    background-color: #ffffff;
    border-radius: 19.5% 3.6% 19.5% 3.6%;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow 0.2s ease;
  }

  .equipo-card:hover {
    box-shadow: 0 14px 32px rgba(0, 0, 0, 0.32);
  }

  .equipo-card--ue {
    left: 51.51%;
    top: 8.65%;
  }

  .equipo-card--redim {
    left: 74.22%;
    top: 28.85%;
  }

  .equipo-card--cam {
    left: 51.51%;
    top: 44.43%;
  }

  .equipo-logo {
    height: auto;
    user-select: none;
  }

  .equipo-logo--ue {
    width: 54.9%;
  }

  .equipo-logo--redim {
    width: 77.1%;
  }

  .equipo-logo--cam {
    width: 69%;
  }

  /* Mariposas decorativas (manos naranjas) del costado derecho */
  .equipo-mariposa-1 {
    position: absolute;
    left: 77.55%;
    top: 5.31%;
    width: 13.49%;
    height: auto;
    pointer-events: none;
  }

  .equipo-mariposa-2 {
    position: absolute;
    left: 87.03%;
    top: 60.62%;
    width: 6.77%;
    height: auto;
    pointer-events: none;
  }

  /* Cita inferior derecha (Noto Sans 30px en el mockup) */
  .equipo-quote {
    position: absolute;
    right: 5.89%;
    top: 79.5%;
    width: 43.3%;
    margin: 0;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(11px, 1.5625vw, 30px);
    line-height: 1.2;
    text-align: justify;
    text-align-last: right;
  }

  /* ===============================
    PIE DE PÁGINA (índigo plano #342a83, como el mockup)
  ================================ */
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background-color: #342a83;
    padding: clamp(14px, 2.2vw, 42px) 4%;
    position: relative;
    z-index: 1;
  }

  .footer-text {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #efeee8;
    font-size: clamp(10px, 1.25vw, 24px);
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
    .banner-explorar {
      width: 38vw;
      height: 34px;
      margin-top: 4vw;
      font-size: 12px;
    }
    .equipo-quote {
      font-size: 13px;
    }
  }

  /* Mobile landscape */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .banner-explorar {
      width: 30vw;
      height: 38px;
      font-size: 14px;
    }
  }

  /* Mobile + Mobile landscape: EQUIPO pasa a una sola columna */
  @media (max-width: 767.98px) {
    .equipo-section {
      aspect-ratio: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 32px 6%;
    }
    .equipo-titulo {
      position: static;
      width: min(70%, 360px);
    }
    .equipo-imagotipo {
      position: static;
      width: min(64%, 320px);
    }
    .equipo-card {
      position: static;
      width: min(78%, 320px);
    }
    .equipo-mariposa-1,
    .equipo-mariposa-2 {
      display: none;
    }
    .equipo-quote {
      position: static;
      width: 100%;
      text-align: center;
      text-align-last: center;
    }
  }

  /* Tablet: el lienzo proporcional se conserva; sombras más discretas */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .banner-explorar,
    .equipo-card {
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14);
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .banner-explorar:hover {
      transform: scale(1.04);
    }
  }

  /* Extra Large: el marco se limita al lienzo original de 1920px */
  @media (min-width: 1200px) {
    .inicio-frame {
      max-width: 1920px;
    }
  }
</style>
