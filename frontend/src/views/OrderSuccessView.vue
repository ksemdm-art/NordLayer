<template>
  <div class="min-h-screen bg-gradient-frost flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-aurora p-8 text-center">
      <!-- Success Icon -->
      <div class="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <!-- Success Message -->
      <h1 class="text-2xl font-bold text-primary-900 mb-4">
        Заказ принят в работу!
      </h1>
      
      <div class="space-y-4 text-primary-700 mb-8">
        <p class="text-lg">
          <span v-if="orderId && orderId !== 'N/A'">
            Ваш заказ <span class="font-semibold text-accent-600">#{{ orderId }}</span> уже в мастерской
          </span>
          <span v-else>
            Ваш заказ уже в мастерской
          </span>
        </p>
        
        <p>
          Мы свяжемся с вами в ближайшее время для уточнения деталей
        </p>
        
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm">
          <p class="font-medium text-primary-900 mb-2">Как мы работаем:</p>
          <ul class="text-left space-y-1 text-primary-700">
            <li>• Обработка заказа в течение рабочего дня</li>
            <li>• Обсуждение деталей и уточнение требований</li>
            <li>• Создание слой за слоем с душой</li>
            <li>• Уведомление о готовности результата</li>
          </ul>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <button
          @click="goHome"
          class="w-full bg-primary-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-800 hover:shadow-glow-nordic transition-all duration-300"
        >
          Вернуться на главную
        </button>
        
        <button
          @click="showReviewForm"
          class="w-full bg-accent-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-accent-600 hover:shadow-glow-copper transition-all duration-300"
        >
          Оставить отзыв
        </button>
        
        <button
          @click="createNewOrder"
          class="w-full bg-primary-100 text-primary-700 py-3 px-6 rounded-lg font-medium hover:bg-primary-200 transition-colors"
        >
          Создать новый заказ
        </button>
      </div>

      <!-- Contact Info -->
      <div class="mt-8 pt-6 border-t border-primary-200 text-sm text-primary-500">
        <p>Есть вопросы? Свяжитесь с нами:</p>
        <div class="flex justify-center space-x-4 mt-2">
          <a href="tel:+79214558534" class="text-accent-600 hover:text-accent-800">📞 +7 (921) 455-85-34</a>
          <a href="mailto:nordlayer@yandex.com" class="text-accent-600 hover:text-accent-800">✉️ nordlayer@yandex.com</a>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary-900">Оставить отзыв</h2>
            <button
              @click="closeReviewModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <ReviewForm
            :order-id="parseInt(orderId)"
            :customer-name="''"
            :customer-email="''"
            @submit="handleReviewSubmit"
            @cancel="closeReviewModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ReviewForm from '@/components/reviews/ReviewForm.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.params.id as string || 'N/A')
const showReviewModal = ref(false)

const goHome = () => {
  router.push('/')
}

const createNewOrder = () => {
  router.push('/order')
}

const showReviewForm = () => {
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
}

const handleReviewSubmit = (reviewData: any) => {
  console.log('Review submitted:', reviewData)
  showReviewModal.value = false
  
  // Показать уведомление об успешной отправке отзыва
  alert('Спасибо за отзыв! Он будет опубликован после модерации.')
}

onMounted(() => {
  // Можно добавить аналитику или другую логику
  console.log('Order success page loaded for order:', orderId.value)
})
</script>