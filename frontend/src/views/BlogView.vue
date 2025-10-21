<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-accent-500/20"></div>
      <div class="relative container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-50 drop-shadow-lg">
            Блог о 3D печати
          </h1>
          <p class="text-xl text-primary-100 mb-8 drop-shadow">
            Изучайте технологии, материалы и процессы 3D печати вместе с нашими экспертами
          </p>
          
          <!-- Search Bar -->
          <div class="relative max-w-2xl mx-auto">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск статей..."
                class="w-full px-6 py-4 pl-12 text-neutral-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200"
                @input="handleSearch"
              />
              <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            <!-- Search Suggestions -->
            <div v-if="searchSuggestions.length > 0 && searchQuery" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
              <div
                v-for="suggestion in searchSuggestions"
                :key="suggestion.id"
                class="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0"
                @click="selectSuggestion(suggestion)"
              >
                <div class="font-medium text-neutral-900">{{ suggestion.title }}</div>
                <div class="text-sm text-neutral-600 mt-1">{{ suggestion.excerpt }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Декоративные элементы -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-accent-500/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-primary-300/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-20 h-20 bg-accent-400/20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Filters and Categories -->
    <section class="py-8 bg-white border-b border-neutral-200">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Categories -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              ]"
              @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>

          <!-- Sort Options -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-600">Сортировка:</span>
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              @change="handleSort"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="popular">Популярные</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <LoadingSpinner v-if="loading" :full-screen="false" />
        
        <div v-else-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
            @click="navigateToArticle(article.id)"
          />
        </div>

        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <svg class="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="text-xl font-semibold text-neutral-900 mb-2">Статьи не найдены</h3>
            <p class="text-neutral-600">
              {{ searchQuery ? 'Попробуйте изменить поисковый запрос' : 'В данной категории пока нет статей' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Subscription -->
    <section class="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-neutral-700 mb-4">
            Не пропустите новые статьи
          </h2>
          <p class="text-neutral-600 mb-8">
            Подпишитесь на нашу рассылку и получайте уведомления о новых образовательных материалах
          </p>
          <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              v-model="newsletterEmail"
              type="email"
              placeholder="Ваш email"
              class="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              variant="primary"
              size="lg"
              :loading="subscribing"
              @click="subscribeToNewsletter"
            >
              Подписаться
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useApiList } from '@/composables/useApi'
import { globalNotifications } from '@/composables/useNotifications'
import { useSEO, seoConfigs } from '@/composables/useSEO'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ArticleCard from '@/components/blog/ArticleCard.vue'
import Button from '@/design-system/components/Button/Button.vue'
import type { Article } from '@/types'

const router = useRouter()
const route = useRoute()
const { setMeta } = useSEO()

// Data
const searchQuery = ref('')
const selectedCategory = ref('Все')
const sortBy = ref('newest')
const newsletterEmail = ref('')
const subscribing = ref(false)
const searchSuggestions = ref<Article[]>([])

// API
const { data: articles, loading, fetchList } = useApiList<Article>('/articles')

// Categories
const categories = computed(() => {
  const uniqueCategories = new Set(['Все'])
  if (articles.value && Array.isArray(articles.value)) {
    articles.value.forEach(article => {
      if (article.category) {
        uniqueCategories.add(article.category)
      }
    })
  }
  return Array.from(uniqueCategories)
})

// Filtered articles
const filteredArticles = computed(() => {
  if (!articles.value || !Array.isArray(articles.value)) {
    return []
  }
  
  let filtered = articles.value.filter(article => article.is_published)

  // Filter by category
  if (selectedCategory.value !== 'Все') {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    )
  }

  // Sort articles
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      case 'oldest':
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
      case 'popular':
        // For now, sort by newest as we don't have view counts
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      default:
        return 0
    }
  })

  return filtered
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.length > 2 && articles.value && Array.isArray(articles.value)) {
    const query = searchQuery.value.toLowerCase()
    searchSuggestions.value = articles.value
      .filter(article =>
        article.is_published &&
        (article.title.toLowerCase().includes(query) ||
         article.excerpt.toLowerCase().includes(query))
      )
      .slice(0, 5)
  } else {
    searchSuggestions.value = []
  }
}

const selectSuggestion = (article: Article) => {
  searchQuery.value = ''
  searchSuggestions.value = []
  navigateToArticle(article.id)
}

const selectCategory = (category: string) => {
  selectedCategory.value = category
}

const handleSort = () => {
  // Sorting is handled by computed property
}

const navigateToArticle = (articleId: number) => {
  router.push(`/blog/${articleId}`)
}

const subscribeToNewsletter = async () => {
  if (!newsletterEmail.value) {
    globalNotifications.warning('Введите email', 'Пожалуйста, введите ваш email адрес')
    return
  }

  subscribing.value = true
  try {
    // TODO: Implement newsletter subscription API call
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    globalNotifications.success('Подписка оформлена', 'Спасибо за подписку на нашу рассылку!')
    newsletterEmail.value = ''
  } catch (error) {
    globalNotifications.error('Ошибка подписки', 'Не удалось оформить подписку. Попробуйте позже.')
  } finally {
    subscribing.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Set SEO meta tags
  setMeta(seoConfigs.blog)
  
  console.log('BlogView: Loading articles...')
  await fetchList()
  console.log('BlogView: Articles loaded:', articles.value)
  
  // Handle tag filtering from URL
  const tagFromUrl = route.query.tag as string
  if (tagFromUrl) {
    searchQuery.value = `#${tagFromUrl}`
  }
})
</script>

<style scoped>
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