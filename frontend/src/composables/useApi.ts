import { ref } from 'vue'
import api from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'

// Removed unused ApiState interface - functionality moved inline

interface ApiOptions<T = Record<string, unknown>> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function useApi<T = unknown>() {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(
    apiCall: () => Promise<AxiosResponse<R>>,
    options: ApiOptions<R> = {}
  ): Promise<R | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await apiCall()
      // Handle backend response format
      const responseData = (response.data as { data?: unknown })?.data || response.data
      data.value = responseData as unknown as T
      
      if (options.onSuccess) {
        options.onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      const axiosError = err as AxiosError
      const errorMessage = getErrorMessage(axiosError)
      error.value = errorMessage

      if (options.onError) {
        options.onError(errorMessage)
      }

      console.error('API Error:', axiosError)
      return null
    } finally {
      loading.value = false
    }
  }

  const get = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(url: string, options: ApiOptions<R> = {}): Promise<R | null> => {
    return execute(() => api.get<R>(url), options)
  }

  const post = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(url: string, payload?: unknown, options: ApiOptions<R> = {}): Promise<R | null> => {
    return execute(() => api.post<R>(url, payload), options)
  }

  const put = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(url: string, payload?: unknown, options: ApiOptions<R> = {}): Promise<R | null> => {
    return execute(() => api.put<R>(url, payload), options)
  }

  const patch = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(url: string, payload?: unknown, options: ApiOptions<R> = {}): Promise<R | null> => {
    return execute(() => api.patch<R>(url, payload), options)
  }

  const del = async <R extends Record<string, unknown> = T extends Record<string, unknown> ? T : Record<string, unknown>>(url: string, options: ApiOptions<R> = {}): Promise<R | null> => {
    return execute(() => api.delete<R>(url), options)
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
  }

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    reset
  }
}

function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const responseData = error.response.data as Record<string, unknown>
    
    // Handle different error response formats
    if (typeof responseData === 'string') {
      return responseData
    }
    
    if (responseData.message && typeof responseData.message === 'string') {
      return responseData.message
    }
    
    if (responseData.detail && typeof responseData.detail === 'string') {
      return responseData.detail
    }
    
    if (responseData.error && typeof responseData.error === 'string') {
      return responseData.error
    }
  }

  if (error.message) {
    return error.message
  }

  return 'Произошла неизвестная ошибка'
}

// Specialized hooks for common API patterns
export function useApiList<T = unknown>(url: string, options: ApiOptions = {}) {
  const { immediate = true } = options
  const apiState = useApi<T[]>()
  
  // Initialize data as empty array instead of null
  apiState.data.value = [] as T[]

  const fetchList = () => apiState.get(url, options) as any

  if (immediate) {
    fetchList()
  }

  return {
    ...apiState,
    fetchList,
    refresh: fetchList
  }
}

export function useApiItem<T = unknown>(url: string, options: ApiOptions = {}) {
  const { immediate = false } = options
  const apiState = useApi<T>()

  const fetchItem = (id?: string | number) => {
    const itemUrl = id ? `${url}/${id}` : url
    return apiState.get(itemUrl, options) as any
  }

  if (immediate) {
    fetchItem()
  }

  return {
    ...apiState,
    fetchItem,
    refresh: () => fetchItem()
  }
}