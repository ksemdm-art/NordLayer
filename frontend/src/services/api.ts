import axios, { type AxiosResponse } from 'axios'
import { globalNotifications } from '@/composables/useNotifications'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const endTime = new Date()
      const duration = endTime.getTime() - response.config.metadata.startTime.getTime()
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }
    
    return response
  },
  (error) => {
    const { response, request, message } = error

    // Network error
    if (!response && request) {
      globalNotifications.error(
        'Ошибка сети',
        'Проверьте подключение к интернету и попробуйте снова'
      )
      return Promise.reject(error)
    }

    // HTTP error responses
    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('admin_token')
          globalNotifications.error(
            'Не авторизован',
            'Пожалуйста, войдите в систему'
          )
          // You can add router redirect here if needed
          break

        case 403:
          globalNotifications.error(
            'Доступ запрещен',
            'У вас нет прав для выполнения этого действия'
          )
          break

        case 404:
          globalNotifications.error(
            'Не найдено',
            'Запрашиваемый ресурс не найден'
          )
          break

        case 422:
          // Validation errors
          if (data?.detail && Array.isArray(data.detail)) {
            const validationErrors = data.detail.map((err: { loc?: string[]; msg?: string }) => 
              `${err.loc?.join('.')}: ${err.msg}`
            ).join(', ')
            globalNotifications.error(
              'Ошибка валидации',
              validationErrors
            )
          } else {
            globalNotifications.error(
              'Ошибка валидации',
              data?.message || 'Проверьте введенные данные'
            )
          }
          break

        case 429:
          globalNotifications.warning(
            'Слишком много запросов',
            'Пожалуйста, подождите немного перед следующим запросом'
          )
          break

        case 500:
          globalNotifications.error(
            'Ошибка сервера',
            'Произошла внутренняя ошибка сервера. Попробуйте позже'
          )
          break

        default:
          globalNotifications.error(
            'Ошибка',
            data?.message || message || 'Произошла неизвестная ошибка'
          )
      }
    }

    return Promise.reject(error)
  }
)

// Extend AxiosRequestConfig to include metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date
    }
  }
}

export default api