import Vue from 'vue'
import Vuex from 'vuex'

import storeDashBoard from './storeDashBoard.js'
import storeNotifications from './storeNotifications.js'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: null,
    urlParams: null,

    dialog_loader: { actived: false, message: '' }
  },
  getters: { },
  mutations: {

  },
  actions: {
    // ======================================================================
    async setSleep (context, ms) {
      try {
        return new Promise(resolve => setTimeout(resolve, ms))
      } catch (error) {
        console.log(error)
      }
    },
    async truncateText (context, { text, maxLength }) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'
      }
      return text
    },
    async getParams ({ state }, event) {
      state.url = new URL(window.location)
      state.urlParams = await new URLSearchParams(state.url.search)
    },
    async dowloadFile_V1 ({ state }, item) {
      // console.log('dowloadFile->', item)
      try {
        let urlBlob = null
        let isDowload = false

        if (item.isPrivate === true) {
          // 1. Descargamos el archivo en memoria (Blob) usando Axios. Permite descargar archivos protegidos
          const response = await axios({
            url: item.url,
            method: 'GET',
            responseType: 'blob' // ¡Esto es la clave! Le dice a Axios que es un archivo, no JSON.
          })

          // 2. Creamos una URL local en el navegador del usuario a partir del Blob
          urlBlob = window.URL.createObjectURL(new Blob([response.data]))
          isDowload = true
        } else if (item.isPrivate === false) {
          // 1. Usamos 'fetch' nativo en lugar de Axios. SIN los headers de Authorization
          const response = await fetch(item.url, {
            method: 'GET',
            mode: 'cors' // Le indica al navegador que maneje los CORS públicos
          })

          // Validamos que la respuesta del servidor sea un éxito (200 OK)
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`)
          }

          // 2. Convertimos la respuesta a un objeto Blob (Archivo)
          const blob = await response.blob()

          // 3. Creamos una URL local en el navegador a partir del Blob
          urlBlob = window.URL.createObjectURL(blob)
          isDowload = true
        }

        if (isDowload) {
          // Simulamos el clic con la etiqueta <a>
          const fileLink = document.createElement('a')
          fileLink.href = urlBlob
          fileLink.setAttribute('download', item.fileName)

          document.body.appendChild(fileLink)
          fileLink.click()

          // Limpieza de memoria y DOM
          fileLink.parentNode.removeChild(fileLink)
          window.URL.revokeObjectURL(urlBlob)

          // console.log('Descarga de archivo Blob exitosa')
        }
      } catch (error) {
        console.error('Error al intentar descargar el archivo Blob:', error)

        // FALLBACK: Si algo falla (ej. error de red), va a abrir en una nueva pestaña para asegurar que el usuario vea el archivo.
        window.open(item.url, '_blank')
      }
    },
    async dowloadFile ({ dispatch }, item) {
      try {
        let blobData = null

        // 1. OBTENER EL ARCHIVO (BLOB) SEGÚN SU PRIVACIDAD
        if (item.isPrivate) {
          // console.log('Descarga Segura:')
          // Descarga Segura: Axios envía tu Token JWT automáticamente
          const response = await axios({
            url: item.url,
            method: 'GET',
            responseType: 'blob'
          })
          blobData = response.data
        } else {
          // console.log('Descarga Pública:')
          // Descarga Pública: Fetch limpio sin headers para evitar CORS
          const response = await fetch(item.url, {
            method: 'GET',
            mode: 'cors'
          })

          if (!response.ok) throw new Error(`Error HTTP público: ${response.status}`)
          blobData = await response.blob()
        }

        // 2. PROCESAR Y DESCARGAR (Código unificado)
        if (blobData) {
          const urlBlob = window.URL.createObjectURL(new Blob([blobData]))
          const fileLink = document.createElement('a')

          fileLink.href = urlBlob
          // Validamos que exista un nombre, de lo contrario asignamos uno genérico
          fileLink.setAttribute('download', item.fileName || 'documento.pdf')

          document.body.appendChild(fileLink)
          fileLink.click()

          // Limpieza de memoria
          fileLink.parentNode.removeChild(fileLink)
          window.URL.revokeObjectURL(urlBlob)
        }
      } catch (error) {
        console.error('Error al intentar descargar el archivo Blob:', error)

        // 3. MANEJO DE ERRORES INTELIGENTE
        if (item.isPrivate) {
          // dispatch('storeNotif/error', 'No tienes permisos para descargar este archivo', { root: true })
        } else {
          // FALLBACK: Solo abrimos en una nueva pestaña si es un archivo público y falló la creación del Blob
          window.open(item.url, '_blank')
        }
      }
    }
  },
  modules: {
    storeDB: storeDashBoard,
    storeNotif: storeNotifications
  }
})
