import { Bubble } from 'vue-chartjs'
export default {
  extends: Bubble,
  props: ['data', 'options'],
  mounted () {
    // console.log('renderChart()--> BubbleChart')
    this.$nextTick(() => {
      setTimeout(() => {
        this.renderChart(this.data, this.options)
      }, 100) // pequeño delay para asegurar visibilidad
    })
  }
}
