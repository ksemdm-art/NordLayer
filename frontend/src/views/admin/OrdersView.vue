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
          <h1 class="text-2xl font-semibold text-gray-900">Управление заказами</h1>
          <p class="mt-2 text-sm text-gray-700">
            Просматривайте и управляйте заказами клиентов
          </p>
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
              placeholder="Имя клиента, email..."
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Статус</label>
            <select
              id="status"
              v-model="filters.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все статусы</option>
              <option value="new">Новый</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Завершен</option>
              <option value="cancelled">Отменен</option>
            </select>
          </div>
          <div>
            <label for="source" class="block text-sm font-medium text-gray-700">Источник</label>
            <select
              id="source"
              v-model="filters.source"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Все источники</option>
              <option value="web">Сайт</option>
              <option value="telegram">Telegram</option>
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

      <!-- Orders table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-500">Загрузка заказов...</p>
        </div>

        <div v-else-if="filteredOrders.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Заказы не найдены</h3>
          <p class="mt-1 text-sm text-gray-500">Заказы появятся здесь после оформления клиентами.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заказ
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Клиент
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Услуга
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Доставка
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Источник
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
              <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">#{{ order.id }}</div>
                    <div v-if="order.notes" class="text-sm text-gray-500">{{ truncateText(order.notes, 40) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.customer_name }}</div>
                    <div class="text-sm text-gray-500">{{ order.customer_email || order.customer_contact }}</div>
                    <div v-if="order.customer_phone" class="text-sm text-gray-500">📞 {{ order.customer_phone }}</div>
                    <div v-if="order.alternative_contact" class="text-sm text-blue-600">💬 {{ order.alternative_contact }}</div>
                    <div v-if="isDeliveryNeeded(order.delivery_needed)" class="text-xs text-green-600">🚚 Доставка нужна</div>
                    <div v-else class="text-xs text-gray-500">🏪 Самовывоз</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ order.service_name || 'Не указана' }}</div>
                    <div class="text-sm text-gray-500">
                      ID: {{ order.service_id }}
                      <span v-if="getServicesCount(order) > 1" class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-1">
                        +{{ getServicesCount(order) - 1 }} услуг
                      </span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      <span v-if="isDeliveryNeeded(order.delivery_needed)" class="text-green-600">
                        🚚 Доставка
                      </span>
                      <span v-else class="text-gray-600">
                        🏪 Самовывоз
                      </span>
                    </div>
                    <div v-if="order.delivery_details" class="text-xs text-gray-500 mt-1">
                      {{ truncateText(order.delivery_details, 30) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusText(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getSourceClass(order.source)"
                  >
                    {{ getSourceText(order.source) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(order.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewOrder(order)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Просмотр
                    </button>
                    <button
                      @click="updateOrderStatus(order)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Статус
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
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span>
                из
                <span class="font-medium">{{ filteredOrders.length }}</span>
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

    <!-- Order Detail Modal -->
    <OrderDetailModal
      v-if="showDetailModal"
      :order="selectedOrder"
      @close="showDetailModal = false"
      @updated="handleOrderUpdated"
    />

    <!-- Status Update Modal -->
    <StatusUpdateModal
      v-if="showStatusModal"
      :order="selectedOrder"
      @close="showStatusModal = false"
      @updated="handleOrderUpdated"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import OrderDetailModal from '@/components/admin/OrderDetailModal.vue'
import StatusUpdateModal from '@/components/admin/StatusUpdateModal.vue'
import { api } from '@/services/api'
import { useColors } from '@/composables/useColors'
import type { Order } from '@/types'

const orders = ref<Order[]>([])
const loading = ref(false)
const showDetailModal = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const notification = ref<{show: boolean, message: string, type: 'success' | 'error'}>({
  show: false,
  message: '',
  type: 'success'
})

// Используем композабл для работы с цветами
const { loadColors } = useColors()

// Filters
const filters = ref({
  search: '',
  status: '',
  source: ''
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

const filteredOrders = computed(() => {
  let filtered = orders.value || []

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.customer_name.toLowerCase().includes(search) ||
      (order.customer_email && order.customer_email.toLowerCase().includes(search)) ||
      (order.customer_contact && order.customer_contact.toLowerCase().includes(search)) ||
      (order.customer_phone && order.customer_phone.toLowerCase().includes(search)) ||
      (order.alternative_contact && order.alternative_contact.toLowerCase().includes(search)) ||
      (order.notes && order.notes.toLowerCase().includes(search)) ||
      (order.service_name && order.service_name.toLowerCase().includes(search))
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(order => order.status === filters.value.status)
  }

  if (filters.value.source) {
    filtered = filtered.filter(order => order.source === filters.value.source)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil((filteredOrders.value || []).length / itemsPerPage))

const paginatedOrders = computed(() => {
  const filtered = filteredOrders.value || []
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

const getStatusClass = (status: string) => {
  const classes = {
    'new': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'cancelled': 'Отменен'
  }
  return texts[status as keyof typeof texts] || status
}

const getSourceClass = (source: string) => {
  const classes = {
    'web': 'bg-purple-100 text-purple-800',
    'telegram': 'bg-blue-100 text-blue-800'
  }
  return classes[source as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getSourceText = (source: string) => {
  const texts = {
    'web': 'Сайт',
    'telegram': 'Telegram'
  }
  return texts[source as keyof typeof texts] || source
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const truncateText = (text: string | undefined | null, length: number) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const isDeliveryNeeded = (deliveryNeeded: unknown): boolean => {
  return deliveryNeeded === true || deliveryNeeded === 'true'
}



// Removed unused getColorValue and getColorName functions

const getServicesCount = (order: Order) => {
  // Подсчитываем количество услуг в заказе из разных возможных полей
  const servicesFromSpecs = Array.isArray(order.specifications?.services) ? order.specifications!.services.length : 0
  
  const selectedServices = order.specifications && Array.isArray(order.specifications.selectedServices) 
    ? order.specifications.selectedServices.length 
    : 0
    
  const servicesList = order.specifications && Array.isArray(order.specifications.servicesList) 
    ? order.specifications.servicesList.length 
    : 0
    
  const orderServices = order.specifications && Array.isArray(order.specifications.orderServices) 
    ? order.specifications.orderServices.length 
    : 0
    
  const additionalServices = order.specifications && Array.isArray(order.specifications.additionalServices) 
    ? order.specifications.additionalServices.length 
    : 0
  
  // Если services - объект, считаем количество ключей
  const servicesObject = typeof order.specifications?.services === 'object' && 
    order.specifications?.services && 
    !Array.isArray(order.specifications.services)
    ? Object.keys(order.specifications.services).length
    : 0
  
  // Возвращаем максимальное количество или 1 (основная услуга)
  return Math.max(servicesFromSpecs, selectedServices, servicesList, orderServices, additionalServices, servicesObject, 1)
}

const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    source: ''
  }
  currentPage.value = 1
}

const loadOrders = async () => {
  loading.value = true
  try {
    console.log('📥 Loading orders from API...')
    // Добавляем timestamp для предотвращения кеширования браузером
    const timestamp = Date.now()
    const response = await api.get(`/orders?_t=${timestamp}`)
    console.log('✅ Orders API response:', response.data)
    const rawOrders = response.data.data || []
    console.log('✅ Loaded', rawOrders.length, 'orders')
    
    // Преобразуем данные к типу Order, извлекая поля из specifications
    orders.value = rawOrders.map((order: Record<string, unknown>) => {
      const processedOrder = {
        ...order,
        // Новые поля контактов и доставки
        customer_email: order.customer_email || order.customer_contact,
        customer_phone: order.customer_phone,
        alternative_contact: order.alternative_contact || (order.specifications as Record<string, unknown>)?.alternative_contact,
        delivery_needed: order.delivery_needed || (order.specifications as Record<string, unknown>)?.delivery_needed,
        delivery_details: order.delivery_details || (order.specifications as Record<string, unknown>)?.delivery_details,
        
        // Извлекаем поля из specifications для удобства
        color: (order.specifications as Record<string, unknown>)?.color || 
               ((order.specifications as Record<string, unknown>)?.selectedColor as Record<string, unknown>)?.color || 
               (order.specifications as Record<string, unknown>)?.selectedColor || 
               (order.specifications as Record<string, unknown>)?.printColor || 
               (order.specifications as Record<string, unknown>)?.filamentColor,
        color_name: (order.specifications as Record<string, unknown>)?.colorName || 
                   ((order.specifications as Record<string, unknown>)?.selectedColor as Record<string, unknown>)?.name || 
                   (order.specifications as Record<string, unknown>)?.color_name || 
                   (order.specifications as Record<string, unknown>)?.printColorName || 
                   (order.specifications as Record<string, unknown>)?.filamentColorName,
        multi_color: (order.specifications as Record<string, unknown>)?.isMultiColor || 
                    (order.specifications as Record<string, unknown>)?.multiColor || 
                    (order.specifications as Record<string, unknown>)?.multi_color,
        multi_colors: (order.specifications as Record<string, unknown>)?.multiColors || 
                     (order.specifications as Record<string, unknown>)?.selectedColors || 
                     (order.specifications as Record<string, unknown>)?.multi_colors,
        quantity: (order.specifications as Record<string, unknown>)?.quantity,
        infill: (order.specifications as Record<string, unknown>)?.infill,
        material: (order.specifications as Record<string, unknown>)?.material,
        quality: (order.specifications as Record<string, unknown>)?.quality,
        urgency: (order.specifications as Record<string, unknown>)?.urgency,
        files_info: (order.specifications as Record<string, unknown>)?.files_info || 
                   (order.specifications as Record<string, unknown>)?.files,
        selected_gallery_items: (order.specifications as Record<string, unknown>)?.selected_gallery_items || 
                               (order.specifications as Record<string, unknown>)?.selectedGalleryItems,
        delivery_method: (order.specifications as Record<string, unknown>)?.deliveryMethod,
        payment_method: (order.specifications as Record<string, unknown>)?.paymentMethod,
        delivery_address: (order.specifications as Record<string, unknown>)?.deliveryAddress,
        delivery_city: (order.specifications as Record<string, unknown>)?.deliveryCity,
        delivery_postal_code: (order.specifications as Record<string, unknown>)?.deliveryPostalCode,
        service_name: (order.specifications as Record<string, unknown>)?.service_type || 
                     (order.service as Record<string, unknown>)?.name,
        // Не показываем цены в админке согласно требованиям
        total_price: null,
        // Добавляем файлы если есть
        files: order.files || []
      }
      
      return processedOrder
    })
    
    // Логируем статус первых нескольких заказов для отладки
    orders.value.slice(0, 5).forEach(order => {
      console.log(`Order ${order.id}: status=${order.status}`)
    })
  } catch (error) {
    console.error('Error loading orders:', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const updateOrderStatus = (order: Order) => {
  selectedOrder.value = order
  showStatusModal.value = true
}

const handleOrderUpdated = async (updatedOrder: Order) => {
  console.log('🔄 Handling order update:', updatedOrder.id, 'new status:', updatedOrder.status)
  
  const index = orders.value.findIndex(o => o.id === updatedOrder.id)
  if (index !== -1) {
    const oldStatus = orders.value[index].status
    orders.value[index] = updatedOrder
    console.log('✅ Order updated in list:', oldStatus, '->', updatedOrder.status)
  }
  
  showDetailModal.value = false
  showStatusModal.value = false
  
  // Перезагружаем список заказов для обеспечения синхронизации
  await loadOrders()
  
  showNotification(`Заказ #${updatedOrder.id} обновлен`, 'success')
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Reset pagination when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(() => {
  loadOrders()
  loadColors()
})
</script>