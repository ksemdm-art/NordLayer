<template>
  <div class="reviews-list">
    <!-- Header -->
    <div class="reviews-header mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-primary-900">Отзывы клиентов</h2>
          <p class="text-primary-600 mt-1">{{ totalReviews }} {{ getReviewsWord(totalReviews) }}</p>
        </div>
        
        <div v-if="showStats" class="stats-summary">
          <div class="flex items-center space-x-2">
            <div class="star-rating">
              <StarIcon
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ 'active': star <= Math.round(averageRating) }"
              />
            </div>
            <span class="text-lg font-semibold text-primary-900">
              {{ averageRating.toFixed(1) }}
            </span>
            <span class="text-sm text-primary-500">
              ({{ totalReviews }} {{ getReviewsWord(totalReviews) }})
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="filters mb-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Rating Filter -->
        <div class="filter-group">
          <label class="filter-label">Рейтинг:</label>
          <select v-model="filters.rating" class="filter-select">
            <option value="">Все</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>

        <!-- Featured Filter -->
        <div class="filter-group">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              v-model="filters.featuredOnly"
              type="checkbox"
              class="filter-checkbox"
            />
            <span class="text-sm text-primary-700">Только рекомендуемые</span>
          </label>
        </div>

        <!-- Sort -->
        <div class="filter-group">
          <label class="filter-label">Сортировка:</label>
          <select v-model="filters.sortBy" class="filter-select">
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="rating_high">Высокий рейтинг</option>
            <option value="rating_low">Низкий рейтинг</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        <span class="ml-3 text-primary-600">Загрузка отзывов...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="text-center py-12">
        <ExclamationTriangleIcon class="w-12 h-12 text-error-500 mx-auto mb-4" />
        <p class="text-error-600 mb-4">{{ error }}</p>
        <button @click="() => loadReviews()" class="retry-button">
          Попробовать снова
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="reviews.length === 0" class="empty-state">
      <div class="text-center py-12">
        <ChatBubbleLeftEllipsisIcon class="w-12 h-12 text-primary-400 mx-auto mb-4" />
        <p class="text-primary-600 mb-2">Пока нет отзывов</p>
        <p class="text-sm text-primary-500">Станьте первым, кто оставит отзыв!</p>
      </div>
    </div>

    <!-- Reviews Grid -->
    <div v-else class="reviews-grid">
      <ReviewCard
        v-for="review in reviews"
        :key="review.id"
        :review="review"
        class="review-item"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && !loading" class="load-more-section mt-8">
      <div class="text-center">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="load-more-button"
        >
          <span v-if="loadingMore" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Загрузка...
          </span>
          <span v-else>Показать еще</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { StarIcon, ExclamationTriangleIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'
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

interface Props {
  showFilters?: boolean
  showStats?: boolean
  featuredOnly?: boolean
  limit?: number
  externalStats?: ReviewsStats | null
}

const props = withDefaults(defineProps<Props>(), {
  showFilters: true,
  showStats: true,
  featuredOnly: false,
  limit: 10,
  externalStats: null
})

const reviews = ref<Review[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref('')
const hasMore = ref(true)
const currentPage = ref(0)
const totalReviews = ref(0)
const averageRating = ref(0)

const filters = reactive({
  rating: '',
  featuredOnly: props.featuredOnly,
  sortBy: 'newest'
})

const loadReviews = async (reset = true) => {
  if (reset) {
    loading.value = true
    currentPage.value = 0
    reviews.value = []
  } else {
    loadingMore.value = true
  }
  
  error.value = ''
  
  try {
    const params = new URLSearchParams({
      skip: (currentPage.value * props.limit).toString(),
      limit: props.limit.toString(),
      approved_only: 'true'
    })
    
    if (filters.rating) {
      params.append('rating', filters.rating)
    }
    
    if (filters.featuredOnly) {
      params.append('featured_only', 'true')
    }
    
    const response = await fetch(`/api/v1/reviews/?${params}`)
    
    if (!response.ok) {
      throw new Error('Ошибка загрузки отзывов')
    }
    
    const result = await response.json()
    
    if (result.success) {
      const newReviews = result.data || []
      
      if (reset) {
        reviews.value = newReviews
      } else {
        reviews.value.push(...newReviews)
      }
      
      hasMore.value = newReviews.length === props.limit
      currentPage.value++
    } else {
      throw new Error(result.message || 'Ошибка загрузки отзывов')
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке отзывов'
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadStats = async () => {
  // Если статистика передана извне, используем её
  if (props.externalStats) {
    averageRating.value = props.externalStats.average_rating || 0
    totalReviews.value = props.externalStats.total_reviews || 0
    return
  }
  
  try {
    const response = await fetch('/api/v1/reviews/stats')
    
    if (response.ok) {
      const result = await response.json()
      
      if (result.success) {
        averageRating.value = result.data.average_rating || 0
        totalReviews.value = result.data.total_reviews || 0
      }
    }
  } catch (err) {
    console.error('Error loading review stats:', err)
  }
}

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return
  loadReviews(false)
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

// Watch filters and reload reviews
watch(filters, () => {
  loadReviews(true)
}, { deep: true })

// Watch external stats
watch(() => props.externalStats, (newStats) => {
  if (newStats) {
    averageRating.value = newStats.average_rating || 0
    totalReviews.value = newStats.total_reviews || 0
  }
}, { immediate: true })

// Load initial data
onMounted(() => {
  loadReviews()
  if (props.showStats && !props.externalStats) {
    loadStats()
  }
})

// Expose methods for parent component
defineExpose({
  loadReviews,
  loadStats
})
</script>

<style scoped>
.reviews-header {
  @apply border-b border-primary-200 pb-4;
}

.stats-summary {
  @apply text-right;
}

.star-rating {
  @apply flex items-center space-x-1;
}

.star {
  @apply w-4 h-4 text-primary-300;
}

.star.active {
  @apply text-accent-500;
}

.filters {
  @apply bg-primary-50 rounded-lg p-3 border border-primary-100;
}

.filter-group {
  @apply flex items-center space-x-2;
}

.filter-label {
  @apply text-sm font-medium text-primary-700;
}

.filter-select {
  @apply px-3 py-1 border border-primary-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-primary-800;
}

.filter-checkbox {
  @apply rounded border-primary-300 text-accent-500 focus:ring-accent-500;
}

.loading-state,
.error-state,
.empty-state {
  @apply bg-primary-50 rounded-lg border border-primary-100;
}

.retry-button {
  @apply px-4 py-2 bg-primary-900 text-primary-50 rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105;
}

.reviews-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.review-item {
  @apply h-fit;
}

.load-more-button {
  @apply px-6 py-3 bg-primary-100 text-primary-700 font-medium rounded-lg hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-primary-200 shadow-lg hover:shadow-xl hover:scale-105;
}
</style>