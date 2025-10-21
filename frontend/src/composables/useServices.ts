import { ref, computed } from 'vue'
import { api } from '@/services/api'

interface Service {
  id: number
  name: string
  description: string
  base_price: number
  price_factors: Record<string, any>
  is_active: boolean
}

const services = ref<Service[]>([])
const loading = ref(false)
const loaded = ref(false)

export const useServices = () => {
  const loadServices = async () => {
    if (loaded.value || loading.value) return services.value
    
    loading.value = true
    try {
      const response = await api.get('/services')
      services.value = response.data.data || response.data || []
      loaded.value = true
    } catch (error) {
      console.error('Error loading services:', error)
      services.value = []
    } finally {
      loading.value = false
    }
    
    return services.value
  }

  const getServiceById = (id: number | string) => {
    const serviceId = typeof id === 'string' ? parseInt(id) : id
    return services.value.find(service => service.id === serviceId)
  }

  const getServicePrice = (id: number | string) => {
    const service = getServiceById(id)
    return service?.base_price || 0
  }

  const getServiceName = (id: number | string) => {
    const service = getServiceById(id)
    return service?.name || `Услуга #${id}`
  }

  const servicesMap = computed(() => {
    const map: Record<number, Service> = {}
    services.value.forEach(service => {
      map[service.id] = service
    })
    return map
  })

  return {
    services,
    loading,
    loaded,
    loadServices,
    getServiceById,
    getServicePrice,
    getServiceName,
    servicesMap
  }
}