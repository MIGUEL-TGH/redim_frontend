<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <custom-navbar />
      <!-- <span class="ml-2 font-weight-bold">REDIM</span> -->
      <v-spacer></v-spacer>
    </v-app-bar>

    <div class="map-wrapper">
      <div id="viewDiv" ref="mapView"></div>

      <logos-cards />

      <left-filter-deck
        :indicators="indicators"
        :states="states"
        :years="years"
        :genders="genders"
        :categories="categories"
        @fetch-categories="getCategories"
        @submit="handleSubmit"
        @clear-categories="categories = []"
      />

      <!-- PANEL ESTADÍSTICO -->
      <div class="stats-panel">
        <stack-cards :category_details="category_details"/>
      </div>
    </div>

    <loader-comp />
    <view-notifications-comp ref="notifier"/>

  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'
import StackCards from '@/components/map/StackCards.vue'
import LogosCards from '@/components/map/LogosCards.vue'
import CustomNavbar from '@/components/map/CustomNavbar.vue'
import LeftFilterDeck from '@/components/map/LeftFilterDeck.vue'

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
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Basemap from '@arcgis/core/Basemap'

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
    LeftFilterDeck
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
      // data form =======================================================================
      category_details: [],
      indicators: [],
      categories: [],
      years: [],
      genders: [],
      states: [],
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
      stopWatchHandle: null,
      graphicsLayer: null
      // vue
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
              color: item.outlineColor || 'gray' // black
            }
          }
        },
        title: 'GeoJSON Layer',
        zIndex: 10, // Asegura que esté debajo de los gráficos
        effect: item.effect || null
      }

      if (item.type === 'rendered') {
        layerOptions.url = URL.createObjectURL(
          new Blob([JSON.stringify(item.data)], { type: 'application/json' })
        )
      } else if (item.type === 'files') {
        layerOptions.url = item.url
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
        center: [-102.37592182483502, 24.097127823504444],
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

      // 4. Esperar a que la vista esté lista antes de agregar el componente
      await this.view.when()

      // 5. Agregamos la capa de México con el efecto de SOMBRA
      await this.AddGeoJSONLayer({
        url: '/assets/WGS84_04.json',
        color: '#b8ab9b', // Relleno de los estados
        outlineColor: '#efeee8', // Color del contorno
        type: 'files',
        effect: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.35))' // Efecto sombreado
      })

      // await this.AddGeoJSONLayer({ url: 'https://sdti-ippi.github.io/SIEPI/multimedia/20192024/map_layers/puebla.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/32entMX05.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/WGS84_04.json', color: [184, 171, 155, 0.9], type: 'files' })
      // await this.AddGeoJSONLayerV1({ url: '/assets/WGS84_04.json', color: [130, 130, 130, 0.1], type: 'files' })
    },
    // ======================================================================================================================================
    async getGenders () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=genders`
        const response = await axios.get(url)
        if (response.data.status === 200) {
          this.genders = response.data.result
          this.genders.unshift({ id: 0, title: 'Todos' })
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
        // console.log('result', response.data)
        if (response.data.status === 200) {
          this.states = response.data.result
          this.states.unshift({ id: 0, title: 'Todos' })
          // this.frmData.state_id = [0]
          // console.log(this.states)
        }
      } catch (error) {
        console.log(error)
        console.log(error.response.data)
      }
    },
    async getCategories (sendData) {
      try {
        if (!sendData.length) {
          this.$store.dispatch('storeNotif/error', {
            message: 'Debe de seleccionar al menos algún tipo de población para solicitar tipos de delitos asociados'
          })
          return
        }

        const url = `${process.env.VUE_APP_API_SERVER}map?type=categories`
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

    async handleSubmit (formData) {
      // console.log('submit-->', formData)

      // this.category_details = []

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

      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=getdata`
        const response = await axios.post(url, sendData)
        if (response.data.status === 200) {
          // await this.setSleep(1000)
          this.category_details = response.data.result
        }
      } catch (error) {
        console.log(error)
        console.log(error.response.data)
      }
    }
    // ======================================================================================================================================
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // ======================================================================================================================================
    this.getIndicators()
    this.getStates()
    this.getYears()
    this.getGenders()
    // this.getCategories([1, 2, 3, 4])

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
