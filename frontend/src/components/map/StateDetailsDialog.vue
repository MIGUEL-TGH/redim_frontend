<template>

  <div class="popup-wrapper" v-show="internalDialog">
    <div class="deck-container">
      <div class="card-blue elevation-10">

        <div class="d-flex justify-end mb-1">
          <v-btn icon @click="internalDialog = false">
            <v-icon color="#efeee8" x-large>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-row align="center" no-gutters>
          <v-col cols="12" md="5" class="mb-3 mb-md-0 text-center text-md-left">
            <div class="text-h6 font-weight-bold title-text">
              <!-- {{ stateData ? stateData.name.toUpperCase() : '...' }} -->
              PUEBLA
            </div>
            <div class="subtitle-text mt-1">
              Trata de personas de 0 a 17 años en México, 2025
            </div>
          </v-col>

          <v-col cols="12" md="7" class="text-center text-md-right">
            <v-row class="ma-0 stats-row" dense align="center" justify="center" justify-md="end" no-gutters>
              <v-col cols="6" class="text-center pa-1 stats-border-right">
                <br>
                <span class="text-h6 font-weight-bold">
                  <!-- {{ (stateData && stateData.woman) ? stateData.woman : 0 }} MUJERES -->
                  10
                </span>
                <span class="text-h6"> MUJERES</span>
              </v-col>
              <v-col cols="6" class="text-center pa-1">
                <br>
                <span class="text-h6 font-weight-bold">
                  <!-- {{ (stateData && stateData.man) ? stateData.man : 0 }} HOMBRES -->
                    25
                </span>
                <span class="text-h6"> HOMBRES</span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="text-right mt-1">
          <em class="source-text">SESNSP</em>
        </div>

      </div>

      <div class="card-white-wrapper elevation-5">
        <div class="card-white pa-2 justify-center align-center" >
          <v-tabs v-model="tab" color="#342a83" hide-slider background-color="transparent" centered>
            <v-tab class="compact-tab">BOLETÍN</v-tab>
            <v-tab class="compact-tab">GALERÍA</v-tab>
            <v-tab class="compact-tab">VIDEOS</v-tab>
            <v-tab class="compact-tab">CASOS</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" class="transparent-bg pa-5">

            <!--1. BOLETÍN -->
            <v-tab-item>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-img src="https://picsum.photos/300/533"
                    class="rounded-lg elevation-5"
                    style="aspect-ratio: 16/9; height: 150px; width: 100%;"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <!-- <h3 class="text-h5 mb-4" style="color: #342a83; font-weight: 700;">Título del Boletín Estatal</h3> -->
                  <p class="text-description text-justify" style="color: #342a83;">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p class="text-body-2 text-justify" style="color: #342a83;">
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                  </p>
                </v-col>
              </v-row>
            </v-tab-item>

            <!--2. GALERÍA -->
            <v-tab-item>
              <div class="custom-gray-border" style="padding: 10px;">
                <div class="scroll-container">
                  <v-row>
                    <v-col cols="12" sm="6" md="4" v-for="(img, index) in paginatedGallery" :key="'img-'+index">
                      <v-card flat color="transparent" class="pa-2 text-center">
                        <v-img :src="img.src" class="align-end rounded-lg" style="height: 250px; width: 100%;"></v-img>
                        <h5 class="mb-0" style="color: #342a83; padding-top: 10px;">
                          <em>"{{ img.title }}"</em>
                        </h5>
                        <div style="color: #342a83; line-height: 1.2; font-size: 12px;">
                          {{ img.subtitle }} <br> {{ img.years }} años
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="text-center mt-4">
                <v-pagination v-model="galleryPage" :length="galleryPages" color="#ed712c" circle></v-pagination>
              </div>

            </v-tab-item>

            <!--3. VIDEOS -->
            <v-tab-item>
              <div class="custom-gray-border" style="padding: 10px;">
                <div class="scroll-container">
                  <v-row no-gutters>
                    <v-col cols="12" sm="6" md="6" v-for="(vid, index) in paginatedVideos" :key="'vid-'+index">
                      <v-card flat color="transparent" class="pa-2 text-left" @click="openVideo(vid.url)">
                        <v-img :src="vid.thumb" class="align-center text-center rounded-lg" style="aspect-ratio: 16/9 !important; height: 150px; width: 100%;">
                          <v-icon size="64" color="rgba(255, 255, 255, 0.8)">mdi-play-circle</v-icon>
                        </v-img>
                        <h5 class="font-weight-bold" style="color: #342a83; padding-top: 10px;">
                          <em>"{{ vid.title }}"</em>
                        </h5>
                        <p class="text-body-2 pt-1 pb-0" style="color: #342a83;">
                          {{ vid.subtitle }}
                        </p>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </div>

              <div class="text-center mt-4">
                <v-pagination v-model="videoPage" :length="videoPages" color="#ed712c" circle></v-pagination>
              </div>
            </v-tab-item>

            <!--4. CASOS -->
            <v-tab-item>
              <v-row>
                <v-col cols="12" md="5">
                  <!-- FlorMolina_1.png -->
                  <!-- <v-img src="https://picsum.photos/500/350" height="300" class="rounded-lg elevation-3 mb-4"></v-img> -->
                  <v-img src="@/assets/logos/FlorMolina_1.png" class="rounded-lg mb-4" style="width: 100%;"></v-img>
                  <div class="d-flex flex-wrap">
                    <v-chip outlined color="#c4ac9c" class="mr-2 mb-2 multiline-chip">ORGANIZACIÓN INTERNACIONAL LAS MIGRACIONES (OIM)</v-chip>
                    <v-chip outlined color="#c4ac9c" class="mr-2 mb-2 multiline-chip">COALICIÓN PARA ABOLIR LA ESCLAVITUD Y TRATA (CAST)</v-chip>
                  </div>
                </v-col>
                <v-col cols="12" md="7">
                  <v-img src="@/assets/logos/FlorMolina_2.png" style="width: 100%;"></v-img>
                  <!-- <h3 class="text-h5 mb-4" style="color: #342a83; font-weight: 700;">Descripción del Caso Analizado</h3>
                  <p class="text-body-1 text-justify">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et faucibus arcu condimentum sed. Suspendisse sodales imperdiet eros vel eleifend.
                  </p>
                  <p class="text-body-1 text-justify">
                    Praesent non rutrum purus. Sed eget nisl dictum, commodo metus congue, lobortis libero. Proin at dui volutpat, egestas purus fringilla, ullamcorper erat. Curabitur hendrerit nisl id metus accumsan, nec accumsan mauris suscipit. Cras in massa sed nisi fringilla vestibulum ut eget enim.
                  </p> -->
                </v-col>
              </v-row>
            </v-tab-item>

          </v-tabs-items>

          <!-- <div class="text-right mt-1">
            <v-btn icon>
              <v-icon color="#6a3d8f" x-large>mdi-minus</v-icon>
            </v-btn>
          </div> -->

        </div>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  // 1️⃣ Identificación
  name: 'StateDetailsDialogView',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    stateData: {
      type: Object,
      default: () => null
    }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      tab: 0,

      // Control de Paginación
      itemsPerPage: 6,
      galleryPage: 1,
      videoPage: 1,

      // --- MOCK DATA PARA LA ESTRUCTURA ---
      // (Se reemplazará con datos reales de tu backend)
      mockGallery: Array.from({ length: 15 }).map((_, i) => ({
        src: `https://picsum.photos/400/300?random=${i}`,
        title: `Galería Imagen ${i + 1}`,
        // subtitle: 'Subtítulo descriptivo de la imagen y contexto.'
        subtitle: 'Subtítulo descriptivo',
        years: i + 5
      })),
      mockVideos: Array.from({ length: 14 }).map((_, i) => ({
        thumb: `https://picsum.photos/400/300?random=${i + 50}`, // Miniatura del video
        title: `REDIM: Reportaje sobre trata y reclutamiento de niñas, niños y adolescentes ${i + 1}`,
        subtitle: `${2020 + 2}`,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Enlace a YouTube
      }))
    }
  },
  computed: {
    // Sincroniza la visibilidad del v-dialog con el padre
    internalDialog: {
      get () {
        return this.dialog
      },
      set (val) {
        this.$emit('update:dialog', val)
      }
    },

    // --- LÓGICA DE PAGINACIÓN ---
    galleryPages () {
      return Math.ceil(this.mockGallery.length / this.itemsPerPage)
    },
    paginatedGallery () {
      const start = (this.galleryPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.mockGallery.slice(start, end)
    },

    videoPages () {
      return Math.ceil(this.mockVideos.length / this.itemsPerPage)
    },
    paginatedVideos () {
      const start = (this.videoPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.mockVideos.slice(start, end)
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    closeDialog () {
      this.internalDialog = false
      // Reseteamos tabs y páginas al cerrar
      setTimeout(() => {
        this.tab = 0
        this.galleryPage = 1
        this.videoPage = 1
      }, 300)
    },
    openVideo (url) {
      // Abre el video en una nueva pestaña
      window.open(url, '_blank')
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

  .popup-wrapper {
    position: fixed; /* Mejor fixed para que siempre esté sobre el mapa */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }

  .deck-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 95vh;
  }

  .card-blue {
    background-color: #342a83;
    color: #ffffff;
    border-radius: 15px;
    position: relative;
    z-index: 2;
  }

  .title-text {
    line-height: 1.1;
    font-weight: bold;
  }

  .text-description {
    font-size: 1rem !important;
  }

  /* --- TARJETA BLANCA --- */
  .card-white-wrapper {
    background-color: #efeee8;
    border-radius: 0 0 15px 15px;
    margin-top: -15px;
    padding-top: 20px;

    /* Flexbox para que este contenedor crezca y se encoja correctamente */
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    overflow-y: auto; /* IMPORTANTE: Aquí se genera el scroll */

    /* Ajuste para pantallas con poca altura (Laptops pequeñas) */
    max-height: calc(95vh - 120px); /* Restamos el espacio aproximado de la cabecera azul */
  }

  /* ======================================================================================= */

  /* Quita el espacio forzado entre tabs */
  .compact-tab {
    min-width: auto !important;
    padding: 0 12px !important;
  }

  .scroll-container {
    max-height: 320px; /* Ajusta esta altura a tu gusto */
    overflow-y: auto;
    overflow-x: hidden;
  }

  .custom-gray-border {
    border: 1px solid #d3d3d3 !important; /* Borde gris sutil */
    border-radius: 12px !important; /* Bordes redondos */
  }

  .multiline-chip {
    height: auto !important; /* Permite que crezca hacia abajo */
    white-space: normal !important; /* Permite el salto de línea */
    padding: 8px 12px !important; /* Da aire al texto */
    text-align: center;
  }

  /* ======================================================================================= */

  .subtitle-text {
    color: #efeee8; /* Blanco-gris para contrastar suavemente */
    line-height: 1.5;
    font-size: 0.7rem !important;
  }

  .source-text {
    font-size: 11px;
    opacity: 0.7;
  }

  .card-white {
    color: #342a83; /* Texto azul para combinar */
    font-size: 15px;
  }

  .transparent-bg {
    background-color: transparent !important;
  }

  .v-tab {
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* ======================================================================================================================================== */

  /* Mobile */
  /* @media (max-width: 767.98px) {  } */
  /* Tablet */
  /* @media (min-width: 768px) and (max-width: 991.98px) { } */
  /* Desktop */
  /* @media (min-width: 992px) and (max-width: 1199.98px) { } */
  /* Large Desktop */
  /* @media (min-width: 1200px) { } */

  /* Mobile (Teléfonos en vertical y horizontal) */
@media (max-width: 767.98px) {
  .popup-wrapper {
    width: 95%; /* Ocupa casi toda la pantalla */
  }
  .card-blue {
    padding: 12px 15px;
  }
  .title-text {
    font-size: 1rem !important; /* Texto más pequeño */
    text-align: center; /* Centrado forzoso en móviles */
  }
  /* .card-white-wrapper {
    padding-left: 10px;
    padding-right: 10px;
    max-height: 55vh;
  } */
}

/* Tablet (iPads, tabletas Android) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .popup-wrapper {
    width: 85%;
    max-width: 700px;
  }
  .card-blue {
    padding: 15px 25px;
  }
  .title-text {
    font-size: 1.15rem !important;
  }
  /* .card-white-wrapper {
    padding-left: 20px;
    padding-right: 20px;
    max-height: 60vh;
  } */
}

/* Desktop (Laptops estándar) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .popup-wrapper {
    width: 70%;
    max-width: 800px;
  }
  .card-blue {
    padding: 20px 30px;
  }
  .title-text {
    font-size: 1.25rem !important; /* Tamaño normal text-h6 */
  }
  /* .card-white-wrapper {
    padding-left: 30px;
    padding-right: 30px;
    max-height: 20vh;
  } */
}

/* Large Desktop (Monitores grandes y PCs de escritorio) */
@media (min-width: 1200px) {
  .popup-wrapper {
    width: 60%;
    max-width: 600px; /* En pantallas gigantes no pasará de 900px */
  }
  .card-blue {
    padding: 20px 35px; /* Más espacio para respirar */
  }
  .title-text {
    font-size: 1.35rem !important; /* Título ligeramente más grande */
  }
  .card-white-wrapper {
    padding-left: 10px;
    padding-right: 10px;
    max-height: 52vh;
  }
  .text-description {
    font-size: 0.75rem !important;
  }
}

/* ======================================================================================================================================== */
@media (max-height: 600px) {
  .card-white-wrapper {
    max-height: calc(90vh - 100px);
  }
  .title-text {
    font-size: 0.9rem !important; /* Achicamos texto para ganar espacio vertical */
  }
}
</style>
