<template>
  <Card
    variant="elevated"
    padding="none"
    hover
    interactive
    class="group overflow-hidden"
    @click="$emit('click')"
  >
    <!-- Featured Image -->
    <div class="relative h-48 overflow-hidden">
      <img
        v-if="article.featured_image"
        :src="article.featured_image"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"
      >
        <svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-4 left-4">
        <Badge :variant="getCategoryVariant(article.category)" size="sm">
          {{ article.category }}
        </Badge>
      </div>

      <!-- Reading Time -->
      <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
        {{ readingTime }} мин чтения
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Title -->
      <h3 class="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
        {{ article.title }}
      </h3>

      <!-- Excerpt -->
      <p class="text-neutral-600 mb-4 line-clamp-3">
        {{ article.excerpt }}
      </p>

      <!-- Meta Information -->
      <div class="flex items-center justify-between text-sm text-neutral-500">
        <time :datetime="article.published_at" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          {{ formatDate(article.published_at) }}
        </time>

        <!-- Social Share Button -->
        <button
          class="flex items-center gap-1 text-neutral-400 hover:text-primary-600 transition-colors duration-200"
          @click.stop="shareArticle"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
          </svg>
          Поделиться
        </button>
      </div>
    </div>

    <!-- Tags -->
    <div v-if="article.tags && article.tags.length > 0" class="px-6 pb-6">
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag"
          variant="neutral"
          size="xs"
        >
          #{{ tag }}
        </Badge>
        <span v-if="article.tags.length > 3" class="text-xs text-neutral-500">
          +{{ article.tags.length - 3 }} еще
        </span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { globalNotifications } from '@/composables/useNotifications'
import Card from '@/design-system/components/Card/Card.vue'
import Badge from '@/design-system/components/Badge/Badge.vue'
import type { Article } from '@/types'

interface Props {
  article: Article
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// Calculate reading time (assuming 200 words per minute)
const readingTime = computed(() => {
  const wordCount = props.article.content.split(/\s+/).length
  return Math.ceil(wordCount / 200)
})

// Get category variant for badge
const getCategoryVariant = (category: string): "default" | "primary" | "secondary" | "error" | "success" | "warning" | "neutral" => {
  const variants: Record<string, "default" | "primary" | "secondary" | "error" | "success" | "warning" | "neutral"> = {
    'Технологии': 'primary',
    'Материалы': 'secondary',
    'Обучение': 'success',
    'Новости': 'warning',
    'Советы': 'neutral'
  }
  return variants[category] || 'default'
}

// Format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Share article
const shareArticle = async () => {
  const url = `${window.location.origin}/blog/${props.article.id}`
  const title = props.article.title
  
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url,
        text: props.article.excerpt
      })
    } catch (error) {
      // User cancelled sharing
    }
  } else {
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url)
      globalNotifications.success('Ссылка скопирована', 'Ссылка на статью скопирована в буфер обмена')
    } catch (error) {
      globalNotifications.error('Ошибка', 'Не удалось скопировать ссылку')
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>