import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import router from './router'
import './assets/css/app.css'

import { useAppStore } from './stores/app'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(VueViewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: true,
    navbar: true,
    title: true,
    movable: true,
  },
})

const pinia = createPinia()
app.use(pinia)
app.use(router)

const appStore = useAppStore()
const authStore = useAuthStore()

appStore.initializer()
authStore.initziliUser()

app.mount('#app')
