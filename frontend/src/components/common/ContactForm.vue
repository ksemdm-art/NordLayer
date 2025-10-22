<template>
  <div class="contact-form max-w-2xl mx-auto bg-white rounded-lg shadow-nordic overflow-hidden">
    <div class="px-6 py-4 border-b border-primary-200">
      <h2 class="text-2xl font-bold text-primary-900">Связаться с нами</h2>
      <p class="text-primary-600 mt-2">Задайте вопрос или получите консультацию</p>
    </div>
    
    <form @submit.prevent="submitForm" class="p-6 space-y-6">
      <!-- Personal Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="name" class="block text-sm font-medium text-primary-700 mb-2">
            Ваше имя *
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="form-input"
            :class="{ 'error': errors.name }"
            placeholder="Введите ваше имя"
            @input="validateField('name')"
            @blur="validateField('name')"
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-primary-700 mb-2">
            Email *
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="form-input"
            :class="{ 'error': errors.email }"
            placeholder="your@email.com"
            @input="validateField('email')"
            @blur="validateField('email')"
          />
          <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
        </div>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-primary-700 mb-2">
          Телефон
        </label>
        <input
          id="phone"
          v-model="formattedPhone"
          type="tel"
          class="form-input"
          :class="{ 'error': errors.phone }"
          placeholder="+7 (999) 123-45-67"
          @input="handlePhoneInput"
          @blur="validateField('phone')"
        />
        <p v-if="errors.phone" class="text-sm text-red-600 mt-1">{{ errors.phone }}</p>
        <p class="text-sm text-neutral-500 mt-1">Необязательно, но поможет нам быстрее связаться с вами</p>
      </div>

      <!-- Subject -->
      <div>
        <label for="subject" class="block text-sm font-medium text-primary-700 mb-2">
          Тема обращения *
        </label>
        <select
          id="subject"
          v-model="formData.subject"
          required
          class="form-select"
          :class="{ 'error': errors.subject }"
          @change="validateField('subject')"
          @input="validateField('subject')"
        >
          <option value="">Выберите тему</option>
          <option value="Консультация по услугам">Консультация по услугам</option>
          <option value="Вопрос по заказу">Вопрос по заказу</option>
          <option value="Техническая поддержка">Техническая поддержка</option>
          <option value="Сотрудничество">Сотрудничество</option>
          <option value="Жалоба">Жалоба</option>
          <option value="Предложение">Предложение</option>
          <option value="Другое">Другое</option>
        </select>
        <p v-if="errors.subject" class="text-sm text-red-600 mt-1">{{ errors.subject }}</p>
      </div>

      <!-- Custom Subject -->
      <div v-if="formData.subject === 'Другое'">
        <label for="customSubject" class="block text-sm font-medium text-primary-700 mb-2">
          Укажите тему *
        </label>
        <input
          id="customSubject"
          v-model="formData.customSubject"
          type="text"
          required
          class="form-input"
          :class="{ 'error': errors.customSubject }"
          placeholder="Опишите тему вашего обращения"
          @input="validateField('customSubject')"
          @blur="validateField('customSubject')"
        />
        <p v-if="errors.customSubject" class="text-sm text-red-600 mt-1">{{ errors.customSubject }}</p>
      </div>

      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-primary-700 mb-2">
          Сообщение *
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          rows="5"
          class="form-textarea"
          :class="{ 'error': errors.message }"
          placeholder="Опишите ваш вопрос или запрос подробнее..."
          @blur="validateField('message')"
        />
        <p v-if="errors.message" class="text-sm text-red-600 mt-1">{{ errors.message }}</p>
        <p class="text-sm text-neutral-500 mt-1">
          Минимум 10 символов. Чем подробнее вы опишете ваш вопрос, тем быстрее мы сможем помочь.
        </p>
      </div>

      <!-- Privacy Notice -->
      <div class="bg-neutral-50 p-4 rounded-md">
        <p class="text-sm text-neutral-600">
          <InformationCircleIcon class="w-4 h-4 inline mr-1" />
          Отправляя форму, вы соглашаетесь на обработку персональных данных в соответствии с нашей политикой конфиденциальности.
        </p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2" />
        <span class="text-sm text-red-600">{{ error }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
        <div>
          <p class="text-sm text-green-600 font-medium">{{ success }}</p>
          <p class="text-sm text-green-600 mt-1">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          class="submit-button"
          :class="{ 'loading': isSubmitting }"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </span>
          <span v-else>Отправить сообщение</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'
import api from '@/services/api'

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  customSubject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  subject?: string
  customSubject?: string
  message?: string
}

interface Emits {
  (e: 'submit', data: ContactFormData): void
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  customSubject: '',
  message: ''
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')
const formattedPhone = ref('')

const isFormValid = computed(() => {
  const hasRequiredFields = formData.name.trim() !== '' &&
                           formData.email.trim() !== '' &&
                           formData.subject !== '' &&
                           formData.message.trim() !== ''
  
  const hasCustomSubject = formData.subject !== 'Другое' || formData.customSubject.trim() !== ''
  
  const hasNoErrors = Object.keys(errors).length === 0 || 
                     Object.values(errors).every(error => !error)
  
  return hasRequiredFields && hasCustomSubject && hasNoErrors
})

// Phone formatting helper (copied from ContactDeliveryStep.vue)
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
  formData.phone = formatted
  validateField('phone')
}

const validateField = (field: keyof ContactFormData) => {
  switch (field) {
    case 'name':
      if (!formData.name.trim()) {
        errors.name = 'Имя обязательно для заполнения'
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа'
      } else {
        delete errors.name
      }
      break
      
    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!formData.email.trim()) {
        errors.email = 'Email обязателен для заполнения'
      } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email адрес'
      } else {
        delete errors.email
      }
      break
    }
      
    case 'phone':
      if (formattedPhone.value && formattedPhone.value.length > 0) {
        const digits = formattedPhone.value.replace(/\D/g, '')
        if (digits.length < 10) {
          errors.phone = 'Введите корректный номер телефона'
        } else {
          delete errors.phone
        }
      } else {
        delete errors.phone
      }
      break
      
    case 'subject':
      if (!formData.subject) {
        errors.subject = 'Выберите тему обращения'
      } else {
        delete errors.subject
      }
      break
      
    case 'customSubject':
      if (formData.subject === 'Другое' && !formData.customSubject.trim()) {
        errors.customSubject = 'Укажите тему обращения'
      } else if (formData.subject === 'Другое' && formData.customSubject.trim().length < 3) {
        errors.customSubject = 'Тема должна содержать минимум 3 символа'
      } else {
        delete errors.customSubject
      }
      break
      
    case 'message':
      if (!formData.message.trim()) {
        errors.message = 'Сообщение обязательно для заполнения'
      } else if (formData.message.trim().length < 10) {
        errors.message = 'Сообщение должно содержать минимум 10 символов'
      } else {
        delete errors.message
      }
      break
  }
}

const validateForm = () => {
  // Validate all fields
  Object.keys(formData).forEach(field => {
    validateField(field as keyof ContactFormData)
  })
  
  return Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
}

const submitForm = async () => {
  if (!validateForm()) return
  
  error.value = ''
  success.value = ''
  isSubmitting.value = true
  
  try {
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formattedPhone.value.trim() || undefined,
      subject: formData.subject === 'Другое' ? formData.customSubject.trim() : formData.subject,
      message: formData.message.trim()
    }
    
    const response = await api.post('/contact/', submitData)
    
    if (response.data.success) {
      success.value = response.data.message || 'Ваш запрос успешно отправлен!'
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
        emit('success')
      }, 3000)
      
      emit('submit', formData)
    } else {
      throw new Error(response.data.message || 'Ошибка отправки сообщения')
    }
    
  } catch (err: any) {
    console.error('Contact form submission error:', err)
    
    if (err.response?.data?.detail) {
      error.value = err.response.data.detail
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else {
      error.value = err.message || 'Произошла ошибка при отправке сообщения. Попробуйте позже.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key as keyof ContactFormData] = ''
  })
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })
  formattedPhone.value = ''
  error.value = ''
  success.value = ''
}

// Expose methods for parent component
defineExpose({
  resetForm,
  validateForm
})
</script>

<style scoped>
.form-input, .form-select {
  @apply w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors duration-200 bg-white text-primary-800;
}

.form-input.error, .form-select.error {
  @apply border-error-300 focus:ring-error-500;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-primary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-y transition-colors duration-200 bg-white text-primary-800;
}

.form-textarea.error {
  @apply border-error-300 focus:ring-error-500;
}

.error-message {
  @apply flex items-start p-3 bg-error-50 border border-error-200 rounded-md;
}

.success-message {
  @apply flex items-start p-3 bg-accent-50 border border-accent-200 rounded-md;
}

.submit-button {
  @apply px-6 py-3 bg-primary-900 text-primary-50 font-medium rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl hover:scale-105;
}

.submit-button.loading {
  @apply cursor-not-allowed;
}
</style>