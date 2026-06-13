import { Pie } from 'vue-chartjs'
export default {
  extends: Pie,
  props: ['data', 'options'],
  mounted () {
    // console.log('renderChart()--> PieChart')
    this.$nextTick(() => {
      setTimeout(() => {
        this.renderChart(this.data, this.options)
      }, 100) // pequeño delay para asegurar visibilidad
    })
  }
}
