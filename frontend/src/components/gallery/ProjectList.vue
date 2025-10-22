<template>
  <div class="project-list">
    <div
      v-for="project in projects"
      :key="project.id"
      class="project-list-item group"
      :class="{ 'featured': project.is_featured }"
      @click="navigateToProject(project)"
    >
      <!-- Image -->
      <div class="project-image-container">
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

        <!-- 3D Badge -->
        <div v-if="project.stl_file" class="stl-badge">
          <svg class="stl-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="project-content">
        <div class="project-header">
          <div class="project-title-section">
            <h3 class="project-title">{{ project.title }}</h3>
            <div class="project-badges">
              <span v-if="project.is_featured" class="featured-badge">
                <svg class="featured-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Рекомендуемый
              </span>
              <span class="category-badge">{{ formatCategory(project.category) }}</span>
            </div>
          </div>
          
          <div class="project-meta">
            <time class="project-date" :datetime="project.created_at">
              {{ formatDate(project.created_at) }}
            </time>
          </div>
        </div>
        
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-stats">
          <div class="stat-item" v-if="project.images && project.images.length > 0">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ project.images.length }} {{ pluralize(project.images.length, 'изображение', 'изображения', 'изображений') }}</span>
          </div>
          
          <div class="stat-item" v-if="project.stl_file">
            <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>3D модель</span>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="project-action">
        <button class="view-button">
          <svg class="view-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="view-text">Просмотреть</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
}

defineProps<Props>()
const router = useRouter()

const navigateToProject = (project: Project) => {
  router.push(`/gallery/${project.id}`)
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const pluralize = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  
  if (mod100 >= 11 && mod100 <= 19) {
    return many
  }
  
  if (mod10 === 1) {
    return one
  }
  
  if (mod10 >= 2 && mod10 <= 4) {
    return few
  }
  
  return many
}
</script>

<style scoped>
.project-list {
  @apply space-y-4;
}

.project-list-item {
  @apply bg-white rounded-xl shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer border border-primary-100;
  @apply flex items-center p-6 gap-6;
}

.project-list-item:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 20px 40px rgba(27, 42, 65, 0.15);
}

.project-list-item.featured {
  @apply ring-2 ring-accent-300 bg-accent-50 border-accent-200;
}

.project-image-container {
  @apply relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden;
}

.project-image {
  @apply w-full h-full object-cover transition-transform duration-300 group-hover:scale-105;
}

.placeholder-image {
  @apply w-full h-full bg-primary-50 flex items-center justify-center;
}

.placeholder-icon {
  @apply w-8 h-8 text-primary-400;
}

.stl-badge {
  @apply absolute -top-1 -right-1 bg-primary-900 text-primary-50 p-1 rounded-full shadow-lg;
}

.stl-icon {
  @apply w-3 h-3;
}

.project-content {
  @apply flex-1 min-w-0;
}

.project-header {
  @apply flex items-start justify-between mb-3;
}

.project-title-section {
  @apply flex-1 min-w-0 mr-4;
}

.project-title {
  @apply text-lg font-semibold text-primary-900 mb-2 line-clamp-1 group-hover:text-accent-600 transition-colors duration-300;
}

.project-badges {
  @apply flex items-center gap-2 flex-wrap;
}

.featured-badge {
  @apply inline-flex items-center gap-1 bg-accent-100 text-accent-800 px-2 py-1 rounded-full text-xs font-medium border border-accent-200;
}

.featured-icon {
  @apply w-3 h-3;
}

.category-badge {
  @apply bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium border border-primary-200;
}

.project-meta {
  @apply flex-shrink-0;
}

.project-date {
  @apply text-sm text-primary-500 font-medium;
}

.project-description {
  @apply text-primary-600 text-sm line-clamp-2 mb-3;
}

.project-stats {
  @apply flex items-center gap-4 text-xs text-primary-500;
}

.stat-item {
  @apply flex items-center gap-1;
}

.stat-icon {
  @apply w-4 h-4;
}

.project-action {
  @apply flex-shrink-0;
}

.view-button {
  @apply flex items-center gap-2 bg-primary-900 hover:bg-primary-800 text-primary-50 px-4 py-2 rounded-lg;
  @apply font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105;
}

.view-icon {
  @apply w-4 h-4;
}

.view-text {
  @apply hidden sm:inline;
}

/* Utility classes for line clamping */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Анимации появления */
.project-list-item {
  animation: fadeInUp 0.6s ease-out forwards;
}

.project-list-item:nth-child(1) { animation-delay: 0.1s; }
.project-list-item:nth-child(2) { animation-delay: 0.2s; }
.project-list-item:nth-child(3) { animation-delay: 0.3s; }
.project-list-item:nth-child(4) { animation-delay: 0.4s; }
.project-list-item:nth-child(5) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .project-list-item {
    @apply flex-col items-start gap-4 p-4;
  }
  
  .project-image-container {
    @apply w-full h-32;
  }
  
  .project-header {
    @apply flex-col items-start gap-2;
  }
  
  .project-meta {
    @apply w-full;
  }
  
  .project-action {
    @apply w-full;
  }
  
  .view-button {
    @apply w-full justify-center;
  }
}

@media (max-width: 480px) {
  .project-badges {
    @apply flex-col items-start gap-1;
  }
  
  .project-stats {
    @apply flex-col items-start gap-2;
  }
  
  .project-list-item {
    @apply p-3 gap-3;
  }
}
</style>