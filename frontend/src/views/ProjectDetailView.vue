<template>
  <div class="project-detail-page">
    <LoadingSpinner v-if="loading" :full-screen="true" />
    
    <div v-else-if="project" class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <RouterLink to="/" class="hover:text-primary-600 transition-colors duration-200">
              Главная
            </RouterLink>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <RouterLink to="/gallery" class="hover:text-primary-600 transition-colors duration-200">
              Галерея
            </RouterLink>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-900 font-medium">{{ project.title }}</li>
        </ol>
      </nav>

      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Left column - Media -->
        <div class="space-y-6">
          <!-- 3D Viewer -->
          <div v-if="project.stl_file" class="stl-viewer-section">
            <div class="bg-white rounded-xl shadow-soft overflow-hidden">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  3D Модель
                </h3>
              </div>
              <div class="aspect-[4/3] relative" style="width: 100%; height: 100%;">
                <STLViewer
                  :stl-url="project.stl_file"
                  :show-instructions="true"
                  class="w-full h-full"
                  @load="handleModelLoad"
                  @error="handleModelError"
                  @progress="handleModelProgress"
                />
              </div>
            </div>
          </div>

          <!-- Image Gallery -->
          <div v-if="project.images && project.images.length > 0" class="image-gallery">
            <div class="bg-white rounded-xl shadow-soft overflow-hidden">
              <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Изображения ({{ project.images.length }})
                </h3>
              </div>
              
              <!-- Main image -->
              <div class="aspect-[4/3] relative bg-gray-100">
                <img 
                  v-if="project.images && project.images.length > 0"
                  :src="getImagePath(project.images[selectedImageIndex])" 
                  :alt="getImageAlt(project.images[selectedImageIndex])"
                  class="w-full h-full object-cover cursor-pointer"
                  @click="openImageModal"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <!-- Navigation arrows -->
                <button 
                  v-if="project.images.length > 1"
                  @click="previousImage"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button 
                  v-if="project.images.length > 1"
                  @click="nextImage"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              <!-- Thumbnail strip -->
              <div v-if="project.images.length > 1" class="p-4">
                <div class="flex space-x-2 overflow-x-auto">
                  <button
                    v-for="(image, index) in project.images"
                    :key="image.id"
                    @click="selectImage(index)"
                    :class="[
                      'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200',
                      selectedImageIndex === index 
                        ? 'border-primary-500 ring-2 ring-primary-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <img 
                      :src="getImagePath(image)" 
                      :alt="getImageAlt(image, index)"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column - Info -->
        <div class="space-y-6">
          <!-- Project info -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <div class="flex items-start justify-between mb-4">
              <h1 class="text-3xl font-bold text-neutral-700">{{ project.title }}</h1>
              <div class="flex items-center space-x-2">
                <span 
                  v-if="project.is_featured"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Рекомендуемый
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ formatCategory(project.category) }}
                </span>
              </div>
            </div>

            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              {{ project.description }}
            </p>

            <!-- Project details -->
            <div class="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
              <div>
                <dt class="text-sm font-medium text-gray-500">Дата создания</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatDate(project.created_at) }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Категория</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ formatCategory(project.category) }}</dd>
              </div>
              <div v-if="project.stl_file">
                <dt class="text-sm font-medium text-gray-500">3D Модель</dt>
                <dd class="mt-1 text-sm text-green-600 font-medium">Доступна</dd>
              </div>
              <div v-if="project.images">
                <dt class="text-sm font-medium text-gray-500">Изображений</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ project.images.length }}</dd>
              </div>
            </div>
          </div>

          <!-- Pricing and Duration Info -->
          <div v-if="hasPricingInfo" class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Стоимость и сроки
            </h3>
            
            <div class="space-y-4">
              <!-- Price -->
              <div v-if="project.estimated_price || project.price_range_min || project.price_range_max" class="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <dt class="text-sm font-medium text-green-800">Примерная стоимость</dt>
                  <dd class="mt-1 text-lg font-bold text-green-900">{{ formatPrice() }}</dd>
                </div>
                <div class="text-green-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>

              <!-- Duration -->
              <div v-if="project.estimated_duration_hours" class="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <dt class="text-sm font-medium text-blue-800">Срок изготовления</dt>
                  <dd class="mt-1 text-lg font-bold text-blue-900">{{ formatDuration(project.estimated_duration_hours) }}</dd>
                </div>
                <div class="text-blue-600">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <!-- Complexity -->
              <div v-if="project.complexity_level" class="flex justify-between items-center p-4 rounded-lg" :class="getComplexityBgClass(project.complexity_level)">
                <div>
                  <dt class="text-sm font-medium" :class="getComplexityTextClass(project.complexity_level)">Уровень сложности</dt>
                  <dd class="mt-1 text-lg font-bold" :class="getComplexityTextClass(project.complexity_level)">{{ getComplexityLabel(project.complexity_level) }}</dd>
                </div>
                <div :class="getComplexityIconClass(project.complexity_level)">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-600">
                💡 <strong>Обратите внимание:</strong> Указанные цены и сроки являются примерными и могут варьироваться в зависимости от сложности, материалов и других параметров вашего заказа.
              </p>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Заинтересовались проектом?</h3>
            <div class="space-y-3">
              <RouterLink
                to="/order"
                class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Заказать похожий проект
              </RouterLink>
              
              <button
                @click="shareProject"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Поделиться проектом
              </button>
            </div>
          </div>

          <!-- Technical specs (if available) -->
          <div v-if="project.stl_file" class="bg-white rounded-xl shadow-soft p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Технические характеристики</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Формат файла:</span>
                <span class="text-gray-900 font-medium">STL</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Статус модели:</span>
                <span class="text-green-600 font-medium">Готова к печати</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Поддержка:</span>
                <span class="text-gray-900 font-medium">Может потребоваться</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related projects -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Похожие проекты</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="relatedProject in relatedProjects" 
            :key="relatedProject.id"
            class="group cursor-pointer"
            @click="navigateToProject(relatedProject.id)"
          >
            <div class="aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-gray-100">
              <img 
                v-if="relatedProject.images && relatedProject.images.length > 0"
                :src="getImagePath(relatedProject.images[0])" 
                :alt="getImageAlt(relatedProject.images[0])"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h4 class="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
              {{ relatedProject.title }}
            </h4>
            <p class="text-sm text-gray-500 mt-1">{{ formatCategory(relatedProject.category) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-md mx-auto">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M15 11V9a6 6 0 00-12 0v2" />
        </svg>
        <h2 class="text-2xl font-semibold text-neutral-700 mb-2">Проект не найден</h2>
        <p class="text-gray-600 mb-6">Запрашиваемый проект не существует или был удален.</p>
        <RouterLink
          to="/gallery"
          class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Вернуться в галерею
        </RouterLink>
      </div>
    </div>

    <!-- Image modal -->
    <div 
      v-if="showImageModal" 
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl max-h-full">
        <img 
          v-if="project?.images && project.images.length > 0"
          :src="getImagePath(project.images[selectedImageIndex])" 
          :alt="getImageAlt(project.images[selectedImageIndex])"
          class="max-w-full max-h-full object-contain"
        />
        <button
          @click="closeImageModal"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApiItem } from '@/composables/useApi'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import STLViewer from '@/components/gallery/STLViewer.vue'
import type { Project } from '@/types'

const route = useRoute()
const router = useRouter()
const { data: project, loading, fetchItem } = useApiItem<Project>('/projects')

// Image gallery state
const selectedImageIndex = ref(0)
const showImageModal = ref(false)



// Mock related projects for development (will be replaced with API call later)
const mockRelatedProjects: Project[] = []

// Computed properties
const selectedImage = computed(() => {
  if (!project.value?.images || project.value.images.length === 0) return null
  return project.value.images[selectedImageIndex.value] || project.value.images[0]
})

const relatedProjects = computed(() => {
  // In a real app, this would filter projects by category or other criteria
  return mockRelatedProjects.slice(0, 3)
})

// Methods
const selectImage = (index: number) => {
  selectedImageIndex.value = index
}

const previousImage = () => {
  if (!project.value?.images) return
  selectedImageIndex.value = selectedImageIndex.value > 0 
    ? selectedImageIndex.value - 1 
    : project.value.images.length - 1
}

const nextImage = () => {
  if (!project.value?.images) return
  selectedImageIndex.value = selectedImageIndex.value < project.value.images.length - 1 
    ? selectedImageIndex.value + 1 
    : 0
}

const openImageModal = () => {
  showImageModal.value = true
}

const closeImageModal = () => {
  showImageModal.value = false
}

const navigateToProject = (projectId: number) => {
  router.push(`/gallery/${projectId}`)
}

const shareProject = async () => {
  if (!project.value) return

  const shareData = {
    title: project.value.title,
    text: project.value.description,
    url: window.location.href
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
      console.log('Ссылка скопирована в буфер обмена')
    }
  } catch (error) {
    console.error('Ошибка при попытке поделиться:', error)
  }
}

const handleModelLoad = () => {
  console.log('3D модель загружена')
}

const handleModelError = (error: string) => {
  console.error('Ошибка загрузки 3D модели:', error)
}

const handleModelProgress = (progress: number) => {
  console.log('Прогресс загрузки 3D модели:', progress)
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
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Pricing and duration methods
const hasPricingInfo = computed(() => {
  if (!project.value) return false
  return project.value.estimated_price || 
         project.value.price_range_min || 
         project.value.estimated_duration_hours ||
         project.value.complexity_level
})

const formatPrice = (): string => {
  if (!project.value) return 'По запросу'
  
  if (project.value.estimated_price) {
    return `${project.value.estimated_price.toLocaleString('ru-RU')} ₽`
  } else if (project.value.price_range_min && project.value.price_range_max) {
    return `${project.value.price_range_min.toLocaleString('ru-RU')} - ${project.value.price_range_max.toLocaleString('ru-RU')} ₽`
  } else if (project.value.price_range_min) {
    return `от ${project.value.price_range_min.toLocaleString('ru-RU')} ₽`
  }
  return 'По запросу'
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

const getComplexityBgClass = (level: string): string => {
  const classes: Record<string, string> = {
    'simple': 'bg-green-50',
    'medium': 'bg-yellow-50',
    'complex': 'bg-red-50'
  }
  return classes[level] || 'bg-gray-50'
}

const getComplexityTextClass = (level: string): string => {
  const classes: Record<string, string> = {
    'simple': 'text-green-800',
    'medium': 'text-yellow-800',
    'complex': 'text-red-800'
  }
  return classes[level] || 'text-gray-800'
}

const getComplexityIconClass = (level: string): string => {
  const classes: Record<string, string> = {
    'simple': 'text-green-600',
    'medium': 'text-yellow-600',
    'complex': 'text-red-600'
  }
  return classes[level] || 'text-gray-600'
}

const getImagePath = (image: any): string => {
  if (!image) return '/placeholder-image.svg'
  
  // Если это строка (как в ProjectCard)
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `http://localhost:8000/uploads/${image}`
  }
  
  // Если это объект с image_path
  if (image.image_path) {
    const path = image.image_path
    if (path.startsWith('http')) return path
    if (path.startsWith('/')) return `http://localhost:8000${path}`
    return `http://localhost:8000/uploads/${path}`
  }
  
  return '/placeholder-image.svg'
}

const getImageAlt = (image: any, index?: number): string => {
  if (!image) return project.value?.title || 'Изображение проекта'
  
  if (typeof image === 'string') {
    return project.value?.title || 'Изображение проекта'
  }
  
  if (image.alt_text) return image.alt_text
  
  const title = project.value?.title || 'Проект'
  return index !== undefined ? `${title} - изображение ${index + 1}` : title
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  
  // Показываем placeholder в родительском контейнере
  const container = img.parentElement
  if (container && !container.querySelector('.error-placeholder')) {
    const placeholder = document.createElement('div')
    placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center bg-gray-100'
    placeholder.innerHTML = `
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    `
    container.appendChild(placeholder)
  }
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    selectedImageIndex.value = 0
    fetchItem(newId as string)
  }
})

// Lifecycle
onMounted(() => {
  const projectId = route.params.id as string
  fetchItem(projectId)
})
</script>

<style scoped>
.stl-viewer-section .aspect-\[4\/3\] {
  height: 450px;
}

.stl-viewer-section :deep(.stl-viewer) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 0 !important;
}

.stl-viewer-section :deep(.stl-viewer canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.stl-viewer-section :deep(.stl-viewer-container) {
  width: 100% !important;
  height: 100% !important;
}

/* Улучшенные переходы для кнопок */
button, .btn {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

button:hover, .btn:hover {
  transform: translateY(-2px);
}

/* Плавные переходы для карточек */
.card-hover {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
}

/* Стили для изображений */
img {
  transition: opacity 0.3s ease;
}

img[src="/placeholder-image.svg"] {
  opacity: 0.7;
}
</style>