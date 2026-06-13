<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>

<style>
  /* Sobreescribe el texto general de la aplicación */
  .v-application {
    font-family: 'Noto Sans', sans-serif !important;
  }

  /* Sobreescribe los encabezados y clases de tipografía de Vuetify */
  .v-application .text-h1,
  .v-application .text-h2,
  .v-application .text-h3,
  .v-application .text-h4,
  .v-application .text-h5,
  .v-application .text-h6,
  .v-application .title,
  .v-application .subtitle-1,
  .v-application .subtitle-2,
  .v-application .body-1,
  .v-application .body-2,
  .v-application .button,
  .v-application .caption,
  .v-application .overline {
    font-family: 'Noto Sans', sans-serif !important;
  }

</style>
