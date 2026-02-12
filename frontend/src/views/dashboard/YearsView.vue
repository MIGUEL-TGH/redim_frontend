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
                <!-- <v-switch v-model="item.status" @change="submit({task:'status_item', id:item.id, status: $event})" color="#246257"
                  dense hide-details style="padding: 0px 0px 10px 0px !important;" label="">
                </v-switch> -->
                <v-switch v-model="item.status"
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
          { text: 'Años', value: 'title', class: 'bg-dark white--text' },
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
        txt_100: [
          v => !!v || 'Se requiere el campo',
          v => (v && v.length <= 100) || 'El nombre debe tener menos de 100 caracteres',
          v => !v || (/^[\w\s-_.,áéíóúÁÉÍÓÚñÑ]{1,100}$/.test(v)) || 'El campo no debe contener carácteres especiales'
        ],
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
    async CRUD_ELEMENT (value) {
      console.log(value)
      try {
        this.dialog_loader.message = 'Enviando datos...'
        this.dialog_loader.actived = true

        const dataSend = { }
        const CRUD_ = {
          send_item: async () => {
            dataSend.params = { ...this.forms }
            dataSend.params.status = 1

            if (this.params.id !== 0) {
              dataSend.params.id = this.params.id
            }

            dataSend.task = (this.params.id === 0) ? 1 : 2 //  1--> insert   2--> update
          }
        }
        CRUD_[value.task] ? CRUD_[value.task]() : console.log('¡CRUD_ELEMENT not found!')

        if (!Object.prototype.hasOwnProperty.call(dataSend, 'task') || dataSend.task === 0) {
          return this.$store.dispatch('error', { message: 'Tarea no definida' })
        }
        console.log('dataSend: ', dataSend)
        // ------------------------------------------------------------------------------------------------------------------------------
        const url = `${process.env.VUE_APP_API_SERVER}years?type=crud`
        // console.log(url)
        const response = await axios.post(url, dataSend)
        console.log('response BD: ', response.data)

        // if (response.data.status === 200) {
        //   this.$store.dispatch('success', { message: response.data.message })
        //   this.getYears()
        //   this.reset({ task: 'close_item' })
        // }
        // ------------------------------------------------------------------------------------------------------------------------------
        // const CRUD_ = {
        //   send_item: async () => {
        //     const url = `${process.env.VUE_APP_API_SERVER}years`
        //     const method = this.params.id === 0 ? 'post' : 'put'
        //     console.log(method)
        //     const response = await axios[method](url, { id: this.params.id, title: this.forms.name, status: this.forms.status })
        //     if (response.data.status === 200) {
        //       this.$store.dispatch('success', { message: response.data.message })
        //       this.getYears()
        //       this.reset({ task: 'close_item' })
        //     }
        //   }
        // }
        // CRUD_[value.task] ? CRUD_[value.task]() : console.log('¡CRUD_ELEMENT not found!')
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
        this.$store.dispatch('error', { message: error.response.data.message || 'Error en la operación' })
      } finally {
        this.dialog_loader.message = ''
        this.dialog_loader.actived = false
      }
    },

    async getYears () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}years?type=getdata`
        console.log(url)
        const response = await axios.get(url)
        console.log(response.data.result)
        if (response.data.status === 200) {
          this.dataTable.items = response.data.result
          // this.years = response.data.result
          // this.years.unshift({ id: 0, title: 'Todos' })
          // this.frmData.year_id = [0]
        }
      } catch (error) {
        console.log(error.response.data)
        console.log(error)
      }
    },
    async reset (value) {
      // console.log('reset -->' ,value)
      // this.$store.dispatch('mod_government_agencies/CRUD_ELEMENT')
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
          await Object.keys(item).forEach(key => {
            // const itemValue = item[key]
            // if (this.forms.hasOwnProperty(key)) {
            //   this.forms[key] = itemValue
            // }
            // console.log('key: ' + key, ' ----- value: ' + itemValue)
          })

          this.params.id = item.id
          this.dialog_item.actived = true
          this.dialog_item.title = 'Dependencia: ' + this.truncateText(item.title)
        },
        close_item: async () => {
          this.$refs.form_item.reset()
          this.dialog_item.actived = false
        }
      }
      RESET_[value.task] ? RESET_[value.task]() : console.log('¡Reset not found!')
    },
    submit (value) {
      // console.log('submit -->' ,value)
      // const message = 'Favor de llenar los campos obligatorios o corregir los campos que están en rojo'
      const SUBMIT_ = {
        send_item: async () => {
          if (!this.$refs.form_item.validate()) { return this.$store.dispatch('error', { message: 'validar datos por favor' }) }
          this.CRUD_ELEMENT(value)
          // this.$store.dispatch('success', { message: 'enviar datos' })
          // this.dialog_loader.message = 'Enviando datos...'
          // this.dialog_loader.actived = true
        },
        status_item: async () => {
          await this.CRUD_ELEMENT(value)
        }
      }
      SUBMIT_[value.task] ? SUBMIT_[value.task]() : console.log('¡Submit not found!')
    },
    onSubmit (e) {
      if (!this.htmlSubmit) { e.preventDefault() }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.getYears()
    // ----------------------------------------
    // console.log('Inicio')
    // await this.setSleep(2000)
    // console.log('Fin')
    // this.$refs.notifier.error('¡Favor de seleccionar las opciones obligatorias para generar la consulta!')

    // await this.setSleep(1000)
    // this.$store.dispatch('success', {
    //   message: 'Error desde dashboard/years'
    // })
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
