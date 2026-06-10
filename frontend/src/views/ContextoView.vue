<template>
  <div class="contexto-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <!-- ===== Cuerpo: fondo original crema→café (fondo-contexto.png) ===== -->
    <div class="contexto-main">
      <div class="contexto-frame">
        <div class="contexto-inner">
          <!-- Título -->
          <h1 class="contexto-title">CONTEXTO</h1>

          <!-- ===== Sección 1: Contexto (manos mariposa + tarjeta LA MARIPOSA) ===== -->
          <section class="ctx-section ctx-section--intro">
            <div class="ctx-visual">
              <img :src="mariposasContexto" class="hero-manos" alt="" aria-hidden="true">
              <context-card
                class="card-floating card-mariposa"
                title="LA MARIPOSA"
                header-color="#342a83"
                :body="cards.mariposa"
                @expand="onExpand"
              />
            </div>
            <div class="ctx-text">
              <h2 class="ctx-heading">
                Contexto sobre trata, reclutamiento y
                utilización de niñas, niños y adolescentes
                en actividades lícitas e ilícitas en México
              </h2>
              <p class="ctx-paragraph">
                La trata y el reclutamiento de niñas, niños y adolescentes
                es más común de lo que parece. Aquí te explicamos
                cómo sucede, cómo identificarlo, qué está pasando en tu
                estado y qué puedes hacer para prevenirlo.
              </p>
              <button type="button" class="leer-mas" @click="onExpand('Contexto')">LEER MÁS <span>+</span></button>
            </div>
          </section>

          <!-- ===== Sección 2: Mitos y realidades (estela de mariposas) ===== -->
          <section class="ctx-section">
            <div class="ctx-visual">
              <img :src="mariposaRecursos" class="sec2-img" alt="" aria-hidden="true">
            </div>
            <div class="ctx-text">
              <h2 class="ctx-heading">Mitos y realidades</h2>
              <p class="ctx-paragraph">
                Estos son algunos mitos y realidades en torno a la
                trata, reclutamiento y utilización de niñas, niños y
                adolescentes en México
              </p>
              <button type="button" class="leer-mas" @click="onExpand('Mitos y realidades')">LEER MÁS <span>+</span></button>
            </div>
          </section>

          <!-- ===== Sección 3: Lo que pasa en mi estado (saco con crías + manos) ===== -->
          <section class="ctx-section">
            <div class="ctx-visual sack-scene">
              <img :src="manoContexto1" class="sack-mano-1" alt="" aria-hidden="true">
              <img :src="crisalidaContexto1" class="sack-img" alt="" aria-hidden="true">
              <img :src="manoContexto2" class="sack-mano-2" alt="" aria-hidden="true">
              <context-card
                class="card-floating card-senales"
                title="SEÑALES DE ALERTA"
                header-color="#342a83"
                :body="cards.senales"
                @expand="onExpand"
              />
            </div>
            <div class="ctx-text">
              <h2 class="ctx-heading">Lo que pasa en mi estado</h2>
              <p class="ctx-paragraph">
                La trata de personas y el reclutamiento de niñas, niños y
                adolescentes afectan distintos territorios de México de
                maneras particulares, pero comparten causas estructurales
                como la violencia, la desigualdad, la impunidad, la
                discriminación y la falta de acceso a derechos.
              </p>
              <button type="button" class="leer-mas" @click="onExpand('Lo que pasa en mi estado')">LEER MÁS <span>+</span></button>
            </div>
          </section>

          <!-- ===== Sección 4: Campaña Niñez Primero (tarjeta TRATA) ===== -->
          <section class="ctx-section ctx-section--campaign">
            <div class="ctx-visual">
              <context-card
                class="card-floating card-trata"
                title="TRATA"
                header-color="#342a83"
                :body="cards.trata"
                @expand="onExpand"
              />
            </div>
            <div class="ctx-text">
              <h2 class="ctx-heading">Campaña “Niñez Primero”</h2>
              <p class="ctx-paragraph">
                #NiñezPrimero es una campaña impulsada por la Red
                por los Derechos de la Infancia en México (REDIM) y el
                CAM, con apoyo de la Unión Europea, junto a organizaciones
                aliadas para visibilizar, prevenir y atender la trata
                de personas, reclutamiento y utilización de niñas, niños
                y adolescentes por grupos delictivos en México.
              </p>
              <button type="button" class="leer-mas" @click="onExpand('Campaña Niñez Primero')">LEER MÁS <span>+</span></button>
            </div>
          </section>

          <!-- ===== Escena café: criaturas, marañas de brazos, crisálida y monumento ===== -->
          <div class="cafe-block">
            <!-- Capas decorativas (proporciones del mockup a 1920px) -->
            <img :src="manosContexto" class="cafe-manos" alt="" aria-hidden="true">
            <img :src="trataContexto" class="cafe-creature cafe-trata" alt="" aria-hidden="true">
            <img :src="reclutamientoContexto" class="cafe-creature cafe-recl" alt="" aria-hidden="true">
            <img :src="crisalidaColgante" class="cafe-crisalida" alt="" aria-hidden="true">
            <img :src="consumidorContexto" class="cafe-monumento" alt="" aria-hidden="true">

            <!-- Tarjetas flotantes sobre la escena café -->
            <context-card
              class="card-floating card-reclutamiento"
              title="EL RECLUTAMIENTO"
              header-color="#342a83"
              :body="cards.reclutamiento"
              @expand="onExpand"
            />
            <context-card
              class="card-floating card-crisalida"
              title="LA CRISÁLIDA"
              header-color="#342a83"
              :body="cards.crisalida"
              @expand="onExpand"
            />
            <context-card
              class="card-floating card-consumidor"
              title="EL CONSUMIDOR"
              header-color="#342a83"
              :body="cards.consumidor"
              @expand="onExpand"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Pie de página (índigo plano, según mockup) ===== -->
    <footer class="footer-bar">
      <span class="footer-text">CIUDAD DE MÉXICO. COL. NO.</span>
      <router-link to="/transparencia" class="footer-text footer-link">AVISO DE PRIVACIDAD</router-link>
    </footer>

    <!-- ===== Diálogo de detalle ampliado de cada concepto ===== -->
    <context-detail-dialog :dialog.sync="detailOpen" :item="detailItem" />
  </div>
</template>

<script>
import HeaderComp from '@/components/HeaderComp.vue'
import ContextCard from '@/components/ContextCard.vue'
import ContextDetailDialog from '@/components/ContextDetailDialog.vue'
import mariposasContexto from '@/assets/contexto/mariposas-contexto.png'
import mariposaRecursos from '@/assets/contexto/mariposa-recursos.png'
import manoContexto1 from '@/assets/contexto/mano-contexto-1.png'
import crisalidaContexto1 from '@/assets/contexto/crisalida-contexto-1.png'
import manoContexto2 from '@/assets/contexto/mano-contexto-2.png'
import manosContexto from '@/assets/contexto/manos-contexto.png'
import trataContexto from '@/assets/contexto/trata-contexto.png'
import reclutamientoContexto from '@/assets/contexto/reclutamiento-contexto.png'
import consumidorContexto from '@/assets/contexto/consumidor-contexto.png'
import crisalidaColgante from '@/assets/contexto/crisalida-colgante.svg'

export default {
  // 1️⃣ Identificación
  name: 'ContextoView',
  components: {
    HeaderComp,
    ContextCard,
    ContextDetailDialog
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
      mariposasContexto,
      mariposaRecursos,
      manoContexto1,
      crisalidaContexto1,
      manoContexto2,
      manosContexto,
      trataContexto,
      reclutamientoContexto,
      consumidorContexto,
      crisalidaColgante,
      detailOpen: false,
      detailItem: null,
      cards: {
        mariposa: '<strong>Un símbolo de libertad, resiliencia y esperanza.</strong> Representa el proceso de recuperación de niñas, niños y adolescentes que han sido víctimas de trata o reclutamiento, mostrando que es posible salir del ciclo de violencia y reconstruir sus vidas con apoyo, protección y oportunidades.',
        senales: '<strong>Algunas señales pueden indicar que una niña, niño o adolescente</strong> está en riesgo o podría estar siendo víctima de trata o reclutamiento. Detectarlas de manera temprana puede ayudar a activar redes de protección y acompañamiento.',
        trata: '<strong>La trata de personas es una grave violación a los derechos humanos</strong> que implica la captación, traslado, acogida o recepción de personas con fines de explotación.',
        reclutamiento: 'El reclutamiento de niñas, niños y adolescentes ocurre cuando <strong>grupos delictivos o armados captan, incorporan, utilizan o controlan a personas menores de edad</strong> para realizar actividades ilícitas o relacionadas con dinámicas criminales.',
        crisalida: 'En esta etapa, <strong>niñas, niños y adolescentes son manipulados, engañados o forzados a ingresar en redes de trata y reclutamiento.</strong> Las personas explotadoras se aprovechan de su vulnerabilidad para privarlos de su libertad y someterlos a situaciones de abuso, violencia y explotación.<br><br><strong>La trata y el reclutamiento los atrapan,</strong> separándolos de su entorno seguro y llevándolos a un ciclo de opresión.',
        consumidor: 'La trata y el reclutamiento de niñas, niños y adolescentes <strong>existen porque hay personas que los explotan.</strong><br><br><strong>El consumidor es el eslabón final de esta cadena de violencia,</strong> aquel que demanda y financia estos delitos, perpetuando la explotación y el abuso. Su responsabilidad es innegable: sin demanda, no habría trata ni reclutamiento.'
      }
    }
  },
  computed: {
    // Mapa de contenidos para el diálogo de detalle, indexado por título.
    // Reúne las seis tarjetas flotantes y los cuatro botones "LEER MÁS".
    // Todas las cabeceras usan el índigo #342a83 del mockup 3.2.
    conceptDetails () {
      return {
        'LA MARIPOSA': { title: 'LA MARIPOSA', headerColor: '#342a83', body: this.cards.mariposa },
        'SEÑALES DE ALERTA': { title: 'SEÑALES DE ALERTA', headerColor: '#342a83', body: this.cards.senales },
        TRATA: { title: 'TRATA', headerColor: '#342a83', body: this.cards.trata },
        'EL RECLUTAMIENTO': { title: 'EL RECLUTAMIENTO', headerColor: '#342a83', body: this.cards.reclutamiento },
        'LA CRISÁLIDA': { title: 'LA CRISÁLIDA', headerColor: '#342a83', body: this.cards.crisalida },
        'EL CONSUMIDOR': { title: 'EL CONSUMIDOR', headerColor: '#342a83', body: this.cards.consumidor },
        Contexto: {
          title: 'CONTEXTO',
          headerColor: '#342a83',
          body: 'La trata y el reclutamiento de niñas, niños y adolescentes es más común de lo que parece. Aquí te explicamos cómo sucede, cómo identificarlo, qué está pasando en tu estado y qué puedes hacer para prevenirlo.'
        },
        'Mitos y realidades': {
          title: 'MITOS Y REALIDADES',
          headerColor: '#342a83',
          body: 'Estos son algunos mitos y realidades en torno a la trata, reclutamiento y utilización de niñas, niños y adolescentes en México.'
        },
        'Lo que pasa en mi estado': {
          title: 'LO QUE PASA EN MI ESTADO',
          headerColor: '#342a83',
          body: 'La trata de personas y el reclutamiento de niñas, niños y adolescentes afectan distintos territorios de México de maneras particulares, pero comparten causas estructurales como la violencia, la desigualdad, la impunidad, la discriminación y la falta de acceso a derechos.'
        },
        'Campaña Niñez Primero': {
          title: 'CAMPAÑA “NIÑEZ PRIMERO”',
          headerColor: '#342a83',
          body: '#NiñezPrimero es una campaña impulsada por la Red por los Derechos de la Infancia en México (REDIM) y el CAM, con apoyo de la Unión Europea, junto a organizaciones aliadas para visibilizar, prevenir y atender la trata de personas, reclutamiento y utilización de niñas, niños y adolescentes por grupos delictivos en México.'
        }
      }
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    onExpand (title) {
      // Abre el diálogo de detalle ampliado del concepto seleccionado
      const detail = this.conceptDetails[title]
      if (detail) {
        this.detailItem = detail
        this.detailOpen = true
      }
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
    Paleta (1.2 GUIA PRELIMINAR): Crema #efeee8 · Azul #342a83 · Morado #6a3d8f
    Magenta #b62b86 · Naranja #ed712c
    Las posiciones/proporciones provienen del mockup 3.2 (lienzo de 1920px).
  ================================ */
  .contexto-page {
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

  /* Fondo original del mockup (degradado crema→café), estirado a todo el alto */
  .contexto-main {
    position: relative;
    overflow: hidden;
    background-color: #efeee8;
    background-image: url('~@/assets/contexto/fondo-contexto.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  /* Marco que replica el lienzo de 1920px del mockup */
  .contexto-frame {
    position: relative;
    max-width: 1920px;
    margin: 0 auto;
  }

  .contexto-inner {
    position: relative;
    z-index: 1;
    padding: clamp(8px, 1.2vw, 24px) 4% 0;
  }

  /* ===============================
    TÍTULO
  ================================ */
  .contexto-title {
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #b62b86;
    font-size: clamp(42px, 9.5vw, 182px);
    line-height: 1.05;
    text-align: right;
    margin: clamp(8px, 1.5vw, 30px) 0 clamp(10px, 1.8vw, 36px);
  }

  /* ===============================
    SECCIONES (2 columnas: visual izq / texto der, como el mockup)
  ================================ */
  .ctx-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 24px;
    align-items: start;
    margin-bottom: clamp(16px, 1.8vw, 36px);
  }

  .ctx-visual {
    position: relative;
  }

  /* Todo el texto de secciones va anclado a la derecha (mockup) */
  .ctx-text {
    position: relative;
    z-index: 3;
    text-align: right;
  }

  .ctx-heading {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 700;
    color: #342a83;
    font-size: clamp(17px, 2.15vw, 41px);
    line-height: 1.3;
    margin: 0 0 clamp(10px, 1.2vw, 24px);
  }

  .ctx-paragraph {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(13px, 1.67vw, 32px);
    line-height: 1.45;
    text-align: justify;
    text-align-last: right;
    margin: 0 0 clamp(12px, 1.8vw, 36px);
  }

  .leer-mas {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 900;
    letter-spacing: 1px;
    color: #ed712c;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: clamp(14px, 2.05vw, 39px);
  }

  .leer-mas span {
    color: #ed712c;
    font-weight: 900;
  }

  .leer-mas:hover {
    color: #342a83;
  }

  /* ===============================
    SECCIÓN 1: manos mariposa + tarjeta LA MARIPOSA
    (la imagen sube hasta el nivel del título y sangra por la izquierda)
  ================================ */
  .hero-manos {
    display: block;
    width: 111%;
    max-width: none;
    height: auto;
    margin: -44% 0 0 -19%;
  }

  .card-mariposa {
    width: 81%;
    margin: -20% 0 0 19%;
  }

  /* ===============================
    SECCIÓN 2: estela de mariposas que baja hacia el saco
  ================================ */
  .sec2-img {
    display: block;
    width: 60%;
    height: auto;
    margin: 48% 0 -32% 3%;
    transform: rotate(-58deg);
  }

  /* ===============================
    SECCIÓN 3: saco con crías + manos que lo acechan + tarjeta SEÑALES
  ================================ */
  .sack-img {
    position: relative;
    display: block;
    width: 50%;
    height: auto;
    margin-left: 4%;
    z-index: 1;
  }

  .sack-mano-1 {
    position: absolute;
    left: -22%;
    top: -10%;
    width: 52%;
    height: auto;
    z-index: 0;
  }

  .sack-mano-2 {
    position: absolute;
    left: -28%;
    top: 60%;
    width: 75%;
    height: auto;
    z-index: 2;
  }

  .card-senales {
    width: 81%;
    margin: -25% 0 0 30%;
  }

  /* ===============================
    SECCIÓN 4: tarjeta TRATA
  ================================ */
  .card-trata {
    width: 81%;
    margin: 28% 0 0 5%;
  }

  /* ===============================
    TARJETAS FLOTANTES
  ================================ */
  .card-floating {
    position: relative;
    z-index: 4;
  }

  /* ===============================
    ESCENA CAFÉ (lienzo proporcional al mockup: 1920 × 2750)
  ================================ */
  .cafe-block {
    position: relative;
    margin: 0 -4.35%;
    aspect-ratio: 1920 / 2750;
  }

  .cafe-block img {
    position: absolute;
    height: auto;
    pointer-events: none;
  }

  /* Maraña de brazos que cruza toda la zona oscura */
  .cafe-manos {
    left: -5%;
    top: 15.3%;
    width: 110%;
    z-index: 0;
  }

  /* Criatura con cuernos (trata): sangra por la izquierda */
  .cafe-trata {
    left: -18%;
    top: -3.4%;
    width: 64%;
    z-index: 1;
  }

  /* Criatura enojada (reclutamiento): sangra por la derecha */
  .cafe-recl {
    left: 42.7%;
    top: -6.2%;
    width: 68.4%;
    z-index: 1;
  }

  /* Crisálida colgante bajo la tarjeta EL RECLUTAMIENTO */
  .cafe-crisalida {
    left: 30.7%;
    top: 19.5%;
    width: 37.7%;
    z-index: 2;
  }

  /* Monumento con nichos (consumidor): ancla inferior, recortado por el pie */
  .cafe-monumento {
    left: -11.6%;
    top: 49.3%;
    width: 140.7%;
    z-index: 2;
  }

  /* Tarjetas de la escena café (porcentajes del lienzo del mockup) */
  .card-reclutamiento {
    position: absolute;
    left: 39%;
    top: 5.3%;
    width: 35.7%;
  }

  .card-crisalida {
    position: absolute;
    left: 52.7%;
    top: 33.6%;
    width: 35.7%;
  }

  .card-consumidor {
    position: absolute;
    left: 22%;
    top: 69.1%;
    width: 35.7%;
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
    .contexto-title {
      font-size: clamp(34px, 11vw, 56px);
    }
    .ctx-heading {
      font-size: 17px;
    }
    .ctx-paragraph {
      font-size: 13px;
    }
    .leer-mas {
      font-size: 14px;
    }
  }

  /* Mobile + Mobile landscape: una sola columna, escena café apilada */
  @media (max-width: 767.98px) {
    .ctx-section {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }
    .contexto-title {
      text-align: center;
    }
    .ctx-text {
      text-align: center;
    }
    .ctx-paragraph {
      text-align: justify;
      text-align-last: center;
    }

    /* Sección 1: la imagen vuelve al flujo y la tarjeta se centra */
    .hero-manos {
      width: 92%;
      margin: 0 auto;
    }
    .card-mariposa {
      width: 100%;
      max-width: 420px;
      margin: -12% auto 0;
    }

    /* Sección 2: estela centrada y sin solaparse */
    .sec2-img {
      width: 70%;
      margin: 4% auto;
      transform: rotate(-45deg);
    }

    /* Sección 3: saco centrado con manos a los lados */
    .sack-img {
      width: 64%;
      margin: 0 auto;
    }
    .sack-mano-1 {
      left: -10%;
      top: -6%;
      width: 46%;
    }
    .sack-mano-2 {
      left: -14%;
      top: 64%;
      width: 60%;
    }
    .card-senales {
      width: 100%;
      max-width: 420px;
      margin: -10% auto 0;
    }

    /* Sección 4: tarjeta TRATA centrada */
    .card-trata {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }

    /* En pantallas angostas el fondo estirado desalinea la zona oscura:
       se apaga la imagen global y la escena café lleva su propio degradado */
    .contexto-main {
      background-image: none;
    }

    /* La escena café pasa a flujo vertical con degradado propio */
    .cafe-block {
      aspect-ratio: auto;
      margin: 24px -5vw 0;
      padding: 48px 5vw 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      background: linear-gradient(
        to bottom,
        rgba(239, 238, 232, 0) 0%,
        #aaa49e 5%,
        #6e6862 10%,
        #353335 20%,
        #38302e 45%,
        #5e4a3c 78%,
        #443b3a 100%
      );
    }
    .cafe-block img {
      position: absolute;
    }
    .cafe-manos {
      left: -15%;
      top: 10%;
      width: 130%;
      opacity: 0.5;
    }
    .cafe-trata {
      left: -20%;
      top: 0;
      width: 75%;
      opacity: 0.35;
    }
    .cafe-recl {
      left: 45%;
      top: 22%;
      width: 80%;
      opacity: 0.35;
    }
    /* La crisálida y el monumento sí entran al flujo entre tarjetas */
    .cafe-block img.cafe-crisalida {
      position: relative;
      left: auto;
      top: auto;
      width: 64%;
      margin: 0 auto;
      order: 2;
    }
    .cafe-block img.cafe-monumento {
      position: relative;
      left: auto;
      top: auto;
      width: 100%;
      margin: 0 auto -10%;
      order: 4;
    }
    .card-reclutamiento,
    .card-crisalida,
    .card-consumidor {
      position: relative;
      left: auto;
      top: auto;
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
    }
    .card-reclutamiento {
      order: 1;
    }
    .card-crisalida {
      order: 3;
    }
    .card-consumidor {
      order: 5;
      margin-top: -55%;
    }
  }

  /* Tablet: mantiene las dos columnas con sangrados más discretos */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .hero-manos {
      width: 104%;
      margin: -36% 0 0 -12%;
    }
    .sack-mano-1 {
      left: -14%;
    }
    .sack-mano-2 {
      left: -18%;
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .contexto-inner {
      padding-top: clamp(12px, 1.4vw, 28px);
    }
  }

  /* Extra Large: el marco se limita al lienzo original de 1920px */
  @media (min-width: 1200px) {
    .contexto-frame {
      max-width: 1920px;
    }
  }
</style>
