<template>
  <div 
    class="project-card group"
    :class="{ 'featured': project.is_featured }"
    @click="navigateToProject"
  >
    <!-- Image container -->
    <div class="image-container">
      <img 
        v-if="project.images && project.images.length > 0"
        :src="typeof project.images[0] === 'string' ? project.images[0] : project.images[0].image_path" 
        :alt="typeof project.images[0] === 'string' ? project.title : (project.images[0].alt_text || project.title)"
        class="project-image"
        loading="lazy"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image">
        <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Overlay with 3D icon if STL available -->
      <div v-if="project.stl_file" class="stl-overlay">
        <div class="stl-badge">
          <svg class="stl-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>3D</span>
        </div>
      </div>

      <!-- Featured badge -->
      <div v-if="project.is_featured" class="featured-badge">
        <svg class="featured-icon" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>

      <!-- Hover overlay -->
      <div class="hover-overlay">
        <div class="hover-content">
          <button class="view-button">
            <svg class="view-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Просмотреть
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="card-content">
      <div class="card-header">
        <span class="category-badge">{{ formatCategory(project.category) }}</span>
        <h3 class="project-title">{{ project.title }}</h3>
      </div>
      
      <p class="project-description">{{ truncateDescription(project.description) }}</p>
      
      <!-- Pricing and duration info - compact version -->
      <div v-if="hasPricingInfo" class="pricing-tags">
        <span v-if="project.estimated_price || project.price_range_min" class="price-tag">
          {{ formatPrice() }}
        </span>
        
        <span v-if="project.estimated_duration_hours" class="duration-tag">
          {{ formatDuration(project.estimated_duration_hours) }}
        </span>
        
        <span v-if="project.complexity_level" class="complexity-tag" :class="getComplexityClass(project.complexity_level)">
          {{ getComplexityLabel(project.complexity_level) }}
        </span>
      </div>

      <div class="card-footer">
        <time class="project-date" :datetime="project.created_at">
          {{ formatDate(project.created_at) }}
        </time>
        
        <div class="project-stats">
          <span v-if="project.images && project.images.length > 1" class="stat">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ project.images.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Project } from '@/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToProject = () => {
  router.push(`/gallery/${props.project.id}`)
}

// Check if project has pricing information
const hasPricingInfo = computed(() => {
  return props.project.estimated_price || 
         props.project.price_range_min || 
         props.project.estimated_duration_hours ||
         props.project.complexity_level
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const formatCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'miniatures': 'Миниатюры',
    'prototypes': 'Прототипы',
    'decorative': 'Декоративные',
    'functional': 'Функциональные',
    'architectural': 'Архитектурные',
    'jewelry': 'Ювелирные',
    'automotive': 'Автомобильные',
    'medical': 'Медицинские'
  }
  return categoryMap[category] || category
}

const truncateDescription = (description: string, maxLength: number = 120): string => {
  if (description.length <= maxLength) return description
  return description.substring(0, maxLength).trim() + '...'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (): string => {
  if (props.project.estimated_price) {
    return `${formatCompactPrice(props.project.estimated_price)} ₽`
  } else if (props.project.price_range_min && props.project.price_range_max) {
    return `${formatCompactPrice(props.project.price_range_min)}-${formatCompactPrice(props.project.price_range_max)} ₽`
  } else if (props.project.price_range_min) {
    return `от ${formatCompactPrice(props.project.price_range_min)} ₽`
  }
  return 'По запросу'
}

const formatCompactPrice = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}М`
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}К`
  }
  return price.toString()
}

const formatDuration = (hours: number): string => {
  if (hours < 24) {
    return `${hours} ч`
  } else {
    const days = Math.ceil(hours / 24)
    return `${days} дн`
  }
}

const getComplexityLabel = (level: string): string => {
  const labels: Record<string, string> = {
    'simple': 'Простой',
    'medium': 'Средний',
    'complex': 'Сложный'
  }
  return labels[level] || level
}

const getComplexityClass = (level: string): string => {
  const classes: Record<string, string> = {
    'simple': 'complexity-simple',
    'medium': 'complexity-medium',
    'complex': 'complexity-complex'
  }
  return classes[level] || ''
}
</script>

<style scoped>
.project-card {
  @apply bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-primary-100;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(27, 42, 65, 0.15);
}

.project-card.featured {
  @apply ring-2 ring-accent-300 border-accent-200;
  background: linear-gradient(135deg, #ffffff 0%, #fef7ed 100%);
}

.image-container {
  @apply relative aspect-[4/3] overflow-hidden;
}

.project-image {
  @apply w-full h-full object-cover transition-transform duration-300 group-hover:scale-105;
}

.placeholder-image {
  @apply w-full h-full bg-primary-50 flex items-center justify-center;
}

.placeholder-icon {
  @apply w-12 h-12 text-primary-400;
}

.stl-overlay {
  @apply absolute top-3 left-3;
}

.stl-badge {
  @apply flex items-center space-x-1 bg-primary-900 text-primary-50 px-2 py-1 rounded-full text-xs font-medium shadow-lg;
}

.stl-icon {
  @apply w-3 h-3;
}

.featured-badge {
  @apply absolute top-3 right-3 bg-accent-500 text-primary-50 p-1.5 rounded-full shadow-lg;
}

.featured-icon {
  @apply w-4 h-4;
}

.hover-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300;
  @apply flex items-center justify-center opacity-0 group-hover:opacity-100;
}

.hover-content {
  @apply transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300;
}

.view-button {
  @apply flex items-center space-x-2 bg-primary-50 text-primary-900 px-4 py-2 rounded-lg font-medium border border-primary-200;
  @apply hover:bg-primary-100 hover:border-primary-300 transition-all duration-200 shadow-lg;
}

.view-icon {
  @apply w-5 h-5;
}

.card-content {
  @apply p-6;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-header {
  @apply mb-3;
}

.project-title {
  @apply text-lg font-semibold text-primary-900 line-clamp-2 mt-2 group-hover:text-accent-600 transition-colors duration-300;
}

.category-badge {
  @apply bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium inline-block border border-primary-200;
}

.project-description {
  @apply text-primary-600 text-sm mb-4;
  flex: 1;
  overflow: hidden;
}

.pricing-tags {
  @apply flex flex-wrap gap-1.5 mb-3;
}

.price-tag {
  @apply inline-flex items-center px-2 py-1 bg-accent-100 text-accent-700 rounded-md text-xs font-medium border border-accent-200;
}

.duration-tag {
  @apply inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium border border-primary-200;
}

.complexity-tag {
  @apply inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border;
}

.complexity-simple {
  @apply bg-accent-100 text-accent-700 border-accent-200;
}

.complexity-medium {
  @apply bg-primary-200 text-primary-800 border-primary-300;
}

.complexity-complex {
  @apply bg-error-100 text-error-700 border-error-200;
}

.card-footer {
  @apply flex items-center justify-between text-xs text-primary-500;
}

.project-date {
  @apply font-medium text-primary-600;
}

.project-stats {
  @apply flex items-center space-x-3;
}

.stat {
  @apply flex items-center space-x-1;
}

.stat-icon {
  @apply w-4 h-4;
}

/* Utility classes for line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>