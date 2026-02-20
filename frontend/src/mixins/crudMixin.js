import axios from 'axios'

export default {
  methods: {
    // SRP (Single Responsibility Principle)
    /* =====================================================
      Orquestador principal
    ====================================================== */
    async executeCrud (action) {
      try {
        this.dialog_loader.message = 'Procesando...'
        this.dialog_loader.actived = true

        const payload = this.buildPayload(action)
        // console.log(payload)

        const inDeveloper = false
        if (inDeveloper) {
          console.log(payload)
          // {task: 'insert', params: {…}}
          return {
            success: true
          }
        }

        const result = await this.sendRequest(payload)
        // console.log('result API REST:', result)

        await this.applyDomChange(result)
        return {
          success: true,
          data: result
        }
      } catch (error) {
        console.log(error.response?.data.message || error.message || error)
        console.log(error)
        this.$store.dispatch('error', {
          // message: error.message || 'Error en la operación'
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })

        return {
          success: false,
          error
        }
      } finally {
        this.dialog_loader.message = ''
        this.dialog_loader.actived = false
      }
    },

    /* =====================================================
      Construcción de payload genérico
    ====================================================== */
    buildPayload (action) {
      if (!this.entityConfig) {
        throw new Error('entityConfig no definido')
      }

      const payload = {
        task: null,
        params: {}
      }

      const TASKS = {
        INSERT: 'insert',
        UPDATE: 'update',
        STATUS: 'status'
      }

      switch (action.task) {
        case 'send_item':
          payload.params = { ...this.forms }

          if (this.params.id === 0) {
            payload.task = TASKS.INSERT
          } else {
            payload.task = TASKS.UPDATE
            payload.params.id = this.params.id
          }

          break

        case 'status_item':
          payload.task = TASKS.STATUS
          payload.params = {
            id: action.id,
            status: action.status ? 1 : 0
          }
          break

        default:
          throw new Error('Acción no soportada')
      }

      return payload
    },

    /* =====================================================
      Request HTTP genérico
    ====================================================== */
    async sendRequest (payload) {
      const url = `${process.env.VUE_APP_API_SERVER}${this.entityConfig.endpoint}?type=crud`
      const response = await axios.post(url, payload)
      if (response.data.status !== 200) {
        throw new Error(response.data.message)
      }

      return response.data.result
    },

    /* =====================================================
      Mutación del DOM genérica
    ====================================================== */
    applyDomChange (result) {
      const actions = {

        saved_item: () => {
          // this.dataTable.items.unshift({ ...this.forms, id: result.id })
          this.dataTable.items.unshift(result.item)
          this.$store.dispatch('success', {
            message: this.entityConfig.messages.saved
          })
        },

        updated_item: () => {
          const index = this.dataTable.items.findIndex(
            // item => item.id === result.id
            item => item.id === result.item.id
          )

          if (index !== -1) {
            // Object.assign(this.dataTable.items[index], this.forms)
            this.$set(this.dataTable.items, index, result.item)
          }

          this.$store.dispatch('success', {
            message: this.entityConfig.messages.updated
          })
        },

        status_updated: () => {
          const index = this.dataTable.items.findIndex(
            item => item.id === result.id
          )

          if (index !== -1) {
            this.dataTable.items[index].status = result.status
          }

          this.$store.dispatch('success', {
            message: this.entityConfig.messages.status
          })
        }
      }

      actions[result.task]?.()
    }
  }
}
