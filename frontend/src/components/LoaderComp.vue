<template>
  <v-dialog v-model="dialog_loader.actived" scrollable persistent width="300">
    <v-card color="#3069b3" dark>
      <v-card-text class="centered">
        <!-- Por favor espere -->
         <div v-html="dialog_loader.message" class="text-white"></div>
        <v-progress-linear indeterminate color="white" class="mb-0" ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'LoaderComp',
  methods: {},
  computed: {
    ...mapState([
      'dialog_loader'
    ])
  }
}
</script>
<style scoped>
  .centered {
    text-align: center !important;
  }
</style>
