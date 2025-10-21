import { ref, type Ref } from 'vue'
import api from '@/services/api'
import type { AxiosError, AxiosResponse } from 'axios'

interface ApiState<T> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

interface ApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T = any>() {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const execute = async <R = T>(
    apiCall: () => Promise<AxiosResponse<R>>,
    options: ApiOptions = {}
  ): Promise<R | null> => {
    try {
      loading.value = true
      error.value = null

      const response = await apiCall()
      // Handle backend response format
      const responseData = (response.data as any)?.data || response.data
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

  const get = async <R = T>(url: string, options: ApiOptions = {}): Promise<R | null> => {
    return execute(() => api.get<R>(url), options)
  }

  const post = async <R = T>(url: string, payload?: any, options: ApiOptions = {}): Promise<R | null> => {
    return execute(() => api.post<R>(url, payload), options)
  }

  const put = async <R = T>(url: string, payload?: any, options: ApiOptions = {}): Promise<R | null> => {
    return execute(() => api.put<R>(url, payload), options)
  }

  const patch = async <R = T>(url: string, payload?: any, options: ApiOptions = {}): Promise<R | null> => {
    return execute(() => api.patch<R>(url, payload), options)
  }

  const del = async <R = T>(url: string, options: ApiOptions = {}): Promise<R | null> => {
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
    const responseData = error.response.data as any
    
    // Handle different error response formats
    if (typeof responseData === 'string') {
      return responseData
    }
    
    if (responseData.message) {
      return responseData.message
    }
    
    if (responseData.detail) {
      return responseData.detail
    }
    
    if (responseData.error) {
      return responseData.error
    }
  }

  if (error.message) {
    return error.message
  }

  return 'Произошла неизвестная ошибка'
}

// Specialized hooks for common API patterns
export function useApiList<T = any>(url: string, options: ApiOptions = {}) {
  const { immediate = true } = options
  const apiState = useApi<T[]>()
  
  // Initialize data as empty array instead of null
  apiState.data.value = [] as T[]

  const fetchList = () => apiState.get<T[]>(url, options)

  if (immediate) {
    fetchList()
  }

  return {
    ...apiState,
    fetchList,
    refresh: fetchList
  }
}

export function useApiItem<T = any>(url: string, options: ApiOptions = {}) {
  const { immediate = false } = options
  const apiState = useApi<T>()

  const fetchItem = (id?: string | number) => {
    const itemUrl = id ? `${url}/${id}` : url
    return apiState.get<T>(itemUrl, options)
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