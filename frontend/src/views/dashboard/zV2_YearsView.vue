<template>
    <v-container>
      <section>
        <div class="title-mod">
          <h2>{{title}}</h2>
        </div>
      </section>
      <section>
        <v-card-title class="content-title">
          <p>{{dataTable.items.length}} registros</p>
          <v-spacer></v-spacer>
          <v-text-field type="text" label="Buscar:" v-model="dataTable.search" append-icon="mdi-magnify" color="#246257" hide-details class="search-field">
            <template v-slot:append-outer>
              <v-btn class="mr-2 text-white" color="#246257" elevation="5" small @click="reset({task:'new_item'})">Nuevo</v-btn>
            </template>
          </v-text-field>
        </v-card-title>

        <v-data-table :headers="dataTable.headers" :items="dataTable.items" :search="dataTable.search"
          :items-per-page="10" :mobile-breakpoint="0" class="elevation-5">

              <template v-slot:item.acc="{item}">
                <v-icon dense @click="reset({task:'get_item', item})" class="BtnHover" color="green"> mdi-pencil </v-icon>
              </template>
              <template v-slot:item.status="{item}">
                <v-switch v-model="item.status" @change="submit({task:'status_item', id:item.id, status: $event})"
                  dense hide-details color="#246257" style="padding: 0px 0px 10px 0px !important;" label="">
                </v-switch>
              </template>

          </v-data-table>
      </section>

      <template>
        <v-dialog v-model="dialog_item.actived" scrollable max-width="500px" persistent>
          <v-card>
            <v-toolbar color="#9B162E" dark style="height: 43px !important;">
              <div style="height: 43px !important; padding: 0 16 0 0px;">
                {{dialog_item.title}}
              </div>
            </v-toolbar>
              <v-card-text style="max-height: 500px;">
                <br>
                <v-form ref="form_item" @submit="onSubmit">
                  <v-row>
                      <v-col cols="12" md="12" class="pa-1">
                        <v-text-field v-model="forms.name" :rules="rules.txt_year"  @keyup.enter="submit({task: 'send_item'})"
                          counter maxlength="4" type="text" label="Fecha:*" color="#246257">
                        </v-text-field>
                      </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-divider class="mx-4 pa-0 ma-1"></v-divider>
              <v-card-actions>
                  <v-spacer></v-spacer>
                  <!--- #9B162E #861E34  #AF1731  #246257--->
                  <v-btn @click="reset({task:'close_item'})" elevation="5" color="#9B162E" class="text-white" small> cancelar </v-btn>
                  <v-btn @click="submit({task: 'send_item'})" elevation="5" color="#246257" class="text-white" small> guardar </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

    </v-container>
</template>
<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'

export default {
  // 1️⃣ Identificación
  name: 'DBYearsView',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      title: 'Años',
      dataTable: {
        search: '',
        headers: [
          { text: 'ID', value: 'id', class: 'bg-dark white--text', width: '10%' },
          { text: 'Años', value: 'name', class: 'bg-dark white--text' },
          { text: 'edit', value: 'acc', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'center' },
          { text: '', value: 'status', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'right' }
        ],
        items: []
      },
      dialog_item: {
        title: '',
        actived: false
      },
      forms: {
        name: '',
        status: true
      },
      rules: {
        txt_year: [
          v => !!v || 'Se requiere el campo',
          v => /^\d{4}$/.test(v) || 'Debe ingresar un año válido de 4 dígitos'
        ]
      },
      params: {
        id: '0'
      }
    }
  },
  computed: {
    ...mapState([
      'dialog_loader'
    ])
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep'
    ]),
    // SRP (Single Responsibility Principle) -----------------------------------------------------------------------
    async buildPayload (action) {
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

          payload.params.status = 1
          break

        case 'status_item':
          payload.task = TASKS.STATUS
          payload.params = {
            id: action.id,
            status: action.status ? 1 : 0
          }
          break

        default:
          throw new Error('Acción no soportada en buildPayload')
      }

      return payload
    },
    async sendRequest (payload) {
      const url = `${process.env.VUE_APP_API_SERVER}years?type=crud`
      const response = await axios.post(url, payload)

      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Error en servidor')
      }

      return response.data.result
    },
    applyDomChange (result) {
      const actions = {
        saved_item: () => {
          this.dataTable.items.unshift({
            ...this.forms,
            id: result.id
          })

          this.$store.dispatch('success', {
            message: '¡Registro guardado correctamente!'
          })
        },

        updated_item: () => {
          const index = this.dataTable.items.findIndex(
            item => item.id === result.id
          )

          if (index !== -1) {
            Object.assign(this.dataTable.items[index], this.forms)
          }

          this.$store.dispatch('success', {
            message: '¡Registro actualizado correctamente!'
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
            message: '¡Estatus actualizado correctamente!'
          })
        }
      }

      actions[result.task]?.()
    },
    async CRUD_ELEMENT (action) {
      try {
        this.dialog_loader.message = 'Procesando...'
        this.dialog_loader.actived = true

        const payload = await this.buildPayload(action)
        const result = await this.sendRequest(payload)

        this.applyDomChange(result)

        this.reset({ task: 'close_item' })
        // console.log(result)
      } catch (error) {
        this.$store.dispatch('error', {
          message: error.message || 'Error en la operación'
        })
      } finally {
        this.dialog_loader.message = ''
        this.dialog_loader.actived = false
      }
    },
    // -------------------------------------------------------------------------------------------------------------

    async getYears () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}years?type=getdata`
        // console.log(url)
        const response = await axios.get(url)
        // console.log(response.data.result)
        if (response.data.status === 200) {
          this.dataTable.items = response.data.result
        }
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
      }
    },
    async reset (value) {
      // console.log('reset -->' ,value)
      const RESET_ = {
        new_item: async () => {
          this.params.id = 0
          this.dialog_item.actived = true
          this.dialog_item.title = 'Nueva Fecha:'

          await this.setSleep(100)
          this.$refs.form_item.reset()
        },
        get_item: async () => {
          const { /* task, */ item } = value
          Object.keys(item).forEach(key => {
            const itemValue = item[key]
            if (Object.prototype.hasOwnProperty.call(this.forms, key)) {
              this.forms[key] = itemValue
            }
            // console.log('key: ' + key, ' ----- value: ' + itemValue)
          })

          this.params.id = item.id
          this.dialog_item.actived = true
          this.dialog_item.title = 'Año: ' + item.name
          // this.dialog_item.title = 'Año: ' + this.truncateText(item.name)
        },
        close_item: async () => {
          if (this.$refs.form_item) {
            this.$refs.form_item.reset()
          }
          this.dialog_item.actived = false
        }
      }
      RESET_[value.task] ? RESET_[value.task]() : console.log('¡Reset not found!')
    },
    submit (action) {
      // console.log('submit -->' ,value)
      const SUBMIT = {
        send_item: async () => {
          if (!this.$refs.form_item.validate()) {
            return this.$store.dispatch('error', { message: 'validar datos por favor' })
          }
          this.CRUD_ELEMENT(action)
        },
        status_item: async () => {
          await this.CRUD_ELEMENT(action)
        }
      }
      // SUBMIT[action.task] ? SUBMIT[action.task]() : console.log('¡Submit not found!')
      SUBMIT[action.task]?.()
    },
    onSubmit (e) {
      if (!this.htmlSubmit) { e.preventDefault() }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.dialog_loader.message = 'Cargando datos...'
    this.dialog_loader.actived = true

    await this.getYears()

    this.dialog_loader.message = ''
    this.dialog_loader.actived = false
  },
  beforeMount () {},
  mounted () {},
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {},
  destroyed () {}

  // 7️⃣ Hooks específicos (como de rutas, etc.)
  // beforeRouteEnter() {}, etc.
}
</script>
<style scoped>
  /* Personalizar estilos aquí */
</style>
