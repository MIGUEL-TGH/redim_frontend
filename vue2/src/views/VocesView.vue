<template>
  <div class="voces-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <!-- ===== Hero VOCES ===== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <img :src="tituloVoces" class="hero-title-img" alt="Voces">
          <p class="hero-subtitle">
            <strong>Chicas y chicos hablan sobre sus derechos,</strong> <br>
            comparten información y cuentan lo que viven <br>
            para prevenir la trata y el reclutamiento.
          </p>
        </div>
        <img :src="manosVoces" class="hero-hands" alt="" aria-hidden="true">
      </div>
    </section>

    <!-- ===== Zona naranja (fondo Voces) ===== -->
    <div class="voces-orange">
      <!-- Sección: Carrusel de videos (pasarela) -->
      <section class="videos-section">
        <coverflow-carousel :items="videos" variant="video">
          <template #card="{ item, active }">
            <figure class="cf-video-card">
              <div class="cf-video">
                <iframe
                  v-if="active"
                  :src="embedUrl(item.youtubeId)"
                  :title="item.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
                <img v-else :src="thumbUrl(item.youtubeId)" :alt="item.title" loading="lazy">
              </div>
              <figcaption class="cf-caption">
                <span class="cf-title">{{ item.title }}</span>
                <span class="cf-date">{{ item.date }}</span>
                <span class="cf-channel">{{ item.channel }}</span>
              </figcaption>
            </figure>
          </template>
        </coverflow-carousel>
      </section>

      <!-- Sección: Casos / etiquetas de personas -->
      <section class="cases-section">
        <div class="cases-inner">
          <!-- Tarjeta principal -->
          <article class="case-main">
            <div class="case-main-photo">
              <img :src="mainCase.img" :alt="mainCase.name">
              <div class="case-badges">
                <a
                  v-for="(b, i) in mainCase.badges"
                  :key="i"
                  class="case-badge"
                  :href="b.url"
                  target="_blank"
                  rel="noopener"
                >{{ b.label }}</a>
              </div>
            </div>
            <div class="case-main-body">
              <p class="case-tagline">{{ mainCase.tagline }}</p>
              <h3 class="case-name">{{ mainCase.name }}</h3>
              <p class="case-country">{{ mainCase.country }}</p>
              <p class="case-desc" v-html="mainCase.desc"></p>
            </div>
          </article>

          <!-- Lista de otros casos -->
          <div class="case-list">
            <button
              v-for="(c, i) in sideCases"
              :key="c.id"
              type="button"
              class="case-tag"
              @click="selectCase(i)"
            >
              <span class="case-tag-name">{{ c.name }}</span>
              <span class="case-tag-country">{{ c.country }}</span>
              <span class="case-tag-arrow" aria-hidden="true">&#8629;</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Sección: PODCAST -->
      <section class="podcast-section">
        <!-- Encabezado: muñeco (izq) + título PODCAST (der), en la misma línea.
             El muñeco baja sus pies (30% inferior) detrás de los cards. -->
        <div class="podcast-head">
          <img :src="dignidadVoces" class="podcast-character" alt="" aria-hidden="true">
          <img :src="tituloPodcast" class="podcast-title-img" alt="Podcast">
        </div>

        <div class="podcast-stage">
          <coverflow-carousel :items="podcasts" variant="podcast">
            <template #card="{ item }">
              <div class="cf-podcast-card">
                <a
                  class="podcast-play"
                  :href="item.url"
                  target="_blank"
                  rel="noopener"
                  :aria-label="'Reproducir ' + item.title"
                >
                  <img :src="reproducirPodcast" alt="">
                </a>
                <div class="podcast-info">
                  <p class="podcast-name">{{ item.title }}</p>
                  <p class="podcast-author">{{ item.author }}</p>
                  <span class="podcast-duration">{{ item.duration }}</span>
                </div>
              </div>
            </template>
          </coverflow-carousel>
        </div>
      </section>
    </div>

    <!-- ===== Sección: HISTORIAS ===== -->
    <section class="historias">
      <div class="historias-inner">
        <h2 class="historias-title">HISTORIAS</h2>

        <div class="historias-grid">
          <article v-for="(s, i) in storiesPage" :key="i" class="story-card">
            <div class="story-photo">
              <img :src="s.image" :alt="s.title" loading="lazy">
            </div>
            <div class="story-body">
              <span class="story-label">Historia</span>
              <h4 class="story-title">{{ s.title }}</h4>
              <span class="story-date">{{ s.date }}</span>
            </div>
          </article>
        </div>

        <div class="historias-dots">
          <button
            v-for="n in storiesPages"
            :key="n"
            type="button"
            class="hdot"
            :class="{ 'hdot--active': n - 1 === storiesIndex }"
            :aria-label="'Página ' + n"
            @click="storiesIndex = n - 1"
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
import CoverflowCarousel from '@/components/CoverflowCarousel.vue'
import tituloVoces from '@/assets/voces/titulo-voces.png'
import tituloPodcast from '@/assets/voces/titulo-podcast.png'
import manosVoces from '@/assets/voces/manos-voces.png'
import dignidadVoces from '@/assets/voces/dignidad-voces.png'
import reproducirPodcast from '@/assets/voces/reproducir-podcast.png'
import florMolina from '@/assets/voces/flor-molina.png'

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

export default {
  // 1️⃣ Identificación
  name: 'VocesView1',
  components: {
    HeaderComp,
    CoverflowCarousel
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
      tituloVoces,
      tituloPodcast,
      manosVoces,
      dignidadVoces,
      reproducirPodcast,
      videos: [],
      podcasts: [],
      mainCase: {},
      sideCases: [],
      storiesPerPage: 3,
      storiesIndex: 0,
      stories: []
    }
  },
  computed: {
    storiesPages () {
      return Math.ceil(this.stories.length / this.storiesPerPage)
    },
    storiesPage () {
      const start = this.storiesIndex * this.storiesPerPage
      return this.stories.slice(start, start + this.storiesPerPage)
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
    selectCase (i) {
      // Intercambia el caso principal con la etiqueta lateral seleccionada
      const clicked = this.sideCases[i]
      this.$set(this.sideCases, i, this.mainCase)
      this.mainCase = clicked
    },
    loadData () {
      // --- Videos (pasarela): contenido real del canal de YouTube de REDIM ---
      this.videos = [
        { youtubeId: 'ipaF-0j6ZlY', title: 'REDIM: Migrar es un derecho', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: 'ccnA9oNsi7w', title: 'REDIM: ¿Quiénes buscan a niñas, niños y adolescentes desaparecidos?', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: 'fw9AAIEbVaw', title: 'REDIM: En Ciudad Juárez, candidat@s también firmaron el ¡Compromiso con la Niñez. SuFuturoEsHOY!', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: 'W6upFglzI_s', title: 'REDIM: #NiñezIndígena habla sobre su derecho a la participación', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: 'NnfB5NOWl-w', title: 'REDIM: Derecho a la identidad desde la mirada de la #NiñezIndígena | Comunidad de Chabeclumil, Chiapas', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: '4LSr9erYiGE', title: 'REDIM: Niñez y adolescencia indígena de Pajajté, en Chiapas, hablan sobre su derecho a la paz', date: '26 DE ENERO 2021', channel: 'REDIM' },
        { youtubeId: 'DLpPL2NwIHU', title: 'REDIM: ABRAZOS - Historias de niñas y niños con familiares privados de libertad / Cap. 4 - Visitas', date: '26 DE ENERO 2021', channel: 'REDIM' }
      ]

      // --- Casos ---
      // Cada badge enlaza a un recurso (objeto { label, url }) y se abre en otra pestaña.
      const florDesc = 'Flor fue víctima de trata laboral en Estados Unidos después de ser engañada con una oferta de trabajo desde México. Gracias al apoyo de la <strong>Organización Internacional para las Migraciones (OIM)</strong> y la <strong>Coalición para Abolir la Esclavitud y la Trata (CAST)</strong>, logró escapar y reunirse con sus hijos tras ocho años de separación. Hoy en día, Flor es una defensora de los derechos de las víctimas de trata y trabaja para crear conciencia sobre este delito, demostrando que la reunificación familiar y la recuperación son posibles; reafirmando que siempre hay una salida y que la esperanza puede transformar vidas.'
      this.mainCase = {
        id: 'flor',
        name: 'FLOR MOLINA',
        country: 'MÉXICO',
        tagline: 'Un ejemplo de esperanza:',
        img: florMolina,
        desc: florDesc,
        badges: [
          { label: 'ORGANIZACIÓN INTERNACIONAL PARA LAS MIGRACIONES (OIM)', url: 'https://mismomundomismosderechos.com/' },
          { label: 'COALICIÓN PARA ABOLIR LA ESCLAVITUD Y TRATA (CAST)', url: 'https://derechosinfancia.org.mx/v1/campana-ninezprimero-llega-a-michoacan-redim-y-cam-presentan-diagnostico-sobre-trata-y-reclutamiento-de-ninas-ninos-y-adolescentes-en-la-entidad/' }
        ]
      }
      this.sideCases = [
        { id: 'mauricio', name: 'MAURICIO', country: 'MÉXICO', tagline: 'Un ejemplo de esperanza:', img: 'https://picsum.photos/seed/voces-mauricio/300/300', desc: LOREM, badges: [{ label: 'ORGANIZACIÓN INTERNACIONAL PARA LAS MIGRACIONES (OIM)', url: 'https://derechosinfancia.org.mx/v1/redim-presenta-ante-la-presidencia-de-la-republica-el-balance-anual-2025-sobre-la-situacion-de-la-ninez-y-adolescencia-en-mexico/' }, { label: 'CONOCE MÁS', url: 'https://derechosinfancia.org.mx/v1/conoce-mas-2/' }] },
        { id: 'melisa', name: 'MELISA', country: 'GUATEMALA', tagline: 'Un ejemplo de esperanza:', img: 'https://picsum.photos/seed/voces-melisa/300/300', desc: LOREM, badges: [{ label: 'COALICIÓN PARA ABOLIR LA ESCLAVITUD Y TRATA (CAST)', url: 'https://derechosinfancia.org.mx/v1/en-audiencia-ante-la-cidh-redim-llama-a-proteger-a-ninas-ninos-y-adolescentes-del-reclutamiento-y-utilizacion-asi-como-a-quienes-estan-en-contexto-de-movilidad-humana/' }] },
        { id: 'antonio', name: 'ANTONIO', country: 'MÉXICO', tagline: 'Un ejemplo de esperanza:', img: 'https://picsum.photos/seed/voces-antonio/300/300', desc: LOREM, badges: [{ label: 'INFANCIA CUENTA (ISSUU)', url: 'https://issuu.com/infanciacuenta' }, { label: 'VACANTES', url: 'https://derechosinfancia.org.mx/v1/vacantes/' }] }
      ]

      // --- Podcasts (pasarela): enlaces reales a YouTube Music ---
      const podcastUrls = [
        'https://music.youtube.com/watch?v=GJWfGOtYKkk&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=A95P0NgOh5A&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=1anjO9OX9Z0&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=C3aDJnKjgew&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=SFt4Y2zEqqI&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=gklGoaz-y-M&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=r-kcMAL3GOM&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju',
        'https://music.youtube.com/watch?v=Ll-W9i78eD0&list=PLEO9IC-WjzH3826WgCfGk5maqckrg2Cju'
      ]
      this.podcasts = podcastUrls.map(url => ({
        title: 'Podcast "1,2,3 por mí y por ti", sobre desaparición infantil.',
        author: 'de Fer contra la desaparición y por los derechos humanos',
        duration: '27:59',
        url
      }))

      // --- Historias ---
      const stories = []
      for (let i = 0; i < 12; i++) {
        stories.push({
          image: `https://picsum.photos/seed/historia-${i}/400/300`,
          title: 'Un minuto para salvarles, desaparición infantil.',
          date: '21 de mayo de 2026'
        })
      }
      this.stories = stories
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
    Naranja #ed712c · Azul oscuro #342a83 · Azul #276acc
    Amarillo #f9cd35 · Crema #efeee8
  ================================ */
  .voces-page {
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
    padding: 28px 24px 0;
    /* overflow hidden recorta lo que sobresalga por debajo (hacia la zona naranja) */
    overflow: hidden;
  }

  .hero-inner {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    /* Alto suficiente para mostrar la imagen completa (≈445px) con holgura
       arriba (no se recorta bajo el header) y abajo (toca la zona naranja). */
    min-height: 490px;
  }

  .hero-text {
    max-width: 420px;
    position: relative;
    z-index: 2;
  }

  .hero-title-img {
    width: 320px;
    max-width: 70vw;
    height: auto;
  }

  .hero-subtitle {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(14px, 2vw, 19px);
    line-height: 1.35;
    margin: 12px 0 0;
  }

  .hero-subtitle strong {
    font-weight: 800;
  }

  .hero-hands {
    position: absolute;
    right: 0;
    /* Pequeña holgura inferior: la base casi toca la zona naranja, sin recorte */
    /* bottom: 18px; */
    bottom: 0px;
    width: 660px;
    max-width: 72%;
    height: auto;
    z-index: 1;
    pointer-events: none;
  }

  /* ===============================
    ZONA NARANJA
  ================================ */
  .voces-orange {
    background-image: url('~@/assets/voces/fondo-voces.png');
    background-size: cover;
    background-position: top center;
    background-color: #ef7d2a;
    padding: 48px 24px 64px;
  }

  /* ===============================
    TARJETAS DE VIDEO (pasarela)
  ================================ */
  .cf-video-card {
    margin: 0;
    background-color: #ffffff;
    border-radius: 16px;
    padding: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
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
    TARJETAS DE VIDEO (pasarela): separación inferior hacia los casos
  ================================ */
  .videos-section {
    /* Mayor separación entre la pasarela de videos y la sección de casos,
       tal como se indica en el mockup 3.3 */
    margin-bottom: clamp(40px, 6vw, 96px);
  }

  /* ===============================
    SECCIÓN DE CASOS
  ================================ */
  .cases-section {
    padding: clamp(24px, 4vw, 56px) 0 16px;
  }

  .cases-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    align-items: stretch;
  }

  .case-main {
    flex: 1 1 0;
    background-color: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    display: flex;
    gap: 20px;
  }

  .case-main-photo {
    flex-shrink: 0;
    /* width: 160px; */
    width: 250px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .case-main-photo > img {
    width: 250px;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
  }

  .case-badges {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .case-badge {
    display: block;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    font-size: 9px;
    line-height: 1.2;
    color: #9e9893;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid #d8d2ca;
    border-radius: 8px;
    padding: 8px;
    text-align: center;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
  }

  .case-badge:hover,
  .case-badge:focus-visible {
    color: #ed712c;
    border-color: #ed712c;
    background-color: rgba(237, 113, 44, 0.08);
    outline: none;
  }

  .case-tagline {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 600;
    color: #342a83;
    font-size: 14px;
    text-align: right;
    margin: 0;
  }

  .case-name {
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(24px, 3.2vw, 34px);
    line-height: 1.05;
    text-align: right;
    margin: 2px 0 0;
  }

  .case-country {
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(14px, 1.8vw, 17px);
    text-align: right;
    margin: 2px 0 12px;
  }

  .case-desc {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #3c3c3b;
    font-size: clamp(11px, 1.3vw, 13px);
    line-height: 1.45;
    margin: 0;
    text-align: justify;
  }

  .case-list {
    flex: 0 0 270px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    justify-content: center;
  }

  .case-tag {
    position: relative;
    background-color: #ffffff;
    border: none;
    border-radius: 16px;
    padding: 18px 24px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
    cursor: pointer;
    text-align: right;
    transition: transform 0.2s ease;
  }

  .case-tag:hover {
    transform: translateX(-6px);
  }

  .case-tag-name {
    display: block;
    /* font-family: 'Noto Sans', sans-serif;
    font-weight: 900; */
    font-family: 'Chelsea Market', cursive;
    font-weight: 600;
    color: #342a83;
    font-size: clamp(18px, 2.4vw, 30px);
    line-height: 1;
  }

  .case-tag-country {
    display: block;
    /* font-family: 'Noto Sans', sans-serif;
    font-weight: 700; */
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #342a83;
    font-size: 20px;
  }

  .case-tag-arrow {
    position: absolute;
    left: 18px;
    bottom: 14px;
    color: #ed712c;
    font-size: 20px;
    font-weight: 700;
  }

  /* ===============================
    SECCIÓN PODCAST
  ================================ */
  .podcast-section {
    padding: 32px 0 8px;
  }

  /* Encabezado: muñeco (izq) + título PODCAST (der), alineados por arriba.
     El muñeco es grande; su cabeza/cuerpo quedan visibles y la tarjeta cubre
     su parte inferior (piernas/pies). */
  .podcast-head {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 16px;
  }

  .podcast-character {
    width: 300px;
    max-width: 44vw;
    height: auto;
    display: block;
    pointer-events: none;
  }

  .podcast-title-img {
    display: block;
    width: 340px;
    max-width: 56vw;
    height: auto;
    /* baja el título para alinearlo con la cara del muñeco */
    margin-top: 36px;
  }

  /* El escenario del carrusel sube (z-index mayor) y cubre la parte inferior del muñeco */
  .podcast-stage {
    position: relative;
    z-index: 2;
    max-width: 1000px;
    margin: -80px auto 0;
  }

  .cf-podcast-card {
    display: flex;
    align-items: center;
    gap: 18px;
    background-color: #ffffff;
    border-radius: 18px;
    padding: 18px 24px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  }

  .podcast-play {
    flex-shrink: 0;
    display: block;
    width: 64px;
    height: 64px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .podcast-play:hover {
    transform: scale(1.08);
  }

  .podcast-play img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .podcast-info {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
  }

  .podcast-name {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    font-style: italic;
    color: #342a83;
    font-size: clamp(13px, 1.6vw, 15px);
    line-height: 1.2;
    margin: 0;
  }

  .podcast-author {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #3c3c3b;
    font-size: clamp(11px, 1.4vw, 13px);
    margin: 6px 0 0;
  }

  .podcast-duration {
    display: block;
    text-align: right;
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    color: #342a83;
    font-size: 13px;
    margin-top: 6px;
  }

  /* ===============================
    HISTORIAS
  ================================ */
  .historias {
    background-color: #efeee8;
    padding: 48px 24px 56px;
  }

  .historias-inner {
    max-width: 1000px;
    margin: 0 auto;
  }

  .historias-title {
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(26px, 4.2vw, 42px);
    margin: 0 0 28px;
  }

  .historias-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .story-card {
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(60, 60, 59, 0.12);
  }

  .story-photo {
    width: 100%;
    aspect-ratio: 4 / 3;
    background-color: #c4ac9c;
    overflow: hidden;
  }

  .story-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .story-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .story-label {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #ed712c;
    font-size: 13px;
  }

  .story-title {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 800;
    font-style: italic;
    color: #342a83;
    font-size: clamp(14px, 1.8vw, 16px);
    line-height: 1.2;
    margin: 6px 0;
  }

  .story-date {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #3c3c3b;
    font-size: 12px;
  }

  .historias-dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 28px;
  }

  .hdot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background-color: #c4ac9c;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.25s ease, transform 0.25s ease;
  }

  .hdot--active {
    background-color: #686d4a;
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
    .hero-inner {
      min-height: 0;
    }
    .podcast-character {
      width: 130px;
    }
    .podcast-title-img {
      margin-top: 14px;
      max-width: 42vw;
    }
    .podcast-stage {
      margin-top: -38px;
    }
    .hero-hands {
      position: relative;
      right: auto;
      bottom: auto;
      width: 80%;
      max-width: 320px;
      margin: 16px auto 0;
      display: block;
    }
    .hero-text {
      text-align: center;
    }
    .hero-title-img {
      max-width: 60vw;
    }
    .cases-inner {
      flex-direction: column;
    }
    .case-main {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .case-main-photo {
      width: 100%;
      align-items: center;
    }
    .case-tagline,
    .case-name,
    .case-country {
      text-align: center;
    }
    .case-desc {
      text-align: left;
    }
    .case-list {
      flex-basis: auto;
    }
    .historias-grid {
      grid-template-columns: 1fr;
    }
    .footer-bar {
      flex-direction: column;
      text-align: center;
      gap: 6px;
    }
  }

  /* Mobile landscape */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .hero-inner {
      min-height: 340px;
    }
    .cases-inner {
      flex-direction: column;
    }
    .case-list {
      flex-basis: auto;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .case-tag {
      flex: 1 1 40%;
    }
    .historias-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .hero-inner {
      min-height: 400px;
    }
    .case-list {
      flex-basis: 220px;
    }
    .historias-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .case-list {
      flex-basis: 250px;
    }
    .hero-inner {
      min-height: 400px;
    }
  }

  /* Extra Large Screens */
  @media (min-width: 1200px) {
    .hero-inner {
      min-height: 400px;
    }
  }
</style>
