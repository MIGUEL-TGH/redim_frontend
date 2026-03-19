import { Doughnut } from 'vue-chartjs'
export default {
  extends: Doughnut,
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
