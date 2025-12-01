import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/theme.css'
import i18n from './i18n'
import { useAuth } from './composables/useAuth'

// Initialize the app
async function initApp() {
  const app = createApp(App)
  
  app.use(router)
  app.use(Antd)
  app.use(i18n)
  
  // Initialize authentication
  const { initAuth } = useAuth()
  await initAuth()
  
  app.mount('#app')
}

// Start the app
initApp().catch(error => {
  console.error('Failed to initialize app:', error)
})

