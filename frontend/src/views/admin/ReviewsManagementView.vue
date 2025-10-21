<template>
  <AdminLayout>
    <div class="reviews-management">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Управление отзывами</h1>
        <p class="text-gray-600 mt-1">Модерация и управление отзывами клиентов</p>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="stats-summary bg-white rounded-lg shadow-sm border px-4 py-2">
          <div class="flex items-center space-x-6 text-sm">
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ stats.total }}</div>
              <div class="text-gray-500">Всего</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-green-600">{{ stats.approved }}</div>
              <div class="text-gray-500">Одобрено</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-yellow-600">{{ stats.pending }}</div>
              <div class="text-gray-500">На модерации</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-blue-600">{{ stats.featured }}</div>
              <div class="text-gray-500">Рекомендуемые</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">Все</option>
            <option value="pending">На модерации</option>
            <option value="approved">Одобренные</option>
            <option value="featured">Рекомендуемые</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Рейтинг:</label>
          <select v-model="filters.rating" class="filter-select">
            <option value="">Все</option>
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Поиск:</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Поиск по содержимому..."
            class="filter-input"
          />
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>

    <!-- Reviews Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клиент
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Рейтинг
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Отзыв
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="review in reviews" :key="review.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ review.customer_name }}</div>
                  <div class="text-sm text-gray-500">{{ review.customer_email }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <StarIcon
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                    />
                  </div>
                  <span class="ml-2 text-sm text-gray-600">{{ review.rating }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <div v-if="review.title" class="text-sm font-medium text-gray-900 truncate">
                    {{ review.title }}
                  </div>
                  <div class="text-sm text-gray-600 truncate">{{ review.content }}</div>
                  <div v-if="review.images && review.images.length > 0" class="text-xs text-blue-600 mt-1">
                    {{ review.images.length }} изображений
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(review)"
                  >
                    {{ getStatusText(review) }}
                  </span>
                  <StarIcon
                    v-if="review.is_featured"
                    class="w-4 h-4 text-blue-500"
                    title="Рекомендуемый"
                  />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(review.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="viewReview(review)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Просмотреть"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="!review.is_approved"
                    @click="approveReview(review.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Одобрить"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  <button
                    v-if="review.is_approved"
                    @click="toggleFeatured(review.id, !review.is_featured)"
                    class="hover:text-blue-900"
                    :class="review.is_featured ? 'text-blue-600' : 'text-gray-400'"
                    :title="review.is_featured ? 'Убрать из рекомендуемых' : 'Сделать рекомендуемым'"
                  >
                    <StarIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteReview(review.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Удалить"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Вперед
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Показано <span class="font-medium">{{ (currentPage - 1) * limit + 1 }}</span> -
                <span class="font-medium">{{ Math.min(currentPage * limit, totalReviews) }}</span> из
                <span class="font-medium">{{ totalReviews }}</span> отзывов
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  :class="page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Detail Modal -->
    <div v-if="selectedReview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">Детали отзыва</h2>
            <button
              @click="selectedReview = null"
              class="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <ReviewCard :review="selectedReview" />

          <div class="mt-6 flex items-center justify-end space-x-3">
            <button
              v-if="!selectedReview.is_approved"
              @click="approveReview(selectedReview.id)"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Одобрить
            </button>
            <button
              v-if="selectedReview.is_approved"
              @click="toggleFeatured(selectedReview.id, !selectedReview.is_featured)"
              class="px-4 py-2 rounded-md"
              :class="selectedReview.is_featured
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              {{ selectedReview.is_featured ? 'Убрать из рекомендуемых' : 'Сделать рекомендуемым' }}
            </button>
            <button
              @click="deleteReview(selectedReview.id)"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import {
  StarIcon,
  EyeIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ReviewCard from '@/components/reviews/ReviewCard.vue'
import { useAuthStore } from '@/stores/auth'

interface Review {
  id: number
  order_id: number
  customer_name: string
  customer_email: string
  rating: number
  title?: string
  content: string
  images?: Array<{ url: string; caption?: string }>
  is_approved: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

const authStore = useAuthStore()
const reviews = ref<Review[]>([])
const selectedReview = ref<Review | null>(null)
const loading = ref(false)
const currentPage = ref(1)
const limit = ref(20)
const totalReviews = ref(0)

const stats = reactive({
  total: 0,
  approved: 0,
  pending: 0,
  featured: 0
})

const filters = reactive({
  status: '',
  rating: '',
  search: ''
})

const totalPages = computed(() => Math.ceil(totalReviews.value / limit.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const loadReviews = async () => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      skip: ((currentPage.value - 1) * limit.value).toString(),
      limit: limit.value.toString()
    })
    
    if (filters.status === 'pending') {
      params.append('approved_only', 'false')
    } else if (filters.status === 'approved') {
      params.append('approved_only', 'true')
    } else if (filters.status === 'featured') {
      params.append('featured_only', 'true')
    }
    
    if (filters.rating) {
      params.append('rating', filters.rating)
    }
    
    let endpoint = '/api/v1/reviews/admin/all'
    if (filters.search) {
      endpoint = '/api/v1/reviews/admin/search'
      params.append('q', filters.search)
    }
    
    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        reviews.value = result.data
        // Для простоты используем длину массива как общее количество
        // В реальном API должно быть поле total
        totalReviews.value = result.data.length
      }
    }
  } catch (error) {
    console.error('Error loading reviews:', error)
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await fetch('/api/v1/reviews/admin/all?limit=1000', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success) {
        const allReviews = result.data
        stats.total = allReviews.length
        stats.approved = allReviews.filter((r: Review) => r.is_approved).length
        stats.pending = allReviews.filter((r: Review) => !r.is_approved).length
        stats.featured = allReviews.filter((r: Review) => r.is_featured).length
      }
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const approveReview = async (reviewId: number) => {
  try {
    const response = await fetch(`/api/v1/reviews/admin/${reviewId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      await loadReviews()
      await loadStats()
      if (selectedReview.value?.id === reviewId) {
        selectedReview.value.is_approved = true
      }
    }
  } catch (error) {
    console.error('Error approving review:', error)
  }
}

const toggleFeatured = async (reviewId: number, featured: boolean) => {
  try {
    const response = await fetch(`/api/v1/reviews/admin/${reviewId}/feature?featured=${featured}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      await loadReviews()
      await loadStats()
      if (selectedReview.value?.id === reviewId) {
        selectedReview.value.is_featured = featured
      }
    }
  } catch (error) {
    console.error('Error toggling featured status:', error)
  }
}

const deleteReview = async (reviewId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
    return
  }
  
  try {
    const response = await fetch(`/api/v1/reviews/admin/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (response.ok) {
      await loadReviews()
      await loadStats()
      if (selectedReview.value?.id === reviewId) {
        selectedReview.value = null
      }
    }
  } catch (error) {
    console.error('Error deleting review:', error)
  }
}

const viewReview = (review: Review) => {
  selectedReview.value = review
}

const resetFilters = () => {
  filters.status = ''
  filters.rating = ''
  filters.search = ''
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const getStatusClass = (review: Review) => {
  if (review.is_featured) {
    return 'bg-blue-100 text-blue-800'
  } else if (review.is_approved) {
    return 'bg-green-100 text-green-800'
  } else {
    return 'bg-yellow-100 text-yellow-800'
  }
}

const getStatusText = (review: Review) => {
  if (review.is_featured) {
    return 'Рекомендуемый'
  } else if (review.is_approved) {
    return 'Одобрен'
  } else {
    return 'На модерации'
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch filters and reload
watch([filters, currentPage], () => {
  loadReviews()
}, { deep: true })

// Load initial data
onMounted(() => {
  loadReviews()
  loadStats()
})
</script>

<style scoped>
.filter-select,
.filter-input {
  @apply px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.filter-group {
  @apply min-w-0;
}

.filter-input {
  @apply min-w-[200px];
}
</style>