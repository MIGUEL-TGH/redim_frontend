<template>
    <v-container>
      <section>
        <div class="title-mod">
          <h2>{{title}}</h2>
        </div>
      </section>
      <section>
        <br>
        <v-form ref="form_query" @submit="onSubmit">
          <v-row style="padding: 0px 0px 0px 0px !important;" justify="center">
            <v-col cols="12" md="12" class="pa-1">
              <v-autocomplete :items="slt_indicators" v-model="params.indicator_id" :rules="rules.required" @change="getCategories"
                item-text="name" item-value="id" dense filled outlined color="#246257" label="Indicador:*">
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>

        params category_id: {{params.category_id}} <br>
        forms category_id: {{forms.category_id}} <br>
        params category_name: {{params.category_name}} <br>

        <!-- <v-btn @click="getCategories()" elevation="5" color="#246257" class="text-white" small> consultar </v-btn> -->
        <h6 v-if="slt_categories.length" class="d-flex justify-center align-center">Categorías:</h6>

        <div class="pa-1 elevation-10 rounded-lg grey lighten-5" style="max-height: 500px;" v-if="slt_categories.length">
          <v-row class="pa-2">
            <v-col cols="12" md="1" class="pa-1 d-flex justify-center align-center">
              <v-btn @click="getCategoryDataById()" elevation="5" color="#246257" class="text-white" small> buscar </v-btn>
            </v-col>
            <v-col cols="12" md="11" class="pa-1">
              <div style="border: 1px solid #E0E0E0;"> <!-- class="pa-3 elevation-1 rounded-lg grey lighten-5" -->
                <v-treeview :active.sync="params.category_id" :items="slt_categories" item-text="title" item-key="id"
                  class="tree-compact" activatable open-all open-on-click>
                </v-treeview>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-divider class="mx-4 pa-0 ma-1"></v-divider>
        <v-row style="padding: 0px 15px 15px 15px;">
            <v-col cols="12" md="4" class="pa-0">
              <br><strong>{{dataTable.items.length}} registros</strong>
            </v-col>
            <v-col cols="12" md="8" class="pa-0">
              <v-text-field type="text" label="Buscar:" v-model="dataTable.search" append-icon="mdi-magnify" color="#246257" single-line hide-details>
                <template v-slot:append-outer>
                  <v-btn class="mr-2 text-white" color="#246257" elevation="5" small
                    @click="reset({task:'new_item'})" :disabled="params.btn_disabled">
                    Nuevo
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
        </v-row>

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
                  <h5>Categoría: {{ params.category_name }}</h5>
                  <v-row no-gutters>
                    <v-col cols="12" md="12" class="pa-1">
                      <v-autocomplete :items="slt_states" v-model="forms.state_id" :rules="rules.required" @change="getCenters"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Estado:*">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="12" class="pa-1">
                      <v-autocomplete :items="slt_centers" v-model="forms.center_id"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Centro:">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <v-autocomplete :items="slt_genders" v-model="forms.gender_id" :rules="rules.required"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Séxo:*">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <v-autocomplete :items="slt_years" v-model="forms.year_id" :rules="rules.required"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Año:*">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <v-text-field v-model="forms.PI" :rules="rules.txt_4"
                        counter maxlength="4" type="text" dense outlined color="#246257" label="Población Internada:*">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="6" class="pa-1">
                      <v-text-field v-model="forms.PS" :rules="rules.txt_4"
                        counter maxlength="4" type="text" dense outlined color="#246257" label="Población Señalada:*">
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
  name: 'DBIndicatorCategoryDetailsView',
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
        endpoint: 'indicator_category_details',
        messages: {
          saved: '¡Información de categorías de indicadores guardado correctamente!',
          updated: '¡Información de categorías de indicadores actualizado correctamente!',
          status: '¡Estatus actualizado correctamente!'
        }
      },
      title: 'Detalles de categorías de indicadores',
      dataTable: {
        search: '',
        headers: [
          { text: 'ID', value: 'id', class: 'bg-dark white--text', width: '10%' },
          { text: 'Categoría', value: 'category_name', class: 'bg-dark white--text' },
          { text: 'Sexo', value: 'gender_name', class: 'bg-dark white--text' },
          { text: 'Año', value: 'year_name', class: 'bg-dark white--text' },
          { text: 'Población internada', value: 'PI', class: 'bg-dark white--text' },
          { text: 'Población señalada', value: 'PS', class: 'bg-dark white--text' },
          { text: 'Estado', value: 'state_name', class: 'bg-dark white--text' },
          { text: 'Centro', value: 'center_name', class: 'bg-dark white--text' },

          { text: 'edit', value: 'acc', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'center' },
          { text: '', value: 'status', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'right' }
        ],
        items: []
      },
      slt_indicators: [],
      slt_categories: [],
      slt_states: [],
      slt_centers: [],
      slt_genders: [],
      slt_years: [],
      // ---------------------------------
      dialog_item: {
        title: '',
        actived: false
      },
      forms: {
        category_id: null,
        state_id: null,
        center_id: null,
        gender_id: null,
        year_id: null,
        PI: '',
        PS: '',
        status: true
      },
      params: {
        id: '0',
        indicator_id: null,
        category_id: [],
        category_name: '',
        // ------------------------------
        country_id: null,
        state_id: null,
        btn_disabled: true
      },
      rules: {
        required: [v => !!v || 'Campo obligatorio'],
        txt_category: [
          v => !!v || 'Se requiere el campo',
          v => (v && v.length <= 255) || 'El nombre debe tener menos de 255 caracteres',
          v => !v || (/^[\w\s-_.,áéíóúÁÉÍÓÚñÑ]{1,255}$/.test(v)) || 'El campo no debe contener carácteres especiales'
        ],
        txt_4: [
          v => (v !== null && v !== '') || 'Se requiere el campo',
          v => /^\d+$/.test(v) || 'Solo se permiten números',
          v => (Number(v) >= 0 && Number(v) <= 9999) || 'El valor debe estar entre 0 y 9999'
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
    // -------------------------------------------------------------------------------------------------------
    getAllLeafIds (nodes, result = []) {
      nodes.forEach(node => {
        if (node.children && node.children.length) {
          this.getAllLeafIds(node.children, result)
        } else {
          result.push(node.id)
        }
      })
      return result
    },
    findNodeById (tree, id) {
      for (const node of tree) {
        // 1️⃣ Si el nodo actual es el que buscamos
        if (node.id === id) {
          return node
        }

        // 2️⃣ Si tiene hijos, buscamos dentro de ellos
        if (node.children && node.children.length) {
          const found = this.findNodeById(node.children, id)
          if (found) {
            return found
          }
        }
      }

      return null
    },
    // -------------------------------------------------------------------------------------------------------
    async getIndicators () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicators?type=getwithcategories`
        const response = await axios.get(url)
        if (response.data.success) {
          this.slt_indicators = response.data.result
            .map(({ id, name }) => ({ id, name }))
          // console.log(this.slt_indicators)
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getCategories () {
      try {
        this.slt_categories = []
        this.dataTable.items = []
        this.params.category_id = []
        this.params.category_name = ''
        this.forms.category_id = null

        const url = `${process.env.VUE_APP_API_SERVER}indicator_categories?type=getactivenode`
        const response = await axios.post(url, this.params.indicator_id)

        // console.log('indicator_id: ', this.params.indicator_id, 'categories: ', response.data.result)
        if (response.data.success && response.data.total > 1) {
          this.slt_categories = response.data.result
          return
        }

        if (response.data.success && response.data.total === 1) {
          const node = response.data.result[0]
          if (node.children.length) {
            this.slt_categories = response.data.result
            return
          }
          // console.log('node: ', node)
          this.params.category_id = [node.id]
          this.params.category_name = node.title
          this.getCategoryDataById()
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      } finally {
        this.params.btn_disabled = true
      }
    },
    async getCategoryDataById () {
      if (!this.params.category_id.length) {
        this.$store.dispatch('warning', {
          message: 'Favor de seleccionar alguna de las categorías'
        })
        this.params.btn_disabled = true
        return
      }

      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicator_category_details?type=getdatabyid`
        const response = await axios.post(url, { category_id: this.params.category_id[0] })
        // console.log('data category: ', response.data)
        if (response.data.success) {
          this.dataTable.items = response.data.result

          const categoryID = this.params.category_id[0]
          this.forms.category_id = categoryID

          if (this.slt_categories.length) {
            const node = this.findNodeById(this.slt_categories, categoryID)
            if (node) {
              this.params.category_name = node.title
            }
          }
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('warning', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })

        this.dataTable.items = []
      } finally {
        this.params.btn_disabled = false
      }
    },
    // -------------------------------------------------------------------------------------------------------
    async getCountries () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}countries?type=getactive`
        const response = await axios.get(url)
        console.log(response.data.result)
        // if (response.data.success) {
        //   this.indicators = response.data.result
        // }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getStates () {
      try {
        // if (!this.params.country_id) {
        //   return this.$store.dispatch('warning', { message: 'Seleccione un país por favor' })
        // }
        // console.log('ID del país:', this.params.country_id)

        const id = 1
        const url = `${process.env.VUE_APP_API_SERVER}states?type=getactivebyid`
        const response = await axios.post(url, { country_id: id })
        // console.log(response.data.result)
        if (response.data.success) {
          this.slt_states = response.data.result
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getCenters () {
      try {
        // if (!this.forms.center_id) {
        //   return this.$store.dispatch('warning', { message: 'Seleccione un estado por favor' })
        // }
        // console.log('ID del estado: ', this.forms.state_id)

        const id = this.forms.state_id
        const url = `${process.env.VUE_APP_API_SERVER}centers?type=getactivebyid`
        const response = await axios.post(url, { state_id: id })
        // console.log(response.data.result)
        if (response.data.success) {
          this.slt_centers = response.data.result
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getGenders () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}genders?type=getactive`
        const response = await axios.get(url)
        // console.log(response.data.result)
        if (response.data.success) {
          this.slt_genders = response.data.result
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getYears () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}years?type=getactive`
        const response = await axios.get(url)
        // console.log(response.data.result)
        if (response.data.success) {
          this.slt_years = response.data.result
        }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },

    // -------------------------------------------------------------------------------------------------------
    async getAllData () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicator_category_details?type=getalldata`
        const response = await axios.get(url)
        console.log(response.data.result)
        // if (response.data.success) {
        //   this.indicators = response.data.result
        // }
      } catch (error) {
        // console.log(error)
        // console.log(error.response.data)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },

    // -------------------------------------------------------------------------------------------------------
    async filterCategories (items) {
      const categories = items
        .filter(item => item.status === true)
        .map(({ id, name }) => ({ id, name }))

      return categories
    },
    async reset (value) {
      // console.log('reset -->' ,value)
      const RESET_ = {
        new_item: async () => {
          this.params.id = 0
          this.dialog_item.actived = true
          this.dialog_item.title = 'Nueva información:'

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
            // console.log('key: ' + key, ' - value: ' + itemValue)
          })
          // console.log('item:', item)
          await this.setSleep(250)

          this.params.id = item.id
          this.dialog_item.actived = true
          this.dialog_item.title = 'Info:'

          // console.log('forms:', this.forms)
        },
        close_item: async () => {
          if (this.$refs.form_item) {
            this.$refs.form_item.reset()
          }
          this.dialog_item.actived = false
          // console.log(this.forms)
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
          // console.log('send_item', result)
          if (result.success) {
            await this.setSleep(250)
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
    await this.getStates()
    await this.getGenders()
    await this.getYears()

    // await this.getAllData()
    // await this.getCountries()
    // await this.getCenters()

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
  /* .v-input {
    font-size: 14px;
  }
  .v-label {
    font-size: 25px !important;
  } */
  .chip-select {
    font-size: 12px;
    padding: 0 5px;
    margin: 0 0px !important;
  }
  .span-select {
    font-size: 11px;
    padding: 0 5px !important;
  }
  /* --------------------------------treeview------------------------------------------------ */
  /* Label tipo v-text-field */
  .tree-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 4px;
  }

  /* Contenedor general */
  .tree-compact {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px;
    max-height: 280px;
    overflow-y: auto;
  }

  /* Cada nodo */
  .tree-compact ::v-deep .v-treeview-node__root {
    min-height: 20px !important;
    padding: 0 4px !important;
  }

  /* Texto del nodo */
  .tree-compact ::v-deep .v-treeview-node__label {
    font-size: 12px;
    line-height: 1.2 !important;
  }

  /* --------------------------------Checkbox------------------------------------------------ */
  /* Checkbox */
  .tree-compact ::v-deep .v-input--selection-controls {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  /* Iconos (expand + checkbox) */
  /* .tree-compact ::v-deep .v-icon {
    font-size: 20px !important;
  } */

  .tree-compact ::v-deep .v-treeview-node__checkbox {
    width: 10px !important;
    /* font-size: 25px !important; */
    transform: scale(0.85) !important;
  }

  /* -------------------------------------------------------------------------------- */
  /* Botón del icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle {
    width: 25px;
    height: 25px;
  }

  /* Icono expand/collapse */
  .tree-compact ::v-deep .v-treeview-node__toggle .v-icon {
    font-size: 20px !important;
  }

  /* Estado activo (seleccionado / focus) */
  .tree-compact ::v-deep .v-treeview-node__toggle.v-btn--active {
    border-radius: 50%;
  }

</style>
