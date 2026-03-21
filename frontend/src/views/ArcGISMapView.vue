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
        @submit="handleFilterSubmit"
      />

      <!-- PANEL ESTADÍSTICO -->
      <div class="stats-panel">
        <stack-cards />
      </div>
    </div>

    <loader-comp />
    <view-notifications-comp ref="notifier"/>

    <!-- <ChartComp
      :type="myChartName"
      :data="myChartData"
      :options="myChartOptions"
    /> -->

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
    // ChartComp
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
      indicators: [],
      categories: [],
      years: [],
      genders: [],
      states: [],

      // charts =======================================================================
      myChartName: '',
      myChartData: {},
      myChartOptions: {},
      dialogData: {
        actived: false
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
    // CHARTS ========================================================================================================

    // ================================================================================================================
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
    },
    // =================================================================================================

    /**
     * MÉTODO 2: handleFilterSubmit
     * Este método se ejecuta cuando el usuario presiona "Aplicar" en la tarjeta blanca.
     * Recibe el frmData COMPLETO, incluyendo el arreglo de category_id seleccionado en el árbol.
     */
    async handleFilterSubmit (formData) {
      try {
        console.log('Aplicando filtros al mapa ArcGIS:', formData)

        // 1. Petición a tu API para traer la data filtrada (GeoJSON, estadísticas, etc.)
        // const response = await axios.post('/api/map-data', formData)
        // const mapData = response.data

        // 2. Aquí va toda tu lógica existente de ArcGIS API for JavaScript
        // Por ejemplo, actualizar los graphics de la vista, cambiar el FeatureLayer, etc.
        // this.updateArcGISMap(mapData)

        // 3. Opcional: Actualizar también los datos del componente estadístico (StackCards)
        // this.updateStackCardsData(mapData.statistics)
      } catch (error) {
        console.error('Error al aplicar los filtros al mapa:', error)
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    // =========================================================================================
    // await this.renderLinerBarChart()
    // await this.renderPieDoughnutChart()
    // await this.setSleep(1500)
    // this.dialogData.actived = true
    // =========================================================================================
    this.getIndicators()
    this.getStates()
    this.getYears()
    this.getGenders()
    // this.getCategories([1, 2, 3, 4])
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
