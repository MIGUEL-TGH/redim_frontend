<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
      <custom-navbar />
      <!-- <span class="ml-2 font-weight-bold">REDIM</span> -->
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- <v-col cols="12">
      <label class="tree-label">Categoría</label>
      <v-treeview selectable v-model="frmData.category_id" :items="categories" item-text="title" item-key="id"
        class="tree-compact" open-all selected-color="white"
      >
      </v-treeview>
    </v-col> -->

    <div class="map-wrapper">
      <div id="viewDiv" ref="mapView"></div>
      <!-- <div id="InfoMap" class="esri-widget"></div> -->

      <logos-cards />

      <!-- PANEL ESTADÍSTICO -->
      <div class="stats-panel">
        <stack-cards />
      </div>
    </div>

    <v-navigation-drawer app v-model="drawer_left_map" width="280px" clipped style="padding: 10px !important;" color="#efeee8"> <!-- B2B2B1 -->
      <div class="drawer-content">
        <v-form ref="form_item" style="padding-top: 5px;">

          <v-select
            class="select-compacto" v-model="frmData.indicator_id" item-value="id" item-text="name" :items="indicators" multiple
            :rules="[v => (v && v.length > 0) || 'Campo obligatorio']" dense outlined background-color="#FAFAFA" color="#246257" item-color="#246257" label="Población*:"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 2" small label close color="#246257" class="white--text chip-select" @click:close="removeIndicator(item.id)">
                <span>{{ item.id }}</span>
              </v-chip>
              <span v-if="index === 2" class="grey--text text-caption ml-1 font-weight-medium">
                (+{{ frmData.indicator_id.length - 2 }} más)
              </span>
            </template>

            <template v-slot:append-outer>
              <v-icon large color="#342a83" class="BtnHover mt-n1" @click="getCategories" title="Cargar categorías">
                mdi-arrow-right-bold-box
              </v-icon>
            </template>
          </v-select>

          <v-select v-model="frmData.state_id" :items="states" item-value="id" item-text="title" multiple :item-disabled="isStateDisabled" :rules="[v => !!v.length || 'Campo obligatorio']"
            dense filled background-color="#fafafa" color="#246257" label="Entidad Federativa*:">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <!-- <span>{{ truncateText(item.title, 20) }}</span> -->
                  <span>{{ item.title }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text span-select">
                  (+{{ frmData.state_id.length - 1 }} más)
                </span>
              </template>
          </v-select>

          <v-select v-model="frmData.year_id" :items="years" item-value="id" item-text="title" multiple :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isYearDisabled"
            dense filled background-color="#fafafa" color="#246257" label="Año*:">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                <span>{{ truncateText(item.title, 20) }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text span-select">
                (+{{ frmData.year_id.length - 1 }} más)
              </span>
            </template>
          </v-select>

          <v-select v-model="frmData.gender_id" :items="genders" item-value="id" item-text="title" multiple :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isGenderDisabled"
            dense filled background-color="#fafafa" color="#246257" label="Sexo*:">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ truncateText(item.title, 20) }}</span>
                </v-chip>
                <span v-if="index === 1" class="grey--text span-select">
                  (+{{ frmData.gender_id.length - 1 }} más)
                </span>
              </template>
          </v-select>

          <div v-if="categories.length">
            <label class="tree-label">Tipo de delito</label>
            <v-treeview selectable v-model="frmData.category_id" :items="categories" item-text="title" item-key="id"
              class="tree-compact" open-all selected-color="#246257"
            >
            </v-treeview>
            <br>
          </div>

          <v-btn color="#342a83" elevation="5" @click="submit" block class="white--text" :disabled="btnSend">consultar</v-btn>
        </v-form>
      </div>

    </v-navigation-drawer>

    <!-- <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1">
      redmi
    </v-navigation-drawer> -->

    <loader-comp />
    <view-notifications-comp ref="notifier"/>

      <v-dialog v-model="dialogData.actived" scrollable max-width="300px" persistent> <!--750px-->
        <v-card max-height="85vh">
          <v-toolbar dark class="toolbar title-dialog" color="#424242">
            REDIM: <strong style="padding-left: 5px;">{{dialogData.title}}</strong>
            <v-spacer></v-spacer>
            <v-btn @click="dialogData.actived=false, Panel=false" color="error" small fab>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <br>
            <h2 class="title-indicator">{{dialogData.indicator}}</h2>
            <v-divider></v-divider>
            <template>
              <br>
              <!-- <ChartComp
                :type="element.chart.name"
                :data="element.chart.attributes"
                :options="chartOptionsPie"
                :refresh="Panel === index"
              /> -->
              <!-- <ChartComp
                :type="nameChart"
                :data="dataLine"
                :options="chartOptionsLine"
              /> -->
              <ChartComp
                :type="nameChart"
                :data="myChartData"
                :options="myChartOptions"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>

  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'
import StackCards from '@/components/map/StackCards.vue'
import LogosCards from '@/components/map/LogosCards.vue'
// import FloatingNavbar from '@/components/map/FloatingNavbar.vue'
import CustomNavbar from '@/components/map/CustomNavbar.vue'

import '@/assets/css/style_maps.css'
import '@/assets/css/style_notifications.css'

import '@arcgis/core/assets/esri/themes/light/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
// import Expand from '@arcgis/core/widgets/Expand'
// import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
// import Graphic from '@arcgis/core/Graphic'
// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import Point from '@arcgis/core/geometry/Point'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'

// import Tables from '@/js/20242030/tables.js'
import Charts from '@/js/charts.js'
import ChartComp from '@/components/ChartComp.vue'

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
    // FloatingNavbar
    CustomNavbar,
    ChartComp
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
      // test =======================================================================
      myChartData: [],
      myChartOptions: [],

      dialogData: {
        actived: false,
        panel: false,
        nameChart: 'doughnut' // pie
      },
      dataPieDoughnut: {
        datasets: [{
          backgroundColor: [
            '#ff6384',
            '#36a2eb',
            '#cc65fe'
          ],
          data: [10, 20, 30]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          'Red',
          'Yellow',
          'Blue'
        ]
      },
      chartOptionsPie: {
        responsive: true,
        maintainAspectRatio: false
      },
      Panel: false,
      attributes: {
        labels: [],
        datasets: [{ backgroundColor: [], data: [] }]
      },
      chartOptionsLine: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        }
      },
      nameChart: 'line',
      dataLine: {
        datasets: [{
          label: 'Scatter Dataset',
          backgroundColor: [
            '#ff6384',
            '#cc65fe'
          ],
          data: [{
            x: -10,
            y: 0
          }, {
            x: 0,
            y: 10
          }, {
            x: 10,
            y: 5
          }]
        }]
      },
      // =========================================================================
      // map
      vectors: [
        'streets-navigation-vector',
        'streets',
        'topo-vector',
        'satellite',
        'hybrid',
        'dark-gray-vector',
        'oceans',
        'national-geographic',
        'terrain',

        'light-gray-vector',
        'gray-vector',
        'streets-vector',
        'navigation-vector',
        'osm',
        'arcgis-light-gray',
        'arcgis-dark-gray',
        'arcgis-topographic',
        'arcgis-imagery',
        'arcgis-navigation',
        'arcgis-streets',
        'arcgis-oceans'
      ],
      view: undefined,
      map: undefined,
      stopWatchHandle: null,
      graphicsLayer: null,
      // vue
      drawer_left_map: true,
      indicators: [],
      categories: [],
      // categories: [
      //   {
      //     id: 1,
      //     title: 'Applications :',
      //     children: [
      //       { id: 2, title: 'Calendar : app' },
      //       { id: 3, title: 'Chrome : app' },
      //       { id: 4, title: 'Webstorm : app' }
      //     ]
      //   },
      //   {
      //     id: 5,
      //     title: 'Documents :',
      //     children: [
      //       {
      //         id: 6,
      //         title: 'vuetify :',
      //         children: [
      //           {
      //             id: 7,
      //             title: 'src :',
      //             children: [
      //               { id: 8, title: 'index : ts' },
      //               { id: 9, title: 'bootstrap : ts' }
      //             ]
      //           }
      //         ]
      //       },
      //       {
      //         id: 10,
      //         title: 'material2 :',
      //         children: [
      //           {
      //             id: 11,
      //             title: 'src :',
      //             children: [
      //               { id: 12, title: 'v-btn : ts' },
      //               { id: 13, title: 'v-card : ts' },
      //               { id: 14, title: 'v-window : ts' }
      //             ]
      //           }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     id: 15,
      //     title: 'Downloads :',
      //     children: [
      //       { id: 16, title: 'October : pdf' },
      //       { id: 17, title: 'November : pdf' },
      //       { id: 18, title: 'Tutorial : html' }
      //     ]
      //   },
      //   {
      //     id: 19,
      //     title: 'Videos :',
      //     children: [
      //       {
      //         id: 20,
      //         title: 'Tutorials :',
      //         children: [
      //           { id: 21, title: 'Basic layouts : mp4' },
      //           { id: 22, title: 'Advanced techniques : mp4' },
      //           { id: 23, title: 'All about app : dir' }
      //         ]
      //       },
      //       { id: 24, title: 'Intro : mov' },
      //       { id: 25, title: 'Conference introduction : avi' }
      //     ]
      //   }
      // ],
      years: [],
      genders: [],
      states: [],

      frmData: {
        // indicator_id: null,
        indicator_id: [],
        category_id: [],
        year_id: [],
        gender_id: [],
        state_id: []
      },
      frmDisabled: {
        category: false
      },
      isUpdatingYear: false,
      isUpdatingCategory: false,
      isUpdatingGender: false,
      isUpdatingState: false,
      btnSend: true
    }
  },
  computed: {
    ...mapState([
      'urlParams',
      'dialog_loader'
    ])
  },

  // 4️⃣ Observadores
  watch: {
    'frmData.indicator_id' (newVal, oldVal) {
      // Nos aseguramos de tener la longitud, usando 0 si por alguna razón es undefined
      const newLength = newVal ? newVal.length : 0
      const oldLength = oldVal ? oldVal.length : 0

      // Condición 1: Se quedó vacío (!newLength)
      // Condición 2: El usuario desmarcó uno de la lista (newLength < oldLength)
      // if (!newLength || newLength < oldLength) { // solo cuando disminulle
      if (!newLength || newLength !== oldLength) { // cuando es diferente
        console.log('submit()--> deshabilitado')

        this.$nextTick(() => {
          // Deshabilitamos el botón de enviar
          this.btnSend = true

          // Opcional: Si quieres limpiar las categorías tal como lo haces en removeIndicator
          this.categories = []
        })
      }
    },

    'frmData.year_id' (val) {
      if (this.isUpdatingYear) return

      this.isUpdatingYear = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.year_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan años normales
        this.frmData.year_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingYear = false
      })
    },
    'frmData.category_id' (val) {
      if (this.isUpdatingCategory) return

      this.isUpdatingCategory = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.category_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.category_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingCategory = false
      })
    },
    'frmData.state_id' (val) {
      if (this.isUpdatingState) return

      this.isUpdatingState = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.state_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.state_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingState = false
      })
    },
    'frmData.gender_id' (val) {
      if (this.isUpdatingGender) return

      this.isUpdatingGender = true

      if (val.includes(0) && val.length > 1) { // Caso 1: Se selecciona "Todos"
        this.frmData.gender_id = [0]
      } else if (!val.includes(0) && val.length >= 1) { // Caso 2: Se seleccionan categorías normales
        this.frmData.gender_id = val.filter(v => v !== 0)
      }

      this.$nextTick(() => {
        this.isUpdatingGender = false
      })
    }
  },

  // 5️⃣ Métodos
  methods: {
    // vuex
    ...mapActions([
      'setSleep',
      'getParams'
    ]),
    // map
    throttle (func, limit) {
      let lastCall = 0
      return function (...args) {
        const now = Date.now()
        if (now - lastCall >= limit) {
          lastCall = now
          func.apply(this, args)
        }
      }
    },
    async AddGeoJSONLayer (item) {
      // console.log('AddGeoJSONLayer() -->', item)
      const layerOptions = {
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: item.color,
            outline: {
              width: 1.2,
              color: 'gray' // black
            }
          }
        },
        // renderer: {
        //   type: 'simple',
        //   symbol: {
        //     type: 'simple-fill',
        //     color: [0, 0, 0, 0], // 🔥 transparente
        //     outline: {
        //       color: '#BFB8AE',
        //       width: 1.2
        //     }
        //   }
        // },
        title: 'GeoJSON Layer',
        zIndex: 10 // Asegura que esté debajo de los gráficos
      }

      if (item.type === 'rendered') {
        layerOptions.url = URL.createObjectURL(
          new Blob([JSON.stringify(item.data)], { type: 'application/json' })
        )
      } else if (item.type === 'files') {
        layerOptions.url = item.url
        layerOptions.renderer.symbol.outline = {
          width: 1,
          color: 'black' // gray
        }
      }

      // console.log('layerOptions -->', layerOptions)
      const geojsonLayer = new GeoJSONLayer(layerOptions)
      this.map.add(geojsonLayer)
    },
    async AddGeoJSONLayerV1 (item) { // Resaltar capa
      // console.log('AddGeoJSONLayer() -->', item)
      const layerOptions = {
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: item.color,
            outline: {
              width: 1.2,
              color: 'gray' // black
            }
          }
        },
        title: 'GeoJSON Layer',
        zIndex: 10 // Asegura que esté debajo de los gráficos
      }

      if (item.type === 'rendered') {
        layerOptions.url = URL.createObjectURL(
          new Blob([JSON.stringify(item.data)], { type: 'application/json' })
        )
      } else if (item.type === 'files') {
        layerOptions.url = item.url
        layerOptions.renderer.symbol.outline = {
          width: 1,
          color: 'black' // gray
        }
      }

      // console.log('layerOptions -->', layerOptions)
      const geojsonLayer = new GeoJSONLayer(layerOptions)
      this.map.add(geojsonLayer)

      // --------------------------------------------------------------------------------
      // 2. Variables de control para hover
      let layerView = null
      let highlightHandle = null
      let currentObjectId = null

      // --------------------------------------------------------------------------------
      // 3. Obtener LayerView (una sola vez)
      await this.view.whenLayerView(geojsonLayer).then((lv) => {
        layerView = lv
      })

      // --------------------------------------------------------------------------------
      // 4. Handler de hover (SIN throttle aquí)
      const pointerMoveHandler = async (event) => {
        if (!layerView) return

        const hit = await this.view.hitTest(event, {
          include: geojsonLayer
        })

        const graphic = hit.results[0]?.graphic

        // Cursor fuera de la capa
        if (!graphic) {
          if (highlightHandle) {
            highlightHandle.remove()
            highlightHandle = null
          }
          currentObjectId = null
          this.view.container.style.cursor = 'default'
          return
        }

        const objectId = graphic.attributes.__OBJECTID

        // ❗ Si sigue sobre el mismo estado, no reprocesar
        if (objectId === currentObjectId) return

        currentObjectId = objectId
        console.log(currentObjectId)

        // Limpiar highlight anterior
        if (highlightHandle) highlightHandle.remove()

        // Aplicar nuevo highlight (rápido)
        highlightHandle = layerView.highlight(graphic)

        // Cambiar cursor
        this.view.container.style.cursor = 'pointer'
      }

      // --------------------------------------------------------------------------------
      // 5. Registrar evento con throttle (CLAVE de rendimiento)
      this.view.on(
        'pointer-move',
        this.throttle(pointerMoveHandler, 50) // ~16 FPS
      )
    },

    async _initMap () {
      this.map = new Map({
        basemap: this.vector[0] // 'streets-navigation-vector'
      })

      this.view = new MapView({
        container: this.$refs.mapView,
        map: this.map,
        center: [-102.37592182483502, 24.097127823504444],
        zoom: 4.4,
        // scale: 9000000, // ajusta hasta que quede perfecto visualmente
        constraints: {
          snapToZoom: false // permite zoom decimal
        },

        highlightOptions: {
          color: '#f44545', // 🔴 color del highlight
          haloColor: '#f44545', // 🔴 borde exterior
          haloOpacity: 1, // 0.9
          fillOpacity: 1 // 0.3
        }
      })

      // await this.view.when() // Esperar a que la vista esté lista antes de agregar el componente

      // this.WatchExpand = new Expand({
      //   view: this.view,
      //   content: document.getElementById('InfoMap'),
      //   group: 'top-right',
      //   visible: false,
      //   focusTrapDisabled: true
      // })
      // this.view.ui.add(this.WatchExpand, 'top-right')
      // console.log('initMap() END')
      // this.stopWatchHandle = reactiveUtils.watch(
      //   () => this.view.updating, // 🔹 propiedad reactiva
      //   async (updating) => {
      //     if (!updating) {
      //       await this.setSleep(1500) // 🔸 espera un poco para asegurar que todo terminó de renderizar
      //       this.dialog_loader.actived = false
      //     }
      //   }
      // )
    },

    async initMap () {
      // console.log('initMap()')
      this.map = new Map({
        // basemap: this.vectors[0] // 'streets-navigation-vector'
        basemap: 'gray-vector'
        // basemap: null
      })

      this.view = new MapView({
        container: this.$refs.mapView,
        map: this.map,
        center: [-102.37592182483502, 24.097127823504444],
        zoom: 4.4,
        // scale: 9000000, // ajusta hasta que quede perfecto visualmente
        constraints: {
          snapToZoom: false // permite zoom decimal
        },

        highlightOptions: {
          color: '#f44545', // 🔴 color del highlight
          haloColor: '#f44545', // 🔴 borde exterior
          haloOpacity: 1, // 0.9
          fillOpacity: 1 // 0.3
        }

        // background: {
        //   type: 'color',
        //   color: '#CFC6BA'
        // }
      })

      await this.view.when() // Esperar a que la vista esté lista antes de agregar el componente

      // this.WatchExpand = new Expand({
      //   view: this.view,
      //   content: document.getElementById('InfoMap'),
      //   group: 'top-right',
      //   visible: false,
      //   focusTrapDisabled: true
      // })
      // this.view.ui.add(this.WatchExpand, 'top-right')
      // console.log('initMap() END')
      // this.stopWatchHandle = reactiveUtils.watch(
      //   () => this.view.updating, // 🔹 propiedad reactiva
      //   async (updating) => {
      //     if (!updating) {
      //       await this.setSleep(1500) // 🔸 espera un poco para asegurar que todo terminó de renderizar
      //       this.dialog_loader.actived = false
      //     }
      //   }
      // )

      // await this.AddGeoJSONLayer({ url: 'https://sdti-ippi.github.io/SIEPI/multimedia/20192024/map_layers/puebla.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/32entMX05.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/WGS84_04.json', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayerV1({ url: '/assets/WGS84_04.json', color: [130, 130, 130, 0.1], type: 'files' })
    },

    async getDataLiner () {
      const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          labels: {
            // fontColor: '#ffffff', // Texto de la leyenda en blanco
            fontColor: '#595555', // Texto de la leyenda en blanco
            boxWidth: 12
          }
        },
        elements: {
          line: {
            tension: 0.3 // Hace que la línea tenga una curva suave. Ponlo en 0 para líneas totalmente rectas.
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              // fontColor: '#e0e0e0', // Números del eje Y
              fontColor: '#858181', // Números del eje Y
              beginAtZero: true
            },
            gridLines: {
              // color: 'rgba(255, 255, 255, 0.1)', // Líneas horizontales sutiles
              // zeroLineColor: 'rgba(255, 255, 255, 0.2)'
              color: 'rgba(242, 7, 19, 0.1)', // Líneas horizontales sutiles
              zeroLineColor: 'rgba(255, 255, 255, 0.2)'
            }
          }],
          xAxes: [{
            ticks: {
              // fontColor: '#e0e0e0' // Años del eje X
              fontColor: '#858181' // Años del eje X
            },
            gridLines: {
              display: false // Usualmente en gráficos de línea de tiempo se oculta la cuadrícula vertical
            }
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false, // Permite ver ambas cifras al pasar el mouse por encima de un año
          // backgroundColor: 'rgba(0,0,0,0.8)'
          backgroundColor: 'rgba(33,75,148,0.8)'
        }
      }

      // 1. Instancias tu clase
      const chartProcessor = new Charts()

      // 2. Le pasas tus datos puros de la BD
      // const rawData = [
      //   { year: 2015, internada: 500, senalada: 350 },
      //   { year: 2016, internada: 600, senalada: 250 },
      //   { year: 2017, internada: 300, senalada: 450 },
      //   { year: 2018, internada: 120, senalada: 300 },
      //   { year: 2019, internada: 150, senalada: 280 },
      //   { year: 2020, internada: 90, senalada: 250 }
      // ]
      const rawData = [
        { year: 2015, internada: 480, senalada: 320 },
        { year: 2016, internada: 610, senalada: 290 },
        { year: 2017, internada: 350, senalada: 460 },
        { year: 2018, internada: 200, senalada: 310 },
        { year: 2019, internada: 170, senalada: 270 },
        { year: 2020, internada: 95, senalada: 240 },
        { year: 2021, internada: 130, senalada: 260 },
        { year: 2022, internada: 220, senalada: 300 },
        { year: 2023, internada: 340, senalada: 410 },
        { year: 2024, internada: 410, senalada: 380 }
      ]

      await chartProcessor.setComparativeLine(rawData)

      // 3. Pasas los datos procesados a Vue
      this.myChartData = chartProcessor.attributes
      this.myChartOptions = lineChartOptions
    },

    // data
    removeIndicator (idToRemove) {
      // Filtramos el array del v-model para excluir el ID que el usuario cerró
      this.frmData.indicator_id = this.frmData.indicator_id.filter(
        id => id !== idToRemove
      )
      // this.btnSend = true
      // this.categories = []
    },
    truncateText (text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    },

    isYearDisabled (item) {
      // Si "Todos" está seleccionado, deshabilitar los demás
      if (this.frmData.year_id.includes(0)) {
        return item.id !== 0
      }

      // Si hay otros seleccionados, deshabilitar "Todos"
      // if (this.frmData.year_id.length > 0) {
      //   return item.id === 0
      // }

      return false
    },
    isCategoryDisabled (item) {
      if (this.frmData.category_id.includes(0)) {
        return item.id !== 0
      }

      return false
    },
    isStateDisabled (item) {
      if (this.frmData.state_id.includes(0)) {
        return item.id !== 0
      }

      return false
    },
    isGenderDisabled (item) {
      if (this.frmData.gender_id.includes(0)) {
        return item.id !== 0
      }

      return false
    },

    getAllLeafIds (nodes, result = []) {
      nodes.forEach(node => {
        if (node.children && node.children.length) {
          this.getAllLeafIds(node.children, result)
        } else {
          result.push(node.id)
        }
      })
      return result
    },

    async getGenders () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=genders`
        const response = await axios.get(url)
        if (response.data.status === 200) {
          this.genders = response.data.result
          this.genders.unshift({ id: 0, title: 'Todos' })
          this.frmData.gender_id = [0]
        }
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
      }
    },
    async getYears () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=years`
        const response = await axios.get(url)
        if (response.data.status === 200) {
          this.years = response.data.result
          this.years.unshift({ id: 0, title: 'Todos' })
          this.frmData.year_id = [0]
        }
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
      }
    },
    async getStates () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=states`
        const response = await axios.get(url)
        if (response.data.status === 200) {
          this.states = response.data.result
          this.states.unshift({ id: 0, title: 'Todos' })
          this.frmData.state_id = [0]
        }
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
      }
    },
    async getCategories () {
      try {
        const sendData = this.frmData.indicator_id
        if (!sendData.length) {
          this.$store.dispatch('storeNotif/error', {
            message: 'Debe de seleccionar al menos algún tipo de población para solicitar tipos de delitos asociados'
          })
          return
        }

        const url = `${process.env.VUE_APP_API_SERVER}map?type=categories`
        // const response = await axios.post(url, this.frmData.indicator_id)
        const response = await axios.post(url, { indicator_ids: this.frmData.indicator_id })
        console.log('getCategories() --> ', response.data.result)
        if (response.data.status === 200) {
          // 1️⃣ VALIDACIÓN DE ESTADO VACÍO
          if (!response.data.result || response.data.result.length === 0) {
            this.categories = []
            this.frmData.category_id = []
            this.btnSend = true

            this.$store.dispatch('storeNotif/info', {
              message: 'No se encontraron tipos de delitos asociadas a las poblaciones seleccionadas. Por favor, intenta con otra combinación.'
            })

            return
          }

          // 2️⃣ FLUJO NORMAL (Si hay datos)
          this.frmData.category_id = []
          this.categories = []
          this.btnSend = false

          // if (response.data.total === 1 && !response.data.result[0].children.length) { // Sin nodos
          //   this.frmData.category_id = [response.data.result[0].id]
          //   return
          // }

          this.categories = response.data.result

          await this.setSleep(100)
          const LeafIds = await this.getAllLeafIds(this.categories)
          // console.log('LeafIds-->', LeafIds)
          this.frmData.category_id = LeafIds
          //   this.frmDisabled.category = false
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('storeNotif/error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getIndicators () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicators?type=getwithdata`
        const response = await axios.get(url)
        // console.log(response.data)
        if (response.data.success) {
          this.indicators = response.data.result
          // this.frmData.indicator_id = this.indicators[1].id
        }
      } catch (error) {
        console.log(error)
      }
    },

    async submit () {
      // this.$refs.notifier.success('Operación realizada correctamente')
      // console.log('submit-->', value)

      if (!this.$refs.form_item.validate()) {
        // this.$refs.notifier.error('¡Favor de seleccionar las opciones obligatorias para generar la consulta!')
        this.$store.dispatch('storeNotif/error', {
          message: '¡Favor de seleccionar las opciones obligatorias para generar la consulta!'
        })
        return ''
      }

      const sendData = {
      // category_id: [1, 2, 3],
      // year_id: [24, 25, 26],
      // gender_id: [1, 2],
      // state_id: [1, 2, 3]
        category_id: [],
        state_id: [],
        year_id: []
      }

      if (this.frmData.state_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.states
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.state_id = ids
      } else {
        sendData.state_id = this.frmData.state_id
      }

      if (this.frmData.year_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.years
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.year_id = ids
      } else {
        sendData.year_id = this.frmData.year_id
      }

      if (this.frmData.gender_id.includes(0)) { // Quitar { id: 0, title: 'Todos' }
        const ids = this.genders
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.gender_id = ids
      } else {
        sendData.gender_id = this.frmData.gender_id
      }

      const categoryIds = this.frmData.category_id
        .filter(item => item !== 0)
        .map(item => item)

      if (!categoryIds.length) {
        // return this.$refs.notifier.error('¡Favor de seleccionar al menos una de las categorías disponobles!')
        this.$store.dispatch('storeNotif/error', {
          message: '¡Favor de seleccionar al menos una de las categorías disponobles!'
        })
        return
      }
      sendData.category_id = categoryIds

      // return console.log(sendData)
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=getdata`
        const response = await axios.post(url, sendData)
        console.log(response.data.result)
        // if (response.data.status === 200) {
        //   console.log(response.data.result)
        // }
      } catch (error) {
        // console.log(error)
        console.log(error.response.data)
      }
    },
    async reset () {
      this.$refs.form_checker.reset()
      setTimeout(() => {
        this.$refs.txt_exp.focus()
      }, '100')
    },
    onSubmit (e) {
      if (!this.htmlSubmit) {
        e.preventDefault()
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // =========================================================================================
    await this.getDataLiner()
    await this.setSleep(1500)
    this.dialogData.actived = true
    // =========================================================================================
    // this.getIndicators()
    // this.getStates()
    // this.getYears()
    // this.getGenders()
    // =========================================================================================

    // this.$refs.notifier.success('Operación realizada correctamente')
    // =========================================================================================
    // this.dialog_loader.actived = true
    // this.dialog_loader.message = 'Por favor espere...'
    // await this.setSleep(2500)
    // this.dialog_loader.actived = false
    // this.dialog_loader.message = ''

    // =========================================================================================
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

    // =========================================================================================
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
  mounted () {
    this.initMap()
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
  /* #mapView {
    background-color: #CFC6BA;
  } */
  /* .v-input {
    font-size: 14px;
  }
  .v-label {
    font-size: 25px !important;
  } */
  .chip-select {
    font-size: 12px;
    padding: 0 8px;
    margin: 0 1px !important;
    text-overflow: ellipsis;
  }
  .span-select {
    font-size: 11px;
    padding: 0 5px !important;
  }

  /* .btn-append-outer {
    position: relative;
    left: 0px;
    padding: 0px 0px 0px 0px;
    margin: 0px 0px 0px 0px;
  } */

  ::v-deep .select-compacto .v-input__append-outer {
    margin-left: 2px !important; /* Cambia a 0px si lo quieres 100% pegado */
  }

  /* --------------------------------treeview------------------------------------------------ */
  /* Label tipo v-text-field */
  .tree-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }

  /* Contenedor general */
  .tree-compact {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    max-height: 280px;
    overflow-y: auto;
  }

  /* Cada nodo */
  .tree-compact ::v-deep .v-treeview-node__root {
    min-height: 20px !important;
    padding: 0 4px !important;
  }

  /* Texto del nodo */
  .tree-compact ::v-deep .v-treeview-node__label {
    font-size: 12px;
    line-height: 1.2 !important;
  }

  /* --------------------------------Checkbox------------------------------------------------ */
  /* Checkbox */
  .tree-compact ::v-deep .v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Iconos (expand + checkbox) */
  /* .tree-compact ::v-deep .v-icon {
    font-size: 20px !important;
  } */

  .tree-compact ::v-deep .v-treeview-node__checkbox {
    width: 10px !important;
    /* font-size: 25px !important; */
    transform: scale(0.85) !important;
  }

  /* -------------------------------------------------------------------------------- */
  /* Botón del icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle {
    width: 25px;
    height: 25px;
  }

  /* Icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle .v-icon {
    font-size: 20px !important;
  }

  /* Estado activo (seleccionado / focus) */
  .tree-compact ::v-deep .v-treeview-node__toggle.v-btn--active {
    border-radius: 50%;
  }

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

  .drawer-gradient {
    /* position: relative;
    overflow: hidden; */

    background: linear-gradient(
      to bottom,
      #b62b86 0%,
      #e30c7e 100%
    ) !important;

    color: white;
  }
  .drawer-gradient::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }
  /* Más contraste en dark mode */
  .theme--dark .drawer-gradient::before {
    background: rgba(0, 0, 0, 0.25);
  }
  .drawer-content {
    position: relative;
    z-index: 1;
    /* padding: 10px; */
    padding: 5px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* ===============================  CONTENEDOR PRINCIPAL  =============================== */
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 93vh;
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
    width: 400px; /* Ancho en escritorio */
    max-width: calc(100vw - 40px); /* Evita que desborde si la pantalla es menor a 440px */
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
