<template>
  <div class="order-form px-4 md:px-0">




    <!-- Progress Indicator -->
    <div class="mb-4 md:mb-8">
      <!-- Mobile: Simple step indicator -->
      <div class="block md:hidden">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-primary-600">
            Шаг {{ currentStep + 1 }} из {{ steps.length }}
          </span>
          <span class="text-sm font-medium text-primary-900">
            {{ steps[currentStep].title }}
          </span>
        </div>
        <div class="w-full bg-primary-200 rounded-full h-2">
          <div 
            class="bg-accent-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
          />
        </div>
      </div>
      
      <!-- Desktop: Full step indicator -->
      <div class="hidden md:flex items-center justify-between mb-4">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex items-center"
          :class="{ 'flex-1': index < steps.length - 1 }"
        >
          <div class="flex items-center">
            <div 
              class="step-indicator"
              :class="getStepClasses(index)"
            >
              <CheckIcon v-if="index < currentStep" class="w-4 h-4" />
              <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
            </div>
            <span 
              class="ml-3 text-sm font-medium transition-colors duration-200"
              :class="index <= currentStep ? 'text-primary-900' : 'text-primary-400'"
            >
              {{ step.title }}
            </span>
          </div>
          
          <!-- Progress Line -->
          <div 
            v-if="index < steps.length - 1"
            class="flex-1 h-0.5 mx-4 transition-colors duration-300"
            :class="index < currentStep ? 'bg-accent-500' : 'bg-primary-200'"
          />
        </div>
      </div>
    </div>



    <!-- Form Content -->
    <div class="form-content">
      <!-- Прямое отображение компонентов без динамической загрузки -->
      <div v-if="currentStep === 0">
        <ServiceSelectionStep 
          v-model="formData"
          :errors="errors"
          :preselected-service-id="props.preselectedServiceId"
          @next="handleNext"
        />
      </div>
      
      <div v-if="currentStep === 1">
        <FilesColorDetailsStep 
          v-model="formData"
          :errors="errors"
          @next="handleNext"
          @previous="handlePrevious"
        />
      </div>
      
      <div v-if="currentStep === 2">
        <ContactDeliveryStep 
          v-model="formData"
          :errors="errors"
          @next="handleNext"
          @previous="handlePrevious"
        />
      </div>
      
      <div v-if="currentStep === 3">
        <ReviewStep 
          v-model="formData"
          :errors="errors"
          @previous="handlePrevious"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckIcon } from '@heroicons/vue/24/solid'
import ServiceSelectionStep from './steps/ServiceSelectionStep.vue'
import FilesColorDetailsStep from './steps/FilesColorDetailsStep.vue'
import ContactDeliveryStep from './steps/ContactDeliveryStep.vue'
import ReviewStep from './steps/ReviewStep.vue'

import { useOrdersStore } from '@/stores/orders'
import type { OrderFormData } from '@/types/orders'


interface Props {
  preselectedServiceId?: number | null
}

const props = defineProps<Props>()

interface Step {
  id: string
  title: string
  component: any
}

const steps: Step[] = [
  { id: 'service', title: 'Выбор услуги', component: ServiceSelectionStep },
  { id: 'files-color-details', title: 'Файлы и параметры', component: FilesColorDetailsStep },
  { id: 'contact-delivery', title: 'Контакты и доставка', component: ContactDeliveryStep },
  { id: 'review', title: 'Подтверждение', component: ReviewStep }
]

const router = useRouter()
const currentStep = ref(0)
const transitionName = ref('slide-right')
const ordersStore = useOrdersStore()

const formData = ref<OrderFormData>({
  services: [],
  files: [],
  selectedGalleryItems: [],
  photos: [],
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  deliveryCity: '',
  deliveryPostalCode: '',
  specifications: {
    material: '',
    quality: '',
    infill: 20,
    color: '',
    selectedColor: null as any,
    isMultiColor: false,
    multiColors: [],
    quantity: 1,
    urgency: 'standard',
    postProcessing: []
  },
  notes: '',
  totalPrice: 0
})

const errors = ref<Record<string, string>>({})

// Removed unused computed properties

const getStepClasses = (index: number) => {
  const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300'
  
  if (index < currentStep.value) {
    return `${baseClasses} bg-accent-500 text-primary-50 shadow-md`
  } else if (index === currentStep.value) {
    return `${baseClasses} bg-primary-100 text-primary-700 border-2 border-accent-500 shadow-sm`
  } else {
    return `${baseClasses} bg-primary-100 text-primary-400 border border-primary-300`
  }
}

// Функция прокрутки наверх
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleNext = () => {
  if (validateCurrentStep()) {
    transitionName.value = 'slide-right'
    currentStep.value++
    // Recalculate price when moving to next step
    calculatePrice()
    // Прокрутка наверх при переходе к следующему шагу
    scrollToTop()
  }
}

const handlePrevious = () => {
  transitionName.value = 'slide-left'
  currentStep.value--
  errors.value = {}
  // Прокрутка наверх при возврате к предыдущему шагу
  scrollToTop()
}

const handleSubmit = async () => {
  if (validateCurrentStep()) {
    try {

      const order = await ordersStore.createOrder(formData.value)
      // Navigate to success page
      router.push(`/order/success/${order.id}`)
    } catch (error) {
      console.error('Order submission failed:', error)
    }
  }
}

const validateCurrentStep = (): boolean => {
  // Валидация теперь обрабатывается в каждом шаге отдельно
  // Здесь мы просто очищаем старые ошибки
  errors.value = {}
  return true
}

// Removed unused functions

// Watch for services changes to update pricing
watch(() => formData.value.services, () => {
  calculatePrice() // Always calculate, even if no services (will set to 0)
}, { deep: true })

watch(() => formData.value.specifications, () => {
  calculatePrice()
}, { deep: true })







const calculatePrice = () => {
  if (!formData.value.services || formData.value.services.length === 0) {
    formData.value.totalPrice = 0
    return
  }
  
  let totalPrice = 0
  const specs = formData.value.specifications || {}
  
  // Add multi-color printing surcharge
  if (specs.isMultiColor) {
    totalPrice *= 1.5 // +50% for multi-color printing
  }
  
  // Ensure we have a valid number
  if (isNaN(totalPrice) || totalPrice < 0) {
    totalPrice = 0
  }
  
  formData.value.totalPrice = Math.round(totalPrice * 100) / 100
}

// Format price for display
// Removed unused formatPrice function

// Load initial data on component mount
onMounted(() => {
  calculatePrice() // Calculate initial price
})
</script>

<style scoped>
.step-indicator {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Transition animations */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Order Details Styles */
.delivery-option {
  @apply flex items-start gap-3 p-4 border-2 border-primary-200 rounded-lg cursor-pointer hover:border-accent-300 hover:bg-accent-50 transition-all duration-200;
}

.delivery-option:has(input:checked) {
  @apply border-accent-500 bg-accent-50;
}

.delivery-option-content {
  @apply flex-1;
}

.payment-option {
  @apply flex items-center gap-3 p-4 border-2 border-primary-200 rounded-lg cursor-pointer hover:border-accent-300 hover:bg-accent-50 transition-all duration-200;
}

.payment-option:has(input:checked) {
  @apply border-accent-500 bg-accent-50;
}



.selection-indicator {
  @apply absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-primary-50 text-xs rounded-full flex items-center justify-center font-bold shadow-lg;
}

/* Photo Upload Styles */
.photo-drop-zone {
  @apply border-2 border-dashed border-primary-300 rounded-lg p-8 cursor-pointer hover:border-accent-400 hover:bg-accent-50 transition-all duration-200;
}

.photo-drop-zone.drag-over {
  @apply border-accent-500 bg-accent-50;
}
</style>