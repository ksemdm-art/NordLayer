<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-primary-900">Выберите услугу</h2>
      <p class="text-primary-600 mt-2">Выберите тип 3D печати, который лучше всего подходит для вашего проекта</p>
    </div>

    <div class="space-y-6">
      <!-- Service Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-card"
          :class="getServiceCardClasses(service)"
          @click="toggleService(service)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-700">
                  <CubeIcon class="w-6 h-6" />
                </div>
                <h3 class="text-lg font-semibold text-primary-900">{{ service.name }}</h3>
              </div>
              
              <p class="text-primary-600 text-sm mb-4">{{ service.description }}</p>
              
              <!-- Features -->
              <ul v-if="service.features" class="space-y-1 mb-4">
                <li 
                  v-for="feature in service.features" 
                  :key="feature"
                  class="flex items-center text-sm text-primary-600"
                >
                  <CheckIcon class="w-4 h-4 text-accent-500 mr-2 flex-shrink-0" />
                  {{ feature }}
                </li>
              </ul>
              
              <div class="flex items-center justify-end">
                <span 
                  v-if="isServiceSelected(service)"
                  class="bg-accent-500 text-primary-50 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  Выбрано
                </span>
              </div>
            </div>
            
            <!-- Selection Indicator -->
            <div class="selection-indicator">
              <div 
                class="w-6 h-6 rounded-full border-2 transition-all duration-200"
                :class="isServiceSelected(service)
                  ? 'border-accent-500 bg-accent-500' 
                  : 'border-primary-300'"
              >
                <CheckIcon 
                  v-if="isServiceSelected(service)"
                  class="w-4 h-4 text-primary-50 m-0.5"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="allErrors.services" class="flex items-center text-error-600 bg-error-50 border border-error-200 rounded-lg px-4 py-3">
        <ExclamationTriangleIcon class="w-5 h-5 text-error-500 mr-2" />
        {{ allErrors.services }}
      </div>

      <!-- Selected Services Summary -->
      <Transition name="slide-down">
        <div v-if="modelValue.services.length > 0" class="bg-accent-50 border border-accent-200 rounded-lg p-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-lg font-semibold text-accent-900">
                Выбранные услуги ({{ modelValue.services.length }})
              </h4>
            </div>
            
            <div class="grid gap-3">
              <div 
                v-for="service in modelValue.services" 
                :key="service.id"
                class="flex items-center justify-between bg-white rounded-lg p-3 border border-accent-200"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CubeIcon class="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h5 class="font-medium text-accent-900">{{ service.name }}</h5>
                    <p class="text-sm text-accent-700">Выбранная услуга</p>
                  </div>
                </div>
                <button 
                  @click="removeService(service)"
                  class="text-error-500 hover:text-error-700 p-1"
                  title="Удалить услугу"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Navigation -->
    <div class="flex justify-end mt-6 pt-6 border-t border-primary-200">
      <button 
        @click="$emit('next')"
        :disabled="modelValue.services.length === 0"
        class="px-6 py-3 bg-primary-900 text-primary-50 rounded-lg font-medium hover:bg-primary-800 disabled:bg-primary-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
      >
        Далее
        <ArrowRightIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { 
  CheckIcon, 
  CubeIcon, 
  ArrowRightIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/solid'
import { api } from '@/services/api'
import type { Service } from '@/types'
import type { OrderFormData } from '@/types/orders'

interface Props {
  modelValue: OrderFormData
  errors: Record<string, string>
  preselectedServiceId?: number | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: OrderFormData]
  next: []
}>()

const services = ref<Service[]>([])
const loading = ref(false)
const localErrors = ref<Record<string, string>>({})

// Validation
const validateServices = (): string => {
  if (!props.modelValue.services || props.modelValue.services.length === 0) {
    return 'Выберите хотя бы одну услугу'
  }
  return ''
}

// Computed properties
const allErrors = computed(() => {
  return { ...props.errors, ...localErrors.value }
})

// Removed unused isValid computed

// Auto-select preselected service when services are loaded
const selectPreselectedService = () => {
  if (props.preselectedServiceId && services.value.length > 0) {
    const preselectedService = services.value.find(s => s.id === props.preselectedServiceId)
    if (preselectedService && !isServiceSelected(preselectedService)) {
      toggleService(preselectedService)
    }
  }
}

// Watch for services to be loaded and auto-select preselected service
watch(services, () => {
  selectPreselectedService()
}, { immediate: true })

// Reactive validation
watch(() => props.modelValue.services, () => {
  const error = validateServices()
  if (error) {
    localErrors.value.services = error
  } else {
    delete localErrors.value.services
  }
}, { immediate: true, deep: true })

onMounted(async () => {
  await loadServices()
  selectPreselectedService()
})

const loadServices = async () => {
  loading.value = true
  try {
    const response = await api.get('/services')
    const servicesData = response.data.data || []
    services.value = servicesData.filter((service: any) => service.is_active)
    console.log('ServiceSelectionStep - loaded services from API:', services.value)
  } catch (error) {
    console.error('Failed to load services:', error)
    // Fallback к демо данным
    services.value = [
      {
        id: 1,
        name: 'FDM Печать',
        description: 'Экономичная технология послойного наплавления пластика. Подходит для прототипов, функциональных деталей и крупных моделей.',
        base_price: 50,
        is_active: true,
        features: [
          'Быстрое изготовление',
          'Экономичная стоимость',
          'Большой выбор материалов'
        ],
        price_factors: {
          material: 1.2,
          quality: 1.5,
          urgency: 2.0
        }
      },
      {
        id: 2,
        name: 'SLA Печать',
        description: 'Стереолитография обеспечивает высочайшую детализацию и гладкую поверхность.',
        base_price: 100,
        is_active: true,
        features: [
          'Высочайшая детализация',
          'Гладкая поверхность',
          'Точность до 0.025мм'
        ],
        price_factors: {
          material: 1.3,
          quality: 1.8,
          urgency: 2.5
        }
      }
    ]
    console.log('ServiceSelectionStep - using fallback services:', services.value)
  } finally {
    loading.value = false
  }
}

const toggleService = (service: Service) => {
  console.log('ServiceSelectionStep - toggleService called with:', service)
  const currentServices = [...props.modelValue.services]
  const existingIndex = currentServices.findIndex(s => s.id === service.id)
  
  if (existingIndex > -1) {
    // Remove service if already selected
    currentServices.splice(existingIndex, 1)
    console.log('ServiceSelectionStep - removed service, new services:', currentServices)
  } else {
    // Add service if not selected
    currentServices.push(service)
    console.log('ServiceSelectionStep - added service, new services:', currentServices)
  }
  
  const updatedData = { 
    ...props.modelValue, 
    services: currentServices
  }
  console.log('ServiceSelectionStep - emitting update:', updatedData)
  emit('update:modelValue', updatedData)
}

const removeService = (service: Service) => {
  const currentServices = props.modelValue.services.filter(s => s.id !== service.id)
  const updatedData = { ...props.modelValue, services: currentServices }
  emit('update:modelValue', updatedData)
}

const isServiceSelected = (service: Service) => {
  return props.modelValue.services.some(s => s.id === service.id)
}

const getServiceCardClasses = (service: Service) => {
  const baseClasses = 'service-card cursor-pointer border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg'
  
  if (isServiceSelected(service)) {
    return `${baseClasses} border-accent-500 bg-accent-50 shadow-md transform scale-[1.02]`
  }
  
  return `${baseClasses} border-primary-200 hover:border-accent-300 hover:bg-accent-50`
}



// Removed unused formatFactorName function
</script>

<style scoped>
.service-card {
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #C68642, #E2A574);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.service-card:hover::before,
.service-card.selected::before {
  transform: scaleX(1);
}

.selected-badge {
  @apply bg-accent-500 text-primary-50 text-xs font-medium px-3 py-1 rounded-full;
}

.selection-indicator {
  @apply flex-shrink-0 ml-4;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}
</style>