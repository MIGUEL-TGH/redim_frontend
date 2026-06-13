import { PolarArea } from 'vue-chartjs'
export default {
  extends: PolarArea,
  props: ['data', 'options'],
  mounted () {
    // console.log('renderChart()--> PolarAreaChart')
    this.$nextTick(() => {
      setTimeout(() => {
        this.renderChart(this.data, this.options)
      }, 100) // pequeño delay para asegurar visibilidad
    })
  }
}
