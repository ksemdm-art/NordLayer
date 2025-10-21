<template>
  <div class="leave-review-page min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Оставить отзыв
          </h1>
          <p class="text-lg text-gray-600 max-w-xl mx-auto">
            Поделитесь своим опытом работы с нами. Ваш отзыв поможет другим клиентам сделать правильный выбор.
          </p>
        </div>

        <!-- Review Form Card -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6 md:p-8">
            <ReviewForm
              :order-id="0"
              :customer-name="''"
              :customer-email="''"
              @submit="handleReviewSubmit"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- Info Section -->
        <div class="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Информация о модерации
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <ul class="list-disc list-inside space-y-1">
                  <li>Все отзывы проходят модерацию перед публикацией</li>
                  <li>Мы публикуем только честные и конструктивные отзывы</li>
                  <li>Время модерации обычно составляет 1-2 рабочих дня</li>
                  <li>Вы можете приложить фотографии результата работы</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Back to Reviews -->
        <div class="mt-8 text-center">
          <router-link
            to="/reviews"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Вернуться к отзывам
          </router-link>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">
          Спасибо за отзыв!
        </h2>
        <p class="text-gray-600 mb-6">
          Ваш отзыв отправлен на модерацию и будет опубликован в ближайшее время.
        </p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button
            @click="goToReviews"
            class="flex-1 px-4 py-2 bg-primary-950 text-white rounded-lg hover:bg-primary-900 transition-colors font-bold shadow-lg"
          >
            Посмотреть отзывы
          </button>
          <button
            @click="closeSuccessModal"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ReviewForm from '@/components/reviews/ReviewForm.vue'

const router = useRouter()
const showSuccessModal = ref(false)

const handleReviewSubmit = (reviewData: any) => {
  console.log('Review submitted:', reviewData)
  showSuccessModal.value = true
}

const handleCancel = () => {
  router.push('/reviews')
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/reviews')
}

const goToReviews = () => {
  showSuccessModal.value = false
  router.push('/reviews')
}
</script>

<style scoped>
.leave-review-page {
  min-height: calc(100vh - 64px); /* Adjust for header height */
}
</style>