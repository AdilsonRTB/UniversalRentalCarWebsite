import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/theme.css'
import i18n from './i18n'
import { useAuth } from './composables/useAuth'
import { VueRecaptcha } from 'vue3-recaptcha2'
import { createHead } from '@vueuse/head'
import './registerServiceWorker'

// Initialize the app
async function initApp() {
  const app = createApp(App)
  const head = createHead()
  
  app.use(router)
  app.use(Antd)
  app.use(i18n)
  app.use(head)
  
  // Register reCAPTCHA v2 component globally
  app.component('VueRecaptcha', VueRecaptcha)
  
  // Initialize authentication
  const { initAuth } = useAuth()
  await initAuth()

  app.mount('#app')
}

// Start the app
initApp().catch(error => {
  console.error('Failed to initialize app:', error)
})

