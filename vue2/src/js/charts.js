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

  // testCharts.vue =========================================================================================================
  async setComparativeLine (items) {
    try {
      // Ordenamos por año para asegurar que la línea fluya de izquierda a derecha
      // items.sort((a, b) => a.year - b.year)

      this.attributes = {
        labels: items.map(item => item.year),
        datasets: [
          {
            label: 'Población Internada',
            borderColor: '#e30c7e', // Color rosado/magenta que encaja con tu diseño
            backgroundColor: 'rgba(227, 12, 126, 0.1)',
            pointBackgroundColor: '#e30c7e',
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3, // Grosor de las líneas
            fill: false,
            data: items.map(item => item.PI)
          },
          {
            label: 'Población Señalada',
            borderColor: '#2e91ce', // Verde de contraste, ajústalo a la paleta UX
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            pointBackgroundColor: '#2e91ce',
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3, // Grosor de las líneas
            fill: false,
            data: items.map(item => item.PS)
          }
        ]
      }
    } catch (error) {
      console.log('Error procesando datos para Line Chart:', error)
    }
  }

  async setBarComparative (items) {
    try {
      // items.sort((a, b) => a.year - b.year)

      this.attributes = {
        labels: items.map(item => item.year),
        datasets: [
          {
            label: 'Población Internada',
            backgroundColor: 'rgba(227, 12, 126, 0.8)', // Rosa fucsia
            borderColor: '#e30c7e',
            borderWidth: 1,
            data: items.map(item => item.PI)
          },
          {
            label: 'Población Señalada',
            backgroundColor: 'rgba(76, 175, 80, 0.8)', // Verde
            borderColor: '#4caf50',
            borderWidth: 1,
            data: items.map(item => item.PS)
          }
        ]
      }
    } catch (error) {
      console.log('Error en Bar Chart:', error)
    }
  }

  async setRadarChart (labels, dataset1, dataset2) {
    try {
      this.attributes = {
        labels: labels, // ej: ['Robo', 'Lesiones', 'Daños', 'Otros']
        datasets: [
          {
            label: 'Año Anterior',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: '#ffffff',
            pointBackgroundColor: '#ffffff',
            borderWidth: 2,
            data: dataset1
          },
          {
            label: 'Año Actual',
            backgroundColor: 'rgba(227, 12, 126, 0.3)',
            borderColor: '#e30c7e',
            pointBackgroundColor: '#e30c7e',
            borderWidth: 2,
            data: dataset2
          }
        ]
      }
    } catch (error) { console.log(error) }
  }

  async setPolarAreaChart (labels, dataArray) {
    // const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo']
    // const dataMeses = [11, 16, 7, 3, 14]
    try {
      this.attributes = {
        labels: labels,
        datasets: [{
          data: dataArray,
          backgroundColor: [
            'rgba(227, 12, 126, 0.7)', // Rosa
            'rgba(76, 175, 80, 0.7)', // Verde
            'rgba(33, 150, 243, 0.7)', // Azul
            'rgba(255, 193, 7, 0.7)', // Amarillo
            'rgba(156, 39, 176, 0.7)' // Morado
          ],
          borderWidth: 1,
          borderColor: '#272727' // Color oscuro para separar las áreas
        }]
        // datasets: [{
        //   data: [10, 20, 30]
        // }],

        // labels: [
        //   'Red',
        //   'Yellow',
        //   'Blue'
        // ]
      }
    } catch (error) { console.log(error) }
  }

  async setBubbleChart (bubbleData1, bubbleData2) {
    // Ejemplo de entrada: [{x: 15, y: 10, r: 8}, {x: 17, y: 12, r: 15}]
    try {
      this.attributes = {
        datasets: [
          {
            label: 'Grupo A',
            backgroundColor: 'rgba(227, 12, 126, 0.6)',
            borderColor: '#e30c7e',
            borderWidth: 1,
            data: bubbleData1
          },
          {
            label: 'Grupo B',
            backgroundColor: 'rgba(76, 175, 80, 0.6)',
            borderColor: '#4caf50',
            borderWidth: 1,
            data: bubbleData2
          }
        ]
      }
    } catch (error) { console.log(error) }
  }

  // GLOBAL=========================================================================================================
  async setRefreshChart () {
    this.attributes = {
      labels: [],
      datasets: []
    }
  }

  async setGenderBar (items) {
    try {
      // 1. Extraer años únicos para los labels del eje X
      const years = [...new Set(items.map(item => item.year))].sort()

      // 2. Mapear la sumatoria (PI + PS) separada por género para los datasets
      const femaleData = years.map(y => {
        const match = items.find(i => i.year === y && i.gender === 'Mujer')
        return match ? (parseInt(match.PI) + parseInt(match.PS)) : 0
      })

      const maleData = years.map(y => {
        const match = items.find(i => i.year === y && i.gender === 'Hombre')
        return match ? (parseInt(match.PI) + parseInt(match.PS)) : 0
      })

      // 3. Formatear para ChartComp
      this.attributes = {
        labels: years,
        datasets: [
          {
            label: 'Mujeres',
            backgroundColor: 'rgba(227, 12, 126, 0.7)',
            data: femaleData
          },
          {
            label: 'Hombres',
            backgroundColor: 'rgba(33, 150, 243, 0.7)',
            data: maleData
          }
        ]
      }
    } catch (error) {
      console.log(error)
    }
  }

  async setBarLine (items, labelKey = 'year') {
    try {
      // Ordenamos por año para asegurar que la línea fluya de izquierda a derecha
      // items.sort((a, b) => a.year - b.year)

      this.attributes = {
        // labels: items.map(item => item.year),
        labels: items.map(item => item[labelKey]),
        datasets: [
          {
            label: 'Población Internada',
            borderColor: '#e30c7e',
            backgroundColor: 'rgba(227, 12, 126, 0.1)',
            pointBackgroundColor: '#e30c7e',
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3, // Grosor de las líneas
            fill: false,
            data: items.map(item => item.PI)
          },
          {
            label: 'Población Señalada',
            borderColor: '#2e91ce',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            pointBackgroundColor: '#2e91ce',
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 3, // Grosor de las líneas
            fill: false,
            data: items.map(item => item.PS)
          }
        ]
      }
    } catch (error) {
      console.log('Error procesando datos para Line Chart:', error)
    }
  }
}

export default ChartsOBJ
