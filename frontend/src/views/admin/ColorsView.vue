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
    
    <div class="colors-admin">
      <div class="header">
        <h1>Управление цветами</h1>
        <button @click="showCreateModal = true" class="btn-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Добавить цвет
        </button>
      </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label>Тип цвета:</label>
        <select v-model="selectedType" @change="loadColors">
          <option value="">Все типы</option>
          <option value="solid">Обычные</option>
          <option value="gradient">Градиенты</option>
          <option value="metallic">Металлик</option>
        </select>
      </div>
      

    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Загрузка цветов...</span>
    </div>

    <!-- Colors Table -->
    <div v-else class="colors-table">
      <table>
        <thead>
          <tr>
            <th>Превью</th>
            <th>Название</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Новинка</th>
            <th>Порядок</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="color in colors" :key="color.id" :class="{ inactive: !color.is_active }">
            <!-- Color Preview -->
            <td>
              <div 
                class="color-preview"
                :style="getColorStyle(color)"
                :title="getColorTooltip(color)"
              >
                <div 
                  v-if="color.type === ColorType.METALLIC" 
                  class="metallic-shine"
                ></div>
              </div>
            </td>

            <!-- Name -->
            <td>
              <div class="color-name">
                {{ color.name }}
                <span v-if="color.is_new" class="new-badge">NEW</span>
              </div>
            </td>

            <!-- Type -->
            <td>
              <span class="type-badge" :class="`type-${color.type.toLowerCase()}`">
                {{ getTypeLabel(color.type) }}
              </span>
            </td>

            <!-- Status -->
            <td>
              <button 
                @click="toggleActiveStatus(color)"
                :class="['status-btn', color.is_active ? 'active' : 'inactive']"
              >
                {{ color.is_active ? 'Доступен' : 'Недоступен' }}
              </button>
            </td>

            <!-- New Status -->
            <td>
              <button 
                @click="toggleNewStatus(color)"
                :class="['new-btn', color.is_new ? 'is-new' : 'not-new']"
              >
                {{ color.is_new ? 'Да' : 'Нет' }}
              </button>
            </td>



            <!-- Sort Order -->
            <td>
              <input 
                type="number" 
                v-model.number="color.sort_order"
                @blur="updateColor(color)"
                class="sort-input"
                min="0"
              />
            </td>

            <!-- Price Modifier -->
            <td>
              <div class="price-modifier">
                <input 
                  type="number" 
                  v-model.number="color.price_modifier"
                  @blur="updateColor(color)"
                  class="price-input"
                  min="0.1"
                  step="0.1"
                />
                <span class="price-percent">
                  ({{ Math.round((color.price_modifier - 1) * 100) }}%)
                </span>
              </div>
            </td>

            <!-- Actions -->
            <td>
              <div class="actions">
                <button 
                  @click="editColor(color)"
                  class="btn-edit"
                  title="Редактировать"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
                <button 
                  @click="deleteColor(color)"
                  class="btn-delete"
                  title="Удалить"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 2H10M2 4H14M12 4V13C12 13.5 11.5 14 11 14H5C4.5 14 4 13.5 4 13V4" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="colors.length === 0" class="empty-state">
        <p>Цвета не найдены</p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ColorModal
      v-if="showCreateModal || showEditModal"
      :color="editingColor"
      :is-edit="showEditModal"
      @close="closeModal"
      @save="handleSave"
    />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { colorsApi, type Color, ColorType } from '@/api/colors'
import { useColors } from '@/composables/useColors'
import ColorModal from '@/components/admin/ColorModal.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'

const { getColorStyle } = useColors()

const colors = ref<Color[]>([])
const loading = ref(false)
const selectedType = ref('')
const notification = ref<{show: boolean, message: string, type: 'success' | 'error'}>({
  show: false,
  message: '',
  type: 'success'
})

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingColor = ref<Color | null>(null)

const loadColors = async () => {
  loading.value = true
  try {
    console.log('📥 Loading colors from API...')
    const colorType = selectedType.value as ColorType | undefined
    // Добавляем timestamp для предотвращения кеширования браузером
    const timestamp = Date.now()
    colors.value = await colorsApi.getColors(colorType, true) // включаем неактивные цвета для админки
    console.log('✅ Loaded', colors.value.length, 'colors')
    
    // Логируем статус первых нескольких цветов для отладки
    colors.value.slice(0, 5).forEach(color => {
      console.log(`Color ${color.id} (${color.name}): ${color.is_active ? 'active' : 'inactive'}, new: ${color.is_new}`)
    })
  } catch (error) {
    console.error('Error loading colors:', error)
    colors.value = []
  } finally {
    loading.value = false
  }
}

const toggleActiveStatus = async (color: Color) => {
  try {
    console.log('🔄 Toggling active status for color:', color.name, 'ID:', color.id, 'Current:', color.is_active)
    const updatedColor = await colorsApi.toggleActiveStatus(color.id)
    console.log('✅ Color active status updated successfully. New status:', updatedColor.is_active)
    
    // Перезагружаем список цветов для обеспечения синхронизации
    await loadColors()
    
    showNotification(
      `Цвет "${color.name}" ${updatedColor.is_active ? 'активирован' : 'деактивирован'}`, 
      'success'
    )
  } catch (error) {
    console.error('Error toggling active status:', error)
    showNotification('Ошибка при изменении статуса цвета', 'error')
  }
}

const toggleNewStatus = async (color: Color) => {
  try {
    console.log('🔄 Toggling new status for color:', color.name, 'ID:', color.id, 'Current:', color.is_new)
    const updatedColor = await colorsApi.toggleNewStatus(color.id)
    console.log('✅ Color new status updated successfully. New status:', updatedColor.is_new)
    
    // Перезагружаем список цветов для обеспечения синхронизации
    await loadColors()
    
    showNotification(
      `Цвет "${color.name}" ${updatedColor.is_new ? 'отмечен как новинка' : 'убран из новинок'}`, 
      'success'
    )
  } catch (error) {
    console.error('Error toggling new status:', error)
    showNotification('Ошибка при изменении статуса новинки', 'error')
  }
}



const updateColor = async (color: Color) => {
  try {
    console.log('🔄 Updating color:', color.name, 'ID:', color.id)
    await colorsApi.updateColor(color.id, {
      sort_order: color.sort_order,
      price_modifier: color.price_modifier
    })
    console.log('✅ Color updated successfully')
    
    // Перезагружаем список цветов для обеспечения синхронизации
    await loadColors()
    
    showNotification(`Цвет "${color.name}" обновлен`, 'success')
  } catch (error) {
    console.error('Error updating color:', error)
    showNotification('Ошибка при обновлении цвета', 'error')
  }
}

const editColor = (color: Color) => {
  editingColor.value = { ...color }
  showEditModal.value = true
}

const deleteColor = async (color: Color) => {
  if (confirm(`Вы уверены, что хотите удалить цвет "${color.name}"?`)) {
    try {
      console.log('🗑️ Deleting color:', color.name, 'ID:', color.id)
      await colorsApi.deleteColor(color.id)
      console.log('✅ Color deleted successfully')
      
      // Перезагружаем список цветов для обеспечения синхронизации
      await loadColors()
      
      showNotification(`Цвет "${color.name}" удален`, 'success')
    } catch (error) {
      console.error('Error deleting color:', error)
      showNotification('Ошибка при удалении цвета', 'error')
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingColor.value = null
}

const handleSave = async (colorData: Partial<Color>) => {
  try {
    if (showEditModal.value && editingColor.value) {
      // Update existing color
      console.log('🔄 Updating existing color:', editingColor.value.name)
      const updatedColor = await colorsApi.updateColor(editingColor.value.id, colorData)
      console.log('✅ Color updated successfully')
      
      showNotification(`Цвет "${updatedColor.name}" обновлен`, 'success')
    } else {
      // Create new color
      console.log('🔄 Creating new color:', colorData.name)
      const newColor = await colorsApi.createColor(colorData)
      console.log('✅ Color created successfully')
      
      showNotification(`Цвет "${newColor.name}" создан`, 'success')
    }
    
    closeModal()
    
    // Перезагружаем список цветов для обеспечения синхронизации
    await loadColors()
  } catch (error) {
    console.error('Error saving color:', error)
    showNotification('Ошибка при сохранении цвета', 'error')
  }
}

const getTypeLabel = (type: ColorType): string => {
  switch (type) {
    case ColorType.SOLID:
      return 'Обычный'
    case ColorType.GRADIENT:
      return 'Градиент'
    case ColorType.METALLIC:
      return 'Металлик'
    default:
      return 'Неизвестный'
  }
}

const getColorTooltip = (color: Color): string => {
  let tooltip = `${color.name} (${getTypeLabel(color.type)})`
  
  if (color.price_modifier !== 1) {
    const modifier = Math.round((color.price_modifier - 1) * 100)
    tooltip += ` - ${modifier > 0 ? '+' : ''}${modifier}% к цене`
  }
  
  return tooltip
}

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

onMounted(() => {
  loadColors()
})
</script>

<style scoped>
.colors-admin {
  @apply p-6;
}

.header {
  @apply flex justify-between items-center mb-6;
}

.header h1 {
  @apply text-2xl font-bold text-gray-900;
}

.btn-primary {
  @apply flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors;
}

.filters {
  @apply flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg;
}

.filter-group {
  @apply flex items-center gap-2;
}

.filter-group label {
  @apply text-sm font-medium text-gray-700;
}

.filter-group select {
  @apply px-3 py-1 border border-gray-300 rounded;
}

.loading {
  @apply flex items-center justify-center gap-2 py-8;
}

.spinner {
  @apply w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin;
}

.colors-table {
  @apply bg-white rounded-lg shadow overflow-hidden;
}

table {
  @apply w-full;
}

thead {
  @apply bg-gray-50;
}

th {
  @apply px-4 py-3 text-left text-sm font-medium text-gray-700;
}

th:nth-child(4), th:nth-child(5) {
  @apply text-center;
}

td {
  @apply px-4 py-3 border-t border-gray-200;
}

td:nth-child(4), td:nth-child(5) {
  @apply text-center;
}

tr.inactive {
  @apply opacity-60;
}

.color-preview {
  @apply w-12 h-8 rounded border border-gray-200 relative overflow-hidden;
}

.metallic-shine {
  @apply absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent;
}

.color-name {
  @apply flex items-center gap-2;
}

.new-badge {
  @apply px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded font-medium;
}

.type-badge {
  @apply px-2 py-1 text-xs rounded;
}

.type-solid {
  @apply bg-blue-100 text-blue-600;
}

.type-gradient {
  @apply bg-purple-100 text-purple-600;
}

.type-metallic {
  @apply bg-yellow-100 text-yellow-600;
}

.status-btn {
  @apply px-3 py-1 text-sm rounded transition-colors;
}

.status-btn.active {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}

.status-btn.inactive {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.new-btn {
  @apply px-3 py-1 text-sm rounded transition-colors;
}

.new-btn.is-new {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}

.new-btn.not-new {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

.new-badge {
  @apply px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded font-medium;
}

.new-btn {
  @apply px-3 py-1 text-sm rounded transition-colors;
}

.new-btn.is-new {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}

.new-btn.not-new {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

.sort-input, .price-input {
  @apply w-16 px-2 py-1 text-sm border border-gray-300 rounded;
}

.price-modifier {
  @apply flex items-center gap-1;
}

.price-percent {
  @apply text-xs text-gray-500;
}

.actions {
  @apply flex gap-2;
}

.btn-edit {
  @apply p-2 text-blue-500 hover:bg-blue-50 rounded;
}

.btn-delete {
  @apply p-2 text-red-500 hover:bg-red-50 rounded;
}

.empty-state {
  @apply text-center py-8 text-gray-500;
}
</style>