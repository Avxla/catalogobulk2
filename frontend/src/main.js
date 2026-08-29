import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar' // 1. Importa Notify aquí

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router/routes.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Registra Quasar agregando el objeto plugins
app.use(Quasar, {
  plugins: {
    Notify
  }
})

app.mount('#app')