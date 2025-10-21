<template>
  <AdminLayout>
    <!-- Notification -->
    <div 
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300',
        notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
      ]"
    >
      <div class="flex items-center">
        <svg 
          v-if="notification.type === 'success'"
          class="w-5 h-5 mr-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg 
          v-else
          class="w-5 h-5 mr-2" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        {{ notification.message }}
      </div>
    </div>
    
    <div class="space-y-6">
      <!-- Page header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-semibold text-gray-900">Управление услугами</h1>
          <p class="mt-2 text-sm text-gray-700">
            Создавайте и редактируйте услуги вашей компании
          </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            @click="showCreateModal = true"
            class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Добавить услугу
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Всего услуг</dt>
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
                  <dt class="text-sm font-medium text-gray-500 truncate">Активные</dt>
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
                <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Неактивные</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.inactive }}</dd>
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7A4 4 0 013 17V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Категорий</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.categories }}</dd>
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
              placeholder="Название услуги..."
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
              <option value="3d_printing">3D Печать</option>
              <option value="post_processing">Постобработка</option>
              <option value="modeling">Моделирование</option>
              <option value="consultation">Консультация</option>
            </select>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Статус</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
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

      <!-- Services table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-500">Загрузка услуг...</p>
        </div>
        <div v-else-if="filteredServices.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Услуги не найдены</h3>
          <p class="mt-1 text-sm text-gray-500">Начните с создания первой услуги.</p>
          <div class="mt-6">
            <button
              type="button"
              @click="showCreateModal = true"
              class="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg class="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Добавить услугу
            </button>
          </div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуга
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Особенности
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
              <tr v-for="service in paginatedServices" :key="service.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ServiceIcon :icon="service.icon || 'cube'" class="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                      <div class="text-sm text-gray-500">{{ truncateText(service.description, 60) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getCategoryClass(service.category)"
                  >
                    {{ getCategoryText(service.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div v-if="service.features && service.features.length > 0" class="flex flex-wrap gap-1">
                    <span 
                      v-for="feature in service.features.slice(0, 2)" 
                      :key="feature"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ feature }}
                    </span>
                    <span v-if="service.features.length > 2" class="text-xs text-gray-500">
                      +{{ service.features.length - 2 }} еще
                    </span>
                  </div>
                  <span v-else class="text-gray-500 italic">Не указаны</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ service.is_active ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(service.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editService(service)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="toggleServiceStatus(service)"
                      :disabled="toggleLoading.has(service.id)"
                      :class="[
                        service.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900',
                        toggleLoading.has(service.id) ? 'opacity-50 cursor-not-allowed' : ''
                      ]"
                    >
                      {{ toggleLoading.has(service.id) ? 'Обновление...' : (service.is_active ? 'Деактивировать' : 'Активировать') }}
                    </button>
                    <button
                      @click="deleteService(service)"
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
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredServices.length) }}</span>
                из
                <span class="font-medium">{{ filteredServices.length }}</span>
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

    <!-- Create/Edit Service Modal -->
    <ServiceModal
      v-if="showCreateModal || showEditModal"
      :service="selectedService"
      :is-edit="showEditModal"
      @close="closeModals"
      @saved="handleServiceSaved"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ServiceModal from '@/components/admin/ServiceModal.vue'
import ServiceIcon from '@/components/ServiceIcon.vue'
import { api } from '@/services/api'

interface Service {
  id: number
  name: string
  description: string
  price_factors?: any
  features?: string[]
  is_active: boolean
  category?: string
  icon?: string
  created_at: string
  updated_at: string
}

const services = ref<Service[]>([])
const loading = ref(false)
const toggleLoading = ref<Set<number>>(new Set()) // Отслеживаем загрузку для каждой услуги отдельно
const notification = ref<{show: boolean, message: string, type: 'success' | 'error'}>({
  show: false,
  message: '',
  type: 'success'
})
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedService = ref<Service | null>(null)

// Filters
const filters = ref({
  search: '',
  category: '',
  status: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Stats
const stats = computed(() => {
  const serviceStats = {
    total: services.value.length,
    active: 0,
    inactive: 0,
    categories: new Set<string>()
  }
  
  services.value.forEach(service => {
    if (service.is_active) {
      serviceStats.active++
    } else {
      serviceStats.inactive++
    }
    if (service.category) serviceStats.categories.add(service.category)
  })
  
  return {
    total: serviceStats.total,
    active: serviceStats.active,
    inactive: serviceStats.inactive,
    categories: serviceStats.categories.size
  }
})

const filteredServices = computed(() => {
  let filtered = services.value || []
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(service =>
      service.name.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search)
    )
  }
  
  if (filters.value.category) {
    filtered = filtered.filter(service => service.category === filters.value.category)
  }
  
  if (filters.value.status) {
    const isActive = filters.value.status === 'active'
    filtered = filtered.filter(service => service.is_active === isActive)
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil((filteredServices.value || []).length / itemsPerPage))

const paginatedServices = computed(() => {
  const filtered = filteredServices.value || []
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

const getCategoryClass = (category?: string) => {
  const classes = {
    '3d_printing': 'bg-blue-100 text-blue-800',
    'post_processing': 'bg-green-100 text-green-800',
    'modeling': 'bg-purple-100 text-purple-800',
    'consultation': 'bg-yellow-100 text-yellow-800'
  }
  return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getCategoryText = (category?: string) => {
  const texts = {
    '3d_printing': '3D Печать',
    'post_processing': 'Постобработка',
    'modeling': 'Моделирование',
    'consultation': 'Консультация'
  }
  return texts[category as keyof typeof texts] || category || 'Без категории'
}



const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU')
}

const truncateText = (text: string | null | undefined, length: number) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: ''
  }
  currentPage.value = 1
}

const loadServices = async () => {
  loading.value = true
  try {
    console.log('📥 Loading services from API...')
    // Добавляем timestamp для предотвращения кеширования браузером
    const timestamp = Date.now()
    const response = await api.get(`/services?active_only=false&_t=${timestamp}`)
    services.value = response.data.data || []
    console.log('✅ Loaded', services.value.length, 'services')
    
    // Логируем статус первых нескольких услуг для отладки
    services.value.slice(0, 5).forEach(service => {
      console.log(`Service ${service.id} (${service.name}): ${service.is_active ? 'active' : 'inactive'}`)
    })
  } catch (error) {
    console.error('Error loading services:', error)
    services.value = []
  } finally {
    loading.value = false
  }
}

const editService = (service: Service) => {
  selectedService.value = service
  showEditModal.value = true
}

const toggleServiceStatus = async (service: Service) => {
  // Предотвращаем множественные клики для конкретной услуги
  if (toggleLoading.value.has(service.id)) {
    console.log('⏳ Already processing service', service.id)
    return
  }
  
  console.log('🔄 Toggling status for service:', service.name, 'ID:', service.id, 'Current:', service.is_active)
  
  toggleLoading.value.add(service.id)
  
  try {
    // Определяем новый статус заранее
    const newStatus = !service.is_active
    
    console.log('📤 Sending PUT request with data:', { is_active: newStatus })
    
    // Отправляем запрос
    const response = await api.put(`/services/${service.id}`, {
      is_active: newStatus
    })
    
    console.log('📥 API response status:', response.status)
    console.log('📥 API response data:', response.data)
    
    if (response.data && response.data.success) {
      const updatedService = response.data.data
      console.log('✅ Service updated successfully. New status:', updatedService.is_active)
      
      // Перезагружаем все данные с сервера для гарантии консистентности
      console.log('🔄 Reloading all services from server...')
      await loadServices()
      
      showNotification(
        `Услуга "${service.name}" ${updatedService.is_active ? 'активирована' : 'деактивирована'}`, 
        'success'
      )
    } else {
      throw new Error('API returned unsuccessful response')
    }
    
  } catch (error: any) {
    console.error('❌ Error toggling service status:', error)
    console.error('❌ Error details:', error.response?.data)
    showNotification('Ошибка при изменении статуса услуги', 'error')
  } finally {
    toggleLoading.value.delete(service.id)
  }
}

const deleteService = async (service: Service) => {
  if (!confirm(`Вы уверены, что хотите удалить услугу "${service.name}"? Это действие нельзя отменить.`)) {
    return
  }
  
  try {
    await api.delete(`/services/${service.id}`)
    
    // Перезагружаем данные с сервера
    await loadServices()
    
    showNotification(`Услуга "${service.name}" удалена`, 'success')
  } catch (error) {
    console.error('Error deleting service:', error)
    showNotification('Ошибка при удалении услуги', 'error')
  }
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Функция для тестирования API
const testAPI = async () => {
  console.log('🧪 Testing API connection...')
  try {
    const response = await api.get('/services/')
    console.log('✅ API test successful:', response.status, response.data)
  } catch (error: any) {
    console.error('❌ API test failed:', error)
  }
}

// Вызываем тест при загрузке компонента
testAPI()

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedService.value = null
}

const handleServiceSaved = (service: Service) => {
  if (showEditModal.value) {
    const index = services.value.findIndex(s => s.id === service.id)
    if (index !== -1) {
      services.value[index] = service
    }
    showNotification(`Услуга "${service.name}" обновлена`, 'success')
  } else {
    services.value.unshift(service)
    showNotification(`Услуга "${service.name}" создана`, 'success')
  }
  closeModals()
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  loadServices()
})
</script>