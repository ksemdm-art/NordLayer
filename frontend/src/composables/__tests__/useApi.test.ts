import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '../useApi'
import api from '@/services/api'

// Mock the API service
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { data, loading, error } = useApi()
    
    expect(data.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should handle successful GET request', async () => {
    const mockData = { id: 1, name: 'Test' }
    const mockResponse = { data: mockData }
    
    vi.mocked(api.get).mockResolvedValue(mockResponse)
    
    const { get, data, loading, error } = useApi()
    
    const result = await get('/test')
    
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(data.value).toEqual(mockData)
    expect(result).toEqual(mockData)
    expect(api.get).toHaveBeenCalledWith('/test')
  })

  it('should handle API errors', async () => {
    const mockError = {
      response: {
        data: { message: 'Test error' }
      }
    }
    
    vi.mocked(api.get).mockRejectedValue(mockError)
    
    const { get, data, loading, error } = useApi()
    
    const result = await get('/test')
    
    expect(loading.value).toBe(false)
    expect(error.value).toBe('Test error')
    expect(data.value).toBe(null)
    expect(result).toBe(null)
  })

  it('should reset state correctly', () => {
    const { data, loading, error, reset } = useApi()
    
    // Set some values
    data.value = { test: 'data' } as any
    loading.value = true
    error.value = 'Some error'
    
    reset()
    
    expect(data.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
  })
})