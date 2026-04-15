<template>
  <v-container>
    <!-- <section>
      <div class="title-mod">
        <h2>Bienvenido, {{ userData.name }}</h2>
      </div>
    </section> -->

    <v-card class="elevation-5 mt-4 pa-6" rounded="lg">
      <v-row>
        <v-col cols="12" md="4" class="d-flex flex-column justify-center align-center">
          <v-avatar size="160" color="#efeee8">
            <v-icon size="120" color="#246257">mdi-account-circle</v-icon>
          </v-avatar>
          <span class="mt-2 text-button" style="color: #6a3d8f;">{{ userData.role }}</span>
        </v-col>

        <v-col cols="12" md="8">
          <h3 class="mb-4" style="color: #246257;">Información del Perfil</h3>

          <v-text-field label="Nombre Completo" :value="userData.name" readonly filled dense prepend-inner-icon="mdi-account" color="#246257" ></v-text-field>

          <v-text-field label="Correo Electrónico" :value="userData.email" readonly filled dense prepend-inner-icon="mdi-email" color="#246257" ></v-text-field>

          <h4 class="mt-4 mb-2" style="color: #246257;">
            <v-icon color="#246257" class="mr-1">mdi-shield-check</v-icon>
            Permisos Asignados
          </h4>

          <v-chip-group column>
            <v-chip
              v-for="(perm, index) in userData.permissions"
              :key="index"
              color="#2e91ce"
              text-color="white"
              small
            >
              <strong>{{ perm.module }}</strong>: {{ perm.permission }}
            </v-chip>
            <v-chip v-if="!userData.permissions || userData.permissions.length === 0" small color="grey" text-color="white">
              Sin permisos especiales
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <section>
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 style="color: #246257;">Seguridad de la Cuenta</h3>
          <v-btn
            color="#b62b86"
            class="white--text"
            elevation="2"
            @click="showPasswordForm = !showPasswordForm"
          >
            <v-icon left>{{ showPasswordForm ? 'mdi-close' : 'mdi-lock-reset' }}</v-icon>
            {{ showPasswordForm ? 'Cancelar' : 'Restaurar Contraseña' }}
          </v-btn>
        </div>

        <v-expand-transition>
          <div v-show="showPasswordForm">
            <v-card outlined class="pa-4" color="#fafafa">
              <v-form ref="form_password" lazy-validation>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field v-model="pwdData.current" :rules="[v => !!v || 'Campo obligatorio']"
                      label="Contraseña Actual*" type="password" dense outlined background-color="white" color="#246257"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field v-model="pwdData.new" :rules="[v => !!v || 'Campo obligatorio']"
                      label="Nueva Contraseña*" type="password" dense outlined background-color="white" color="#246257"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field v-model="pwdData.confirm" label="Verificar Contraseña Nueva*" type="password" dense outlined background-color="white" color="#246257"
                      :rules="[
                        v => !!v || 'Campo obligatorio',
                        v => v === pwdData.new || 'Las contraseñas no coinciden'
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <div class="d-flex justify-end mt-2">
                  <v-btn color="#246257" class="white--text" elevation="3" @click="submitPasswordUpdate" >
                    Actualizar Contraseña
                  </v-btn>
                </div>
              </v-form>
            </v-card>
          </div>
        </v-expand-transition>
      </section>
    </v-card>
  </v-container>
</template>
<script>
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
export default {
  // 1️⃣ Identificación
  name: 'DBMyProfileView',
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
      userData: {
        name: '',
        email: '',
        role: '',
        permissions: []
      },
      showPasswordForm: false,
      pwdData: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  computed: {},

  // 4️⃣ Observadores
  watch: {},

  // 5️⃣ Métodos
  methods: {
    extractDataFromToken () {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const decoded = jwtDecode(token)
          this.userData.name = decoded.data.name || 'Usuario Desconocido'
          this.userData.email = decoded.data.email || 'Sin correo'
          this.userData.role = decoded.data.role || 'Sin rol asignado'
          this.userData.permissions = decoded.data.permissions || []
        } catch (error) {
          console.error('Error al decodificar el token:', error)
        }
      } else {
        this.$store.dispatch('storeNotif/error', {
          message: 'No se encontró token de autenticación. Por favor, inicia sesión nuevamente.'
        })
      }
    },
    async submitPasswordUpdate () {
      if (!this.$refs.form_password.validate()) { return }

      const url = `${process.env.VUE_APP_API_SERVER}auth/update_my_profile_password`
      const response = await axios.post(url, this.pwdData)
      if (response.data.success) {
        const result = response.data.result
        this.showPasswordForm = false
        this.$refs.form_password.reset()

        this.$store.dispatch('storeNotif/success', {
          message: result.message || 'Contraseña actualizada exitosamente.'
        })
      } else {
        this.$store.dispatch('storeNotif/error', {
          message: response.data.message || 'Error al actualizar la contraseña.'
        })
      }
    }
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  created () {
    this.extractDataFromToken()
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
<style scoped></style>
