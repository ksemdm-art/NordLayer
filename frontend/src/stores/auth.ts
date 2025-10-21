import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface User {
  id: number
  username: string
  email: string
  full_name?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.is_admin ?? false)

  const setAuth = (authData: LoginResponse) => {
    token.value = authData.access_token
    user.value = authData.user
    localStorage.setItem('admin_token', authData.access_token)
    
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.access_token}`
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('admin_token')
    delete api.defaults.headers.common['Authorization']
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email,
        password
      })
      
      setAuth(response.data)
      return response.data
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    clearAuth()
  }

  const getCurrentUser = async () => {
    if (!token.value) return null
    
    try {
      const response = await api.get<User>('/auth/me')
      user.value = response.data
      return response.data
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  }

  // Initialize auth on store creation
  const initAuth = async () => {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      try {
        await getCurrentUser()
      } catch (error) {
        clearAuth()
      }
    }
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getCurrentUser,
    changePassword,
    initAuth
  }
})