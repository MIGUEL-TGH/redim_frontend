<template>
  <div class="stack-wrapper">
    <div class="stack-container">
      <div v-for="(card, index) in cards" :key="index" class="stack-item" :class="{ 'is-active': activeIndex === index }" :style="getItemStyle(index)">

        <!-- <div class="stack-header" :class="{ 'un-active': shouldApplyUnactive(index) }" :style="{ background: card.gradient }" @click="toggle(index)"> -->
        <div class="stack-header" :class="{ 'first-header': index === 0 }" :style="{ background: card.gradient }" @click="toggle(index)">
            <span class="stack-title">{{ card.title }}</span>

            <div>
              <v-icon color="white" class="thick-icon">
                {{ activeIndex === index ? 'mdi-minus' : 'mdi-plus' }}
              </v-icon>
            </div>
        </div>

        <v-expand-transition>
          <div v-show="activeIndex === index" class="stack-content">
            <slot :name="card.id">
              <div v-if="card.id === 'poblacion' || card.id === 'genders' || card.id === 'states'">
                <div style="padding: 15px;">
                  <div class="chart-wrapper">
                    <!-- {{ activeIndex }} / {{ index }} -->
                    <ChartComp
                      v-if="myChartName && myChartData && myChartData.datasets && myChartData.datasets.length > 0 && myChartData.labels && myChartData.labels.length > 0"
                      :type="myChartName"
                      :data="myChartData"
                      :options="myChartOptions"
                      :styles="{ height: '250px', position: 'relative' }"
                      :refresh="activeIndex === index"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="fake-content" style="padding: 15px;">
                <p>Estadísticas para {{ card.title }}</p>
                <div class="simple-bar" style="width: 80%"></div>
                <div class="simple-bar" style="width: 60%"></div>
                <div class="simple-bar" style="width: 40%"></div>
              </div>
            </slot>
          </div>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script>
import Charts from '@/js/charts.js'
import ChartComp from '@/components/ChartComp.vue'

import { /* mapState, */ mapActions } from 'vuex'

export default {
  // 1️⃣ Identificación
  name: 'StackCardsComp',
  components: { // Importación de componentes hijos
    ChartComp
  },
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {
    // category_details: { type: Array, default: () => [] },
    chartDataYear: { type: Array, default: () => [] },
    chartDataGender: { type: Array, default: () => [] },
    chartDataState: { type: Array, default: () => [] }
    // isShowCards: { type: Boolean, default: false }
  },
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      activeIndex: null, // 0
      overlapMargin: -30,
      cards: [
        {
          id: 'poblacion',
          title: 'Población total',
          baseColor: '#e255a1',
          gradient: 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)'
        },
        {
          id: 'genders',
          title: 'Población por sexo',
          baseColor: '#556cd6',
          gradient: 'linear-gradient(90deg, #2196F3 0%, #3F51B5 100%)'
        },
        {
          id: 'states',
          title: 'Población por estados',
          baseColor: '#ff7a1a',
          gradient: 'linear-gradient(90deg, #FF9800 0%, #FF5722 100%)'
        },
        {
          id: 'internados',
          title: 'Señalados e Internados',
          baseColor: '#17b35f',
          gradient: 'linear-gradient(90deg, #4CAF50 0%, #009688 100%)'
        }
      ],
      // charts =======================================================================
      myChartName: '',
      myChartData: {},
      myChartOptions: {}
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {
    chartDataYear: {
      // immediate: true, // Se ejecuta apenas se crea el componente
      handler (newData) {
        // console.log('chartDataYear --> ', newData)
        if (newData && newData.length > 0) {
          // this.renderCharts({ type: 'line', data: newData })
          this.renderCharts({ type: 'line', data: newData, labelKey: 'year' })
          this.activeIndex = 0
        } else {
          this.activeIndex = null
        }
      }
    },
    chartDataGender: {
      // immediate: true, // Se ejecuta apenas se crea el componente
      handler (newData) {
        // console.log('chartDataGender --> ', newData)
        if (newData && newData.length > 0) {
          // this.renderCharts({ type: 'bar', data: newData })
          this.renderCharts({ type: 'bar', data: newData, labelKey: 'gender' })
          this.activeIndex = 1
        } else {
          this.activeIndex = null
        }
      }
    },
    chartDataState: {
      // immediate: true, // Se ejecuta apenas se crea el componente
      handler (newData) {
        // console.log('chartDataState --> ', newData)
        if (newData && newData.length > 0) {
          // this.renderCharts({ type: 'bar', data: newData })
          this.renderCharts({ type: 'bar', data: newData, labelKey: 'state' })
          this.activeIndex = 2
        } else {
          this.activeIndex = null
        }
      }
    }
  },

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    toggle (index) {
      // console.log(index)
      // this.activeIndex = this.activeIndex === index ? null : index
      // =====================================================================================
      if (this.activeIndex === index) {
        this.activeIndex = -1 // Cierra si se vuelve a hacer clic en el mismo
      } else {
        this.activeIndex = index // Abre la tarjeta actual
        // 🟢 NUEVO: Emitimos un evento al padre avisando qué tarjeta se abrió
        this.$emit('toggle-card', index)
      }
    },
    getItemStyle (index) {
      const isFirst = index === 0
      // const isActive = this.activeIndex === index

      return {
        zIndex: this.cards.length - index,

        // Si es la primera, no lleva margen.
        // Si la anterior está abierta, tampoco debería encimarse tanto.
        marginTop: isFirst ? '0px' : `${this.overlapMargin}px`,

        // Añadimos una transición suave para el margen
        transition: 'margin 0.4s ease, transform 0.3s ease'
      }
    },
    shouldApplyUnactive (index) {
      // No aplicar si es el primero
      if (index === 0) return false
      // Aplicar solo si no es el activo
      return this.activeIndex !== index
    },
    // CHARTS ========================================================================================================
    async renderCharts (element) {
      // console.log('renderCharts --> ', element)
      // // 1. Instancias tu clase
      const chartProcessor = new Charts()

      // // 2. Opciones de diseño general (Dark Mode para Vuetify)
      const optionsBarLine = {
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

      if (element.type === 'refresh') {
        await chartProcessor.setRefreshChart()
      } else if (element.type === 'line' && element.labelKey === 'year') {
        await chartProcessor.setBarLine(element.data, element.labelKey)
        this.myChartOptions = optionsBarLine
      } else if (element.type === 'bar' && element.labelKey === 'state') {
        await chartProcessor.setBarLine(element.data, element.labelKey)
        this.myChartOptions = optionsBarLine
      } else if (element.type === 'bar' && element.labelKey === 'gender') {
        await chartProcessor.setGenderBar(element.data)
        this.myChartOptions = optionsBarLine
      }

      // else if (element.type === 'bar') {
      //   await chartProcessor.setGenderBar(element.data)
      //   this.myChartOptions = optionsBarLine
      // } else if (element.type === 'line') {
      //   await chartProcessor.setBarLine(element.data, element.labelKey)
      //   this.myChartOptions = optionsBarLine
      // }

      await this.setSleep(100)
      // // 4. Inyectar datos al componente Vue
      this.myChartName = element.type
      this.myChartData = chartProcessor.attributes
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {

  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.
}
</script>

<style scoped>
  /* ===============================  CONTENEDOR PRINCIPAL  =============================== */
  /* Contenedor posicionado en el mapa (ArcGIS) */
  .stack-wrapper {
    width: 100%;
    font-family: 'Roboto', sans-serif;
  }
  .stack-container {
    display: flex;
    flex-direction: column;
  }

  .thick-icon {
    font-weight: bold;
    -webkit-text-stroke: 1px white;
  }

  /* ===============================  TARJETAS  =============================== */
  .stack-item {
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 -4px 10px rgba(0,0,0,0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
  }

  /* Cuando una tarjeta está activa, le damos un poco más de sombra */
  .stack-item.is-active {
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    margin-bottom: 10px;
    /* margin-top: 0 !important; */
  }

  /* ===============================  CABECERAS  =============================== */
  .stack-header {
    height: 70px;
    padding: 0 20px;
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: white;
  }
  .stack-header.un-active {
    /* height: 70px; */
    padding-top: 30px;
  }
  .stack-header.first-header {
    padding-top: 0px !important;
  }
  .stack-title {
    font-weight: bold;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Si el texto es muy largo en móviles, pone "..." */
  }

  .chart-wrapper {
    position: relative;
    width: 100%;
    /* Le damos 250px para respetar el max-height de 300px y el padding */
    /* height: 250px; */
  }

  .stack-content {
    background: white;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    /* max-height: 300px;
    overflow-y: auto; */
  }

  /* ===============================  ESTILOS INTERNOS DE EJEMPLO  =============================== */
  /* Estilos de ejemplo para el contenido interno */
  .fake-content {
    color: #444;
  }
  .simple-bar {
    height: 12px;
    background: #ff5252;
    margin: 10px 0;
    border-radius: 6px;
    opacity: 0.8;
  }

  /* ===============================  MEDIA QUERIES (Responsividad)  =============================== */
  /* Hover solo para pantallas que soportan puntero (Escritorio/Laptops) */
  @media (hover: hover) and (pointer: fine) {
    .stack-item:hover {
      transform: translateX(-5px); /* Un poco más sutil */
    }
  }
  /* Teléfonos Móviles (hasta 600px) */
  @media (max-width: 600px) {

    .stack-item {
      border-radius: 15px; /* Bordes un poco menos pronunciados en pantallas pequeñas */
    }

    .stack-header {
      height: 60px;
      padding: 0 15px;
    }

    .stack-header.un-active {
      height: 60px;
      padding-top: 25px; /* Se ajusta para que el traslape (-30px) siga funcionando visualmente */
    }

    .stack-title {
      font-size: 0.85rem; /* Texto un poco más pequeño para evitar saltos de línea */
    }
  }
</style>
