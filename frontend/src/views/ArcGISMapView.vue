<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
        REDIM
      <v-spacer></v-spacer>
        <!-- <img src="@/assets/logos/redim_logo.png" style="width: 100%; max-width: 60px; height: auto;"> -->
    </v-app-bar>
    <!-- <v-col cols="12">
      <label class="tree-label">Categoría</label>
      <v-treeview selectable v-model="frmData.category_id" :items="categories" item-text="title" item-key="id"
        class="tree-compact" open-all selected-color="white"
      >
      </v-treeview>
    </v-col> -->

    <!-- <div id="viewDiv" ref="mapView"></div>
    <div id="InfoMap" class="esri-widget"></div> -->

    <div class="map-wrapper">
      <div id="viewDiv" ref="mapView"></div>

      <!-- TARJETA PROYECTO (abajo derecha) -->
      <div class="map-card map-card-left">
        <!-- <img src="@/assets/logos/proyecto.png" class="logo-project"> -->
          <img src="@/assets/logos/logos2.png" class="logo-project">
      </div>

      <!-- TARJETA INSTITUCIONAL (abajo izquierda) -->
      <div class="map-card map-card-right">
          <div class="card-logos">
          <!-- <img src="@/assets/logos/eu.png" class="logo-eu">
          <img src="@/assets/logos/redim.png" class="logo-redim">
          <img src="@/assets/logos/cam.png" class="logo-cam"> -->
          <img src="@/assets/logos/union_europea.png" class="logo-eu">
          <img src="@/assets/logos/redim_background.png" class="logo-redim">
          <img src="@/assets/logos/cam.jpg" class="logo-cam">
        </div>
      </div>
    </div>

    <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1">
    <!-- <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped class="drawer-gradient" > -->
      <div class="drawer-content">
        <!-- Navegar por el mapa -->
        <v-form ref="form_item" style="padding-top: 5px;">
          <v-select v-model="frmData.indicator_id" item-value="id" item-text="name" :items="indicators" :rules="[v => !!v || 'Campo obligatorio']"
            dense filled background-color="#fafafa" color="#246257" @change="getCategories" label="Indicador*:">
            <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ truncateText(item.name, 30) }}</span>
                </v-chip>
              </template>
          </v-select>

          <v-select v-model="frmData.state_id" :items="states" item-value="id" item-text="title" multiple :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isStateDisabled"
            dense filled background-color="#fafafa" color="#246257" label="Entidad Federativa*:">
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                  <span>{{ truncateText(item.title, 20) }}</span>
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
            <label class="tree-label">Categoría</label>
            <v-treeview selectable v-model="frmData.category_id" :items="categories" item-text="title" item-key="id"
              class="tree-compact" open-all selected-color="white"
            >
            </v-treeview>
            <!-- <br>
            {{ frmData.category_id }} -->
            <br>
          </div>

          <!-- <v-btn color="#246257" elevation="5" @click="submit" block class="white--text">consultar</v-btn> -->
          <v-btn color="#342a83" elevation="5" @click="submit" block class="white--text">consultar</v-btn>
        </v-form>
      </div>

    </v-navigation-drawer>

    <!-- <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1">
      redmi
    </v-navigation-drawer> -->

    <loader-comp />
    <view-notifications-comp ref="notifier"/>
  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/dashboard/viewNotifications.vue'
// import viewNotificationsComp from '@/components/viewNotifications.vue'

import '@/assets/css/style_maps.css'
import '@/assets/css/style_notifications.css'

import '@arcgis/core/assets/esri/themes/light/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Expand from '@arcgis/core/widgets/Expand'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
// import Graphic from '@arcgis/core/Graphic'
// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import Point from '@arcgis/core/geometry/Point'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'

import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  // 1️⃣ Identificación
  name: 'ArcGISMap',
  components: { // Importación de componentes hijos
    LoaderComp,
    viewNotificationsComp
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
      // map
      vector: [
        'streets-navigation-vector',
        'streets',
        'topo-vector',
        'satellite',
        'hybrid',
        'dark-gray-vector',
        'oceans',
        'national-geographic',
        'terrain',
        'satellite'
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
        indicator_id: null,
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
      isUpdatingState: false
    }
  },
  computed: {
    ...mapState([
      'dialog_loader'
    ])
  },

  // 4️⃣ Observadores
  watch: {
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
      'setSleep'
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
    async initMap () {
      // console.log('initMap()')
      this.map = new Map({
        basemap: this.vector[0] // 'streets-navigation-vector'
      })

      this.view = new MapView({
        container: this.$refs.mapView,
        map: this.map,
        // center: [-98.18635039767328, 19.054906905810686], // Estadio Olímpico Zaragoza
        // zoom: 7
        center: [-102.37592182483502, 24.097127823504444],
        zoom: 5,

        highlightOptions: {
          color: '#f44545', // 🔴 color del highlight
          haloColor: '#f44545', // 🔴 borde exterior
          haloOpacity: 1, // 0.9
          fillOpacity: 1 // 0.3
        }
      })

      await this.view.when() // Esperar a que la vista esté lista antes de agregar el componente

      this.WatchExpand = new Expand({
        view: this.view,
        content: document.getElementById('InfoMap'),
        group: 'top-right',
        visible: false,
        focusTrapDisabled: true
      })
      this.view.ui.add(this.WatchExpand, 'top-right')

      this.stopWatchHandle = reactiveUtils.watch(
        () => this.view.updating, // 🔹 propiedad reactiva
        async (updating) => {
          if (!updating) {
            await this.setSleep(1500) // 🔸 espera un poco para asegurar que todo terminó de renderizar
            this.dialog_loader.actived = false
          }
        }
      )

      // await this.AddGeoJSONLayer({ url: 'https://sdti-ippi.github.io/SIEPI/multimedia/20192024/map_layers/puebla.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      // await this.AddGeoJSONLayer({ url: '/assets/32entMX05.geojson', color: [130, 130, 130, 0.1], type: 'files' })
      await this.AddGeoJSONLayer({ url: '/assets/WGS84_04.json', color: [130, 130, 130, 0.1], type: 'files' })
    },
    // data
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
        // console.log(this.frmData.indicator_id)
        const url = `${process.env.VUE_APP_API_SERVER}map?type=categories`
        const response = await axios.post(url, this.frmData.indicator_id)
        console.log('getCategories() --> ', response.data.result)
        if (response.data.status === 200) {
          this.frmData.category_id = []
          this.categories = []

          if (response.data.total === 1 && !response.data.result[0].children.length) { // Sin nodos
            this.frmData.category_id = [response.data.result[0].id]
            return
          }

          this.categories = response.data.result

          await this.setSleep(100)
          const LeafIds = await this.getAllLeafIds(this.categories)
          // console.log('LeafIds-->', LeafIds)
          this.frmData.category_id = LeafIds
          //   this.frmDisabled.category = false
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('error', {
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
        this.$refs.notifier.error('¡Favor de seleccionar las opciones obligatorias para generar la consulta!')
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
        return this.$refs.notifier.error('¡Favor de seleccionar al menos una de las categorías disponobles!')
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
    // this.$refs.notifier.success('Operación realizada correctamente')
    // this.dialog_loader.actived = true
    // this.dialog_loader.message = 'Por favor espere...'
    // --------------------------------------------------------------------------------
    // this.getIndicators()
    // this.getStates()
    // this.getYears()
    // this.getGenders()
    // --------------------------------------------------------------------------------
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
  },
  beforeMount () {},
  mounted () {
    this.initMap()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {
  },
  destroyed () { }

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.

}
</script>

<style scoped>
  /* .v-input {
    font-size: 14px;
  }
  .v-label {
    font-size: 25px !important;
  } */
  .chip-select {
    font-size: 12px;
    padding: 0 5px;
    margin: 0 0px !important;
  }
  .span-select {
    font-size: 11px;
    padding: 0 5px !important;
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
    /* background: linear-gradient(
      90deg,
      #2e91ce 0%,
      #342a83 20%,
      #6a3d8f 40%,
      #b62b86 70%,
      #ed712c 100%
    ); */
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
    padding: 10px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* -------------------------------------------------------------------------------- */
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 93vh;
  }

  #viewDiv {
    width: 100%;
    height: 100%;
  }

  /* ===============================
    TARJETAS
  ================================ */

  .map-card {
    position: absolute;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);
    border-radius: 18px;
    padding: 16px 24px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.08);

    z-index: 10;

    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  /* Hover elegante */
  .map-card:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 28px rgba(0, 0, 0, 0.2),
      0 4px 10px rgba(0, 0, 0, 0.12);
  }

  /* Posiciones */
  .map-card-left {
    bottom: 20px;
    left: 20px;
  }

  .map-card-right {
    bottom: 20px;
    right: 20px;
  }

  /* ===============================
    LOGOS
  ================================ */

  .card-logos {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .card-logos img {
    height: 45px;
    object-fit: contain;
  }

  /* Ajustes específicos si se requiere */
  .logo-eu { height: 50px; }
  .logo-redim { height: 40px; }
  .logo-cam { height: 45px; }

  .logo-project {
    height: 60px;
  }

</style>
