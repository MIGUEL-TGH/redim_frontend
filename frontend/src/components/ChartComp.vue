<template>
    <component
      ref="chart"
      :is="chartComponent"
      :data="chartData"
      :options="chartOptions"
    />
</template>

<script>
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import LineChart from '@/components/charts/LineChart'
import DoughnutChart from '@/components/charts/DoughnutChart'

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
        bar: BarChart,
        pie: PieChart,
        line: LineChart,
        doughnut: DoughnutChart
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
      console.log('refresh--> ChartComp.vue ', val)
      // if (val) {
      //   this.$nextTick(() => {
      //     if (this.$refs.chart && this.$refs.chart.renderChart) {
      //       console.log('refresh-->', val)
      //     }
      //   })
      // }
    }
  }
}
</script>
