import { Radar } from 'vue-chartjs'
export default {
  extends: Radar,
  props: ['data', 'options'],
  mounted () {
    // console.log('renderChart()--> RadarChart')
    this.$nextTick(() => {
      setTimeout(() => {
        this.renderChart(this.data, this.options)
      }, 100) // pequeño delay para asegurar visibilidad
    })
  }
}
