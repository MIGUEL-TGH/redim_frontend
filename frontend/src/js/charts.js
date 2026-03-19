class ChartsOBJ {
  constructor () {
    this.id = 0
    this.name = ''
    this.attributes = {}
  }

  async setPieDoughnut (items) {
    try {
      this.attributes = {
        labels: [],
        datasets: [{ backgroundColor: [], data: [] }]
      }
      for (const element of items) {
        if (element) {
          if (element.color) {
            this.attributes.labels.splice(0, 0, element.desc)
            this.attributes.datasets[0].backgroundColor.splice(0, 0, element.color)
            this.attributes.datasets[0].data.splice(0, 0, element.data)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async setBar (items, headers) {
    try {
      items.sort((a, b) => {
        if (a.desc < b.desc) return -1
        if (a.desc > b.desc) return 1
        return 0
      })
      this.attributes = { labels: [], datasets: [] }
      const hasColorAttribute = headers.every(item => 'color' in item)
      // console.log('hasColorAttribute-->', hasColorAttribute)
      if (hasColorAttribute) {
        this.attributes.labels = items.map(item => item.desc)
        const hasColors = headers.filter(item => item.color !== null)
        for (const element of hasColors) {
          const dataChart = items.map(item => item[element.value])
          const dataValues = dataChart.map(value => parseFloat(value.replace(/,/g, '')))

          this.attributes.datasets.splice(0, 0,
            { label: element.text, backgroundColor: element.color, data: dataValues }
          )
        }

        this.attributes.datasets.sort((a, b) => {
          if (a.label < b.label) return -1
          if (a.label > b.label) return 1
          return 0
        })

        this.attributes.labels.sort()
      } else {
        for (const element of items) {
          const Data = []
          if (typeof element.data === 'string') {
            Data.push(element.data)
            this.attributes.labels.splice(0, 0, '')
          }
          this.attributes.datasets.splice(0, 0,
            { label: element.desc, backgroundColor: element.color, data: Data }
          )
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async setChart (type, element) {
    this.name = type
    const CHARTS = {
      pie: () => { this.setPieDoughnut(element.items) },
      doughnut: () => { this.setPieDoughnut(element.items) },
      bar: () => { this.setBar(element.items, element.headers) }
    }
    await CHARTS[type] ? CHARTS[type]() : console.log('chart not found!')
  }
}

export default ChartsOBJ
