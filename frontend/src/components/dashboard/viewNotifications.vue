<template>
  <div class="notifications">
    <br>
    <br>
    <transition-group name="slide" tag="div">
      <div v-for="n in notifications" :key="n.id" :class="['notification', n.type]" style="background-color: #282925ff;">
        <v-icon class="BtnHover notify-icon" color="white"> {{ n.icon }} </v-icon>
        <span> {{ n.message }} </span>
        <v-icon class="BtnHover close-icon" color="white" @click="removeNotify(n.id)"> mdi-close-circle </v-icon>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'viewNotificationsComp',
  components: { // Importación de componentes hijos
  },
  directives: {}, // Directivas personalizadas
  filters: {}, // Filtros (si usas)

  // 2️⃣ Propiedades de entrada
  props: {},
  mixins: {},
  extends: {},

  // 3️⃣ Datos reactivas
  data () {
    return {
      // notifications: []
    }
  },
  computed: {
    notifications () {
      // return this.$store.state.notifications
      return this.$store.state.storeNotif.notifications
    }
  },

  // 4️⃣ Observadores
  watch: { },

  // 5️⃣ Métodos
  methods: {
    // ...mapMutations({
    //   removeNotify: 'REMOVE'
    // })
    ...mapMutations('storeNotif', {
      removeNotify: 'REMOVE'
    })
  },

  // 6️⃣ Ciclo de vida
  beforeCreate () {},
  async created () {},
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
