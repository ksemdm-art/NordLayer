<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Управление контентом</h1>
          <p class="mt-2 text-sm text-gray-700">
            Редактируйте тексты и контент сайта
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            @click="showCreateModal = true"
            class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Добавить контент
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Всего контента</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.total }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Активный</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.active }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Групп</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.groups }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Типов контента</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.types }}</dd>
                </dl>
              </div>
            </div>
          </div>
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
              placeholder="Ключ или описание..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="group" class="block text-sm font-medium text-gray-700">Группа</label>
            <select
              id="group"
              v-model="filters.group"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все группы</option>
              <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
            </select>
          </div>
          <div>
            <label for="content_type" class="block text-sm font-medium text-gray-700">Тип</label>
            <select
              id="content_type"
              v-model="filters.content_type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все типы</option>
              <option value="text">Текст</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
              <option value="image_url">URL изображения</option>
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

      <!-- Content table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-500">Загрузка контента...</p>
        </div>
        <div v-else-if="filteredContent.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Контент не найден</h3>
          <p class="mt-1 text-sm text-gray-500">Начните с создания первого элемента контента.</p>
          <div class="mt-6">
            <button
              type="button"
              @click="showCreateModal = true"
              class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Добавить контент
            </button>
          </div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ключ
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Группа
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Содержимое
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="relative px-6 py-3">
                  <span class="sr-only">Действия</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="content in paginatedContent" :key="content.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ content.key }}</div>
                  <div class="text-sm text-gray-500">{{ content.description || 'Без описания' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeClass(content.content_type)"
                  >
                    {{ getTypeText(content.content_type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ content.group_name || 'Без группы' }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ getContentPreview(content) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="content.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ content.is_active ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editContent(content)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="deleteContent(content)"
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
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredContent.length) }}</span>
                из
                <span class="font-medium">{{ filteredContent.length }}</span>
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

    <!-- Create/Edit Content Modal -->
    <ContentModal
      v-if="showCreateModal || showEditModal"
      :content="selectedContent"
      :is-edit="showEditModal"
      :groups="groups"
      @close="closeModals"
      @saved="handleContentSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :title="`Удалить контент «${contentToDelete?.key}»`"
      :message="'Это действие нельзя отменить. Контент будет удален навсегда.'"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ContentModal from '@/components/admin/ContentModal.vue'
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal.vue'
import { api } from '@/services/api'

interface Content {
  id: number
  key: string
  content_type: string
  content?: string
  json_content?: any
  description?: string
  group_name?: string
  is_active: boolean
  sort_order: string
  created_at: string
  updated_at: string
}

const content = ref<Content[]>([])
const groups = ref<string[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedContent = ref<Content | null>(null)
const contentToDelete = ref<Content | null>(null)

// Filters
const filters = ref({
  search: '',
  group: '',
  content_type: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Stats
const stats = computed(() => {
  const contentStats = {
    total: content.value.length,
    active: 0,
    groups: new Set<string>(),
    types: new Set<string>()
  }
  
  content.value.forEach(item => {
    if (item.is_active) contentStats.active++
    if (item.group_name) contentStats.groups.add(item.group_name)
    contentStats.types.add(item.content_type)
  })
  
  return {
    total: contentStats.total,
    active: contentStats.active,
    groups: contentStats.groups.size,
    types: contentStats.types.size
  }
})

const filteredContent = computed(() => {
  let filtered = content.value || []
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(item =>
      item.key.toLowerCase().includes(search) ||
      (item.description && item.description.toLowerCase().includes(search)) ||
      (item.content && item.content.toLowerCase().includes(search))
    )
  }
  
  if (filters.value.group) {
    filtered = filtered.filter(item => item.group_name === filters.value.group)
  }
  
  if (filters.value.content_type) {
    filtered = filtered.filter(item => item.content_type === filters.value.content_type)
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil((filteredContent.value || []).length / itemsPerPage))

const paginatedContent = computed(() => {
  const filtered = filteredContent.value || []
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

const getTypeClass = (type: string) => {
  const classes = {
    'text': 'bg-blue-100 text-blue-800',
    'html': 'bg-green-100 text-green-800',
    'json': 'bg-purple-100 text-purple-800',
    'image_url': 'bg-yellow-100 text-yellow-800'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getTypeText = (type: string) => {
  const texts = {
    'text': 'Текст',
    'html': 'HTML',
    'json': 'JSON',
    'image_url': 'Изображение'
  }
  return texts[type as keyof typeof texts] || type
}

const getContentPreview = (item: Content) => {
  if (item.content_type === 'json' && item.json_content) {
    return JSON.stringify(item.json_content).substring(0, 100)
  }
  return item.content?.substring(0, 100) || 'Пусто'
}

const resetFilters = () => {
  filters.value = {
    search: '',
    group: '',
    content_type: ''
  }
  currentPage.value = 1
}

const loadContent = async () => {
  loading.value = true
  try {
    const response = await api.get('/cms/admin/content')
    content.value = response.data.data || []
  } catch (error) {
    console.error('Error loading content:', error)
    content.value = []
  } finally {
    loading.value = false
  }
}

const loadGroups = async () => {
  try {
    const response = await api.get('/cms/admin/content/groups')
    groups.value = response.data.data || []
  } catch (error) {
    console.error('Error loading groups:', error)
    groups.value = []
  }
}

const editContent = (item: Content) => {
  selectedContent.value = item
  showEditModal.value = true
}

const deleteContent = (item: Content) => {
  contentToDelete.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!contentToDelete.value) return
  
  try {
    await api.delete(`/cms/admin/content/${contentToDelete.value.id}`)
    content.value = content.value.filter(c => c.id !== contentToDelete.value!.id)
    showDeleteModal.value = false
    contentToDelete.value = null
  } catch (error) {
    console.error('Error deleting content:', error)
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedContent.value = null
}

const handleContentSaved = (savedContent: Content) => {
  if (showEditModal.value) {
    const index = content.value.findIndex(c => c.id === savedContent.id)
    if (index !== -1) {
      content.value[index] = savedContent
    }
  } else {
    content.value.unshift(savedContent)
  }
  closeModals()
  loadGroups() // Обновляем список групп
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  loadContent()
  loadGroups()
})
</script>