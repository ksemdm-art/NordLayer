<template>
  <AdminLayout>
    <div class="contact-requests-management">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Управление запросами обратной связи</h1>
        <p class="text-gray-600 mt-1">Просмотр и обработка запросов от клиентов</p>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="stats-summary bg-white rounded-lg shadow-sm border px-4 py-2">
          <div class="flex items-center space-x-6 text-sm">
            <div class="text-center">
              <div class="font-semibold text-gray-900">{{ stats.total_requests || 0 }}</div>
              <div class="text-gray-500">Всего</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-blue-600">{{ stats.status_distribution?.new || 0 }}</div>
              <div class="text-gray-500">Новые</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-yellow-600">{{ stats.status_distribution?.in_progress || 0 }}</div>
              <div class="text-gray-500">В работе</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-green-600">{{ stats.status_distribution?.resolved || 0 }}</div>
              <div class="text-gray-500">Решено</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-gray-600">{{ stats.recent_requests || 0 }}</div>
              <div class="text-gray-500">За неделю</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Статус:</label>
          <select v-model="filters.status" class="filter-select" @change="loadContactRequests">
            <option value="">Все</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="resolved">Решено</option>
            <option value="closed">Закрыто</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Дата от:</label>
          <input
            v-model="filters.startDate"
            type="date"
            class="filter-input"
            @change="loadContactRequests"
          />
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Дата до:</label>
          <input
            v-model="filters.endDate"
            type="date"
            class="filter-input"
            @change="loadContactRequests"
          />
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Поиск:</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Поиск по имени, теме, сообщению..."
            class="filter-input"
            @input="debouncedSearch"
          />
        </div>

        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
          <button
            @click="resetFilters"
            class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Requests Table -->
    <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div v-if="loading" class="p-8 text-center">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Загрузка запросов...
        </div>
      </div>

      <div v-else-if="contactRequests.length === 0" class="p-8 text-center text-gray-500">
        <EnvelopeIcon class="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Запросы не найдены</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Клиент
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тема
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сообщение
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="request in contactRequests"
              :key="request.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="openRequestModal(request)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ request.name }}</div>
                  <div class="text-sm text-gray-500">{{ request.email }}</div>
                  <div v-if="request.phone" class="text-sm text-gray-500">{{ request.phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ request.subject }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-md truncate">{{ request.message }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadgeClass(request.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusText(request.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(request.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click.stop="openRequestModal(request)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Просмотреть"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="quickStatusUpdate(request, getNextStatus(request.status))"
                    class="text-green-600 hover:text-green-900"
                    :title="getNextStatusText(request.status)"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click.stop="deleteRequest(request)"
                    class="text-red-600 hover:text-red-900"
                    title="Удалить"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Показано {{ Math.min(pagination.skip + 1, pagination.total) }}-{{ Math.min(pagination.skip + pagination.limit, pagination.total) }} из {{ pagination.total }}
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="changePage(pagination.skip - pagination.limit)"
              :disabled="pagination.skip === 0"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Назад
            </button>
            <button
              @click="changePage(pagination.skip + pagination.limit)"
              :disabled="!pagination.has_next"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Далее
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Detail Modal -->
    <div v-if="selectedRequest" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">Запрос обратной связи #{{ selectedRequest.id }}</h2>
            <button
              @click="closeRequestModal"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <div class="space-y-6">
            <!-- Client Information -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Информация о клиенте</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Имя:</label>
                  <p class="text-gray-900">{{ selectedRequest.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email:</label>
                  <p class="text-gray-900">
                    <a :href="`mailto:${selectedRequest.email}`" class="text-blue-600 hover:text-blue-800">
                      {{ selectedRequest.email }}
                    </a>
                  </p>
                </div>
                <div v-if="selectedRequest.phone">
                  <label class="block text-sm font-medium text-gray-700">Телефон:</label>
                  <p class="text-gray-900">
                    <a :href="`tel:${selectedRequest.phone}`" class="text-blue-600 hover:text-blue-800">
                      {{ selectedRequest.phone }}
                    </a>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Дата обращения:</label>
                  <p class="text-gray-900">{{ formatDate(selectedRequest.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Request Details -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Детали запроса</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Тема:</label>
                  <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ selectedRequest.subject }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Сообщение:</label>
                  <p class="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">{{ selectedRequest.message }}</p>
                </div>
              </div>
            </div>

            <!-- Status Management -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Управление статусом</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Текущий статус:</label>
                  <select
                    v-model="selectedRequest.status"
                    @change="updateRequestStatus"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">Новый</option>
                    <option value="in_progress">В работе</option>
                    <option value="resolved">Решено</option>
                    <option value="closed">Закрыто</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Заметки администратора:</label>
                  <textarea
                    v-model="selectedRequest.admin_notes"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Добавьте заметки о работе с этим запросом..."
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                @click="closeRequestModal"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                @click="saveRequestChanges"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <span v-if="saving">Сохранение...</span>
                <span v-else>Сохранить изменения</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  EnvelopeIcon, 
  EyeIcon, 
  CheckIcon, 
  TrashIcon, 
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import api from '@/services/api'
import { globalNotifications } from '@/composables/useNotifications'

interface ContactRequest {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  admin_notes?: string
  created_at: string
  updated_at: string
}

interface ContactRequestStats {
  total_requests: number
  recent_requests: number
  status_distribution: {
    new: number
    in_progress: number
    resolved: number
    closed: number
  }
}

const contactRequests = ref<ContactRequest[]>([])
const selectedRequest = ref<ContactRequest | null>(null)
const loading = ref(false)
const saving = ref(false)
const stats = ref<ContactRequestStats>({
  total_requests: 0,
  recent_requests: 0,
  status_distribution: {
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  }
})

const filters = ref({
  status: '',
  startDate: '',
  endDate: '',
  search: ''
})

const pagination = ref({
  skip: 0,
  limit: 20,
  total: 0,
  has_next: false
})

// Debounced search
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadContactRequests()
  }, 500)
}

const loadContactRequests = async () => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      skip: pagination.value.skip.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.startDate) params.append('start_date', filters.value.startDate)
    if (filters.value.endDate) params.append('end_date', filters.value.endDate)
    if (filters.value.search) params.append('search', filters.value.search)
    
    const response = await api.get(`/contact/admin/?${params}`)
    
    if (response.data.success) {
      contactRequests.value = response.data.data
      if (response.data.pagination) {
        pagination.value = { ...pagination.value, ...response.data.pagination }
      }
    }
  } catch (error) {
    console.error('Error loading contact requests:', error)
    globalNotifications.error('Ошибка', 'Не удалось загрузить запросы')
  } finally {
    loading.value = false
  }
}

const loadStats = async () => {
  try {
    const response = await api.get('/contact/admin/stats')
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const openRequestModal = (request: ContactRequest) => {
  selectedRequest.value = { ...request }
}

const closeRequestModal = () => {
  selectedRequest.value = null
}

const updateRequestStatus = async () => {
  if (!selectedRequest.value) return
  
  try {
    const response = await api.put(`/contact/admin/${selectedRequest.value.id}/status`, null, {
      params: { status: selectedRequest.value.status }
    })
    
    if (response.data.success) {
      // Update the request in the list
      const index = contactRequests.value.findIndex(r => r.id === selectedRequest.value!.id)
      if (index !== -1) {
        contactRequests.value[index].status = selectedRequest.value.status
      }
      
      globalNotifications.success('Успех', 'Статус запроса обновлен')
      loadStats() // Refresh stats
    }
  } catch (error) {
    console.error('Error updating status:', error)
    globalNotifications.error('Ошибка', 'Не удалось обновить статус')
  }
}

const saveRequestChanges = async () => {
  if (!selectedRequest.value) return
  
  saving.value = true
  
  try {
    const updateData = {
      status: selectedRequest.value.status,
      admin_notes: selectedRequest.value.admin_notes
    }
    
    const response = await api.put(`/contact/admin/${selectedRequest.value.id}`, updateData)
    
    if (response.data.success) {
      // Update the request in the list
      const index = contactRequests.value.findIndex(r => r.id === selectedRequest.value!.id)
      if (index !== -1) {
        contactRequests.value[index] = { ...response.data.data }
      }
      
      globalNotifications.success('Успех', 'Изменения сохранены')
      closeRequestModal()
      loadStats() // Refresh stats
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    globalNotifications.error('Ошибка', 'Не удалось сохранить изменения')
  } finally {
    saving.value = false
  }
}

const quickStatusUpdate = async (request: ContactRequest, newStatus: string) => {
  try {
    const response = await api.put(`/contact/admin/${request.id}/status`, null, {
      params: { status: newStatus }
    })
    
    if (response.data.success) {
      request.status = newStatus as any
      globalNotifications.success('Успех', 'Статус обновлен')
      loadStats() // Refresh stats
    }
  } catch (error) {
    console.error('Error updating status:', error)
    globalNotifications.error('Ошибка', 'Не удалось обновить статус')
  }
}

const deleteRequest = async (request: ContactRequest) => {
  if (!confirm(`Вы уверены, что хотите удалить запрос от ${request.name}?`)) {
    return
  }
  
  try {
    const response = await api.delete(`/contact/admin/${request.id}`)
    
    if (response.data.success) {
      contactRequests.value = contactRequests.value.filter(r => r.id !== request.id)
      globalNotifications.success('Успех', 'Запрос удален')
      loadStats() // Refresh stats
    }
  } catch (error) {
    console.error('Error deleting request:', error)
    globalNotifications.error('Ошибка', 'Не удалось удалить запрос')
  }
}

const resetFilters = () => {
  filters.value = {
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  }
  pagination.value.skip = 0
  loadContactRequests()
}

const changePage = (newSkip: number) => {
  pagination.value.skip = Math.max(0, newSkip)
  loadContactRequests()
}

// Helper functions
const getStatusBadgeClass = (status: string) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    new: 'Новый',
    in_progress: 'В работе',
    resolved: 'Решено',
    closed: 'Закрыто'
  }
  return texts[status as keyof typeof texts] || status
}

const getNextStatus = (currentStatus: string) => {
  const nextStatus = {
    new: 'in_progress',
    in_progress: 'resolved',
    resolved: 'closed',
    closed: 'new'
  }
  return nextStatus[currentStatus as keyof typeof nextStatus] || 'in_progress'
}

const getNextStatusText = (currentStatus: string) => {
  const nextStatus = getNextStatus(currentStatus)
  return `Изменить на "${getStatusText(nextStatus)}"`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadContactRequests()
  loadStats()
})
</script>

<style scoped>
.filter-group {
  @apply min-w-0 flex-1;
}

.filter-select, .filter-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.stats-summary {
  @apply min-w-max;
}
</style>