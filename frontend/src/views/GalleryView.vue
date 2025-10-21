<template>
  <div class="gallery-page">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-accent-500/20"></div>
      <div class="relative container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-50 drop-shadow-lg">
          Галерея проектов
        </h1>
        <p class="text-xl text-primary-100 max-w-2xl mx-auto drop-shadow">
          Посмотрите на наши работы и вдохновитесь для своего проекта
        </p>
      </div>
      
      <!-- Декоративные элементы -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-accent-500/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-primary-300/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-20 h-20 bg-accent-400/20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-gradient-to-br from-primary-50 to-white min-h-screen">
      <div class="container mx-auto px-4">
        <!-- Filters -->
        <GalleryFilter 
          @filter-change="handleFilterChange"
          @view-change="handleViewChange"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>

        <!-- Results Count -->
        <div v-else-if="filteredProjects.length > 0" class="mb-6">
          <p class="text-primary-700 font-medium">
            Найдено {{ filteredProjects.length }} {{ pluralize(filteredProjects.length, 'проект', 'проекта', 'проектов') }}
          </p>
        </div>

        <!-- Gallery Content -->
        <div v-if="!loading">
          <!-- Masonry Grid View -->
          <MasonryGrid
            v-if="currentViewMode === 'masonry'"
            :items="filteredProjects"
            :column-width="320"
            :gap="24"
            :loading="loading"
          >
            <template #default="{ item }">
              <ProjectCard :project="item" />
            </template>
          </MasonryGrid>

          <!-- List View -->
          <ProjectList
            v-else-if="currentViewMode === 'list'"
            :projects="filteredProjects"
          />

          <!-- Empty State -->
          <div v-if="filteredProjects.length === 0" class="text-center py-16">
            <svg class="w-16 h-16 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 20a7.962 7.962 0 01-5-1.709M15 11V9a6 6 0 00-12 0v2" />
            </svg>
            <h3 class="text-xl font-semibold text-primary-900 mb-2">Проекты не найдены</h3>
            <p class="text-primary-600 mb-6">Попробуйте изменить параметры поиска или фильтры</p>
            <button 
              @click="clearFilters"
              class="bg-primary-900 hover:bg-primary-800 text-primary-50 px-6 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Очистить фильтры
            </button>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreProjects && !loading" class="text-center mt-12">
          <button 
            @click="loadMoreProjects"
            :disabled="loadingMore"
            class="bg-primary-900 hover:bg-primary-800 disabled:bg-primary-400 text-primary-50 px-8 py-3 rounded-lg font-bold transition-all duration-200 flex items-center mx-auto shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg v-if="loadingMore" class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-50" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loadingMore ? 'Загрузка...' : 'Загрузить еще' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApiList } from '@/composables/useApi'
import GalleryFilter from '@/components/gallery/GalleryFilter.vue'
import MasonryGrid from '@/components/gallery/MasonryGrid.vue'
import ProjectCard from '@/components/gallery/ProjectCard.vue'
import ProjectList from '@/components/gallery/ProjectList.vue'
import type { Project } from '@/types'
import type { FilterOptions } from '@/components/gallery/GalleryFilter.vue'

const { data: projects, loading, fetchList } = useApiList<Project>('/projects')

const currentFilters = ref<FilterOptions>({
  search: '',
  category: '',
  sortBy: 'created_at_desc',
  viewMode: 'masonry',
  showOnlyFeatured: false,
  showOnlyWith3D: false,
  complexityLevels: [],
  minPrice: undefined,
  maxPrice: undefined,
  minHours: undefined,
  maxHours: undefined
})

const currentViewMode = ref<'masonry' | 'list'>('masonry')
const loadingMore = ref(false)
const hasMoreProjects = ref(true)

// Load projects on component mount
onMounted(async () => {
  await fetchList()
  
  // SEO optimization
  document.title = 'Галерея проектов - 3D печать'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Галерея наших 3D печатных проектов: миниатюры, прототипы, декоративные изделия. Вдохновитесь для своего проекта.')
  }
})

const filteredProjects = computed(() => {
  let result = projects.value || []

  // Search filter
  if (currentFilters.value.search) {
    const searchTerm = currentFilters.value.search.toLowerCase()
    result = result.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    )
  }

  // Category filter
  if (currentFilters.value.category) {
    result = result.filter(project => project.category === currentFilters.value.category)
  }

  // Featured filter
  if (currentFilters.value.showOnlyFeatured) {
    result = result.filter(project => project.is_featured)
  }

  // 3D model filter
  if (currentFilters.value.showOnlyWith3D) {
    result = result.filter(project => project.stl_file)
  }

  // Complexity filter
  if (currentFilters.value.complexityLevels.length > 0) {
    result = result.filter(project => 
      project.complexity_level && 
      currentFilters.value.complexityLevels.includes(project.complexity_level)
    )
  }

  // Price range filter
  if (currentFilters.value.minPrice !== undefined || currentFilters.value.maxPrice !== undefined) {
    result = result.filter(project => {
      const projectPrice = project.estimated_price || project.price_range_min || project.price_range_max
      if (!projectPrice) return false
      
      if (currentFilters.value.minPrice !== undefined && projectPrice < currentFilters.value.minPrice) {
        return false
      }
      
      if (currentFilters.value.maxPrice !== undefined && projectPrice > currentFilters.value.maxPrice) {
        return false
      }
      
      return true
    })
  }

  // Duration filter
  if (currentFilters.value.minHours !== undefined || currentFilters.value.maxHours !== undefined) {
    result = result.filter(project => {
      if (!project.estimated_duration_hours) return false
      
      if (currentFilters.value.minHours !== undefined && project.estimated_duration_hours < currentFilters.value.minHours) {
        return false
      }
      
      if (currentFilters.value.maxHours !== undefined && project.estimated_duration_hours > currentFilters.value.maxHours) {
        return false
      }
      
      return true
    })
  }

  // Sorting
  result = [...result].sort((a, b) => {
    switch (currentFilters.value.sortBy) {
      case 'created_at_asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'created_at_desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      case 'featured':
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
      default:
        return 0
    }
  })

  return result
})

const handleFilterChange = (filters: FilterOptions) => {
  currentFilters.value = filters
}

const handleViewChange = (viewMode: 'masonry' | 'list') => {
  currentViewMode.value = viewMode
}

const clearFilters = () => {
  currentFilters.value = {
    search: '',
    category: '',
    sortBy: 'created_at_desc',
    viewMode: currentViewMode.value,
    showOnlyFeatured: false,
    showOnlyWith3D: false,
    complexityLevels: [],
    minPrice: undefined,
    maxPrice: undefined,
    minHours: undefined,
    maxHours: undefined
  }
}

const loadMoreProjects = async () => {
  loadingMore.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In real app, this would load more projects from API
  hasMoreProjects.value = false
  loadingMore.value = false
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