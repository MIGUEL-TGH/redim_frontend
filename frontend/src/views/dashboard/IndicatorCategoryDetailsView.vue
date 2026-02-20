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
        <v-divider class="mx-4 pa-0 ma-1"></v-divider>
        <v-row style="padding: 0px 15px 15px 15px;">
            <v-col cols="12" md="4" class="pa-0">
              <br><strong>{{dataTable.items.length}} registros</strong>
            </v-col>
            <v-col cols="12" md="8" class="pa-0">
              <v-text-field type="text" label="Buscar:" v-model="dataTable.search" append-icon="mdi-magnify" color="#246257" single-line hide-details>
                <template v-slot:append-outer>
                  <v-btn class="mr-2 text-white" color="#246257" elevation="5" small @click="reset({task:'new_item'})">Nuevo</v-btn>
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
                  <v-row no-gutters>
                    <!-- <v-col cols="12" md="12" class="pa-1">
                      <v-autocomplete :items="indicators" v-model="forms.indicator_id" :rules="rules.required"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Indicador:*">
                      </v-autocomplete>
                    </v-col> -->
                    <!-- <v-col cols="12" md="12" class="pa-1">
                      <v-autocomplete :items="slt_categories" v-model="forms.parent_id"
                        item-text="name" item-value="id" dense outlined color="#246257" label="Categoría Padre:*">
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" md="12" class="pa-1">
                      <v-text-field v-model="forms.name" :rules="rules.txt_category"
                        counter maxlength="255" type="text" dense outlined color="#246257" label="Categoría Hijo:*">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" md="12" class="pa-1">
                      <v-text-field v-model="forms.level" :rules="rules.txt_2"
                        counter maxlength="2" type="text" dense outlined color="#246257" label="Nivel Jerárquico:*">
                      </v-text-field>
                    </v-col> -->
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

        <v-dialog v-model="dialog_categories.actived" scrollable max-width="500px" persistent>
            <v-card>
               <v-toolbar color="#246257" dark style="height: 43px !important;">
                  <div style="height: 43px !important; padding: 0 16 0 0px;">
                     {{dialog_categories.title}}
                  </div>
               </v-toolbar>

               <v-card-text style="max-height: 500px;">
                  {{ params.category_id }}
                  <br>
                  <div v-if="slt_categories.length"
                    class="pa-3 elevation-1 rounded-lg grey lighten-5" style="border: 1px solid #E0E0E0;">
                    <v-treeview v-model="params.category_id" :items="slt_categories" item-text="title" item-key="id"
                      class="tree-compact" activatable open-all open-on-click>
                    </v-treeview>
                  </div>
               </v-card-text>
               <v-divider class="mx-4 pa-0 ma-1"></v-divider>
               <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="reset({task:'close_query'})" elevation="5" color="#9B162E" class="text-white" small> cancelar </v-btn>
                  <v-btn @click="getCategoryDataById()" elevation="5" color="#246257" class="text-white" small> buscar </v-btn>
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
          { text: 'Indicador', value: 'indicator_name', class: 'bg-dark white--text' },
          { text: 'Categoría padre', value: 'parent_name', class: 'bg-dark white--text' },
          { text: 'Categoría hijo', value: 'name', class: 'bg-dark white--text' },
          { text: 'nivel', value: 'level', class: 'bg-dark white--text' },
          { text: 'edit', value: 'acc', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'center' },
          { text: '', value: 'status', sortable: false, width: '1%', class: 'bg-dark white--text', align: 'right' }
        ],
        items: []
      },
      slt_indicators: [],
      slt_categories: [],
      slt_years: [],
      slt_states: [],
      slt_center: [],
      dialog_item: {
        title: '',
        actived: false
      },
      dialog_categories: {
        title: '',
        actived: false,
        items: [],
        txt_search: ''
      },
      forms: {
        indicator_id: null,
        parent_id: null,
        name: '',
        level: '',
        status: true
      },
      params: {
        id: '0',
        indicator_id: null,
        // category_id: null,
        category_id: [],

        country_id: null,
        state_id: null
      },
      rules: {
        required: [v => !!v || 'Campo obligatorio'],
        txt_category: [
          v => !!v || 'Se requiere el campo',
          v => (v && v.length <= 255) || 'El nombre debe tener menos de 255 caracteres',
          v => !v || (/^[\w\s-_.,áéíóúÁÉÍÓÚñÑ]{1,255}$/.test(v)) || 'El campo no debe contener carácteres especiales'
        ],
        txt_2: [
          v => !!v || 'Se requiere el campo',
          v => /^\d+$/.test(v) || 'Solo se permiten números',
          v => (Number(v) >= 0 && Number(v) <= 99) || 'El valor debe estar entre 0 y 99'
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
    async getIndicators () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}indicators?type=getwithdata`
        const response = await axios.get(url)
        if (response.data.success) {
          this.slt_indicators = response.data.result
            .map(({ id, name }) => ({ id, name }))
          console.log(this.slt_indicators)
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
        const url = `${process.env.VUE_APP_API_SERVER}map?type=categories`
        const response = await axios.post(url, this.params.indicator_id)
        console.log(this.params.indicator_id)
        if (response.data.success) {
          this.slt_categories = []

          if (response.data.total === 1 && !response.data.result[0].children.length) { // Sin nodos
            console.log('Categoría sin nodos hijos:', response.data.result[0])
            return
          }

          console.log('Categorías con nodos hijos:', response.data.result)
          this.slt_categories = response.data.result
          this.dialog_categories.title = 'Categoría:'
          this.dialog_categories.actived = true
        }
      } catch (error) {
        console.log(error)
        this.$store.dispatch('error', {
          message: error.response?.data.message || error.message || error || 'Error en la operación'
        })
      }
    },
    async getCategoryDataById () {
      try {
        console.log(this.params.category_id)

        // const url = `${process.env.VUE_APP_API_SERVER}indicator_category_details?type=getactivebyid`
        // const response = await axios.post(url, { category_id: this.params.category_id })
        // console.log(response.data.result)
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
    async getYears () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}years?type=getactive`
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
    async getGenders () {
      try {
        const url = `${process.env.VUE_APP_API_SERVER}genders?type=getactive`
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
        if (!this.params.country_id) {
          return this.$store.dispatch('warning', { message: 'Seleccione un país por favor' })
        }
        console.log('ID del país:', this.params.country_id)
        // const id = this.params.country_id
        // const id = 3
        // const url = `${process.env.VUE_APP_API_SERVER}states?type=getactivebyid`
        // const response = await axios.post(url, { country_id: this.params.country_id })
        // const response = await axios.post(url, { country_id: id })
        // console.log(response.data.result)
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
    async getCenters () {
      try {
        // if (!this.params.state_id) {
        //   return this.$store.dispatch('warning', { message: 'Seleccione un estado por favor' })
        // }
        // console.log('ID del estado: ', this.params.state_id)
        // const id = this.params.state_id
        const id = 1
        const url = `${process.env.VUE_APP_API_SERVER}centers?type=getactivebyid`
        // const response = await axios.post(url, { state_id: this.params.state_id })
        const response = await axios.post(url, { state_id: id })
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
    // async getIndicatorCategories () {
    //   try {
    //     const url = `${process.env.VUE_APP_API_SERVER}indicator_categories?type=getdata`
    //     const response = await axios.get(url)
    //     // console.log(response.data.result)
    //     if (response.data.success) {
    //       this.dataTable.items = response.data.result
    //       const newCategories = await this.filterCategories(response.data.result)
    //       this.slt_categories = newCategories
    //     }
    //   } catch (error) {
    //     // console.log(error)
    //     // console.log(error.response.data)
    //     this.$store.dispatch('error', {
    //       message: error.response?.data.message || error.message || error || 'Error en la operación'
    //     })
    //   }
    // },
    async reset (value) {
      // console.log('reset -->' ,value)
      const RESET_ = {
        new_item: async () => {
          this.params.id = 0
          this.dialog_item.actived = true
          this.dialog_item.title = 'Nueva información:'

          const newCategories = await this.filterCategories(this.dataTable.items)
          this.slt_categories = newCategories

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
          this.dialog_item.title = 'Info: ' + truncatedName
        },
        close_item: async () => {
          if (this.$refs.form_item) {
            this.$refs.form_item.reset()
          }
          this.dialog_item.actived = false
        },
        close_query: async () => {
          if (this.$refs.form_query) {
            this.$refs.form_query.reset()
          }
          this.dialog_categories.actived = false
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
    await this.getAllData()
    // await this.getYears()
    // await this.getGenders()
    // await this.getCountries()
    // await this.getStates()
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
