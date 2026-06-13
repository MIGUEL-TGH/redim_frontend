import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
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
