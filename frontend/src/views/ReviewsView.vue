<template>
  <div class="reviews-page">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-accent-500/20"></div>
      <div class="relative container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-50 drop-shadow-lg">
          Отзывы клиентов
        </h1>
        <p class="text-xl text-primary-100 max-w-2xl mx-auto drop-shadow">
          Реальные отзывы от наших клиентов о качестве 3D печати и сервисе
        </p>
      </div>
      
      <!-- Декоративные элементы -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-accent-500/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-primary-300/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-20 h-20 bg-accent-400/20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Main Content -->
    <section class="main-content py-16 bg-gradient-to-br from-primary-50 to-white min-h-screen">
      <div class="container mx-auto px-4">
        <!-- Stats Overview -->
        <div v-if="stats" class="stats-overview bg-white rounded-lg shadow-nordic p-4 mb-4 border border-primary-100">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-primary-900">Статистика отзывов</h2>
            <button
              @click="showReviewForm"
              class="px-4 py-2 bg-accent-500 text-primary-50 font-semibold rounded-lg hover:bg-accent-600 hover:shadow-lg hover:scale-105 transition-all duration-300 ease-out shadow-lg"
            >
              Оставить отзыв
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Average Rating -->
            <div class="stat-card text-center">
              <div class="flex items-center justify-center space-x-2 mb-1">
                <div class="star-rating">
                  <StarIcon
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ 'active': star <= Math.round(stats.average_rating) }"
                  />
                </div>
                <span class="text-2xl font-bold text-primary-900">
                  {{ stats.average_rating.toFixed(1) }}
                </span>
              </div>
              <p class="text-sm text-primary-600">Средняя оценка</p>
            </div>

            <!-- Total Reviews -->
            <div class="stat-card text-center">
              <div class="text-2xl font-bold text-primary-900 mb-1">
                {{ stats.total_reviews }}
              </div>
              <p class="text-sm text-primary-600">
                {{ getReviewsWord(stats.total_reviews) }}
              </p>
            </div>

            <!-- Rating Distribution -->
            <div class="stat-card">
              <h3 class="text-base font-semibold text-primary-900 mb-2 text-center">
                Распределение оценок
              </h3>
              <div class="space-y-1">
                <div
                  v-for="rating in [5, 4, 3, 2, 1]"
                  :key="rating"
                  class="rating-bar"
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-primary-600 w-6">{{ rating }}</span>
                    <StarIcon class="w-3 h-3 text-accent-500" />
                    <div class="flex-1 bg-primary-200 rounded-full h-1.5">
                      <div
                        class="bg-accent-500 h-1.5 rounded-full transition-all duration-300"
                        :style="{ width: `${getRatingPercentage(rating)}%` }"
                      />
                    </div>
                    <span class="text-xs text-primary-600 w-6 text-right">
                      {{ stats.rating_distribution[rating] || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews List -->
        <ReviewsList
          ref="reviewsList"
          :show-filters="true"
          :show-stats="false"
          :limit="12"
          :external-stats="stats"
        />
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section bg-primary-50 py-8">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-primary-900 mb-4">
          Готовы заказать 3D печать?
        </h2>
        <p class="text-lg text-primary-600 mb-8 max-w-2xl mx-auto">
          Присоединяйтесь к нашим довольным клиентам и получите качественную 3D печать
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link
            to="/order"
            class="cta-button primary"
          >
            Сделать заказ
          </router-link>
          <button
            @click="showReviewForm"
            class="cta-button secondary"
          >
            Оставить отзыв
          </button>
          <router-link
            to="/services"
            class="cta-button secondary"
          >
            Наши услуги
          </router-link>
        </div>
      </div>
    </section>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary-900">Оставить отзыв</h2>
            <button
              @click="closeReviewModal"
              class="text-primary-400 hover:text-primary-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <ReviewForm
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { StarIcon } from '@heroicons/vue/24/solid'
import ReviewsList from '@/components/reviews/ReviewsList.vue'
import ReviewForm from '@/components/reviews/ReviewForm.vue'

interface ReviewsStats {
  average_rating: number
  total_reviews: number
  rating_distribution: Record<string, number>
}

const router = useRouter()
const stats = ref<ReviewsStats | null>(null)
const reviewsList = ref<InstanceType<typeof ReviewsList>>()
const showReviewModal = ref(false)

const loadStats = async () => {
  try {
    const response = await fetch('/api/v1/reviews/stats')
    
    if (response.ok) {
      const result = await response.json()
      
      if (result.success) {
        stats.value = result.data
      }
    }
  } catch (err) {
    console.error('Error loading review stats:', err)
  }
}

const getReviewsWord = (count: number): string => {
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'отзывов'
  }
  
  if (lastDigit === 1) {
    return 'отзыв'
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'отзыва'
  }
  
  return 'отзывов'
}

const getRatingPercentage = (rating: number): number => {
  if (!stats.value || stats.value.total_reviews === 0) return 0
  
  const count = stats.value.rating_distribution[rating] || 0
  return (count / stats.value.total_reviews) * 100
}

const showReviewForm = () => {
  router.push('/reviews/leave')
}

const closeReviewModal = () => {
  showReviewModal.value = false
}

const handleReviewSubmit = (reviewData: any) => {
  console.log('Review submitted:', reviewData)
  showReviewModal.value = false
  
  // Показать уведомление об успешной отправке отзыва
  alert('Спасибо за отзыв! Он будет опубликован после модерации.')
  
  // Обновить статистику и список отзывов
  loadStats()
  reviewsList.value?.loadReviews()
}

// Load data on mount
onMounted(() => {
  loadStats()
})

// Set page title
if (typeof document !== 'undefined') {
  document.title = 'Отзывы клиентов - 3D Печать'
}
</script>

<style scoped>
.hero-section {
  @apply relative overflow-hidden;
}

.hero-section::before {
  content: '';
  @apply absolute inset-0 bg-black bg-opacity-10;
}

.hero-section > * {
  @apply relative z-10;
}

.stats-overview {
  @apply border border-primary-200;
}

.stat-card {
  @apply p-2;
}

.star-rating {
  @apply flex items-center space-x-1;
}

.star {
  @apply w-6 h-6 text-primary-300;
}

.star.active {
  @apply text-accent-500;
}

.rating-bar {
  @apply flex items-center;
}

.cta-section {
  @apply border-t border-primary-200;
}

.cta-button {
  @apply px-8 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl hover:scale-105;
}

.cta-button.primary {
  @apply bg-primary-900 text-primary-50 hover:bg-primary-800 focus:ring-accent-500;
}

.cta-button.secondary {
  @apply bg-white text-primary-900 border-2 border-primary-900 hover:bg-primary-50 focus:ring-accent-500;
}

/* Анимации */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(2deg);
  }
  66% {
    transform: translateY(-25px) rotate(-2deg);
  }
}

.animate-float {
  animation: float 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>