<template>
    <component
      ref="chart"
      :is="chartComponent"
      :data="chartData"
      :options="chartOptions"
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
    refresh: Boolean
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
      // console.log('chartData() --> ', this.data)
      return this.data
    },
    chartOptions () {
      // console.log('chartOptions() --> ', this.options)
      return this.options
    }
  },
  mounted () {
    // console.log('mounted --> ChartComp.vue')
  },
  watch: {
    refresh (val) {
      // console.log('refresh--> ChartComp.vue ', val)
      if (val) {
        this.$nextTick(() => {
          if (this.$refs.chart && this.$refs.chart.renderChart) {
            // console.log('refresh-->', val)
          }
        })
      }
    }
  }
}
</script>
