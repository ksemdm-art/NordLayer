<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Управление проектами</h1>
          <p class="mt-2 text-sm text-gray-700">
            Управляйте проектами галереи, добавляйте новые и редактируйте существующие
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            @click="showCreateModal = true"
            class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Добавить проект
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Поиск</label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Название проекта..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700">Категория</label>
            <select
              id="category"
              v-model="filters.category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все категории</option>
              <option value="miniatures">Миниатюры</option>
              <option value="functional">Функциональные</option>
              <option value="decorative">Декоративные</option>
              <option value="prototypes">Прототипы</option>
            </select>
          </div>
          <div>
            <label for="featured" class="block text-sm font-medium text-gray-700">Статус</label>
            <select
              id="featured"
              v-model="filters.featured"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все</option>
              <option value="true">Рекомендуемые</option>
              <option value="false">Обычные</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="resetFilters"
              class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <!-- Projects table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-500">Загрузка проектов...</p>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Проекты не найдены</h3>
          <p class="mt-1 text-sm text-gray-500">Начните с создания нового проекта.</p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Добавить проект
            </button>
          </div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Проект
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена / Сложность
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата создания
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="project in paginatedProjects" :key="project.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img
                        v-if="project.images && project.images.length > 0"
                        class="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        :src="project.images[0]"
                        :alt="project.title"
                        style="min-width: 48px; min-height: 48px; max-width: 48px; max-height: 48px;"
                      />
                      <div v-else class="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ project.title }}</div>
                      <div class="text-sm text-gray-500">{{ truncateText(project.description, 50) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getCategoryName(project.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    <div v-if="project.estimated_price" class="text-green-600 font-medium">
                      {{ formatPrice(project.estimated_price) }}
                    </div>
                    <div v-else-if="project.price_range_min || project.price_range_max" class="text-green-600 font-medium">
                      {{ formatPriceRange(project.price_range_min, project.price_range_max) }}
                    </div>
                    <div v-if="project.complexity_level" class="text-xs mt-1">
                      <span 
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="getComplexityClass(project.complexity_level)"
                      >
                        {{ getComplexityLabel(project.complexity_level) }}
                      </span>
                    </div>
                    <div v-if="project.estimated_duration_hours" class="text-xs text-gray-500 mt-1">
                      {{ formatDuration(project.estimated_duration_hours) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="project.is_featured"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                  >
                    Рекомендуемый
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    Обычный
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(project.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editProject(project)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="deleteProject(project)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Предыдущая
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Следующая
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Показано
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                до
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProjects.length) }}</span>
                из
                <span class="font-medium">{{ filteredProjects.length }}</span>
                результатов
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Предыдущая</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Следующая</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Project Modal -->
    <ProjectModal
      v-if="showCreateModal || showEditModal"
      :project="editingProject"
      :is-editing="showEditModal"
      @close="closeModal"
      @saved="handleProjectSaved as any"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :title="'Удалить проект'"
      :message="`Вы уверены, что хотите удалить проект '${deletingProject?.title}'? Это действие нельзя отменить.`"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ProjectModal from '@/components/admin/ProjectModal.vue'
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal.vue'
import { api } from '@/services/api'

interface Project {
  id: number
  title: string
  description: string
  category: string
  images: string[]
  stl_file?: string
  is_featured: boolean
  created_at: string
  updated_at: string
  estimated_price?: number
  estimated_duration_hours?: number
  complexity_level?: string
  price_range_min?: number
  price_range_max?: number
}

const projects = ref<Project[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingProject = ref<Project | null>(null)
const deletingProject = ref<Project | null>(null)

// Filters
const filters = ref({
  search: '',
  category: '',
  featured: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const filteredProjects = computed(() => {
  let filtered = projects.value || []

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(project =>
      project.title.toLowerCase().includes(search) ||
      project.description.toLowerCase().includes(search)
    )
  }

  if (filters.value.category) {
    filtered = filtered.filter(project => project.category === filters.value.category)
  }

  if (filters.value.featured) {
    const isFeatured = filters.value.featured === 'true'
    filtered = filtered.filter(project => project.is_featured === isFeatured)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil((filteredProjects.value || []).length / itemsPerPage))

const paginatedProjects = computed(() => {
  const filtered = filteredProjects.value || []
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getCategoryName = (category: string) => {
  const categories = {
    'miniatures': 'Миниатюры',
    'functional': 'Функциональные',
    'decorative': 'Декоративные',
    'prototypes': 'Прототипы'
  }
  return categories[category as keyof typeof categories] || category
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const truncateText = (text: string | undefined | null, length: number) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const formatPrice = (price: number) => {
  return `${price.toLocaleString('ru-RU')} ₽`
}

const formatPriceRange = (min?: number, max?: number) => {
  if (min && max) {
    return `${min.toLocaleString('ru-RU')} - ${max.toLocaleString('ru-RU')} ₽`
  } else if (min) {
    return `от ${min.toLocaleString('ru-RU')} ₽`
  } else if (max) {
    return `до ${max.toLocaleString('ru-RU')} ₽`
  }
  return 'По запросу'
}

const formatDuration = (hours: number) => {
  if (hours < 24) {
    return `${hours} ч`
  } else {
    const days = Math.ceil(hours / 24)
    return `${days} дн`
  }
}

const getComplexityLabel = (level: string) => {
  const labels: Record<string, string> = {
    'simple': 'Простой',
    'medium': 'Средний',
    'complex': 'Сложный'
  }
  return labels[level] || level
}

const getComplexityClass = (level: string) => {
  const classes: Record<string, string> = {
    'simple': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'complex': 'bg-red-100 text-red-800'
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    featured: ''
  }
  currentPage.value = 1
}

const loadProjects = async () => {
  loading.value = true
  try {
    const response = await api.get('/projects')
    // Extract data from API response format {success, message, data}
    projects.value = response.data.data || []
  } catch (error) {
    console.error('Error loading projects:', error)
    projects.value = []
  } finally {
    loading.value = false
  }
}

const editProject = (project: Project) => {
  editingProject.value = { ...project }
  showEditModal.value = true
}

const deleteProject = (project: Project) => {
  deletingProject.value = project
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!deletingProject.value) return

  try {
    await api.delete(`/projects/${deletingProject.value.id}`)
    projects.value = projects.value.filter(p => p.id !== deletingProject.value!.id)
    showDeleteModal.value = false
    deletingProject.value = null
  } catch (error) {
    console.error('Error deleting project:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingProject.value = null
}

const handleProjectSaved = (project: Project) => {
  const projectWithDates: Project = {
    ...project,
    created_at: project.created_at || new Date().toISOString(),
    updated_at: project.updated_at || new Date().toISOString()
  }
  
  if (showEditModal.value) {
    const index = projects.value.findIndex(p => p.id === project.id)
    if (index !== -1) {
      projects.value[index] = projectWithDates
    }
  } else {
    projects.value.unshift(projectWithDates)
  }
  closeModal()
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  loadProjects()
})
</script>