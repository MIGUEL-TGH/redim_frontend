import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['data', 'options'],
  mounted () {
    // console.log('renderChart()--> BarChart')
    this.$nextTick(() => {
      setTimeout(() => {
        this.renderChart(this.data, this.options)
      }, 100)
    })
  }
}
