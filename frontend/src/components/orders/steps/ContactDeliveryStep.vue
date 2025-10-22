<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Контакты и доставка</h2>
      <p class="text-gray-600 mt-2">Укажите ваши контактные данные и предпочтения по доставке</p>
    </div>

    <div class="space-y-6">
      <!-- Contact Information -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Имя и фамилия *
            </label>
            <input
              :value="modelValue.customerName"
              @input="updateField('customerName', $event)"
              type="text"
              placeholder="Введите ваше имя"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
              :class="{ 'border-red-500': allErrors.customerName }"
            />
            <p v-if="allErrors.customerName" class="text-red-500 text-sm mt-1">{{ allErrors.customerName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Телефон
            </label>
            <input
              v-model="formattedPhone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
              :class="{ 'border-red-500': allErrors.customerPhone }"
              @input="handlePhoneInput"
            />
            <p v-if="allErrors.customerPhone" class="text-red-500 text-sm mt-1">{{ allErrors.customerPhone }}</p>
            <p class="text-sm text-gray-500 mt-1">
              Необязательное поле. Поддерживаются номера РФ и СНГ
            </p>
          </div>
        </div>
        
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            :value="modelValue.customerEmail"
            @input="updateField('customerEmail', $event)"
            type="email"
            placeholder="your@email.com"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
            :class="{ 'border-red-500': allErrors.customerEmail }"
          />
          <p v-if="allErrors.customerEmail" class="text-red-500 text-sm mt-1">{{ allErrors.customerEmail }}</p>
        </div>

        <!-- Alternative Contact Method -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Иная форма связи
          </label>
          <input
            v-model="alternativeContact"
            type="text"
            placeholder="Например: Telegram @username, WhatsApp, Viber и т.д."
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
          />
          <p class="text-sm text-gray-500 mt-1">
            Укажите альтернативный способ связи, если основные варианты вам не подходят
          </p>
        </div>
      </div>

      <!-- Delivery Information -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Получение заказа</h3>
        
        <div class="space-y-4">
          <!-- Delivery Method Question -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Нужна ли доставка? *
            </label>
            <div class="space-y-3">
              <label class="delivery-option">
                <input
                  type="radio"
                  name="deliveryNeeded"
                  :value="false"
                  v-model="deliveryNeeded"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="delivery-option-content">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="font-medium">Самовывоз</span>
                    <span class="text-green-600 font-medium">Бесплатно</span>
                  </div>
                  <p class="text-sm text-gray-600">Заберу заказ самостоятельно в вашем офисе</p>
                </div>
              </label>
              
              <label class="delivery-option">
                <input
                  type="radio"
                  name="deliveryNeeded"
                  :value="true"
                  v-model="deliveryNeeded"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div class="delivery-option-content">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="font-medium">Нужна доставка</span>
                    <span class="text-blue-600 font-medium">Обсудим детали</span>
                  </div>
                  <p class="text-sm text-gray-600">Хочу получить заказ с доставкой</p>
                </div>
              </label>
            </div>
            <p v-if="allErrors.deliveryNeeded" class="text-red-500 text-sm mt-1">{{ allErrors.deliveryNeeded }}</p>
          </div>

          <!-- Delivery Details (shown when delivery is needed) -->
          <div v-if="deliveryNeeded" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="text-sm font-medium text-blue-900 mb-3">Детали доставки</h4>
            
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-blue-800 mb-2">
                  Адрес доставки
                </label>
                <textarea
                  v-model="deliveryDetails"
                  placeholder="Укажите адрес и удобное время для доставки..."
                  rows="3"
                  class="w-full px-4 py-3 border border-blue-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 resize-none"
                />
              </div>
              
              <div class="bg-blue-100 rounded-lg p-3">
                <p class="text-sm text-blue-800">
                  <strong>Обратите внимание:</strong> Стоимость и возможность доставки будут обсуждены с вами индивидуально после оформления заказа.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-blue-900 mb-4">Информация о заказе</h3>
        <div class="space-y-2 text-sm text-blue-800">
          <p v-if="modelValue.services?.length">
            <strong>Услуги:</strong> {{ modelValue.services.map(s => s.name).join(', ') }}
          </p>
          <p v-if="modelValue.files?.length">
            <strong>Файлов загружено:</strong> {{ modelValue.files.length }}
          </p>
          <p v-if="modelValue.selectedGalleryItems?.length">
            <strong>Моделей из галереи:</strong> {{ modelValue.selectedGalleryItems.length }}
          </p>
          <p v-if="modelValue.photos?.length">
            <strong>Фотографий загружено:</strong> {{ modelValue.photos.length }}
          </p>
          <p v-if="selectedColorInfo">
            <strong>Цвет:</strong> {{ selectedColorInfo }}
          </p>
          <p v-if="modelValue.notes?.trim()">
            <strong>Дополнительная информация:</strong> Указана
          </p>
          <p v-if="alternativeContact?.trim()">
            <strong>Альтернативная связь:</strong> {{ alternativeContact }}
          </p>
          <p>
            <strong>Получение:</strong> {{ deliveryNeeded ? 'С доставкой' : 'Самовывоз' }}
          </p>
        </div>
      </div>
    </div>



    <!-- Navigation -->
    <div class="flex justify-between mt-6 pt-6 border-t border-gray-200">
      <button 
        @click="$emit('previous')"
        class="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
      >
        ← Назад
      </button>
      
      <button 
        @click="handleNext"
        :disabled="!isValid"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
      >
        Далее →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { OrderFormData } from '@/types/orders'

interface Props {
  modelValue: OrderFormData
  errors: Record<string, string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: OrderFormData]
  next: []
  previous: []
}>()

// Local state for new fields
const alternativeContact = ref(props.modelValue.alternativeContact || '')
const deliveryNeeded = ref(props.modelValue.deliveryNeeded ?? null)
const deliveryDetails = ref(props.modelValue.deliveryDetails || '')
const formattedPhone = ref(props.modelValue.customerPhone || '')

// Local validation errors
const localErrors = ref<Record<string, string>>({})

// Update field function
const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  emit('update:modelValue', updatedData)
}

// Validation functions
const validateName = (name: string): string => {
  if (!name?.trim()) {
    return 'Имя обязательно для заполнения'
  }
  if (name.trim().length < 2) {
    return 'Имя должно содержать минимум 2 символа'
  }
  return ''
}

const validateEmail = (email: string): string => {
  if (!email?.trim()) {
    return 'Email обязателен для заполнения'
  }
  if (!isValidEmail(email)) {
    return 'Введите корректный email адрес'
  }
  return ''
}

const validatePhone = (phone: string): string => {
  if (phone && phone.length > 0) {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) {
      return 'Введите корректный номер телефона'
    }
  }
  return ''
}

const validateDelivery = (): string => {
  if (deliveryNeeded.value === null || deliveryNeeded.value === undefined) {
    return 'Выберите способ получения заказа'
  }
  return ''
}

// Computed properties
const selectedColorInfo = computed(() => {
  if (props.modelValue.specifications.isMultiColor) {
    const colorCount = Array.isArray(props.modelValue.specifications.multiColors) ? props.modelValue.specifications.multiColors.length : 0
    return `Многоцветная печать (${colorCount} цветов)`
  }
  return props.modelValue.specifications.selectedColor ? 'Выбран' : null
})

const allErrors = computed(() => {
  return { ...props.errors, ...localErrors.value }
})

const isValid = computed(() => {
  // Validate all fields
  const nameError = validateName(props.modelValue.customerName)
  const emailError = validateEmail(props.modelValue.customerEmail)
  const phoneError = validatePhone(formattedPhone.value)
  const deliveryError = validateDelivery()
  
  return !nameError && !emailError && !phoneError && !deliveryError
})

// Phone formatting helper
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')
  
  // Handle different country codes
  if (digits.startsWith('7') || digits.startsWith('8')) {
    // Russian format
    const cleaned = digits.startsWith('8') ? '7' + digits.slice(1) : digits
    if (cleaned.length <= 1) return '+7'
    if (cleaned.length <= 4) return `+7 (${cleaned.slice(1)}`
    if (cleaned.length <= 7) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4)}`
    if (cleaned.length <= 9) return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
    return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
  } else if (digits.startsWith('375')) {
    // Belarus format
    if (digits.length <= 3) return '+375'
    if (digits.length <= 5) return `+375 (${digits.slice(3)}`
    if (digits.length <= 8) return `+375 (${digits.slice(3, 5)}) ${digits.slice(5)}`
    if (digits.length <= 10) return `+375 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`
    return `+375 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
  } else if (digits.startsWith('380')) {
    // Ukraine format
    if (digits.length <= 3) return '+380'
    if (digits.length <= 5) return `+380 (${digits.slice(3)}`
    if (digits.length <= 8) return `+380 (${digits.slice(3, 5)}) ${digits.slice(5)}`
    if (digits.length <= 10) return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`
    return `+380 (${digits.slice(3, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
  } else if (digits.startsWith('77')) {
    // Kazakhstan format
    if (digits.length <= 2) return '+77'
    if (digits.length <= 5) return `+77 (${digits.slice(2)}`
    if (digits.length <= 8) return `+77 (${digits.slice(2, 5)}) ${digits.slice(5)}`
    if (digits.length <= 10) return `+77 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8)}`
    return `+77 (${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
  } else if (digits.length > 0) {
    // Other formats - just add + at the beginning
    return `+${digits}`
  }
  
  return value
}

const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const formatted = formatPhoneNumber(target.value)
  formattedPhone.value = formatted
  
  // Update the model
  const updatedData = {
    ...props.modelValue,
    customerPhone: formatted
  }
  emit('update:modelValue', updatedData)
}

// Validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Handle next step
const handleNext = () => {
  if (isValid.value) {
    // Update the model with new fields
    const updatedData = {
      ...props.modelValue,
      alternativeContact: alternativeContact.value,
      deliveryNeeded: deliveryNeeded.value,
      deliveryDetails: deliveryDetails.value
    }

    emit('update:modelValue', updatedData)
    emit('next')
  }
}

// Watch for changes and update the model
watch([alternativeContact, deliveryNeeded, deliveryDetails], () => {
  const updatedData = {
    ...props.modelValue,
    alternativeContact: alternativeContact.value,
    deliveryNeeded: deliveryNeeded.value,
    deliveryDetails: deliveryDetails.value
  }

  emit('update:modelValue', updatedData)
}, { deep: true, immediate: true })

// Watch for phone changes from parent
watch(() => props.modelValue.customerPhone, (newPhone) => {
  if (newPhone !== formattedPhone.value) {
    formattedPhone.value = newPhone || ''
  }
})

// Reactive validation watchers
watch(() => props.modelValue.customerName, (newName) => {
  const error = validateName(newName)
  if (error) {
    localErrors.value.customerName = error
  } else {
    delete localErrors.value.customerName
  }
}, { immediate: true })

watch(() => props.modelValue.customerEmail, (newEmail) => {
  const error = validateEmail(newEmail)
  if (error) {
    localErrors.value.customerEmail = error
  } else {
    delete localErrors.value.customerEmail
  }
}, { immediate: true })

watch(formattedPhone, (newPhone) => {
  const error = validatePhone(newPhone)
  if (error) {
    localErrors.value.customerPhone = error
  } else {
    delete localErrors.value.customerPhone
  }
}, { immediate: true })

watch(deliveryNeeded, () => {
  const error = validateDelivery()
  if (error) {
    localErrors.value.deliveryNeeded = error
  } else {
    delete localErrors.value.deliveryNeeded
  }
}, { immediate: true })


</script>

<style scoped>
.delivery-option {
  @apply flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200;
}

.delivery-option:has(input:checked) {
  @apply border-blue-500 bg-blue-50;
}

.delivery-option-content {
  @apply flex-1;
}

.payment-option {
  @apply flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200;
}

.payment-option:has(input:checked) {
  @apply border-blue-500 bg-blue-50;
}
</style>