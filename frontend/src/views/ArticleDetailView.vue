<template>
  <div class="min-h-screen bg-neutral-50">
    <LoadingSpinner v-if="loading" :full-screen="true" />
    
    <div v-else-if="article">
      <!-- Hero Section -->
      <section class="relative py-16 bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-20"></div>
        <div class="relative container mx-auto px-4">
          <!-- Breadcrumb -->
          <nav class="mb-8">
            <ol class="flex items-center space-x-2 text-sm text-primary-100">
              <li>
                <RouterLink to="/" class="hover:text-white transition-colors">Главная</RouterLink>
              </li>
              <li>/</li>
              <li>
                <RouterLink to="/blog" class="hover:text-white transition-colors">Блог</RouterLink>
              </li>
              <li>/</li>
              <li class="text-white">{{ article.title }}</li>
            </ol>
          </nav>

          <div class="max-w-6xl mx-auto">
            <!-- Category Badge -->
            <div class="mb-4">
              <Badge :variant="getCategoryVariant(article.category)" size="md">
                {{ article.category }}
              </Badge>
            </div>

            <!-- Title -->
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              {{ article.title }}
            </h1>

            <!-- Excerpt -->
            <p class="text-xl text-primary-100 mb-8 leading-relaxed">
              {{ article.excerpt }}
            </p>

            <!-- Meta Information -->
            <div class="flex flex-wrap items-center gap-6 text-primary-100">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <time :datetime="article.published_at">
                  {{ formatDate(article.published_at) }}
                </time>
              </div>
              
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ readingTime }} мин чтения</span>
              </div>


            </div>
          </div>
        </div>
      </section>

      <!-- Article Content -->
      <section class="py-12">
        <div class="container mx-auto px-4">
          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <!-- Main Content -->
              <article class="lg:col-span-4">
                <div class="bg-white rounded-xl shadow-soft overflow-hidden">
                  <!-- Featured Image -->
                  <div v-if="article.featured_image" class="aspect-video overflow-hidden">
                    <img
                      :src="article.featured_image"
                      :alt="article.title"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Content -->
                  <div class="p-8 lg:p-16">
                    <div class="prose prose-xl max-w-none" v-html="formattedContent"></div>
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="article.tags && article.tags.length > 0" class="mt-8 bg-white rounded-xl shadow-soft p-6">
                  <h3 class="text-lg font-semibold text-neutral-900 mb-4">Теги</h3>
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="tag in article.tags"
                      :key="tag"
                      variant="neutral"
                      size="sm"
                      class="cursor-pointer hover:bg-primary-100 hover:text-primary-800 transition-colors"
                      @click="searchByTag(tag)"
                    >
                      #{{ tag }}
                    </Badge>
                  </div>
                </div>
              </article>

              <!-- Sidebar -->
              <aside class="lg:col-span-1">
                <!-- Table of Contents -->
                <div v-if="tableOfContents.length > 0" class="bg-white rounded-xl shadow-soft overflow-hidden mb-6 sticky top-6">
                  <div class="bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-4 border-b border-primary-200">
                    <h3 class="text-lg font-semibold text-primary-900 flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                      </svg>
                      Содержание
                    </h3>
                  </div>
                  <nav class="p-6">
                    <div class="space-y-1">
                      <a
                        v-for="heading in tableOfContents"
                        :key="heading.id"
                        :href="`#${heading.id}`"
                        :class="[
                          'group flex items-center py-2 px-3 rounded-lg text-sm transition-all duration-200',
                          activeHeadingId === heading.id 
                            ? 'bg-primary-100 text-primary-700 border-l-3 border-primary-500' 
                            : 'hover:bg-primary-50',
                          heading.level === 2 
                            ? 'font-medium text-neutral-900 hover:text-primary-700 border-l-3 border-transparent hover:border-primary-500' 
                            : 'text-neutral-600 hover:text-primary-600 ml-4 border-l-2 border-neutral-200 hover:border-primary-300',
                          activeHeadingId === heading.id && heading.level !== 2
                            ? 'ml-4 border-l-2 border-primary-500 bg-primary-50 text-primary-700'
                            : ''
                        ]"
                        @click.prevent="scrollToHeading(heading.id)"
                      >
                        <span class="flex-1">{{ heading.text }}</span>
                        <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </nav>
                </div>

                <!-- Related Articles -->
                <div v-if="relatedArticles.length > 0" class="bg-white rounded-xl shadow-soft p-6">
                  <h3 class="text-lg font-semibold text-neutral-900 mb-4">Похожие статьи</h3>
                  <div class="space-y-4">
                    <div
                      v-for="relatedArticle in relatedArticles"
                      :key="relatedArticle.id"
                      class="group cursor-pointer"
                      @click="navigateToArticle(relatedArticle.id)"
                    >
                      <h4 class="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 mb-1">
                        {{ relatedArticle.title }}
                      </h4>
                      <p class="text-sm text-neutral-600 line-clamp-2">
                        {{ relatedArticle.excerpt }}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-neutral-700 mb-2">Статья не найдена</h2>
        <p class="text-neutral-600 mb-6">Запрашиваемая статья не существует или была удалена.</p>
        <Button variant="primary" @click="$router.push('/blog')">
          Вернуться в блог
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiItem, useApiList } from '@/composables/useApi'
// import { globalNotifications } from '@/composables/useNotifications' // Unused
import { useSEO } from '@/composables/useSEO'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/design-system/components/Badge/Badge.vue'
import Button from '@/design-system/components/Button/Button.vue'
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()
const { setMeta } = useSEO()

// API
const { data: article, loading, fetchItem } = useApiItem<Article>('/articles')
const { data: allArticles, fetchList } = useApiList<Article>('/articles')

// Table of contents
interface TOCItem {
  id: string
  text: string
  level: number
}

const tableOfContents = ref<TOCItem[]>([])
const activeHeadingId = ref<string>('')

// Computed properties
const readingTime = computed(() => {
  if (!article.value) return 0
  const wordCount = article.value.content.split(/\s+/).length
  return Math.ceil(wordCount / 200)
})

const formattedContent = computed(() => {
  if (!article.value) return ''
  
  let content = article.value.content
  
  // Convert markdown-style headers to HTML with IDs for TOC
  content = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const level = hashes.length
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return `<h${level} id="${id}">${text}</h${level}>`
  })
  
  // Convert markdown-style code blocks
  content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
  })
  
  // Convert inline code
  content = content.replace(/`([^`]+)`/g, '<code class="bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-sm">$1</code>')
  
  // Convert markdown-style links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 hover:text-primary-700 underline" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Convert markdown-style bold text
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // Convert markdown-style italic text
  content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  
  // Convert line breaks to paragraphs
  content = content.split('\n\n').map(paragraph => {
    if (paragraph.trim() && !paragraph.startsWith('<h') && !paragraph.startsWith('<pre')) {
      return `<p>${paragraph.trim()}</p>`
    }
    return paragraph
  }).join('\n\n')
  
  return content
})

const relatedArticles = computed(() => {
  if (!article.value || !allArticles.value) return []
  
  return allArticles.value
    .filter(a => 
      a.id !== article.value!.id && 
      a.is_published && 
      a.category === article.value!.category
    )
    .slice(0, 3)
})

// Removed unused socialButtons

// Methods
const getCategoryVariant = (category: string): "error" | "default" | "primary" | "secondary" | "success" | "warning" | "neutral" => {
  const variants: Record<string, "error" | "default" | "primary" | "secondary" | "success" | "warning" | "neutral"> = {
    'Технологии': 'primary',
    'Материалы': 'secondary',
    'Обучение': 'success',
    'Новости': 'warning',
    'Советы': 'neutral'
  }
  return variants[category] || 'default'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const extractTableOfContents = () => {
  nextTick(() => {
    const headings = document.querySelectorAll('h2, h3, h4, h5, h6')
    tableOfContents.value = Array.from(headings).map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }))
  })
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    // Добавляем отступ для фиксированного хедера
    const yOffset = -80
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    })
    
    // Обновляем URL без перезагрузки страницы
    history.replaceState(null, '', `#${id}`)
  }
}

const searchByTag = (tag: string) => {
  router.push(`/blog?tag=${encodeURIComponent(tag)}`)
}

const navigateToArticle = (articleId: number) => {
  router.push(`/blog/${articleId}`)
}

// Отслеживание активного заголовка при прокрутке
const updateActiveHeading = () => {
  const headings = document.querySelectorAll('h2, h3, h4, h5, h6')
  const scrollPosition = window.scrollY + 100 // Отступ для лучшего UX
  
  let activeId = ''
  
  headings.forEach((heading) => {
    const rect = heading.getBoundingClientRect()
    const top = rect.top + window.pageYOffset
    
    if (top <= scrollPosition) {
      activeId = heading.id
    }
  })
  
  activeHeadingId.value = activeId
}

// Добавляем слушатель прокрутки
const setupScrollListener = () => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
}

// Убираем слушатель при размонтировании
const cleanupScrollListener = () => {
  window.removeEventListener('scroll', updateActiveHeading)
}

// Watch for article changes to update SEO
watch(article, (newArticle) => {
  if (newArticle) {
    setMeta({
      title: newArticle.title,
      description: newArticle.excerpt,
      keywords: newArticle.tags?.join(', '),
      image: newArticle.featured_image,
      url: window.location.href,
      type: 'article',
      publishedTime: newArticle.published_at,
      section: newArticle.category,
      tags: newArticle.tags
    })
  }
})

// Lifecycle
onMounted(async () => {
  const articleId = route.params.id as string
  await fetchItem(articleId)
  await fetchList()
  extractTableOfContents()
  setupScrollListener()
})

onUnmounted(() => {
  cleanupScrollListener()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Prose styles for article content */
:deep(.prose) {
  color: #374151;
  line-height: 1.8;
  font-size: 1.125rem; /* 18px */
}

:deep(.prose h1) {
  font-size: 2.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 2rem;
  color: #111827;
}

:deep(.prose h2) {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  color: #111827;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
  scroll-margin-top: 80px; /* Отступ для фиксированного хедера */
}

:deep(.prose h2::before) {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
}

:deep(.prose h3) {
  font-size: 1.625rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #111827;
  scroll-margin-top: 80px;
}

:deep(.prose h4) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #111827;
  scroll-margin-top: 80px;
}

:deep(.prose p) {
  margin-bottom: 1.75rem;
}

:deep(.prose a) {
  color: #2563eb;
  text-decoration: underline;
  font-weight: 500;
}

:deep(.prose a:hover) {
  color: #1d4ed8;
}

:deep(.prose strong) {
  font-weight: 600;
  color: #111827;
}

:deep(.prose em) {
  font-style: italic;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  color: #1f2937;
  padding: 0.125rem 0.375rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.prose pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 2rem 0;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

:deep(.prose pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

:deep(.prose ul) {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

:deep(.prose ol) {
  list-style-type: decimal;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

:deep(.prose li) {
  margin-bottom: 0.5rem;
}

:deep(.prose blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.prose img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 2rem 0;
}

:deep(.prose table) {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
}

:deep(.prose th) {
  background-color: #f9fafb;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border: 1px solid #e5e7eb;
}

:deep(.prose td) {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
}

:deep(.prose hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 3rem 0;
}
</style>