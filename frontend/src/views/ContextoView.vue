<template>
  <div class="contexto-page">
    <!-- ===== Barra superior con menú ===== -->
    <header-comp />

    <!-- ===== Cuerpo con degradado (crema arriba ~55% / café abajo ~45%) ===== -->
    <div class="contexto-main">
      <!-- Capas de fondo sobrepuestas (decorativas) -->
      <img :src="manosContexto" class="bg-manos" alt="" aria-hidden="true">
      <img :src="consumidorContexto" class="bg-consumidor" alt="" aria-hidden="true">

      <div class="contexto-inner">
        <!-- Título -->
        <h1 class="contexto-title">CONTEXTO</h1>

        <!-- ===== Sección 1: Contexto ===== -->
        <section class="ctx-section ctx-section--intro">
          <div class="ctx-visual">
            <img :src="mariposasContexto" class="sec1-img" alt="" aria-hidden="true">
            <context-card
              class="card-floating card-mariposa"
              title="LA MARIPOSA"
              header-color="#342a83"
              :body="cards.mariposa"
              @expand="onExpand"
            />
          </div>
          <div class="ctx-text ctx-text--right">
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

        <!-- ===== Sección 2: Mitos y realidades ===== -->
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

        <!-- ===== Sección 3: Lo que pasa en mi estado ===== -->
        <section class="ctx-section">
          <div class="ctx-visual">
            <div class="overlap-images">
              <img :src="manoContexto1" class="overlap-img overlap-1" alt="" aria-hidden="true">
              <img :src="crisalidaContexto1" class="overlap-img overlap-2" alt="" aria-hidden="true">
              <img :src="manoContexto2" class="overlap-img overlap-3" alt="" aria-hidden="true">
            </div>
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

        <!-- ===== Sección 4: Campaña Niñez Primero (texto a la derecha) ===== -->
        <section class="ctx-section ctx-section--campaign">
          <div class="ctx-visual">
            <context-card
              class="card-floating card-trata"
              title="TRATA"
              header-color="#6a3d8f"
              :body="cards.trata"
              @expand="onExpand"
            />
          </div>
          <div class="ctx-text ctx-text--right">
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

        <!-- ===== Escena café: criaturas (fondo) + tarjetas flotantes ===== -->
        <div class="cafe-block">
          <!-- Criaturas decorativas (funcionan como fondo) -->
          <img :src="trataContexto" class="cafe-creature cafe-trata" alt="" aria-hidden="true">
          <img :src="reclutamientoContexto" class="cafe-creature cafe-recl" alt="" aria-hidden="true">

          <!-- Tarjetas flotantes sobre la escena café -->
          <context-card
            class="card-floating card-reclutamiento"
            title="EL RECLUTAMIENTO"
            header-color="#6a3d8f"
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

    <!-- ===== Pie de página ===== -->
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
    conceptDetails () {
      return {
        'LA MARIPOSA': { title: 'LA MARIPOSA', headerColor: '#342a83', body: this.cards.mariposa },
        'SEÑALES DE ALERTA': { title: 'SEÑALES DE ALERTA', headerColor: '#342a83', body: this.cards.senales },
        TRATA: { title: 'TRATA', headerColor: '#6a3d8f', body: this.cards.trata },
        'EL RECLUTAMIENTO': { title: 'EL RECLUTAMIENTO', headerColor: '#6a3d8f', body: this.cards.reclutamiento },
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
          headerColor: '#6a3d8f',
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
    Paleta: Crema #efeee8 · Azul #342a83 · Morado #6a3d8f · Magenta #b62b86
    Café (escena inferior) #6b5742 / #5a4a37
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

  /* Degradado de fondo: crema arriba (~55%) → café abajo (~45%) */
  .contexto-main {
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      to bottom,
      #efeee8 0%,
      #efeee8 50%,
      #6b5742 70%,
      #5a4a37 100%
    );
  }

  /* ===============================
    CAPAS DE FONDO
  ================================ */
  /* Manos enredadas: segunda capa al fondo, sobre la zona café */
  .bg-manos {
    position: absolute;
    left: 50%;
    bottom: 220px;
    transform: translateX(-50%);
    width: 1100px;
    max-width: 96%;
    height: auto;
    opacity: 0.85;
    z-index: 0;
    pointer-events: none;
  }

  /* Consumidor (nichos): tercera capa, siempre pegada al pie de página (abajo-izquierda) */
  .bg-consumidor {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 300px;
    max-width: 34%;
    height: auto;
    z-index: 0;
    pointer-events: none;
  }

  .contexto-inner {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 80px;
  }

  /* ===============================
    TÍTULO
  ================================ */
  .contexto-title {
    font-family: 'Chelsea Market', cursive;
    font-weight: 400;
    color: #b62b86;
    font-size: clamp(34px, 6vw, 64px);
    text-align: right;
    margin: 8px 0 12px;
  }

  /* ===============================
    SECCIONES (2 columnas: visual izq / texto der)
  ================================ */
  .ctx-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    align-items: center;
    margin-bottom: 56px;
  }

  /* Sección intro (Contexto): encabezado pegado al título, alineado arriba */
  .ctx-section--intro {
    align-items: start;
    margin-top: -8px;
  }

  /* Baja la imagen de mariposas ~10% del alto del título para alinearla con
     el borde inferior de "CONTEXTO" sin mover la columna de texto */
  .ctx-section--intro .ctx-visual {
    padding-top: 10px;
  }

  .ctx-visual {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ctx-text {
    position: relative;
    z-index: 3;
  }

  .ctx-text--right {
    text-align: right;
  }

  .ctx-heading {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 800;
    color: #342a83;
    font-size: clamp(16px, 2.2vw, 22px);
    line-height: 1.25;
    margin: 0 0 14px;
  }

  .ctx-paragraph {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 400;
    color: #342a83;
    font-size: clamp(13px, 1.6vw, 16px);
    line-height: 1.5;
    margin: 0 0 16px;
  }

  .leer-mas {
    font-family: 'Noto Sans', sans-serif;
    font-weight: 800;
    letter-spacing: 1px;
    color: #ed712c;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-size: clamp(13px, 1.6vw, 16px);
  }

  .leer-mas span {
    color: #ed712c;
    font-weight: 900;
  }

  .leer-mas:hover {
    color: #342a83;
  }

  /* ===============================
    IMÁGENES DECORATIVAS POR SECCIÓN
  ================================ */
  .sec1-img {
    width: 520px;
    max-width: 100%;
    height: auto;
  }

  /* Mariposas con inclinación de derecha a izquierda (≈ -45°) */
  .sec2-img {
    width: 300px;
    max-width: 80%;
    height: auto;
    transform: rotate(-45deg);
  }

  /* Tres imágenes sobrepuestas (manos + crisálida) */
  .overlap-images {
    position: relative;
    width: 360px;
    max-width: 100%;
    height: 320px;
  }

  .overlap-img {
    position: absolute;
    height: auto;
  }

  .overlap-1 {
    width: 250px;
    left: 0;
    top: 40px;
    z-index: 1;
  }

  .overlap-2 {
    width: 170px;
    left: 95px;
    top: 0;
    z-index: 3;
  }

  .overlap-3 {
    width: 230px;
    right: 0;
    top: 120px;
    z-index: 2;
    transform: scaleX(-1);
  }

  /* ===============================
    TARJETAS FLOTANTES
  ================================ */
  .card-floating {
    position: relative;
    z-index: 4;
  }

  .card-mariposa {
    margin-top: -40px;
  }

  .card-senales {
    margin-top: -10px;
  }

  /* ===============================
    ESCENA CAFÉ (criaturas de fondo + tarjetas)
  ================================ */
  .cafe-block {
    position: relative;
    min-height: 860px;
    margin-top: 24px;
  }

  /* Criaturas: actúan como fondo de la escena café */
  .cafe-creature {
    position: absolute;
    height: auto;
    z-index: 0;
    pointer-events: none;
  }

  /* Trata (criatura con cuernos): zona superior-izquierda */
  .cafe-trata {
    left: -2%;
    top: 0;
    width: 46%;
  }

  /* Reclutamiento (criatura enojada): zona central-derecha */
  .cafe-recl {
    right: -2%;
    top: 240px;
    width: 50%;
  }

  /* Tarjetas de la escena café (posicionadas sobre las criaturas) */
  .card-reclutamiento {
    position: absolute;
    left: 30%;
    top: 300px;
  }

  .card-crisalida {
    position: absolute;
    right: 4%;
    top: 470px;
  }

  .card-consumidor {
    position: absolute;
    left: 2%;
    bottom: 0;
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
    position: relative;
    z-index: 1;
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

  /* Mobile + Mobile landscape: una sola columna, escena café apilada */
  @media (max-width: 767.98px) {
    .ctx-section {
      grid-template-columns: 1fr;
      gap: 20px;
      margin-bottom: 40px;
    }
    .ctx-text,
    .ctx-text--right {
      text-align: center;
    }
    .contexto-title {
      text-align: center;
    }
    .card-floating {
      margin: -20px auto 0 !important;
    }

    /* La escena café pasa a flujo vertical: criaturas como fondo tenue */
    .cafe-block {
      min-height: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      padding-bottom: 200px;
    }
    .cafe-creature {
      opacity: 0.3;
    }
    .cafe-trata {
      width: 70%;
      top: 60px;
      left: 0;
    }
    .cafe-recl {
      width: 75%;
      top: 360px;
      right: 0;
    }
    .card-reclutamiento,
    .card-crisalida,
    .card-consumidor {
      position: relative;
      left: auto;
      right: auto;
      top: auto;
      bottom: auto;
      margin: 0 auto;
    }
    .bg-consumidor {
      width: 150px;
      max-width: 44%;
    }
    .bg-manos {
      bottom: 280px;
      width: 130%;
      max-width: 130%;
      opacity: 0.5;
    }
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .contexto-inner {
      max-width: 900px;
    }
    .cafe-block {
      min-height: 760px;
    }
    .cafe-trata {
      width: 50%;
    }
    .cafe-recl {
      width: 54%;
      top: 210px;
    }
    .card-reclutamiento {
      left: 28%;
      top: 270px;
    }
    .card-crisalida {
      right: 2%;
      top: 430px;
    }
  }

  /* Desktop */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .cafe-block {
      min-height: 840px;
    }
  }

  /* Extra Large */
  @media (min-width: 1200px) {
    .contexto-inner {
      max-width: 1200px;
    }
    .cafe-block {
      min-height: 900px;
    }
    .cafe-recl {
      top: 280px;
    }
    .card-crisalida {
      top: 520px;
    }
  }
</style>
