<template>
  <div class="construction-wrapper">
    <v-app-bar app dark elevation="10" clipped-left class="app-bar-gradient">
      <custom-navbar />
      <v-spacer></v-spacer>
    </v-app-bar>

    <div class="content-wrapper d-flex flex-column justify-center align-center">

      <section class="mb-6">
        <div class="title-mod">
          <h2 class="section-title">{{ $route.meta.title || 'Módulo' }}</h2>
        </div>
      </section>

      <div class="video-card elevation-10">
        <video autoplay  loop  muted  playsinline  class="video-player">
          <source src="/videos/Módulo_en_construcción_REDIM.mp4" type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>

        <!-- <div class="video-overlay d-flex flex-column justify-end align-center pb-8">
          <h2 class="text-h4 font-weight-bold white--text text-center text-uppercase">
            Módulo en Construcción
          </h2>
          <p class="white--text text-center mt-2 subtitle-text">
            Estamos preparando esta sección para ofrecerte la mejor experiencia.
          </p>
          <v-btn color="#ed712c" dark elevation="5" class="mt-4 rounded-pill font-weight-bold" to="/">
            Volver al Inicio
          </v-btn>
        </div> -->
      </div>

    </div>
  </div>
</template>

<script>
import CustomNavbar from '@/components/map/CustomNavbar.vue'

export default {
  name: 'UnderConstructionView',
  components: {
    CustomNavbar
  }
}
</script>

<style scoped>

  .title-mod h2{
    text-align: center;
    background-color: transparent;
    text-transform: uppercase;
    font-size: clamp(20px, 5vw, 40px);
    font-weight: normal;
    color: #78909C;

    word-break: break-word; /* permite que las palabras se dividan si es necesario */
    white-space: normal; /* permite los saltos de línea */
    line-height: 1.2; /* mejora el espaciado entre líneas */
    padding: 0 5px; /* opcional: margen interno para pantallas pequeñas */

    margin: 0px 0px 0px 0px;
  }

  /* ===============================
    1. APP BAR (Mismo estilo de tu proyecto)
  ================================ */
  .app-bar-gradient {
    background: linear-gradient(
      to right,
      #2e91ce 0%,
      #342a83 25%,
      #6a3d8f 50%,
      #b62b86 75%,
      #ed712c 100%
    ) !important;
  }

  /* ===============================
    2. CONTENEDOR PRINCIPAL
  ================================ */
  .construction-wrapper {
    background-color: #dfdad0; /* Color de fondo general de Niñez Primero */
    min-height: 100vh;
  }

  .content-wrapper {
    /* Restamos los 64px del App Bar para que quede perfectamente centrado */
    height: calc(100vh - 64px);
    width: 100%;
    padding: 20px;
  }

  /* ===============================
    3. TARJETA DE VIDEO
  ================================ */
  .video-card {
    position: relative;
    /* width: 100%; */
    max-width: 800px;
    /* aspect-ratio: 16/9; */
    height: 600px;
    background-color: #000;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.3) !important; /* Sombra profunda */
  }

  .video-player {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Asegura que el video llene la tarjeta sin deformarse */
    display: block;
  }

  /* ===============================
    4. CAPA DE TEXTO (OVERLAY)
  ================================ */
  .video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Gradiente oscuro en la parte inferior para que el texto blanco resalte */
    background: linear-gradient(to top, rgba(52, 42, 131, 0.9) 0%, rgba(0, 0, 0, 0) 60%);
    pointer-events: none; /* Permite hacer clic a través de la capa si fuera necesario */
  }

  .video-overlay .v-btn {
    pointer-events: auto; /* Reactiva el clic solo para el botón */
  }

  .subtitle-text {
    font-size: 1.1rem;
    max-width: 80%;
  }

  /* ===============================
    5. RESPONSIVIDAD (Móviles)
  ================================ */
  @media (max-width: 600px) {
    .video-card {
      border-radius: 15px;
    }
    .video-overlay h2 {
      font-size: 1.5rem !important;
    }
    .subtitle-text {
      font-size: 0.95rem;
    }
  }
</style>
