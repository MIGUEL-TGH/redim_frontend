<!-- <template>
  <div>
    <h1> TemplateView Welcome </h1>
  </div>
</template> -->

<template>
  <v-dialog
    v-model="internalDialog"
    max-width="1000"
    :fullscreen="$vuetify.breakpoint.smAndDown"
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="dialog-wrapper">
      <v-btn icon absolute top right z-index="10" @click="closeDialog" color="white" class="mt-2 mr-2">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div class="card-blue pa-5 elevation-4">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="7" class="mb-2 mb-md-0">
            <div class="text-h4 font-weight-bold title-text">
              {{ stateData ? stateData.name.toUpperCase() : '...' }}
            </div>
            <div class="subtitle-text mt-1">
              Trata de personas de 0 a 17 años en México, 2025
            </div>
          </v-col>

          <v-col cols="12" md="5" class="text-md-right text-left">
            <span class="text-h6 font-weight-bold mr-4">
              {{ (stateData && stateData.woman) ? stateData.woman : 0 }} MUJERES
            </span>
            <span class="text-h6 font-weight-bold">
              {{ (stateData && stateData.man) ? stateData.man : 0 }} HOMBRES
            </span>
          </v-col>
        </v-row>
      </div>

      <v-card-text class="card-white-wrapper pa-0" style="background-color: #efeee8;">
        <v-tabs v-model="tab" color="#ed712c" background-color="transparent" centered grow icons-and-text>
          <v-tab>BOLETÍN</v-tab>
          <v-tab>GALERÍA</v-tab>
          <v-tab>VIDEOS</v-tab>
          <v-tab>CASOS</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab" class="transparent-bg pa-5">

          <!-- BOLETÍN -->
          <v-tab-item>
            <v-row>
              <!-- <v-col cols="12" sm="4" md="3"> -->
              <v-col cols="12" sm="12" md="12">
                <v-img
                  src="https://picsum.photos/300/533"
                  aspect-ratio="0.5625"
                  class="rounded-lg elevation-3"
                  style="aspect-ratio: 16/9; height: 300px;"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="8" md="9">
                <h3 class="text-h5 mb-4" style="color: #342a83; font-weight: 700;">Título del Boletín Estatal</h3>
                <p class="text-body-1 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p class="text-body-1 text-justify">
                  Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
                </p>
              </v-col>
            </v-row>
          </v-tab-item>

          <!-- GALERÍA -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="(img, index) in paginatedGallery" :key="'img-'+index">
                <v-card hover class="rounded-lg">
                  <v-img :src="img.src" height="200" class="align-end"></v-img>
                  <v-card-title class="text-subtitle-1 font-weight-bold pb-0">{{ img.title }}</v-card-title>
                  <v-card-subtitle class="pt-1 pb-3">{{ img.subtitle }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
            <div class="text-center mt-4">
              <v-pagination v-model="galleryPage" :length="galleryPages" color="#ed712c" circle></v-pagination>
            </div>
          </v-tab-item>

          <!-- VIDEOS -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="(vid, index) in paginatedVideos" :key="'vid-'+index">
                <v-card hover class="rounded-lg" @click="openVideo(vid.url)">
                  <v-img :src="vid.thumb" height="200" class="align-center text-center">
                    <v-icon size="64" color="rgba(255, 255, 255, 0.8)">mdi-play-circle</v-icon>
                  </v-img>
                  <v-card-title class="text-subtitle-1 font-weight-bold pb-0">{{ vid.title }}</v-card-title>
                  <v-card-subtitle class="pt-1 pb-3">{{ vid.subtitle }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
            <div class="text-center mt-4">
              <v-pagination v-model="videoPage" :length="videoPages" color="#ed712c" circle></v-pagination>
            </div>
          </v-tab-item>

          <!-- CASOS -->
          <v-tab-item>
            <v-row>
              <v-col cols="12" md="5">
                <v-img src="https://picsum.photos/500/350" height="300" class="rounded-lg elevation-3 mb-4"></v-img>
                <div class="d-flex flex-wrap">
                  <v-chip color="#276acc" dark class="mr-2 mb-2">Trata de Personas</v-chip>
                  <v-chip color="#b62b86" dark class="mr-2 mb-2">Explotación</v-chip>
                  <v-chip color="#5db43d" dark class="mr-2 mb-2">Prevención</v-chip>
                </div>
              </v-col>
              <v-col cols="12" md="7">
                <h3 class="text-h5 mb-4" style="color: #342a83; font-weight: 700;">Descripción del Caso Analizado</h3>
                <p class="text-body-1 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem. Aliquam erat volutpat. Donec placerat nisl magna, et faucibus arcu condimentum sed. Suspendisse sodales imperdiet eros vel eleifend.
                </p>
                <p class="text-body-1 text-justify">
                  Praesent non rutrum purus. Sed eget nisl dictum, commodo metus congue, lobortis libero. Proin at dui volutpat, egestas purus fringilla, ullamcorper erat. Curabitur hendrerit nisl id metus accumsan, nec accumsan mauris suscipit. Cras in massa sed nisi fringilla vestibulum ut eget enim.
                </p>
              </v-col>
            </v-row>
          </v-tab-item>

        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
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
        subtitle: 'Subtítulo descriptivo de la imagen y contexto.'
      })),
      mockVideos: Array.from({ length: 14 }).map((_, i) => ({
        thumb: `https://picsum.photos/400/300?random=${i + 50}`, // Miniatura del video
        title: `Video Reportaje ${i + 1}`,
        subtitle: 'Análisis y estadísticas de la zona.',
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
  /* Personalizar estilos aquí */
  .dialog-wrapper {
    overflow: hidden; /* Para que la tarjeta azul no pierda sus bordes redondos si aplica */
  }

  /* =================== CARD AZUL =================== */
  .card-blue {
    background-color: #342a83;
    color: #ffffff;
    position: relative;
  }

  .title-text {
    line-height: 1.1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .subtitle-text {
    color: #efeee8; /* Blanco-gris para contrastar suavemente */
    font-size: 0.9rem;
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
