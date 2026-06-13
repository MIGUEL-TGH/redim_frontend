<template>
  <v-container>
    <section>
      <div class="title-mod">
        <h2>{{ title }}</h2>
      </div>
    </section>

    <!-- <section>
      <v-text-field v-model="dataTable.search" type="text" label="Buscar usuario..." append-icon="mdi-magnify" color="#246257" hide-details class="search-field"></v-text-field>
      <v-data-table :headers="dataTable.headers" :items="dataTable.items" :search="dataTable.search" :items-per-page="10" class="elevation-5"></v-data-table>
    </section> -->

    <section>
      <v-card-title class="content-title">
        <p>{{ dataTable.items.length }} usuarios registrados</p>
        <v-spacer></v-spacer>
        <v-text-field v-model="searchInput" @input="debounceSearch" type="text" label="Buscar usuario..." append-icon="mdi-magnify" color="#246257" hide-details class="search-field">
          <template v-slot:append-outer>
            <v-btn v-if="hasWritePermission" class="mr-2 text-white" color="#246257" elevation="5" small @click="reset({ task: 'new_item' })"> Nuevo </v-btn>
          </template>
        </v-text-field>
      </v-card-title>

      <v-data-table :headers="dataTable.headers" :items="dataTable.items" :search="dataTable.search" :items-per-page="10" class="elevation-5">
        <template v-slot:item.acc="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-if="hasWritePermission" v-bind="attrs" v-on="on" dense class="mr-2" color="green" @click="reset({ task: 'get_item', item })">mdi-pencil</v-icon>
              </template>
              <span>Editar Usuario</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-if="hasWritePermission" v-bind="attrs" v-on="on" dense class="mr-2" color="orange" @click="submit({task:'reset_password', id:item.id, name: item.name, username: item.username})">mdi-lock-reset</v-icon>
              </template>
              <span>Restaurar Contraseña</span>
            </v-tooltip>

            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-if="hasWritePermission" v-bind="attrs" v-on="on" dense :color="item.status == 1 ? 'blue' : 'grey'" @click="submit({task:'status_item', id:item.id, status: $event})">
                  {{ item.status == 1 ? 'mdi-account-check' : 'mdi-account-off' }}
                </v-icon>
              </template>
              <span>{{ item.status == 1 ? 'Desactivar' : 'Activar' }}</span>
            </v-tooltip> -->

          </div>
        </template>

        <!-- <template v-slot:item.status="{item}">
          <v-switch :disabled="!hasWritePermission" v-model="item.status" @change="submit({task:'status_item', id:item.id, status: $event})"
            dense hide-details color="#246257" style="padding: 0px 0px 10px 0px !important;" label="">
          </v-switch>
        </template> -->

        <template v-slot:item.status="{ item }">
          <!-- <v-chip :color="item.status == 1 ? 'success' : 'error'" dark x-small>
            {{ item.status == 1 ? 'Activo' : 'Inactivo' }}
          </v-chip> -->
          <v-switch :disabled="!hasWritePermission" v-model="item.status" @change="submit({task:'status_item', id:item.id, status: $event})"
            dense hide-details color="#246257" style="padding: 0px 0px 10px 0px !important;" label="">
          </v-switch>
        </template>
      </v-data-table>
    </section>

    <v-dialog v-model="dialog_item.actived" max-width="600px" persistent>
      <v-card>
        <v-toolbar class="white--text" color="#246257" dark style="height: 43px !important;">
          <div style="height: 43px !important; padding: 0 16 0 0px;">
            {{ forms.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </div>
        </v-toolbar>

        <v-card-text class="dialog-body">
          <v-form ref="form_item" lazy-validation @submit="onSubmit">
            <v-row no-gutters>
              <v-col cols="12" md="6" class="pa-1">
                <v-text-field v-model="forms.name" label="Nombre Completo*" outlined dense color="#246257" :rules="rules.name" counter maxlength="100"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pa-1">
                <v-select v-model="forms.role_id" :items="roles" item-text="name" item-value="id" label="Rol*" outlined dense color="#246257" :rules="rules.role_id"></v-select>
              </v-col>
              <v-col cols="12" md="6" class="pa-1">
                <v-text-field v-model="forms.email" label="Correo Electrónico*" outlined dense color="#246257" :rules="rules.email" counter maxlength="50"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" class="pa-1">
                <v-text-field v-model="forms.username" label="Nombre de Usuario*" outlined dense color="#246257" :rules="rules.username" counter maxlength="25"></v-text-field>
              </v-col>
              <!-- <v-col cols="12" v-if="!forms.id">
                <v-text-field v-model="forms.password" label="Contraseña Inicial*" type="password" outlined dense color="#246257" :rules="rules.required"></v-text-field>
              </v-col> -->
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider class="mx-4 pa-0 ma-1"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="reset({ task: 'close_item' })" small>Cancelar</v-btn>
          <v-btn color="#246257" class="white--text" @click="submit({ task: 'send_item' })" small>
            {{ forms.id ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import crudMixin from '@/mixins/crudMixin'
export default {
  // 1️⃣ Identificación
  name: 'UsersView',
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
      title: 'Gestión de Usuarios',
      // Configuración para el Mixin
      entityConfig: {
        endpoint: 'users', // Ruta base en el API
        messages: {
          saved: 'Usuario registrado correctamente',
          updated: 'Datos actualizados con éxito',
          status: 'Estatus de usuario modificado'
        }
      },
      dialog_item: {
        title: '',
        actived: false
      },
      // Datos de la tabla
      searchInput: '', // Guarda exactamente lo que el usuario está tecleando
      searchTimeout: null, // Variable para guardar el temporizador
      dataTable: {
        search: '',
        headers: [
          { text: 'Nombre', value: 'name', class: 'bg-dark white--text' },
          { text: 'Rol', value: 'role_name', class: 'bg-dark white--text' },
          { text: 'Correo', value: 'email', class: 'bg-dark white--text' },
          { text: 'Usuario', value: 'username', class: 'bg-dark white--text' },
          { text: 'Acciones', value: 'acc', class: 'bg-dark white--text', sortable: false, align: 'center', width: '80px' },
          { text: 'Estado', value: 'status', class: 'bg-dark white--text', sortable: false, width: '1%', align: 'right' }
        ],
        items: []
      },
      // Modelo del formulario
      forms: {
        name: '',
        role_id: null,
        email: '',
        username: '',
        status: 1

      },
      params: {
        id: 0
      },
      roles: [],
      rules: {
        // required: [v => !!v || 'Campo obligatorio.'],
        name: [
          v => !!v || 'El nombre es obligatorio.',
          v => (v && v.length <= 100) || 'El nombre no debe exceder los 100 caracteres.',
          v => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.,]+$/.test(v) || 'Formato inválido. Solo alfanuméricos, espacios y caracteres (- _ . ,)'
        ],
        role_id: [v => !!v || 'Debe seleccionar un rol para el usuario.'],
        email: [
          v => !!v || 'El correo electrónico es obligatorio.',
          v => (v && v.length <= 50) || 'El correo no debe exceder los 50 caracteres.',
          v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Debe ingresar un correo electrónico válido.'
        ],
        username: [
          v => !!v || 'El nombre de usuario es obligatorio.',
          v => (v && v.length <= 25) || 'Máximo 25 caracteres.',
          v => /^[a-zA-Z0-9\-_.]+$/.test(v) || 'Solo alfanuméricos y caracteres (- _ .) sin espacios.'
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'dialog_loader'
    ]),
    hasWritePermission () {
      // Lógica basada en tu sistema de permisos del token
      return true // Ajustar según tu lógica de Vuex/Permissions
    }
  },

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    ...mapActions([
      'setSleep',
      'truncateText',
      'dowloadFile'
    ]),
    debounceSearch (val) {
      // 1. Si el usuario presiona otra tecla antes de que termine el tiempo,
      // limpiamos/cancelamos el temporizador anterior.
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // 2. Creamos un nuevo temporizador
      this.searchTimeout = setTimeout(() => {
        // 3. Solo cuando haya pasado el tiempo sin que el usuario teclee nada más,
        // pasamos el texto al buscador real de la tabla.
        this.dataTable.search = val
      }, 500) // 500 milisegundos (medio segundo) de espera. Puedes ajustarlo a tu gusto.
    },
    async getUsers () {
      const url = `${process.env.VUE_APP_API_SERVER}users?type=getdata`
      const response = await axios.get(url)
      if (response.data.success) {
        this.dataTable.items = response.data.result
        // console.log(response.data.result)
      }
    },
    async getRoles () {
      const url = `${process.env.VUE_APP_API_SERVER}users?type=getroles`
      const response = await axios.get(url)
      if (response.data.success) {
        this.roles = response.data.result
      }
    },

    async reset (value) {
      // console.log('reset -->', value)
      const RESET = {
        new_item: async () => {
          this.params.id = 0
          this.dialog_item.actived = true
          this.dialog_item.title = 'Nuevo Usuario:'

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
          // const truncatedName = await this.truncateText({ text: item.name, maxLength: 45 })
          // this.dialog_item.title = 'Estado: ' + truncatedName
        },
        close_item: async () => {
          if (this.$refs.form_item) {
            this.$refs.form_item.reset()
          }
          this.dialog_item.actived = false
        }
      }
      RESET[value.task] ? RESET[value.task]() : console.log('¡Reset not found!')
    },
    async submit (action) {
      // console.log('submit -->', action)

      const SUBMIT = {
        // 1. Guardar un nuevo usuario o actualizar uno existente
        send_item: async () => {
          if (!this.$refs.form_item.validate()) return
          const result = await this.executeCrud(action)
          // console.log('submit --> send_item', result)
          if (result.success) {
            if (result.data?.pdf_data) {
              const pdfData = result.data.pdf_data
              // 'http://192.168.100.20/redim_backend/api/users?type=download_pdf&file=Responsiva_AdminEstef_1776571931.pdf'
              const url = `${process.env.VUE_APP_API_SERVER}users?type=download_pdf&file=${pdfData.fileName}`
              this.dowloadFile({
                isPrivate: true,
                // fileName: pdfData.newFileName,
                fileName: pdfData.newFileName || pdfData.fileName, // Fallback por si newFileName no viene
                url
              })
            }

            await this.setSleep(500)
            this.reset({ task: 'close_item' })

            // ==============================================================================
            // const ruta = 'multimedia/pdfs/Responsiva_AdminEstef_1776571931.pdf'
            // const nombreArchivo = ruta.split('/').pop()
            // console.log(nombreArchivo)
          }
        },
        // 2. Acción específica para resetear contraseña
        reset_password: async () => {
          if (!confirm(`¿Estás seguro de generar una nueva contraseña para este usuario: ${action.username}?`)) { return }

          // // Asumiendo que action.task = 'reset_password' y action.item trae el ID
          const result = await this.executeCrud(action)

          if (result.success) {
            // console.log('¡Contraseña resetado correctamente!')
            if (result.data?.pdf_data) {
              const pdfData = result.data.pdf_data
              // 'http://192.168.100.20/redim_backend/api/users?type=download_pdf&file=Responsiva_AdminEstef_1776571931.pdf'
              const url = `${process.env.VUE_APP_API_SERVER}users?type=download_pdf&file=${pdfData.fileName}`
              this.dowloadFile({
                isPrivate: true,
                // fileName: pdfData.newFileName,
                fileName: pdfData.newFileName || pdfData.fileName, // Fallback por si newFileName no viene
                url
              })
            }

            // Forzosamente el backend debe mandar el nuevo PDF
            // if (result.data && result.data.pdf_url) {
            //   window.open(this.axios.defaults.baseURL.replace('/api', '') + result.data.pdf_url, '_blank')
            // }
          }
        },
        // 3. Cambio de estatus del usuario
        status_item: async () => {
          const result = await this.executeCrud(action)
          if (result.success) {
            this.reset({ task: 'close_item' })
          }
        }

      }
      SUBMIT[action.task]?.()
    },
    onSubmit (e) {
      e.preventDefault()
    },

    async testFunctions () {
      // const urlFile = 'multimedia/pdfs/Responsiva_AdminEstef_1776571931.pdf'
      // const url = `${process.env.VUE_APP_API_SERVER}${urlFile}`
      // console.log(url)
      // ===================================================================================
      // this.dowloadFile({ isPrivate: false, fileName: 'INDICADORES-ECONOMIA.xlsx', url: 'https://sdti-ippi.github.io/SIEPI/multimedia/20192024/excel/indicadores/1.ECONOMIA.xlsx' })
      // this.dowloadFile({ isPrivate: false, fileName: 'Cotizacion_pagina_web.pdf', url: 'http://192.168.100.20/redim_backend/api/multimedia/otros/Cotizacion_pagina_web.pdf' })
      // this.dowloadFile({ isPrivate: false, fileName: 'Cotizacion_pagina_web.pdf', url: 'http://192.168.100.20/redim_backend/api/multimedia/Cotizacion_pagina_web.pdf' })
      // this.dowloadFile({ isPrivate: false, fileName: 'AdminEstef.pdf', url: 'http://192.168.100.20/redim_backend/api/multimedia/pdfs/users/Responsiva_AdminEstef_1776571931.pdf' })
      // this.dowloadFile({ isPrivate: true,  fileName: 'AdminEstef.pdf', url: 'http://192.168.100.20/redim_backend/api/users?type=download_pdf&file=Responsiva_AdminEstef_1776571931.pdf' })
      // ===================================================================================
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.dialog_loader.message = 'Cargando usuarios...'
    this.dialog_loader.actived = true

    await this.getUsers()
    await this.getRoles()
    // await this.testFunctions()

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
  .dialog-body {
    max-height: 300px;
    padding: 20px 24px 0px !important;
    overflow-y: auto;
  }
</style>
