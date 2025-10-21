import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import NotificationContainer from './components/common/NotificationContainer.vue'
import { useAuthStore } from './stores/auth'
import './style.css'

const app = createApp(App)

// Configure Pinia
const pinia = createPinia()
app.use(pinia)

// Configure Router
app.use(router)

// Initialize auth store
const authStore = useAuthStore()
authStore.initAuth()

// Global components
app.component('NotificationContainer', NotificationContainer)

// Global error handler
app.config.errorHandler = (error, instance, info) => {
  console.error('Global error:', error, info)
  // You can integrate with error reporting service here
}

// Mount the app
app.mount('#app')