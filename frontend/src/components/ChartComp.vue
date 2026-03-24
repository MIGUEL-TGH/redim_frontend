<template>
  <component
    :key="componentKey"
    ref="chart"
    :is="chartComponent"
    :data="chartData"
    :options="chartOptions"
    :styles="styles"
  />
</template>

<script>
import LineChart from '@/components/charts/LineChart'
import DoughnutChart from '@/components/charts/DoughnutChart'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import RadarChart from './charts/RadarChart.js'
import PolarAreaChart from './charts/PolarAreaChart.js'
import BubbleChart from './charts/BubbleChart.js'

export default {
  name: 'ChartRenderer',
  props: {
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({ responsive: true, maintainAspectRatio: false })
    },
    refresh: Boolean,
    styles: {
      type: Object,
      default: () => ({ position: 'relative', height: '100%' })
    }
  },
  data () {
    return {
      componentKey: 0
    }
  },
  computed: {
    chartComponent () {
      const types = {
        line: LineChart,
        pie: PieChart,
        doughnut: DoughnutChart,
        bar: BarChart,
        radar: RadarChart,
        polararea: PolarAreaChart,
        bubble: BubbleChart
      }
      return types[this.type] || BarChart
    },
    chartData () {
      return this.data
    },
    chartOptions () {
      return this.options
    }
  },
  watch: {
    data: {
      deep: true,
      handler () {
        this.forceRerender()
      }
    },
    refresh (val) {
      if (val) {
        this.forceRerender()
      }
    }
  },
  methods: {
    forceRerender () {
      this.componentKey += 1
    }
  }
}
</script>
