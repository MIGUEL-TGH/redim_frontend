<template>
  <div>
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-container class="fill-height wrapper" fluid>
      <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar dark flat class="header-card">
                <v-toolbar-title>Graficos</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <ChartComp v-if="myChartName"
                  :type="myChartName"
                  :data="myChartData"
                  :options="myChartOptions"
                />
              </v-card-text>
              <v-card-actions>
                <div style="margin-top: 20px;">
                  <p class="text-center font-weight-bold">Pruebas UI:</p>
                  <!-- <v-btn small color="info" class="ma-1" @click="renderLinerBarChart()">Bar</v-btn> -->
                  <v-btn small color="#efeee8" class="ma-1" @click="testNewCharts('pie')">pie</v-btn>
                  <v-btn small color="#f44545" class="ma-1 white--text" @click="testNewCharts('doughnut')">doughnut</v-btn>
                  <v-btn small color="#6a3d8f" class="ma-1 white--text" @click="testNewCharts('line')">Line</v-btn>
                  <v-btn small color="#686d4a" class="ma-1 white--text" @click="testNewCharts('bar')">Bar</v-btn>
                  <v-btn small color="success" class="ma-1" @click="testNewCharts('radar')">Radar</v-btn>
                  <v-btn small color="warning" class="ma-1" @click="testNewCharts('polararea')">Polar</v-btn>
                  <v-btn small color="error" class="ma-1" @click="testNewCharts('bubble')">Burbuja</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
    </v-container>

  </div>
</template>

<script>

import Charts from '@/js/charts.js'
import ChartComp from '@/components/ChartComp.vue'

import { mapActions } from 'vuex'

export default {
  // 1️⃣ Identificación
  name: 'ChartsView',
  components: { // Importación de componentes hijos
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
      // charts =======================================================================
      myChartName: '',
      myChartData: {},
      myChartOptions: {}
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: { },

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep',
      'getParams'
    ]),
    // CHARTS ========================================================================================================
    async renderLinerBarChart () {
      const chartOptions = {
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
            tension: 0 // Hace que la línea tenga una curva suave (0.3). Ponlo en 0 para líneas totalmente rectas.
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#858181', // Números del eje Y
              beginAtZero: true
            },
            gridLines: {
              display: true, // Activa las líneas horizontales
              color: 'rgba(6, 0, 0, 0.2)', // Líneas horizontales sutiles
              borderDash: [5, 5], // Opcional: Crea el efecto punteado (5px línea, 5px espacio)
              zeroLineColor: 'rgba(255, 255, 255, 0.2)'
            }
          }],
          xAxes: [{
            ticks: {
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

      // await chartProcessor.setComparativeLine(rawData)
      await chartProcessor.setBarComparative(rawData)

      // 3. Pasas los datos procesados a Vue
      this.myChartName = 'bar' // line
      this.myChartData = chartProcessor.attributes
      this.myChartOptions = chartOptions
    },
    async renderPieDoughnutChart () {
      const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false
      }

      // 2. Le pasas tus datos puros de la BD
      const dataPieDoughnut = {
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
      }

      // 3. Pasas los datos procesados a Vue
      this.myChartName = 'doughnut' // pie doughnut
      this.myChartData = dataPieDoughnut
      this.myChartOptions = pieChartOptions
    },
    // Método temporal para testear los nuevos gráficos
    async testNewCharts (chartType) {
      // 1. Instanciamos tu clase
      const chartProcessor = new Charts()

      // 2. Opciones de diseño general (Dark Mode para Vuetify)
      const optionsRadarPolar = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { labels: { fontColor: '#ffffff' } },
        scale: {
          gridLines: { color: 'rgba(255, 255, 255, 0.15)' },
          pointLabels: { fontColor: '#e0e0e0', fontSize: 12 },
          ticks: { display: false }
        }
      }

      const optionsXY = { // Usado para Barras
        // responsive: true,
        // maintainAspectRatio: false,
        // legend: { labels: { fontColor: '#ffffff' } },
        // scales: {
        //   yAxes: [{ gridLines: { color: 'rgba(255, 255, 255, 0.15)' }, ticks: { fontColor: '#e0e0e0', beginAtZero: true } }],
        //   xAxes: [{ gridLines: { display: false }, ticks: { fontColor: '#e0e0e0' } }]
        // }
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
            tension: 0 // Hace que la línea tenga una curva suave (0.3). Ponlo en 0 para líneas totalmente rectas.
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#858181', // Números del eje Y
              beginAtZero: true
            },
            gridLines: {
              display: true, // Activa las líneas horizontales
              color: 'rgba(6, 0, 0, 0.2)', // Líneas horizontales sutiles
              borderDash: [5, 5], // Opcional: Crea el efecto punteado (5px línea, 5px espacio)
              zeroLineColor: 'rgba(255, 255, 255, 0.2)'
            }
          }],
          xAxes: [{
            ticks: {
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

      const optionsBubble = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { labels: { fontColor: '#ffffff' } },
        scales: {
          yAxes: [{ gridLines: { color: 'rgba(255, 255, 255, 0.15)' }, ticks: { fontColor: '#e0e0e0' } }],
          xAxes: [{ gridLines: { color: 'rgba(255, 255, 255, 0.15)' }, ticks: { fontColor: '#e0e0e0' } }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label || ''
              const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
              return `${label} -> (X: ${val.x}, Y: ${val.y}, Volumen: ${val.r})`
            }
          }
        }
      }

      const mockBarData = [
        { year: 2015, PI: 480, PS: 320 },
        { year: 2016, PI: 610, PS: 290 },
        { year: 2017, PI: 350, PS: 460 },
        { year: 2018, PI: 200, PS: 310 },
        { year: 2019, PI: 170, PS: 270 },
        { year: 2020, PI: 95, PS: 240 },
        { year: 2021, PI: 130, PS: 260 },
        { year: 2022, PI: 220, PS: 300 },
        { year: 2023, PI: 340, PS: 410 },
        { year: 2024, PI: 410, PS: 380 }
      ]

      const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false
      }
      const dataPieDoughnut = {
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
      }

      // 3. Generar la Data Simulada (Mock Data) según el tipo
      if (chartType === 'bar') {
        // Asumiendo que agregaste el método setBarComparative que te sugerí antes
        await chartProcessor.setBarComparative(mockBarData)
        this.myChartOptions = optionsXY
      } else if (chartType === 'line') {
        // Asumiendo que agregaste el método setBarComparative que te sugerí antes
        await chartProcessor.setComparativeLine(mockBarData)
        this.myChartOptions = optionsXY
      } else if (chartType === 'pie' || chartType === 'doughnut') {
        this.myChartName = chartType
        this.myChartData = dataPieDoughnut
        this.myChartOptions = pieChartOptions
        return
      } else if (chartType === 'radar') {
        const labels = ['Robo', 'Lesiones', 'Daños', 'Homicidio', 'Narcomenudeo']
        const dataAnterior = [65, 59, 90, 81, 56]
        const dataActual = [28, 48, 40, 19, 96]
        await chartProcessor.setRadarChart(labels, dataAnterior, dataActual)
        this.myChartOptions = optionsRadarPolar
      } else if (chartType === 'polararea') { // En tu ChartComp vi que usaste 'polararea' minúscula
        const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo']
        const dataMeses = [11, 16, 7, 3, 14]
        await chartProcessor.setPolarAreaChart(labels, dataMeses)
        this.myChartOptions = optionsRadarPolar
      } else if (chartType === 'bubble') {
        const dataGpoA = [
          { x: 14, y: 6, r: 15 }, // Ej. X: Edad 14, Y: 6 meses sentencia, R: 15 casos
          { x: 16, y: 12, r: 25 },
          { x: 18, y: 24, r: 10 }
        ]
        const dataGpoB = [
          { x: 15, y: 3, r: 8 },
          { x: 17, y: 8, r: 30 },
          { x: 18, y: 18, r: 5 }
        ]
        await chartProcessor.setBubbleChart(dataGpoA, dataGpoB)
        this.myChartOptions = optionsBubble
      }

      await this.setSleep(100)
      // 4. Inyectar datos al componente Vue y abrir el Modal
      this.myChartName = chartType
      this.myChartData = chartProcessor.attributes // Pasamos el JSON estructurado por tu clase

      // this.dialogData.title = 'Test: ' + chartType.toUpperCase()
      // this.dialogData.indicator = 'Previsualización de Mock Data'
      // this.dialogData.actived = true // Abre tu <v-dialog>
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
  },
  beforeMount () {},
  mounted () { },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () { },
  destroyed () { }

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.

}
</script>

<style scoped>
  /* ===============================  CONTENEDOR PRINCIPAL  =============================== */
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
  .wrapper {
    position: relative;
    width: 100%;
    height: 93vh;
  }
  .header-card {
    background: linear-gradient(90deg, #2196F3 0%, #3F51B5 100%)
  }
</style>
