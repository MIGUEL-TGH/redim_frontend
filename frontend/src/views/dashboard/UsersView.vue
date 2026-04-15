<template>
  <!-- <div>
    <h1> InitComp Welcome </h1>
  </div> -->
  <v-container>
    <section>
      <div class="title-mod">
        <h2>{{ title }}</h2>
      </div>
    </section>

    <section>
      <v-card-title class="content-title">
        <p>{{ dataTable.items.length }} usuarios registrados</p>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="dataTable.search"
          type="text"
          label="Buscar usuario..."
          append-icon="mdi-magnify"
          color="#246257"
          hide-details
          class="search-field"
        >
          <template v-slot:append-outer>
            <v-btn
              v-if="hasWritePermission"
              class="mr-2 text-white"
              color="#246257"
              elevation="5"
              small
              @click="reset({ task: 'new_item' })"
            >
              Nuevo Usuario
            </v-btn>
          </template>
        </v-text-field>
      </v-card-title>

      <v-data-table
        :headers="dataTable.headers"
        :items="dataTable.items"
        :search="dataTable.search"
        :items-per-page="10"
        class="elevation-5"
      >
        <template v-slot:item.acc="{ item }">
          <div class="d-flex">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="hasWritePermission"
                  v-bind="attrs"
                  v-on="on"
                  dense
                  class="mr-2"
                  color="green"
                  @click="reset({ task: 'get_item', item })"
                >mdi-pencil</v-icon>
              </template>
              <span>Editar Usuario</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="hasWritePermission"
                  v-bind="attrs"
                  v-on="on"
                  dense
                  class="mr-2"
                  color="orange"
                  @click="openResetPassword(item)"
                >mdi-lock-reset</v-icon>
              </template>
              <span>Restaurar Contraseña</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-if="hasWritePermission"
                  v-bind="attrs"
                  v-on="on"
                  dense
                  :color="item.status == 1 ? 'blue' : 'grey'"
                  @click="reset({ task: 'status_item', item })"
                >
                  {{ item.status == 1 ? 'mdi-account-check' : 'mdi-account-off' }}
                </v-icon>
              </template>
              <span>{{ item.status == 1 ? 'Desactivar' : 'Activar' }}</span>
            </v-tooltip>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status == 1 ? 'success' : 'error'" dark x-small>
            {{ item.status == 1 ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>
      </v-data-table>
    </section>

    <v-dialog v-model="dialog_item.actived" max-width="600px" persistent>
      <v-card>
        <v-card-title class="headline white--text" style="background-color: #246257;">
          {{ forms.id ? 'Editar Usuario' : 'Nuevo Usuario' }}
          <v-spacer></v-spacer>
          <v-btn icon dark @click="reset({ task: 'close_item' })">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="mt-4">
          <v-form ref="form_item" lazy-validation @submit.prevent="onSubmit">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="forms.name" label="Nombre Completo*" outlined dense color="#246257" :rules="[v => !!v || 'Requerido']"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select v-model="forms.role_id" :items="roles" item-text="name" item-value="id" label="Rol*" outlined dense color="#246257" :rules="[v => !!v || 'Requerido']"></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="forms.email" label="Correo Electrónico*" outlined dense color="#246257" :rules="[v => !!v || 'Requerido', v => /.+@.+\..+/.test(v) || 'Email no válido']"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="forms.username" label="Nombre de Usuario*" outlined dense color="#246257" :rules="[v => !!v || 'Requerido']"></v-text-field>
              </v-col>
              <v-col cols="12" v-if="!forms.id">
                <v-text-field v-model="forms.password" label="Contraseña Inicial*" type="password" outlined dense color="#246257" :rules="[v => !!v || 'Requerido']"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="reset({ task: 'close_item' })">Cancelar</v-btn>
          <v-btn color="#246257" class="white--text" @click="submit({ task: 'send_item' })">
            {{ forms.id ? 'Actualizar' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-dialog v-model="dialog_loader.actived" persistent max-width="300px">
      <v-card color="#246257" dark class="pa-4 text-center">
        <v-card-text>
          {{ dialog_loader.message }}
          <v-progress-linear indeterminate color="white" class="mb-0 mt-2"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog> -->

  </v-container>
</template>

<script>
import { mapState } from 'vuex'
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
      dataTable: {
        search: '',
        headers: [
          { text: 'Acciones', value: 'acc', sortable: false, align: 'center', width: '120px' },
          { text: 'Nombre', value: 'name' },
          { text: 'Rol', value: 'role_name' },
          { text: 'Correo', value: 'email' },
          { text: 'Usuario', value: 'username' },
          { text: 'Estado', value: 'status', align: 'center' }
        ],
        items: []
      },
      // Modelo del formulario
      forms: {
        id: null,
        name: '',
        role_id: null,
        email: '',
        username: '',
        password: '',
        status: 1
      },
      roles: [] // Se cargará desde el backend
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
    async getUsers () {
      // const response = await this.$axios.get('users')
      const url = `${process.env.VUE_APP_API_SERVER}states?type=getdata`
      const response = await axios.get(url)
      console.log(response.data.result)

      // try {
      //   const response = await this.$axios.get('users')
      //   if (response.data.success) {
      //     this.dataTable.items = response.data.result
      //   }
      // } catch (e) {
      //   console.error('Error al cargar usuarios')
      // }
    },

    async getRoles () {
      // Carga el catálogo de roles para el select
      try {
        const response = await this.$axios.get('roles')
        if (response.data.success) {
          this.roles = response.data.result
        }
      } catch (e) {
        console.error('Error al cargar roles')
      }
    },

    openResetPassword (item) {
      // Aquí podrías abrir un pequeño prompt o diálogo para enviar una nueva contraseña
      this.$store.dispatch('storeNotif/info', {
        message: `Funcionalidad para restaurar contraseña de ${item.username} en desarrollo.`
      })
    },
    async reset (value) {
      console.log('reset -->', value)
      // const RESET_ = {
      //   new_item: async () => {
      //     this.params.id = 0
      //     this.dialog_item.actived = true
      //     this.dialog_item.title = 'Nuevo Estado:'

      //     await this.setSleep(100)
      //     this.$refs.form_item.reset()
      //   },
      //   get_item: async () => {
      //     const { /* task, */ item } = value
      //     Object.keys(item).forEach(key => {
      //       const itemValue = item[key]
      //       if (Object.prototype.hasOwnProperty.call(this.forms, key)) {
      //         this.forms[key] = itemValue
      //       }
      //       // console.log('key: ' + key, ' ----- value: ' + itemValue)
      //     })

      //     this.params.id = item.id
      //     this.dialog_item.actived = true
      //     const truncatedName = await this.truncateText({ text: item.name, maxLength: 45 })
      //     this.dialog_item.title = 'Estado: ' + truncatedName
      //   },
      //   close_item: async () => {
      //     if (this.$refs.form_item) {
      //       this.$refs.form_item.reset()
      //     }
      //     this.dialog_item.actived = false
      //   }
      // }
      // RESET_[value.task] ? RESET_[value.task]() : console.log('¡Reset not found!')
    },
    submit (action) {
      console.log('submit -->', action)
      // const SUBMIT = {
      //   send_item: async () => {
      //     if (!this.$refs.form_item.validate()) return
      //     const result = await this.executeCrud(action)
      //     if (result.success) {
      //       this.reset({ task: 'close_item' })
      //       await this.getUsers() // Recargamos para ver cambios
      //     }
      //   },
      //   status_item: async () => {
      //     const result = await this.executeCrud(action)
      //     if (result.success) {
      //       // El mixin ya maneja el cambio visual del status
      //     }
      //   }
      // }
      // SUBMIT[action.task]?.()
    },
    onSubmit (e) {
      e.preventDefault()
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {
    this.dialog_loader.message = 'Cargando usuarios...'
    this.dialog_loader.actived = true

    await this.getUsers()
    // await this.getRoles()

    // this.dialog_loader.actived = false
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
