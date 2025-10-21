<template>
  <section class="reviews-section py-16 bg-neutral-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Отзывы наших клиентов
        </h2>
        <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
          Узнайте, что говорят о нас те, кто уже воспользовался нашими услугами 3D печати
        </p>
        
        <!-- Stats -->
        <div v-if="stats" class="flex items-center justify-center space-x-6 mt-6">
          <div class="stat-item">
            <div class="flex items-center justify-center space-x-2">
              <div class="star-rating">
                <StarIcon
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ 'active': star <= Math.round(stats.average_rating) }"
                />
              </div>
              <span class="text-2xl font-bold text-neutral-900">
                {{ stats.average_rating.toFixed(1) }}
              </span>
            </div>
            <p class="text-sm text-neutral-600 mt-1">Средняя оценка</p>
          </div>
          
          <div class="stat-divider"></div>
          
          <div class="stat-item">
            <div class="text-2xl font-bold text-neutral-900">
              {{ stats.total_reviews }}
            </div>
            <p class="text-sm text-neutral-600 mt-1">
              {{ getReviewsWord(stats.total_reviews) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="ml-3 text-neutral-600">Загрузка отзывов...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="text-center py-12">
          <ExclamationTriangleIcon class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="loadReviews" class="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>

      <!-- Reviews Carousel -->
      <div v-else-if="reviews.length > 0" class="reviews-carousel">
        <!-- Desktop: Grid Layout -->
        <div class="hidden lg:grid lg:grid-cols-3 gap-6">
          <ReviewCard
            v-for="review in displayedReviews"
            :key="review.id"
            :review="review"
            class="review-card-compact"
          />
        </div>

        <!-- Mobile/Tablet: Carousel -->
        <div class="lg:hidden">
          <div class="carousel-container">
            <div 
              class="carousel-track"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div
                v-for="review in reviews"
                :key="review.id"
                class="carousel-slide"
              >
                <ReviewCard :review="review" class="review-card-compact" />
              </div>
            </div>
          </div>

          <!-- Carousel Controls -->
          <div class="carousel-controls mt-6">
            <button
              @click="previousSlide"
              :disabled="currentSlide === 0"
              class="carousel-button"
            >
              <ChevronLeftIcon class="w-5 h-5" />
            </button>

            <!-- Dots Indicator -->
            <div class="carousel-dots">
              <button
                v-for="(_, index) in reviews"
                :key="index"
                @click="goToSlide(index)"
                class="carousel-dot"
                :class="{ 'active': index === currentSlide }"
              />
            </div>

            <button
              @click="nextSlide"
              :disabled="currentSlide === reviews.length - 1"
              class="carousel-button"
            >
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="text-center py-12">
          <ChatBubbleLeftEllipsisIcon class="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <p class="text-neutral-600 mb-2">Пока нет отзывов</p>
          <p class="text-sm text-neutral-500">Станьте первым, кто оставит отзыв!</p>
        </div>
      </div>

      <!-- View All Button -->
      <div v-if="reviews.length > 0" class="text-center mt-12">
        <router-link
          to="/reviews"
          class="view-all-button"
        >
          Посмотреть все отзывы
          <ArrowRightIcon class="w-5 h-5 ml-2" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  StarIcon, 
  ExclamationTriangleIcon, 
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import ReviewCard from './ReviewCard.vue'

interface ReviewImage {
  url: string
  caption?: string
}

interface Review {
  id: number
  customer_name: string
  rating: number
  title?: string
  content: string
  images?: ReviewImage[]
  is_featured: boolean
  created_at: string
}

interface ReviewsStats {
  average_rating: number
  total_reviews: number
  rating_distribution: Record<string, number>
}

const reviews = ref<Review[]>([])
const stats = ref<ReviewsStats | null>(null)
const loading = ref(false)
const error = ref('')
const currentSlide = ref(0)

// Auto-carousel interval
let carouselInterval: NodeJS.Timeout | null = null

const displayedReviews = computed(() => {
  // Show up to 3 reviews on desktop
  return reviews.value.slice(0, 3)
})

const loadReviews = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Load featured reviews for homepage
    const response = await fetch('/api/v1/reviews/featured?limit=6')
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки отзывов')
    }
    
    const result = await response.json()
    
    if (result.success) {
      reviews.value = result.data || []
    } else {
      throw new Error(result.message || 'Ошибка загрузки отзывов')
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке отзывов'
  } finally {
    loading.value = false
  }
}

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

// Carousel methods
const nextSlide = () => {
  if (currentSlide.value < reviews.value.length - 1) {
    currentSlide.value++
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const startAutoCarousel = () => {
  if (reviews.value.length <= 1) return
  
  carouselInterval = setInterval(() => {
    if (currentSlide.value >= reviews.value.length - 1) {
      currentSlide.value = 0
    } else {
      currentSlide.value++
    }
  }, 5000) // Change slide every 5 seconds
}

const stopAutoCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

// Load data on mount
onMounted(() => {
  loadReviews()
  loadStats()
  startAutoCarousel()
})

onUnmounted(() => {
  stopAutoCarousel()
})

// Expose methods for parent component
defineExpose({
  loadReviews,
  loadStats
})
</script>

<style scoped>
.stat-item {
  @apply text-center;
}

.stat-divider {
  @apply w-px h-12 bg-neutral-300;
}

.star-rating {
  @apply flex items-center space-x-1;
}

.star {
  @apply w-5 h-5 text-neutral-300;
}

.star.active {
  @apply text-yellow-400;
}

.loading-state,
.error-state,
.empty-state {
  @apply bg-white rounded-lg shadow-sm;
}

.retry-button {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200;
}

.review-card-compact {
  @apply h-full;
}

/* Carousel Styles */
.carousel-container {
  @apply relative overflow-hidden rounded-lg;
}

.carousel-track {
  @apply flex transition-transform duration-300 ease-in-out;
}

.carousel-slide {
  @apply w-full flex-shrink-0 px-2;
}

.carousel-controls {
  @apply flex items-center justify-center space-x-4;
}

.carousel-button {
  @apply p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}

.carousel-dots {
  @apply flex items-center space-x-2;
}

.carousel-dot {
  @apply w-2 h-2 rounded-full bg-neutral-300 hover:bg-neutral-400 transition-colors duration-200;
}

.carousel-dot.active {
  @apply bg-primary-600;
}

.view-all-button {
  @apply inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200;
}
</style>