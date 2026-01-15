<template>
  <div>
    <!-- <style src="@/assets/css/style_maps.css"></style> -->
    <v-app-bar app dark elevation="10" color="#ec1e4c" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
        REDIM
      <v-spacer></v-spacer>
        <img src="@/assets/logos/redim_logo.png" style="width: 100%; max-width: 60px; height: auto;">
    </v-app-bar>
    <div id="viewDiv" ref="mapView"></div>
    <v-navigation-drawer app v-model="drawer_left_map" width="260px" clipped style="padding: 10px !important;" color="#B2B2B1"> <!-- #B0B0B0-->
      <!-- Navegar por el mapa -->
      <v-form ref="form_item" style="padding-top: 5px;">
        <v-select v-model="frmData.indicator_id" item-value="id" item-text="title" :items="indicators" :rules="[v => !!v || 'Campo obligatorio']"
          dense filled background-color="#fafafa" color="#246257" @change="getCategories" label="Indicador*:">
          <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                <span>{{ truncateText(item.title, 30) }}</span>
              </v-chip>
            </template>
        </v-select>

        <v-select v-model="frmData.category_id" :items="categories" item-value="id" item-text="title" multiple :rules="[v => !!v.length || 'Campo obligatorio']" :item-disabled="isCategoryDisabled"
          dense filled background-color="#fafafa" color="#246257" label="Categoría*:">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                <span>{{ truncateText(item.title, 20) }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text span-select">
                (+{{ frmData.category_id.length - 1 }} más)
              </span>
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
          dense filled background-color="#fafafa" color="#246257" label="Género*:">
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0" small label color="#246257" class="chip-select" text-color="white">
                <span>{{ truncateText(item.title, 20) }}</span>
              </v-chip>
              <span v-if="index === 1" class="grey--text span-select">
                (+{{ frmData.gender_id.length - 1 }} más)
              </span>
            </template>
        </v-select>

        <v-btn color="#246257" elevation="5" @click="submit" block class="white--text">consultar</v-btn>
      </v-form>
    </v-navigation-drawer>

    <loader-comp />
    <view-notifications-comp ref="notifier"/>
  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'
import viewNotificationsComp from '@/components/viewNotifications.vue'

import '@/assets/css/style_maps.css'
import '@/assets/css/style_notifications.css'

import '@arcgis/core/assets/esri/themes/light/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
// import Graphic from '@arcgis/core/Graphic'
// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import Point from '@arcgis/core/geometry/Point'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'

import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
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
        this.throttle(pointerMoveHandler, 60) // ~16 FPS
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
        zoom: 5
      })

      await this.view.when() // Esperar a que la vista esté lista antes de agregar el componente

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
        const url = `${process.env.VUE_APP_API_SERVER}map?type=categories`
        const response = await axios.post(url, this.frmData.indicator_id)
        console.log(response.data)
        if (response.data.status === 200) {
          this.frmData.category_id = []
          this.categories = response.data.result
          this.categories.unshift({ id: 0, title: 'Todos' })
          this.frmData.category_id = [0]
        }
      } catch (error) {
        console.log(error)
      }
    },
    async getIndicators () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=indicators`
        const response = await axios.get(url)
        console.log(response.data)
        if (response.data.status === 200) {
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

      if (this.frmData.category_id.includes(0)) {
        const ids = this.categories
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.category_id = ids
      } else {
        sendData.category_id = this.frmData.category_id
      }

      if (this.frmData.state_id.includes(0)) {
        const ids = this.states
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.state_id = ids
      } else {
        sendData.state_id = this.frmData.state_id
      }

      if (this.frmData.year_id.includes(0)) {
        const ids = this.years
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.year_id = ids
      } else {
        sendData.year_id = this.frmData.year_id
      }

      if (this.frmData.gender_id.includes(0)) {
        const ids = this.genders
          .filter(item => item.id !== 0)
          .map(item => item.id)

        sendData.gender_id = ids
      } else {
        sendData.gender_id = this.frmData.gender_id
      }

      console.log(sendData)
      // console.log(this.frmData.category_id)
      try {
        const url = `${process.env.VUE_APP_API_SERVER}map?type=getdata`
        const response = await axios.post(url, sendData)
        console.log(response.data)
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
    this.getIndicators()
    this.getStates()
    this.getYears()
    this.getGenders()
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
  .v-input {
    font-size: 14px;
  }
  .v-label {
    font-size: 25px !important;
  }
  .chip-select {
    font-size: 12px;
    padding: 0 5px;
    margin: 0 0px !important;
  }
  .span-select {
    font-size: 11px;
    padding: 0 5px !important;
  }

</style>
