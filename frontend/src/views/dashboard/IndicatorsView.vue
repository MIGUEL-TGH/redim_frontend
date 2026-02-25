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
                      <v-text-field v-model="forms.name" :rules="rules.txt_250" @keyup.enter="submit({task: 'send_item'})"
                        counter maxlength="250" type="text" label="Indicador:*" color="#246257">
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
import crudMixin from '@/mixins/crudMixin'

export default {
  // 1️⃣ Identificación
  name: 'DBIndicatorsView',
  components: {}, // Importación de componentes hijos
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: [crudMixin],
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      entityConfig: {
        endpoint: 'indicators',
        messages: {
          saved: '¡Indicador guardado correctamente!',
          updated: '¡Indicador actualizado correctamente!',
          status: '¡Estatus actualizado correctamente!'
        }
      },
      title: 'Indicadores',
      dataTable: {
        search: '',
        headers: [
          { text: 'ID', value: 'id', class: 'bg-dark white--text', width: '10%' },
          { text: 'Indicadores', value: 'name', class: 'bg-dark white--text' },
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
        team: 1,
        map: 1,
        status: true
      },
      params: {
        id: '0'
      },
      rules: {
        txt_250: [
          v => !!v || 'Se requiere el campo',
          v => (v && v.length <= 250) || 'El nombre debe tener menos de 250 caracteres',
          v => !v || (/^[-\w\s_.,/():;%&áéíóúÁÉÍÓÚñÑ]{1,250}$/.test(v)) || 'El campo no debe contener carácteres especiales'
        ]
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
      'setSleep',
      'truncateText'
    ]),

    async getIndicators () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicators?type=getdata`
        const response = await axios.get(url)
        // console.log(response.data.result)
        if (response.data.success) {
          this.dataTable.items = response.data.result
        }
      } catch (error) {
        // console.log(error.response.data)
        // console.log(error)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async reset (value) {
      // console.log('reset -->' ,value)
      const RESET_ = {
        new_item: async () => {
          this.params.id = 0
          this.dialog_item.actived = true
          this.dialog_item.title = 'Nuevo Indicador:'

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
          const truncatedName = await this.truncateText({ text: item.name, maxLength: 45 })
          this.dialog_item.title = 'Indicador: ' + truncatedName
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

          const result = await this.executeCrud(action)
          if (result.success) {
            this.reset({ task: 'close_item' })
          }
        },
        status_item: async () => {
          const result = await this.executeCrud(action)
          if (result.success) {
            this.reset({ task: 'close_item' })
          }
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

    await this.getIndicators()

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
