<template>
  <div class="review-form max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-neutral-200">
      <h2 class="text-2xl font-bold text-neutral-900">Оставить отзыв</h2>
      <p class="text-neutral-600 mt-2">Поделитесь своим опытом работы с нами</p>
    </div>
    
    <form @submit.prevent="submitReview" class="p-6 space-y-6">
      <!-- Customer Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="customerName" class="block text-sm font-medium text-neutral-700 mb-2">
            Ваше имя *
          </label>
          <input
            id="customerName"
            v-model="formData.customerName"
            type="text"
            required
            class="form-input"
            placeholder="Введите ваше имя"
          />
        </div>
        
        <div>
          <label for="customerEmail" class="block text-sm font-medium text-neutral-700 mb-2">
            Email *
          </label>
          <input
            id="customerEmail"
            v-model="formData.customerEmail"
            type="email"
            required
            class="form-input"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <!-- Rating -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">
          Оценка *
        </label>
        <div class="star-rating">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
            class="star-button"
            :class="getStarClass(star)"
          >
            <StarIcon class="w-8 h-8" />
          </button>
        </div>
        <p class="text-sm text-neutral-500 mt-1">
          {{ getRatingText(formData.rating) }}
        </p>
      </div>

      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-neutral-700 mb-2">
          Заголовок отзыва
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="form-input"
          placeholder="Краткое описание вашего опыта"
        />
      </div>

      <!-- Content -->
      <div>
        <label for="content" class="block text-sm font-medium text-neutral-700 mb-2">
          Отзыв *
        </label>
        <textarea
          id="content"
          v-model="formData.content"
          required
          rows="5"
          class="form-textarea"
          placeholder="Расскажите подробнее о вашем опыте работы с нами..."
        />
      </div>

      <!-- Images Upload -->
      <div>
        <label class="block text-sm font-medium text-neutral-700 mb-2">
          Фотографии результата
        </label>
        <p class="text-sm text-neutral-500 mb-3">
          Добавьте фотографии готовой работы, чтобы другие клиенты могли увидеть качество наших услуг
        </p>
        <ImageUploader
          v-model="formData.images"
          :max-files="5"
          :max-size-mb="10"
          @upload="handleImageUpload"
        />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        <ExclamationTriangleIcon class="w-5 h-5 text-red-500 mr-2" />
        <span class="text-sm text-red-600">{{ error }}</span>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <CheckCircleIcon class="w-5 h-5 text-green-500 mr-2" />
        <span class="text-sm text-green-600">{{ success }}</span>
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
          <span v-else>Отправить отзыв</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { StarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import ImageUploader from '@/components/common/ImageUploader.vue'

interface ImageData {
  file?: File
  url?: string
  caption?: string
  preview?: string
}

interface ReviewFormData {
  customerName: string
  customerEmail: string
  rating: number
  title: string
  content: string
  images: ImageData[]
}

interface Props {
  customerName?: string
  customerEmail?: string
}

interface Emits {
  (e: 'submit', data: ReviewFormData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = reactive<ReviewFormData>({
  customerName: props.customerName || '',
  customerEmail: props.customerEmail || '',
  rating: 0,
  title: '',
  content: '',
  images: []
})

const hoverRating = ref(0)
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')

const isFormValid = computed(() => {
  return formData.customerName.trim() !== '' &&
         formData.customerEmail.trim() !== '' &&
         formData.rating > 0 &&
         formData.content.trim() !== ''
})

const setRating = (rating: number) => {
  formData.rating = rating
}

const getStarClass = (star: number) => {
  const activeRating = hoverRating.value || formData.rating
  return {
    'active': star <= activeRating,
    'hover': hoverRating.value > 0 && star <= hoverRating.value
  }
}

const getRatingText = (rating: number) => {
  const texts = {
    0: 'Выберите оценку',
    1: 'Очень плохо',
    2: 'Плохо',
    3: 'Нормально',
    4: 'Хорошо',
    5: 'Отлично'
  }
  return texts[rating as keyof typeof texts] || ''
}

const handleImageUpload = (files: File[]) => {
  // Images are handled by the ImageUploader component
  console.log('Images uploaded:', files)
}

const submitReview = async () => {
  if (!isFormValid.value) return
  
  error.value = ''
  success.value = ''
  isSubmitting.value = true
  
  try {
    // Create FormData for file upload
    const submitData = new FormData()
    
    // Add form fields
    submitData.append('customer_name', formData.customerName)
    submitData.append('customer_email', formData.customerEmail)
    submitData.append('rating', formData.rating.toString())
    submitData.append('content', formData.content)
    
    if (formData.title) {
      submitData.append('title', formData.title)
    }
    
    // Add image files
    formData.images.forEach((image, index) => {
      if (image.file) {
        submitData.append('images', image.file)
      }
    })
    
    // Submit to API
    const response = await fetch('/api/v1/reviews/', {
      method: 'POST',
      body: submitData
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Ошибка отправки отзыва')
    }
    
    const result = await response.json()
    
    if (result.success) {
      success.value = 'Отзыв успешно отправлен и будет опубликован после модерации'
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm()
        emit('submit', formData)
      }, 2000)
    } else {
      throw new Error(result.message || 'Ошибка отправки отзыва')
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при отправке отзыва'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.rating = 0
  formData.title = ''
  formData.content = ''
  formData.images = []
  error.value = ''
  success.value = ''
}

// Expose methods for parent component
defineExpose({
  resetForm
})
</script>

<style scoped>
.form-input {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.form-textarea {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y;
}

.star-rating {
  @apply flex items-center space-x-1;
}

.star-button {
  @apply text-neutral-300 hover:text-yellow-400 transition-colors duration-200 focus:outline-none;
}

.star-button.active {
  @apply text-yellow-400;
}

.star-button.hover {
  @apply text-yellow-300;
}

.error-message {
  @apply flex items-center p-3 bg-red-50 border border-red-200 rounded-md;
}

.success-message {
  @apply flex items-center p-3 bg-green-50 border border-green-200 rounded-md;
}

.submit-button {
  @apply px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
}

.submit-button.loading {
  @apply cursor-not-allowed;
}
</style>