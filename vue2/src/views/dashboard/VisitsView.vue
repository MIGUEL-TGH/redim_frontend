<template>
  <v-container>
    <section>
      <div class="title-mod">
        <h2>{{ title }}</h2>
      </div>
    </section>

    <!-- Tarjetas resumen -->
    <section>
      <v-row dense>
        <v-col cols="12" sm="4">
          <v-card class="elevation-5 pa-3 text-center">
            <div class="stat-label">Visitas totales</div>
            <div class="stat-value">{{ totalVisits }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="elevation-5 pa-3 text-center">
            <div class="stat-label">Visitas hoy</div>
            <div class="stat-value">{{ totalToday }}</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="elevation-5 pa-3 text-center">
            <div class="stat-label">Vistas registradas</div>
            <div class="stat-value">{{ dataTable.items.length }}</div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Gráfica de tendencia -->
    <section class="mt-4">
      <v-card class="elevation-5 pa-3">
        <v-card-title class="content-title pt-0">
          <p class="mb-0">Tendencia de visitas</p>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="rangeDays" mandatory dense color="#246257" @change="getSeries">
            <v-btn :value="7" small>7 días</v-btn>
            <v-btn :value="30" small>30 días</v-btn>
            <v-btn :value="90" small>90 días</v-btn>
          </v-btn-toggle>
        </v-card-title>

        <div class="chart-wrapper">
          <chart-comp v-if="hasTrend" type="line" :data="trendData" :options="trendOptions" />
          <div v-else class="chart-empty">
            Aún no hay visitas registradas en este periodo.
          </div>
        </div>
      </v-card>
    </section>

    <!-- Tabla de detalle -->
    <section class="mt-4">
      <v-card-title class="content-title">
        <p>Detalle por vista</p>
        <v-spacer></v-spacer>
        <v-text-field v-model="searchInput" @input="debounceSearch" type="text" label="Buscar vista..." append-icon="mdi-magnify" color="#246257" hide-details class="search-field">
          <template v-slot:append-outer>
            <v-btn class="mr-2 text-white" color="#246257" elevation="5" small @click="reload"> Actualizar </v-btn>
          </template>
        </v-text-field>
      </v-card-title>

      <v-data-table :headers="dataTable.headers" :items="dataTable.items" :search="dataTable.search" :items-per-page="15" class="elevation-5">
        <template v-slot:item.view_key="{ item }">
          <code class="view-key">{{ item.view_key }}</code>
        </template>
        <template v-slot:item.total="{ item }">
          <strong>{{ item.total }}</strong>
        </template>
        <template v-slot:item.last_seen="{ item }">
          {{ formatDate(item.last_seen) }}
        </template>
      </v-data-table>
    </section>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import ChartComp from '@/components/ChartComp.vue'

export default {
  // 1️⃣ Identificación
  name: 'VisitsView',
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
      title: 'Contador de Visitas',
      searchInput: '', // Lo que el usuario está tecleando
      searchTimeout: null, // Temporizador del buscador
      // Paleta alineada al proyecto para las líneas (se recicla si hay más vistas)
      palette: ['#342a83', '#b62b86', '#ed712c', '#2e91ce', '#6a3d8f', '#246257', '#686d4a', '#e0a800', '#c4ac9c'],
      rangeDays: 30, // Rango activo de la gráfica de tendencia
      series: [], // Filas crudas (view_key, visit_date, hits) del endpoint
      trendData: { labels: [], datasets: [] },
      trendOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom',
          labels: { fontColor: '#595555', boxWidth: 12, fontSize: 11 }
        },
        elements: {
          line: { tension: 0.3 }
        },
        scales: {
          yAxes: [{
            ticks: { fontColor: '#858181', beginAtZero: true, precision: 0 },
            gridLines: { color: 'rgba(0, 0, 0, 0.06)' }
          }],
          xAxes: [{
            ticks: { fontColor: '#858181', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
            gridLines: { display: false }
          }]
        },
        tooltips: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(36, 98, 87, 0.9)'
        }
      },
      dataTable: {
        search: '',
        headers: [
          { text: 'Vista', value: 'label', class: 'bg-dark white--text' },
          { text: 'Identidad', value: 'view_key', class: 'bg-dark white--text' },
          { text: 'Ruta', value: 'path', class: 'bg-dark white--text' },
          { text: 'Total', value: 'total', class: 'bg-dark white--text', align: 'right' },
          { text: 'Hoy', value: 'today', class: 'bg-dark white--text', align: 'right' },
          { text: 'Última visita', value: 'last_seen', class: 'bg-dark white--text' }
        ],
        items: []
      }
    }
  },
  computed: {
    ...mapState([
      'dialog_loader'
    ]),
    totalVisits () {
      return this.dataTable.items.reduce((acc, item) => acc + (item.total || 0), 0)
    },
    totalToday () {
      return this.dataTable.items.reduce((acc, item) => acc + (item.today || 0), 0)
    },
    hasTrend () {
      return this.trendData.labels.length > 0 && this.trendData.datasets.length > 0
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    debounceSearch (val) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.dataTable.search = val
      }, 500)
    },
    formatDate (value) {
      if (!value) return '—'
      const date = new Date(value.replace(' ', 'T'))
      if (isNaN(date.getTime())) return value
      return date.toLocaleString('es-MX', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      })
    },
    // Clave 'YYYY-MM-DD' a partir de componentes locales (evita corrimientos por zona horaria)
    dateKey (dateObj) {
      const y = dateObj.getFullYear()
      const m = String(dateObj.getMonth() + 1).padStart(2, '0')
      const d = String(dateObj.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },
    // Genera el eje X continuo de los últimos N días (incluye días sin visitas)
    buildDateAxis (days) {
      const keys = []
      const labels = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      for (let i = days - 1; i >= 0; i--) {
        const dt = new Date(today)
        dt.setDate(today.getDate() - i)
        keys.push(this.dateKey(dt))
        labels.push(`${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}`)
      }
      return { keys, labels }
    },
    buildTrend () {
      const { keys, labels } = this.buildDateAxis(this.rangeDays)

      // Agrupamos los hits por vista y por fecha
      const byView = {}
      this.series.forEach(row => {
        if (!byView[row.view_key]) byView[row.view_key] = {}
        byView[row.view_key][row.visit_date] = row.hits
      })

      // Diccionario view_key -> label legible (desde el resumen ya cargado)
      const labelOf = {}
      this.dataTable.items.forEach(item => {
        labelOf[item.view_key] = item.label || item.view_key
      })

      const datasets = []

      // 1) Línea de Total diario (suma de todas las vistas), resaltada
      const totalData = keys.map(k =>
        Object.keys(byView).reduce((acc, vk) => acc + (byView[vk][k] || 0), 0)
      )
      datasets.push({
        label: 'Total',
        data: totalData,
        borderColor: '#3c3c3b',
        backgroundColor: 'rgba(60, 60, 59, 0.08)',
        borderWidth: 3,
        pointRadius: 2,
        fill: true
      })

      // 2) Una línea por vista
      Object.keys(byView).forEach((vk, idx) => {
        const color = this.palette[idx % this.palette.length]
        datasets.push({
          label: labelOf[vk] || vk,
          data: keys.map(k => byView[vk][k] || 0),
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          pointRadius: 2,
          fill: false
        })
      })

      this.trendData = { labels, datasets }

      // vue-chartjs 2.x dibuja el canvas con un setTimeout(100ms) interno; si el
      // contenedor aún no tiene ancho, queda en 0px. Forzamos un resize cuando ya
      // hay layout para que Chart.js (responsive) ajuste el tamaño correcto.
      this.$nextTick(() => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 250)
      })
    },
    async getVisits () {
      const url = `${process.env.VUE_APP_API_SERVER}visits?type=getdata`
      const response = await axios.get(url)
      if (response.data.success) {
        this.dataTable.items = response.data.result
      }
    },
    async getSeries () {
      const url = `${process.env.VUE_APP_API_SERVER}visits?type=series&days=${this.rangeDays}`
      const response = await axios.get(url)
      if (response.data.success) {
        this.series = response.data.result
        this.buildTrend()
      }
    },
    async reload () {
      this.dialog_loader.message = 'Actualizando visitas...'
      this.dialog_loader.actived = true
      await this.getVisits()
      await this.getSeries()
      this.dialog_loader.actived = false
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.dialog_loader.message = 'Cargando visitas...'
    this.dialog_loader.actived = true

    await this.getVisits()
    await this.getSeries()

    this.dialog_loader.actived = false
  },
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
  .stat-label {
    font-size: 0.85rem;
    color: #6b6b6b;
  }
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #246257;
  }
  .view-key {
    background-color: #eef2f1;
    color: #246257;
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
  }
  .chart-wrapper {
    position: relative;
    width: 100%;
    height: 400px;
  }
  .chart-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #9e9e9e;
    font-style: italic;
  }
</style>
