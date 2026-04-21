<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <custom-navbar />
      <!-- <span class="ml-2 font-weight-bold">REDIM</span> -->
      <v-spacer></v-spacer>
      <img src="@/assets/logos/Isologo.png" alt="Logo Niñez Primero">
    </v-app-bar>

    <div class="map-wrapper">
      <div id="viewDiv" ref="mapView"></div>

      <logos-cards
        @zoom-in="handleZoomIn"
        @zoom-out="handleZoomOut"
        @go-home="handleGoHome"
      />

      <left-filter-deck
        ref="filterDeck"

        :indicators="indicators"
        :states="states"
        :years="years"
        :genders="genders"
        :categories="categories"

        @fetch-categories="getCategories"
        @submit="handleSubmit"
        @clear-categories="categories = []"
        @show-cards="setShowCards"
      />

      <hover-popup-card
        ref="hoverPopup"
        :hoverInfo="hoverInfo"
      />

      <state-details-dialog
        :dialog.sync="dialogState"
        :stateData="clickedStateData"
      />

      <!-- PANEL ESTADÍSTICO -->
      <div class="stats-panel">
        <!-- <stack-cards :category_details="category_details"/> -->
        <stack-cards
          v-show="isCardOpen"
          ref="stackCardsRef"

          :chartDataYear="chartDataYear"
          :chartDataGender="chartDataGender"
          :chartDataState="chartDataState"

          @toggle-card="handleCardOpened"
        />
      </div>

      <!-- <div ref="hoverPopup" v-show="hoverInfo.show" class="custom-hover-popup elevation-5" style="position: absolute; top: 0; left: 0; will-change: transform;" >
        <div class="font-weight-bold">{{ hoverInfo.data ? hoverInfo.data.name : '...' }}</div>
         <v-divider class="my-1"></v-divider>
        <div class="caption">
          <strong> SESNSP, Trata de personas de 0 a 17 años en México, 2025 </strong> <br>
          <strong> {{ hoverInfo.data ? hoverInfo.data.name : '...' }} </strong> <br>
          Hombres: {{ hoverInfo.data ? hoverInfo.data.man : 0 }}<br>
          Mujeres: {{ hoverInfo.data ? hoverInfo.data.woman : 0 }}
        </div>
      </div> -->

      <v-dialog v-model="dialog_rules.actived" scrollable max-width="800px">
          <v-card>
            <!-- <v-card-text> -->
              <!-- <img :src="dialog_rules.image" style="max-width: 100%; height: auto;" elevation="5"> -->
              <img src="@/assets/logos/Tutorial.jpg" style="max-width: 100%; height: auto;">
              <!-- <img src="https://picsum.photos/200/300?random=1" style="max-width: 100%; height: auto;"> -->
            <!-- </v-card-text> -->
          </v-card>
      </v-dialog>

      <!-- <v-dialog v-model="dialogState" max-width="900" :fullscreen="$vuetify.breakpoint.smAndDown">
        <v-card v-if="selectedStateData">
          <v-toolbar color="#342a83" dark flat>
            <v-toolbar-title>Información: {{ selectedStateData.state_name }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialogState = false"><v-icon>mdi-close</v-icon></v-btn>
          </v-toolbar>

          <v-card-text v-if="!selectedStateData.has_content" class="text-center py-10">
            <v-icon size="64" color="grey lighten-1">mdi-information-off-outline</v-icon>
            <h3 class="grey--text mt-4">Información no disponible por el momento para este estado.</h3>
          </v-card-text>

          <v-tabs v-else v-model="tab" color="#ed712c" centered>
            <v-tab>Boletín</v-tab>
            <v-tab :disabled="!selectedStateData.gallery.length">Galería</v-tab>
            <v-tab :disabled="!selectedStateData.videos.length">Videos</v-tab>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat class="pa-4">
                  <h2 class="mb-2">{{ selectedStateData.bulletin.title }}</h2>
                  <p class="caption grey--text">{{ selectedStateData.bulletin.date }}</p>
                  <v-img v-if="selectedStateData.bulletin.cover_image" :src="selectedStateData.bulletin.cover_image" height="300" class="mb-4 rounded"></v-img>
                  <p class="font-weight-bold">{{ selectedStateData.bulletin.summary }}</p>
                  <div v-html="selectedStateData.bulletin.body"></div> </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card flat class="pa-4">
                  <v-row>
                    <v-col v-for="(img, i) in selectedStateData.gallery" :key="i" cols="12" sm="6" md="4">
                      <v-card hover>
                        <v-img :src="img.url" height="200" contain></v-img>
                        <v-card-subtitle class="text-center">{{ img.caption }}</v-card-subtitle>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card flat class="pa-4">
                  <v-row>
                    <v-col v-for="(vid, i) in selectedStateData.videos" :key="i" cols="12" md="6">
                      <iframe width="100%" height="250" :src="vid.url_iframe" frameborder="0" allowfullscreen></iframe>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </v-dialog> -->

      <!-- MODO DESARROLLO -->
      <!-- <div style="position: absolute; bottom: 20px; left: 20px; z-index: 90; background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px;" class="elevation-4">
        <div class="caption font-weight-bold mb-2">Estrategia de Hover (Pruebas)</div>
        <v-radio-group v-model="hoverStrategy" hide-details class="mt-0">
          <v-radio label="Relleno Nativo (Highlight)" value="native-highlight"></v-radio>
          <v-radio label="Contorno Simplificado (Rápido)" value="generalized-outline"></v-radio>
          <v-radio label="Contorno Crudo (Pesado)" value="raw-outline"></v-radio>
        </v-radio-group>
      </div> -->

    </div>

    <loader-comp />
    <view-notifications-comp ref="notifier"/>
    <!-- <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ipsum cumque aspernatur amet nesciunt alias reiciendis! Ab eum officiis laudantium earum velit iure totam quod beatae dolorem! Nam, ex cumque.</h1> -->
  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'
import StackCards from '@/components/map/StackCards.vue'
import LogosCards from '@/components/map/LogosCards.vue'
import CustomNavbar from '@/components/map/CustomNavbar.vue'
import LeftFilterDeck from '@/components/map/LeftFilterDeck.vue'
import HoverPopupCard from '@/components/map/HoverPopupCard.vue'
import StateDetailsDialog from '@/components/map/StateDetailsDialog.vue'

import '@/assets/css/style_maps.css'
import '@/assets/css/style_notifications.css'

import '@arcgis/core/assets/esri/themes/light/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
// import Expand from '@arcgis/core/widgets/Expand'
// import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import Point from '@arcgis/core/geometry/Point'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Basemap from '@arcgis/core/Basemap'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'

// import Tables from '@/js/20242030/tables.js'
// import Charts from '@/js/charts.js'
// import ChartComp from '@/components/ChartComp.vue'

import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  // 1️⃣ Identificación
  name: 'ArcGISMap',
  components: { // Importación de componentes hijos
    LoaderComp,
    viewNotificationsComp,
    StackCards,
    LogosCards,
    CustomNavbar,
    // ChartComp,
    LeftFilterDeck,
    HoverPopupCard,
    StateDetailsDialog
  },
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      // LeftFilterDeck =======================================================================
      category_details: [], // X
      indicators: [],
      categories: [],
      years: [],
      genders: [],
      states: [],

      // StackCards =======================================================================
      isCardOpen: false,
      chartDataYear: null,
      chartDataGender: null,
      chartDataState: null,

      // StateDetailsDialog =======================================================================
      dialogState: true, // Controla si el modal está abierto o cerrado
      clickedStateData: null, // Guarda la info del estado cliqueado
      // =========================================================================
      // map
      vectors: [
        'streets-navigation-vector',
        'streets-night-vector',
        'streets-relief-vector',
        'streets',
        'topo-vector',
        'satellite',
        'hybrid',
        'oceans',
        'terrain',
        'streets-vector',
        'osm',
        'topo',
        'dark-gray-vector',
        'gray-vector',
        'dark-gray',
        'gray'
      ],
      view: undefined,
      map: undefined,
      hoverLayer: null,
      capasInteractivas: [],
      lastHoveredId: null,
      hoverStrategy: 'generalized-outline', // 'generalized-outline', 'raw-outline', 'native-highlight'
      hoverInfo: {
        show: false,
        x: 0,
        y: 0,
        data: null
      },
      dataStates: [],
      // =========================================================================
      // vue
      dialog_rules: {
        actived: false,
        message: '',
        image: '@/assets/logos/NiñezPrimero-Placa.png'
      },
      // =========================================================================
      // vue data test
      tab: null,
      // dialogState: false,
      selectedStateData: {
        state_id: 15,
        state_name: 'Estado de México',
        has_content: true,
        bulletin: {
          title: 'Avances en la protección integral',
          date: '2025-10-20',
          summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit',
          body: 'Cuerpo completo de la noticia separado por párrafos... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          cover_image: 'https://picsum.photos/200/300?random=1'
        },
        gallery: [
          { url: 'https://picsum.photos/200/300?random=2', caption: 'Reunión de comité' },
          { url: 'https://picsum.photos/200/300?random=3', caption: 'Taller formativo' },
          { url: 'https://picsum.photos/200/300?random=4', caption: 'Evento comunitario' },
          { url: 'https://picsum.photos/200/300?random=5', caption: 'Campaña de difusión' },
          { url: 'https://picsum.photos/200/300?random=6', caption: 'Firma de convenio' },
          { url: 'https://picsum.photos/200/300?random=7', caption: 'Capacitación a policías' }
        ],
        videos: [
          { title: 'Campaña 2025', url_iframe: 'https://www.youtube.com/embed/J4jLgauOUPs?list=RDJ4jLgauOUPs' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'urlParams',
      'dialog_loader'
    ])
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    // vuex
    ...mapActions([
      'setSleep',
      'getParams'
    ]),

    // map ======================================================================================================================================
    handleZoomIn () { // +
      if (this.view) {
        // this.view.goTo({ scale: this.view.scale * 0.8 })
        this.view.goTo(
          { scale: this.view.scale * 0.8 },
          { duration: 800, easing: 'ease-in-out' }
        )
      }
    },
    handleZoomOut () { // -
      if (this.view) {
        // this.view.goTo({ scale: this.view.scale * 1.5 })
        this.view.goTo(
          { scale: this.view.scale * 1.5 },
          { duration: 800, easing: 'ease-in-out' }
        )
      }
    },
    handleGoHome () {
      if (this.view) {
        this.view.goTo(
          {
            center: [-106.98709444156532, 23.88462442879944],
            scale: 15000000
          },
          { duration: 1200, easing: 'ease-in-out' } // Un poco más lento para viajes largos
        )
      }
    },

    async loadDataMap () {
      // SESNSP, Trata de personas de 0 a 17 años en México, 2025
      const data = [
        { id: 1, name: 'Aguascalientes', man: 0, woman: 1, cve_ent: 1 },
        { id: 2, name: 'Baja California', man: 4, woman: 12, cve_ent: 2 },
        { id: 3, name: 'Baja California Sur', man: 3, woman: 4, cve_ent: 3 },
        { id: 4, name: 'Campeche', man: 0, woman: 1, cve_ent: 4 },
        { id: 5, name: 'Chiapas', man: 2, woman: 4, cve_ent: 7 },
        { id: 6, name: 'Chihuahua', man: 13, woman: 21, cve_ent: 8 },
        { id: 7, name: 'Ciudad de México', man: 6, woman: 16, cve_ent: 9 },
        { id: 8, name: 'Coahuila de Zaragoza', man: 1, woman: 2, cve_ent: 5 },
        { id: 9, name: 'Colima', man: 0, woman: 0, cve_ent: 6 },
        { id: 10, name: 'Durango', man: 0, woman: 0, cve_ent: 10 },
        { id: 11, name: 'Guanajuato', man: 2, woman: 3, cve_ent: 11 },
        { id: 12, name: 'Guerrero', man: 3, woman: 12, cve_ent: 12 },
        { id: 13, name: 'Hidalgo', man: 0, woman: 3, cve_ent: 13 },
        { id: 14, name: 'Jalisco', man: 5, woman: 0, cve_ent: 14 },
        { id: 15, name: 'México', man: 11, woman: 31, cve_ent: 15 },
        { id: 16, name: 'Michoacán de Ocampo', man: 0, woman: 1, cve_ent: 16 },
        { id: 17, name: 'Morelos', man: 0, woman: 3, cve_ent: 17 },
        { id: 18, name: 'Nayarit', man: 0, woman: 1, cve_ent: 18 },
        { id: 19, name: 'Nuevo León', man: 0, woman: 7, cve_ent: 19 },
        { id: 20, name: 'Oaxaca', man: 3, woman: 6, cve_ent: 20 },
        { id: 21, name: 'Puebla', man: 5, woman: 5, cve_ent: 21 },
        { id: 22, name: 'Querétaro', man: 0, woman: 0, cve_ent: 22 },
        { id: 23, name: 'Quintana Roo', man: 17, woman: 53, cve_ent: 23 },
        { id: 24, name: 'San Luis Potosí', man: 0, woman: 11, cve_ent: 24 },
        { id: 25, name: 'Sinaloa', man: 0, woman: 0, cve_ent: 25 },
        { id: 26, name: 'Sonora', man: 1, woman: 2, cve_ent: 26 },
        { id: 27, name: 'Tabasco', man: 0, woman: 5, cve_ent: 27 },
        { id: 28, name: 'Tamaulipas', man: 0, woman: 3, cve_ent: 28 },
        { id: 29, name: 'Tlaxcala', man: 0, woman: 0, cve_ent: 29 },
        { id: 30, name: 'Veracruz de Ignacio de la Llave', man: 2, woman: 2, cve_ent: 30 },
        { id: 31, name: 'Yucatán', man: 0, woman: 0, cve_ent: 31 },
        { id: 32, name: 'Zacatecas', man: 2, woman: 12, cve_ent: 32 }
      ]

      this.dataStates = data
    },
    async hoverLayers () {
      // console.log('hoverLayers() --> N1')

      // Asegurarnos de que el arreglo de capas interactivas existe
      if (!this.capasInteractivas || this.capasInteractivas.length === 0) return

      // Variables para controlar el Highlight Nativo
      let activeHighlightHandle = null
      let activeLayerView = null
      let isThrottled = false

      // Agregar la capa de gráficos para el resaltado oscuro
      this.hoverLayer = new GraphicsLayer({ title: 'CapaHover' })
      this.map.add(this.hoverLayer)

      this.view.on('pointer-move', async (event) => {
        // console.log('hoverLayers() --> N2', event)

        // 1. Mover el popup suavemente (Bypass a Vue)
        if (this.hoverInfo.show && this.$refs.hoverPopup) {
          // Cuando el elemento html esta en ArcGISMapView.vue (en el mismo componente)
          // this.$refs.hoverPopup.style.transform = `translate(${event.x + 15}px, ${event.y + 15}px)`

          // Cuando esta en otro componente (HoverPopupCard.vue)
          this.$refs.hoverPopup.$el.style.transform = `translate(${event.x + 50}px, ${event.y + -50}px)`
        }

        // 2. THROTTLE INTELIGENTE (Solo limita si ya estamos navegando por un estado)
        if (this.lastHoveredId !== null) {
          if (isThrottled) return
          isThrottled = true
          setTimeout(() => { isThrottled = false }, 40) // 40ms = movimiento súper fluido
        }

        // 3. Ejecutar HitTest buscando en las capas
        this.view.hitTest(event, { include: this.capasInteractivas }).then(async (response) => {
          // Filtramos para asegurar que encontramos un gráfico válido con el atributo CVE_ENT
          const validResults = response.results.filter(
            r => r.graphic && r.graphic.attributes && r.graphic.attributes.CVE_ENT
          )

          if (validResults.length === 0) {
            if (this.lastHoveredId !== null) {
              this.hoverLayer.removeAll()
              if (activeHighlightHandle) {
                activeHighlightHandle.remove()
                activeHighlightHandle = null
              }
              this.lastHoveredId = null
              this.hoverInfo.show = false
            }

            return
          }

          // console.log('hoverLayers() --> N3')

          if (response.results.length > 0) {
            const result = response.results[0]
            const graphic = result.graphic
            const cveEnt = graphic.attributes.CVE_ENT
            const currentLayer = graphic.layer

            if (this.lastHoveredId !== cveEnt) {
              this.lastHoveredId = cveEnt
              // 4.1. Limpieza de modos anteriores
              this.hoverLayer.removeAll()
              if (activeHighlightHandle) {
                activeHighlightHandle.remove()
                activeHighlightHandle = null
              }

              if (this.hoverStrategy === 'native-highlight') { // 4.2. Modalidad 1: Highlight Nativo de ArcGIS (Relleno completo)
                activeLayerView = await this.view.whenLayerView(currentLayer)
                activeHighlightHandle = activeLayerView.highlight(graphic)
              } else { // 4.3. Modalidad 2 y 3: Borde Dibujado (GraphicsLayer)
                let geometriaParaDibujar = graphic.geometry

                if (this.hoverStrategy === 'generalized-outline') { // 4.4. Modo Rápido (Simplificado)
                  const maxDeviation = this.view.resolution * 2 // 2
                  // console.log(maxDeviation)
                  geometriaParaDibujar = geometryEngine.generalize(graphic.geometry, maxDeviation, true)
                }

                // 5. Si es 'raw-outline', usa la geometriaParaDibujar original
                const highlightGraphic = new Graphic({
                  geometry: geometriaParaDibujar,
                  symbol: {
                    type: 'simple-fill',
                    color: [0, 0, 0, 0], // Transparente adentro
                    outline: { color: '#333333', width: 2.5 }
                  }
                })
                this.hoverLayer.add(highlightGraphic)
              }

              // 6. Actualización de la Información del Pop-up
              this.view.container.style.cursor = 'pointer'
              const cveEntNum = Number(cveEnt)
              const stateData = this.dataStates.find(s => s.cve_ent === cveEntNum)
              this.hoverInfo.data = stateData || { nombre: graphic.attributes.NOMGEO }
              this.hoverInfo.show = true

              // Cuando el elemento html esta en ArcGISMapView.vue (en el mismo componente)
              // this.$refs.hoverPopup.style.transform = `translate(${event.x + 15}px, ${event.y + 15}px)`

              // Cuando esta en otro componente (HoverPopupCard.vue)
              this.$refs.hoverPopup.$el.style.transform = `translate(${event.x + 50}px, ${event.y + -50}px)`
            }
          } else {
            // Salida del mouse: Limpiar todo
            if (this.lastHoveredId !== null) {
              this.hoverLayer.removeAll()
              if (activeHighlightHandle) {
                activeHighlightHandle.remove()
                activeHighlightHandle = null
              }
              this.lastHoveredId = null
              this.hoverInfo.show = false
              this.view.container.style.cursor = 'default'
            }
          }
        })
      })
    },
    async addGeoJSONLayer (item) {
      // console.log('addGeoJSONLayer() -->', item)
      const layerOptions = {
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: item.color || 'black',
            outline: {
              width: 1.2,
              color: item.outlineColor || 'gray' // black
            }
          }
        },
        title: 'GeoJSON_Layer',
        zIndex: 10,
        effect: item.effect || null
      }

      // dataSource --> 'files': para cargar desde archivos locales, 'rendered': para cargar desde datos ya en memoria
      if (item.dataSource === 'rendered') {
        layerOptions.url = URL.createObjectURL(
          new Blob([JSON.stringify(item.data)], { type: 'application/json' })
        )
      }

      if (item.dataSource === 'files' && item.layerRole === 'interactive') {
        layerOptions.outFields = ['*'] // Asegura que todas las propiedades estén disponibles en el hitTest
        layerOptions.url = item.url
      }

      if (item.dataSource === 'files' && item.layerRole === 'background-shadow') {
        layerOptions.url = item.url
      }

      // ======================================================================================================================================
      // Lógica para capas que siempre se muestran sin importar la escala
      if (item.renderingStrategy === 'static') {
        const geojsonLayer = new GeoJSONLayer(layerOptions)
        this.map.add(geojsonLayer)

        if (item.layerRole === 'interactive') {
          this.capasInteractivas = [geojsonLayer]
        }
      }

      // Lógica para capas basadas en escala
      if (item.renderingStrategy === 'scale-dependent') {
        // Capa ultra ligera para cuando el mapa está muy lejos (Zoom out)
        const capaNacional = new GeoJSONLayer({
          ...layerOptions,
          url: '/assets/WGS84_04_05.json',
          minScale: 0,
          maxScale: 3000000
        })

        // Capa detallada para cuando te acercas a un estado (Zoom in)
        const capaEstatal = new GeoJSONLayer({
          ...layerOptions,
          url: '/assets/WGS84_04_100.json',
          minScale: 3000000,
          maxScale: 0
        })

        this.capasInteractivas = [capaNacional, capaEstatal]
        this.map.addMany(this.capasInteractivas)
      }

      // ======================================================================================================================================
      // ======================================================================================================================================
      // ======================================================================================================================================
      // ======================================================================================================================================
    },
    async initMap () {
      // 1. Creamos la capa de todos los países (Tierra)
      const worldLayer = new FeatureLayer({
        url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0',
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: '#dfdad0', // Color de todos los países
            outline: {
              color: '#efeee8', // Contorno sutil
              width: 0.5
            }
          }
        }
      })

      // 2. Empaquetamos esa capa en un Basemap personalizado
      const customBasemap = new Basemap({
        baseLayers: [worldLayer],
        title: 'Fondo Minimalista Niñez Primero',
        id: 'fondo-ninez-primero'
      })

      // 3. Instanciamos el mapa con nuestro propio basemap
      this.map = new Map({
        // basemap: this.vectors[0] // 'streets-navigation-vector'
        basemap: customBasemap
      })

      this.view = new MapView({
        container: this.$refs.mapView,
        map: this.map,
        // longitude, latitude
        // center: [-102.37592182483502, 24.097127823504444],
        // center: [-106.98709444156532, 23.88462442879944], // La Cruz Sinaloa
        center: [-104.24355191297404, 23.847865996045297], // Nombre de Dios, Durango

        // zoom: 4.4,
        scale: 15000000, // ajusta hasta que quede perfecto visualmente
        constraints: {
          snapToZoom: false // permite zoom decimal
        },

        highlightOptions: {
          color: '#f44545',
          haloColor: '#f44545',
          haloOpacity: 1, // 0.9
          fillOpacity: 1 // 0.3
        },
        // El color del océano/mares
        background: {
          type: 'color',
          color: '#efeee8'
        }
      })

      // Ocultar los controles de zoom por defecto de ArcGIS
      this.view.ui.remove('zoom')

      // 4. Esperar a que la vista esté lista antes de agregar el componente
      await this.view.when()

      // ============================================================================================================
      // 5. Agregamos la capa de México con el efecto de SOMBRA
      // await this.addGeoJSONLayer({
      //   url: '/assets/Mexico_WGS84_04.json',
      //   color: '#dfdad0', // Relleno de los estados
      //   outlineColor: '#dfdad0', // Color del contorno
      //   effect: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.35))', // Efecto sombreado

      //   dataSource: 'files', // 'files' 'rendered'
      //   layerRole: 'background-shadow', // 'interactive' 'background-shadow'
      //   renderingStrategy: 'static' // 'static' 'scale-dependent'
      // })

      // await this.addGeoJSONLayer({
      //   url: '/assets/WGS84_04_10.json', // WGS84_04_100  WGS84_04_10  WGS84_04_05  WGS84_04_2ent
      //   color: '#b8ab9b', // Relleno de los estados
      //   outlineColor: '#efeee8', // Color del contorno
      //   effect: null,

      //   dataSource: 'files', // 'files' 'rendered'
      //   layerRole: 'interactive', // 'interactive' 'background-shadow'
      //   renderingStrategy: 'static' // 'static' 'scale-dependent'
      // })

      // ======================================================================================================================================
      // await this.AddGeoJSONLayer({ url: 'https://sdti-ippi.github.io/SIEPI/multimedia/20192024/map_layers/puebla.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/32entMX05.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/WGS84_04.json', color: [184, 171, 155, 0.9], type: 'files' })
      // await this.AddGeoJSONLayerV1({ url: '/assets/WGS84_04_100.json', color: [130, 130, 130, 0.1], type: 'files' })

      // ======================================================================================================================================
      // await this.hoverLayers()
      // ======================================================================================================================================

      this.view.on('click', (event) => {
        // console.log('click', event)
        // this.view.hitTest(event).then((response) => {
        //   const results = response.results.filter(r => r.layer.title === 'Estados')
        //   if (results.length > 0) {
        //     const stateId = results[0].graphic.attributes.id
        //     // Aquí llamas a tu API/backend (ej. axios.get(`/api/estado/${stateId}`))
        //     this.fetchStateDetails(stateId)
        //   }
        // })
      })

      // ======================================================================================================================================
      // this.view.on('click', (event) => {
      //   this.view.hitTest(event).then((response) => {
      //     if (response.results.length > 0) {
      //       const graphic = response.results.filter(
      //         (result) => result.graphic.layer.id === 'tu_id_de_capa'
      //       )[0]

      //       if (graphic) {
      //         // 1. Extraemos los datos del polígono
      //         const attributes = graphic.graphic.attributes

      //         // 2. Preparamos el objeto para el modal (igual que el hoverInfo)
      //         this.clickedStateData = {
      //           name: attributes.NOMGEO, // O el nombre de tu campo
      //           woman: attributes.total_mujeres,
      //           man: attributes.total_hombres
      //         }

      //         // 3. Abrimos el modal
      //         this.dialogState = true
      //       }
      //     }
      //   })
      // })
      // ======================================================================================================================================
    },

    // ======================================================================================================================================
    async handleSubmit_V1 (formData) {
      // console.log('submit-->', formData)
      this.dialog_loader.actived = true
      this.dialog_loader.message = 'Por favor espere...'

      this.category_details = []
      await this.setSleep(500)

      const sendData = {
      // category_id: [1, 2, 3],
      // state_id: [1, 2, 3]
      // year_id: [24, 25, 26],
      // gender_id: [1, 2],
        category_id: [],
        state_id: [],
        year_id: [],
        gender_id: []
      }

      if (formData.state_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.states
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.state_id = ids
      } else {
        sendData.state_id = formData.state_id
      }

      if (formData.year_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.years
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.year_id = ids
      } else {
        sendData.year_id = formData.year_id
      }

      if (formData.gender_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.genders
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.gender_id = ids
      } else {
        sendData.gender_id = formData.gender_id
      }

      const categoryIds = formData.category_id
        .filter(item => item !== 0)
        .map(item => item)

      if (!categoryIds.length) {
        this.$store.dispatch('storeNotif/error', {
          message: '¡Favor de seleccionar al menos una de las categorías disponobles!'
        })
        return
      }
      sendData.category_id = categoryIds
      // console.log(sendData)
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=getdata`
        const response = await axios.post(url, sendData)
        console.log(response.data)
        if (response.data.status === 200) {
          // await this.setSleep(1000)
          this.category_details = response.data.result
        }
      } catch (error) {
        console.log(error)
        console.log(error.response.data)
      } finally {
        this.dialog_loader.actived = false
        this.dialog_loader.message = ''
      }
    },
    // ======================================================================================================================================
    async getGenders () {
      // try {
      const url = `${process.env.VUE_APP_API_SERVER}genders?type=getdatabysector`
      const response = await axios.get(url)
      if (response.data.status === 200) {
        this.genders = response.data.result
        this.genders.unshift({ id: 0, title: 'Todos' })
      }
      // } catch (error) {
      //   console.log(error.response.data)
      //   console.log(error)
      // }
    },
    async getYears () {
      // try {
      const url = `${process.env.VUE_APP_API_SERVER}years?type=getdatabysector`
      const response = await axios.get(url)
      if (response.data.status === 200) {
        this.years = response.data.result
        this.years.unshift({ id: 0, title: 'Todos' })
      }
      // } catch (error) {
      //   console.log(error.response.data)
      //   console.log(error)
      // }
    },
    async getStates () {
      // try {
      const url = `${process.env.VUE_APP_API_SERVER}states?type=getdatabysector`
      const response = await axios.get(url)
      if (response.data.status === 200) {
        this.states = response.data.result
        this.states.unshift({ id: 0, title: 'Todos' })
      }
      // } catch (error) {
      //   console.log(error)
      //   console.log(error.response.data)
      // }
    },
    async getCategories (sendData) {
      try {
        if (!sendData.length) {
          this.$store.dispatch('storeNotif/error', {
            message: 'Debe de seleccionar al menos algún tipo de población para solicitar tipos de delitos asociados'
          })
          return
        }
        // console.log('getCategories', sendData)
        const url = `${process.env.VUE_APP_API_SERVER}indicator_categories?type=categoriesnode`
        const response = await axios.post(url, { indicator_ids: sendData })
        // console.log('getCategories() --> ', response.data.result)

        if (response.data.status === 200) {
          // 1️⃣ VALIDACIÓN DE ESTADO VACÍO
          if (!response.data.result || response.data.result.length === 0) {
            this.categories = []

            this.$store.dispatch('storeNotif/info', {
              message: 'No se encontraron tipos de delitos asociadas a las poblaciones seleccionadas. Por favor, intenta con otra combinación.'
            })

            return
          }

          // 2️⃣ FLUJO NORMAL (Si hay datos)
          this.categories = response.data.result
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('storeNotif/error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getIndicators () {
      // try {
      const url = `${process.env.VUE_APP_API_SERVER}indicators?type=getwithdata`
      const response = await axios.get(url)
      if (response.data.success) {
        this.indicators = response.data.result
        // console.log('getIndicators ', this.indicators)
      }
      // }
      // catch (error) {
      //   console.log(error)
      // }
    },

    setShowCards (type) {
      // console.log('setShowCards --> ', type)
      this.isCardOpen = type
    },
    async fetchGroupedData (payload) {
      try {
        const formData = { ...payload }

        const sendData = {
          group_by: formData.group_by,
          category_id: [],
          state_id: [],
          year_id: [],
          gender_id: []
        }

        if (formData.state_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
          const ids = this.states
            .filter(item => item.id !== 0)
            .map(item => item.id)

          sendData.state_id = ids
        } else {
          sendData.state_id = formData.state_id
        }

        if (formData.year_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
          const ids = this.years
            .filter(item => item.id !== 0)
            .map(item => item.id)

          sendData.year_id = ids
        } else {
          sendData.year_id = formData.year_id
        }

        if (formData.gender_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
          const ids = this.genders
            .filter(item => item.id !== 0)
            .map(item => item.id)

          sendData.gender_id = ids
        } else {
          sendData.gender_id = formData.gender_id
        }

        const categoryIds = formData.category_id
          .filter(item => item !== 0)
          .map(item => item)

        if (!categoryIds.length) {
          this.$store.dispatch('storeNotif/error', {
            message: '¡Favor de seleccionar al menos una de las categorías disponobles!'
          })
          return
        }
        sendData.category_id = categoryIds

        const url = `${process.env.VUE_APP_API_SERVER}map?type=getdata`
        const response = await axios.post(url, sendData)
        let result = []

        if (response.data.status === 200) {
          this.setShowCards(true)

          await this.setSleep(100)
          result = response.data.result
          this.$refs.filterDeck.activeToggle = true
        }

        // console.log('result data charts --> ', formData.group_by, result)

        // Dependiendo del group_by, procesas los datos y los asignas a su variable
        switch (formData.group_by) {
          case 'year':
            this.chartDataYear = result
            break
          case 'gender':
            this.chartDataGender = result
            break
          case 'state':
            this.chartDataState = result
            break
        }
      } catch (error) {
        console.error('Error obteniendo datos agrupados:', error)
      } finally {
        // Ocultar loader
      }
    },
    async handleCardOpened (index) {
      const groupByMap = {
        0: 'year',
        1: 'gender',
        2: 'state'
        // 3: 'center'
      }

      const targetGroup = groupByMap[index]

      if (targetGroup) {
        const activeToggle = this.$refs.filterDeck.activeToggle

        const frmData = this.$refs.filterDeck.frmData

        const payload = {
          ...frmData,
          group_by: targetGroup
        }

        if (!frmData.category_id.length || !frmData.indicator_id.length || !activeToggle) { return }

        // console.log('handleCardOpened --> ', index, payload)
        // console.log('handleCardOpened --> ')
        await this.fetchGroupedData(payload)
      }
    },
    async handleSubmit (frmData) {
      const payload = {
        ...frmData,
        group_by: 'year'
      }
      // console.log('handleSubmit --> ')
      await this.fetchGroupedData(payload)
    },

    // ======================================================================================================================================
    parseParam (paramValue, catalogList) {
      // if (!paramValue || !catalogList || catalogList.length === 0) return []
      if (!paramValue || !catalogList || catalogList.length === 0) return [0]

      // Convertimos el string "1,2,3" en un array de enteros [1, 2, 3]
      const paramArray = paramValue.split(',').map(Number)

      // REGLA: Si incluye un 0, se seleccionan todos los registros del array
      if (paramArray.includes(0)) {
        return [0]
        // return catalogList.map(item => item.id)
        // return catalogList
        //   .filter(item => item.id !== 0)
        //   .map(item => item.id)
      }

      // REGLA: Omitir (filtrar) aquellos IDs de la URL que NO existen en el catálogo
      const filter = paramArray.filter(id => catalogList.some(item => item.id === id))

      // REGLA: Si no hay datos en filter, se asigna un 0
      if (!filter.length) {
        return [0]
        // return catalogList.map(item => item.id)
        // return catalogList
        //   .filter(item => item.id !== 0)
        //   .map(item => item.id)
      }

      return filter
    },
    async evaluateUrlParams () {
      if (!this.urlParams) { return }

      // Verificamos si la URL contiene al menos uno de los filtros
      const filterKeys = ['indicator', 'category', 'gender', 'state', 'year']
      const hasFilters = filterKeys.some(key => this.urlParams.has(key))

      // Si no hay parámetros, el flujo termina aquí y funciona normalmente
      if (!hasFilters) { return }

      if (this.$refs.filterDeck) {
        const filterData = this.$refs.filterDeck.frmData

        // Parseamos y validamos asegurándo de que cada ID exista
        const dataIndicators = await this.parseParam(this.urlParams.get('indicator'), this.indicators)
        if (dataIndicators.includes(0)) { return }
        filterData.indicator_id = dataIndicators

        filterData.indicator_id = await this.parseParam(this.urlParams.get('indicator'), this.indicators)
        filterData.state_id = await this.parseParam(this.urlParams.get('state'), this.states)
        filterData.year_id = await this.parseParam(this.urlParams.get('year'), this.years)
        filterData.gender_id = await this.parseParam(this.urlParams.get('gender'), this.genders)

        // =================================================================================================================
        await this.setSleep(1000)
        await this.$refs.filterDeck.getCategories()

        await this.setSleep(500)
        await this.$refs.filterDeck.submitFilters()
      }
    },
    startTutorial () {
      console.log('--- MODO TUTORIAL ACTIVADO ---')
    },
    async loadCatalogs () {
      try {
        await Promise.all([
          this.getIndicators(),
          this.getStates(),
          this.getYears(),
          this.getGenders()

          // this.getCategories([1, 2])
        ])
      } catch (error) {
        console.error('Error cargando catálogos:', error)
      }
    },
    async initApplication () {
      this.dialog_loader.actived = true
      this.dialog_loader.message = 'Por favor espere...'

      // 1. Obtener parámetros de la URL usando tu acción de Vuex existente
      await this.getParams()

      // 2. MODALIDAD 1: Modo Tutorial
      // https://ninezprimero.aularedim.net/mapa?introduccion=true
      // Verifica si existe la bandera introduccion=true
      if (this.urlParams && this.urlParams.get('introduccion') === 'true') {
        await this.startTutorial()
      }

      // 3. Cargar catálogos base
      // await this.loadCatalogs()

      // 4. MODALIDAD 2: validar parámetros
      await this.evaluateUrlParams()

      this.dialog_loader.actived = false
      this.dialog_loader.message = ''
    }
    // ======================================================================================================================================
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // console.log('created')
    // ======================================================================================================================================
    // ======================================================================================================================================
    // this.dialog_loader.actived = true
    // this.dialog_loader.message = 'Por favor espere...'
    // await this.setSleep(2500)
    // this.dialog_loader.actived = false
    // this.dialog_loader.message = ''

    // ======================================================================================================================================
    // this.getCategories()

    // this.categories = [
    //   { id: 0, title: 'Todos' },
    //   { id: 13, title: 'Con adicción  a sustancias psicoactivas' },
    //   { id: 14, title: 'Con discapacidad' },
    //   { id: 15, title: 'Indefinido' },
    //   { id: 17, title: 'No identificado' },
    //   { id: 16, title: 'Pertenece a pueblo indígena' }
    // ]
    // this.frmData.category_id = [1]
    // console.log(this.frmData.category_id)

    // this.submit()
    // ======================================================================================================================================

    // await this.getParams(null)
    // await window.addEventListener('popstate', this.getParams)
    // await this.setSleep(1500)
    // console.log(this.urlParams)
    // if (this.urlParams.size) {
    //   console.log('Con parametros')
    // } else {
    //   console.log('Sin parametros')
    // }

    // const project = this.urlParams.get('project')
    // const find = await this.projects.find(element => { return element.param === project })

    // if (type === 'cloced') {
    //   state.dialog_data.actived = false
    //   state.url.searchParams.delete('project')
    //   window.history.replaceState({}, '', state.url)

    //   state.urlParams = new URLSearchParams(state.url.search)
    //   state.dialog_data.currentPage = 1
    // }
  },
  beforeMount () {},
  async mounted () {
    await this.loadDataMap()
    await this.initMap()
    await this.initApplication()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
    window.removeEventListener('popstate', this.getParams)
  },
  destroyed () { }

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.

}
</script>

<style scoped>
  /* -------------------------------------------------------------------------------- */
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

  /* ===============================  CONTENEDOR PRINCIPAL  =============================== */
  .map-wrapper {
    position: relative;
    width: 100%;
    /* height: 93vh; */
    height: calc(100vh - 64px); /* Resto del alto de la AppBar */
    overflow: hidden;
  }

  #viewDiv {
    width: 100%;
    height: 100%;
  }

  /* ===============================  PANEL  =============================== */
  .stats-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 50;
    /*width: 400px;*/ /* Ancho en escritorio */
    width: 450px; /* Ancho en escritorio */
    max-width: calc(100vw - 40px); /* Evita que desborde si la pantalla es menor a 440px */
  }

  /* ===============================  MAPA  =============================== */

  .custom-hover-popup {
    position: absolute;
    background: white;
    padding: 8px 12px;
    border-radius: 8px;
    pointer-events: none; /* Importante: para que no interfiera con el mouse */
    z-index: 1000;
    border-left: 4px solid #ed712c;
    min-width: 150px;
  }

  /* Tablets (hasta 960px) */
  @media (max-width: 960px) {
    .stats-panel {
      width: 350px;
    }
  }
  /* Teléfonos Móviles (hasta 600px) */
  @media (max-width: 600px) {
    .stats-panel {
      top: 10px;
      right: 10px;
      width: 335px; /* 80% 335px */
      /* Le restamos 20px (10px de cada lado) para mantener un margen parejo en móvil */
      max-width: calc(100vw - 20px);
    }
  }

</style>
