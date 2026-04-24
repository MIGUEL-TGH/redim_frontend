<template>

  <div class="popup-wrapper" v-show="internalDialog">
    <div class="deck-container">
      <div class="card-blue elevation-10">
        <!-- <div class="d-flex justify-end mb-1">
          <v-icon color="#efeee8" x-large>mdi-close</v-icon>
        </div> -->
        <div class="d-flex justify-end mb-1">
          <v-btn icon @click="internalDialog = false"> <v-icon color="#efeee8" x-large>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-row align="center" no-gutters>
          <v-col cols="12" md="5" class="mb-2 mb-md-0">
            <div class="text-h6 font-weight-bold title-text">
              <!-- {{ stateData ? stateData.name.toUpperCase() : '...' }} -->
              PUEBLA
            </div>
            <div class="subtitle-text mt-1">
              Trata de personas de 0 a 17 años en México, 2025
            </div>
          </v-col>

          <v-col cols="12" md="7" class="text-md-right text-left">
            <v-row class="ma-0 stats-row" dense align="center" no-gutters>
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
                    aspect-ratio="0.5625" class="rounded-lg elevation-3"
                    style="aspect-ratio: 16/9; height: 200px; width: 100%;"
                  ></v-img>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <!-- <h3 class="text-h5 mb-4" style="color: #342a83; font-weight: 700;">Título del Boletín Estatal</h3> -->
                  <p class="text-body-2 text-justify" style="color: #342a83;">
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

          <!-- <div class="text-right" style="padding-right: 25px;">
            <v-icon color="#6a3d8f" x-large>mdi-minus</v-icon>
          </div> -->
          <div class="text-right pr-6 mt-2">
            <v-btn icon>
              <v-icon color="#6a3d8f" x-large>mdi-minus</v-icon>
            </v-btn>
          </div>
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
    position: fixed; /* Asegura que flote sobre toda la pantalla */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* El truco mágico para centrar perfecto */
    z-index: 1000;
    width: 90%; /* Opcional: para que no pegue en los bordes en móviles */
    max-width: 800px; /* O el ancho máximo que prefieras */
  }

  /* Quita el espacio forzado entre tabs */
  .compact-tab {
    min-width: auto !important;
    padding: 0 12px !important;
  }

  /* Reduce el padding general del contenedor blanco */
  /* .card-white-wrapper {
    padding: 10px !important;
  } */

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

  /* .popup-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
    width: 700px;
    z-index: 1000;
  } */

  .deck-container {
    display: flex;
    flex-direction: column;
  }
  /* --- TARJETA AZUL --- */
  .card-blue {
    background-color: #342a83;
    color: #ffffff;
    border-radius: 15px;
    padding: 15px 30px;
    position: relative;
    z-index: 2; /* Siempre encima de la blanca */
  }

  .title-text {
    line-height: 1.1;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    overflow: hidden !important;
  }

  .subtitle-text {
    color: #efeee8; /* Blanco-gris para contrastar suavemente */
    line-height: 1.5;
    font-size: 0.7rem !important;
  }

  .source-text {
    font-size: 11px;
    opacity: 0.7;
  }

  /* --- TARJETA BLANCA --- */
  .card-white-wrapper {
    background-color: #efeee8;
    border-radius: 0 0 15px 15px;
    margin-top: -15px; /* Sube la tarjeta blanca para esconderse bajo la azul */
    /* Compensa el espacio comido por el margen negativo */
    /* padding-top: 20px;
    padding-bottom: 0px !important; */
    padding: 10px 20px;
    position: relative;
    z-index: 1; /* Por debajo de la tarjeta azul */
  }

  .card-white {
    color: #342a83; /* Texto azul para combinar */
    font-size: 15px;
  }

  /* ======================================================================================================================================== */

  .dialog-wrapper {
    overflow: hidden; /* Para que la tarjeta azul no pierda sus bordes redondos si aplica */
  }

  /* =================== TABS & CONTENIDO =================== */
  .card-white-wrapper {
    background-color: #efeee8; /* Fondo blanco-gris de la interfaz */
    min-height: 60vh; /* Asegura que el pop-up tenga buena altura */
  }

  .transparent-bg {
    background-color: transparent !important;
  }

  /* Sobrescribir estilos de Tabs para un look más limpio */
  .v-tab {
    font-weight: 700;
    letter-spacing: 1px;
  }
</style>
