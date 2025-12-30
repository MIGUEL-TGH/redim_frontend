<template>
  <div>
    <v-app-bar app dark elevation="10" color="#ec1e4c" clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer_left_map=!drawer_left_map"></v-app-bar-nav-icon>
        REDIM
      <v-spacer></v-spacer>
        <img src="@/assets/logos/redim_logo.png" style="width: 100%; max-width: 60px; height: auto;">
    </v-app-bar>
    <div id="viewDiv" ref="mapView"></div>
    <v-navigation-drawer app dark v-model="drawer_left_map" width="250px" clipped style="padding-top: 10px;" color="#B0B0B0">
      Navegar por el mapa
    </v-navigation-drawer>
    <!-- #3c8c43 #4071b2-->

    <loader-comp />
  </div>
</template>

<script>
import LoaderComp from '@/components/LoaderComp.vue'

import '@/assets/css/style_maps.css'
import '@arcgis/core/assets/esri/themes/light/main.css'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils'
// import Graphic from '@arcgis/core/Graphic'
// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
// import Point from '@arcgis/core/geometry/Point'
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer'

// import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ArcGISMap',
  components: { // Importación de componentes hijos
    LoaderComp
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
      drawer_left_map: false
    }
  },
  computed: {
    ...mapState([
      'dialog_loader'
    ])
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    // vuex
    ...mapActions([
      'setSleep'
    ]),
    // map
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

      // -------------------------------highlight-----------------------------------------------------
      let highlightHandle = null
      let layerView = null
      let ObjectID = null

      // 1. Esperar a que el LayerView esté listo
      this.view.whenLayerView(geojsonLayer).then((lv) => {
        layerView = lv
      })

      this.view.on('pointer-move', async (event) => {
        if (!layerView) return

        const hit = await this.view.hitTest(event, {
          include: geojsonLayer
        })

        const graphic = hit.results[0]?.graphic

        // Cursor fuera de la capa
        if (!graphic) {
          if (highlightHandle) highlightHandle.remove()
          // layerView.effect = null
          ObjectID = null
          return
        }

        const objectId = graphic.attributes.__OBJECTID

        // ❗ Si sigue sobre el mismo estado, NO hacer nada
        if (objectId === ObjectID) return

        ObjectID = objectId
        // --------------------------------------------------------------------------------
        // 1. Highlight (opcional)
        if (highlightHandle) highlightHandle.remove()
        highlightHandle = layerView.highlight(graphic)

        // --------------------------------------------------------------------------------
        // 2. SOLO contorno usando effect
        // layerView.effect = {
        //   filter: {
        //     objectIds: [objectId]
        //   },
        //   includedEffect: 'drop-shadow(0px, 0px, 0px) brightness(1.2)',
        //   excludedEffect: 'opacity(0.2)'
        // }
      })

      // 2. Evento hover
      // this.view.on('pointer-move', async (event) => {
      //   if (!layerView) return

      // const hit = await this.view.hitTest(event)

      // const graphic = hit.results.find(
      //   (result) => result.graphic.layer === geojsonLayer
      // )?.graphic

      // Limpiar highlight anterior
      // if (highlightHandle) {
      //   highlightHandle.remove()
      //   highlightHandle = null
      // }

      // Aplicar nuevo highlight
      // if (graphic) {
      //   idLayerView = graphic.attributes.__OBJECTID
      //   console.log(graphic)
      //   highlightHandle = layerView.highlight(graphic)
      // }
      // })
    },

    async initMap () {
      console.log('initMap()')
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
      await this.AddGeoJSONLayer({ url: '/assets/32entMX05.geojson', color: [130, 130, 130, 0.1], type: 'files' })
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.dialog_loader.actived = true
    this.dialog_loader.message = 'Por favor espere...'
    // try {
    //   const url = `${process.env.VUE_APP_API_SERVER}map?type=items`
    //   console.log(url)

    //   const response = await axios.get(url)
    //   console.log(response.data.result)
    //   if (response.data.status === 200) {
    //     this.citas.all = response.data.result
    //   }
    // } catch (error) {
    //   console.log(error.response.data)
    //   console.log(error)
    // }
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

<style scoped></style>
