<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'Редактировать цвет' : 'Создать цвет' }}</h2>
        <button @click="$emit('close')" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Basic Info -->
        <div class="form-section">
          <h3>Основная информация</h3>
          
          <div class="form-group">
            <label for="name">Название цвета *</label>
            <input 
              id="name"
              v-model="formData.name" 
              type="text" 
              required
              placeholder="Например: Красный металлик"
            />
          </div>

          <div class="form-group">
            <label for="type">Тип цвета *</label>
            <select id="type" v-model="formData.type" required @change="onTypeChange">
              <option value="solid">Обычный цвет</option>
              <option value="gradient">Градиент</option>
              <option value="metallic">Металлик</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="sort_order">Порядок сортировки</label>
              <input 
                id="sort_order"
                v-model.number="formData.sort_order" 
                type="number" 
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="price_modifier">Модификатор цены</label>
              <input 
                id="price_modifier"
                v-model.number="formData.price_modifier" 
                type="number" 
                min="0.1"
                step="0.1"
              />
              <small>1.0 = без изменений, 1.2 = +20% к цене</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="formData.is_active"
                />
                Доступен для заказа
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  v-model="formData.is_new"
                />
                Отметить как новинку
              </label>
            </div>
          </div>
        </div>

        <!-- Color Type Specific Fields -->
        <div class="form-section">
          <h3>Настройки цвета</h3>

          <!-- Solid Color -->
          <div v-if="formData.type === ColorType.SOLID" class="color-config">
            <div class="form-group">
              <label for="hex_code">Цвет (HEX) *</label>
              <div class="color-input-group">
                <input 
                  id="hex_code"
                  v-model="formData.hex_code" 
                  type="text" 
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#FF0000"
                  required
                />
                <input 
                  type="color" 
                  :value="formData.hex_code || '#000000'"
                  @input="formData.hex_code = ($event.target as HTMLInputElement).value"
                  class="color-picker"
                />
              </div>
            </div>
          </div>

          <!-- Gradient Color -->
          <div v-else-if="formData.type === ColorType.GRADIENT" class="color-config">
            <div class="form-group">
              <label>Направление градиента</label>
              <select v-model="formData.gradient_direction">
                <option value="linear">Линейный</option>
                <option value="radial">Радиальный</option>
              </select>
            </div>

            <div class="form-group">
              <label>Цвета градиента *</label>
              <div class="gradient-stops">
                <div 
                  v-for="(stop, index) in formData.gradient_colors" 
                  :key="index"
                  class="gradient-stop"
                >
                  <input 
                    type="color" 
                    v-model="stop.color"
                    class="color-picker"
                  />
                  <input 
                    type="number" 
                    v-model.number="stop.position"
                    min="0" 
                    max="100"
                    class="position-input"
                  />
                  <span>%</span>
                  <button 
                    type="button"
                    @click="removeGradientStop(index)"
                    class="remove-stop"
                    :disabled="formData.gradient_colors.length <= 2"
                  >
                    ×
                  </button>
                </div>
              </div>
              <button 
                type="button" 
                @click="addGradientStop"
                class="add-stop"
              >
                + Добавить цвет
              </button>
            </div>
          </div>

          <!-- Metallic Color -->
          <div v-else-if="formData.type === ColorType.METALLIC" class="color-config">
            <div class="form-group">
              <label for="metallic_base">Базовый цвет *</label>
              <div class="color-input-group">
                <input 
                  id="metallic_base"
                  v-model="formData.metallic_base" 
                  type="text" 
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#C0C0C0"
                  required
                />
                <input 
                  type="color" 
                  :value="formData.metallic_base || '#C0C0C0'"
                  @input="formData.metallic_base = ($event.target as HTMLInputElement).value"
                  class="color-picker"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="metallic_intensity">Интенсивность металлика</label>
              <input 
                id="metallic_intensity"
                v-model.number="formData.metallic_intensity" 
                type="range" 
                min="0" 
                max="1" 
                step="0.1"
              />
              <span class="intensity-value">{{ formData.metallic_intensity }}</span>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="form-section">
          <h3>Предварительный просмотр</h3>
          <div class="color-preview-section">
            <div 
              class="color-preview-large"
              :style="getPreviewStyle()"
            >
              <div 
                v-if="formData.type === ColorType.METALLIC" 
                class="metallic-shine"
              ></div>
            </div>
            <div class="preview-info">
              <p><strong>{{ formData.name || 'Название цвета' }}</strong></p>
              <p>Тип: {{ getTypeLabel(formData.type) }}</p>
              <p v-if="formData.price_modifier !== 1">
                Изменение цены: {{ Math.round((formData.price_modifier - 1) * 100) }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="modal-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Отмена
          </button>
          <button type="submit" class="btn-save">
            {{ isEdit ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ColorType, type Color, type GradientStop } from '@/api/colors'

interface Props {
  color?: Color | null
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: Partial<Color>): void
}

const props = withDefaults(defineProps<Props>(), {
  color: null,
  isEdit: false
})

const emit = defineEmits<Emits>()

const formData = reactive({
  name: '',
  type: ColorType.SOLID,
  is_active: true,
  is_new: false,
  sort_order: 0,
  price_modifier: 1.0,
  hex_code: '#000000',
  gradient_colors: [
    { color: '#FF0000', position: 0 },
    { color: '#0000FF', position: 100 }
  ] as GradientStop[],
  gradient_direction: 'linear',
  metallic_base: '#C0C0C0',
  metallic_intensity: 0.5
})

// Initialize form data
if (props.color) {
  Object.assign(formData, props.color)
  if (props.color.type === ColorType.GRADIENT && props.color.gradient_colors) {
    formData.gradient_colors = [...props.color.gradient_colors]
  }
}

const onTypeChange = () => {
  // Reset type-specific fields when type changes
  if (formData.type === ColorType.SOLID) {
    formData.hex_code = '#000000'
  } else if (formData.type === ColorType.GRADIENT) {
    if (!formData.gradient_colors || formData.gradient_colors.length < 2) {
      formData.gradient_colors = [
        { color: '#FF0000', position: 0 },
        { color: '#0000FF', position: 100 }
      ]
    }
    formData.gradient_direction = 'linear'
  } else if (formData.type === ColorType.METALLIC) {
    formData.metallic_base = '#C0C0C0'
    formData.metallic_intensity = 0.5
  }
}

const addGradientStop = () => {
  const newPosition = formData.gradient_colors.length > 0 
    ? Math.max(...formData.gradient_colors.map(s => s.position)) + 10
    : 50
  
  formData.gradient_colors.push({
    color: '#000000',
    position: Math.min(newPosition, 100)
  })
}

const removeGradientStop = (index: number) => {
  if (formData.gradient_colors.length > 2) {
    formData.gradient_colors.splice(index, 1)
  }
}

const getPreviewStyle = (): Record<string, string> => {
  if (formData.type === ColorType.SOLID) {
    return { backgroundColor: formData.hex_code }
  } else if (formData.type === ColorType.GRADIENT) {
    const stops = formData.gradient_colors
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')
    
    const direction = formData.gradient_direction === 'radial' ? 'radial-gradient' : 'linear-gradient'
    return { background: `${direction}(${stops})` }
  } else if (formData.type === ColorType.METALLIC) {
    const baseColor = formData.metallic_base
    const intensity = formData.metallic_intensity
    
    return {
      background: `linear-gradient(135deg, ${baseColor} 0%, #ffffff${Math.round(intensity * 255).toString(16).padStart(2, '0')} 50%, ${baseColor} 100%)`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,${intensity})`
    }
  }
  
  return { backgroundColor: '#cccccc' }
}

const getTypeLabel = (type: ColorType): string => {
  switch (type) {
    case ColorType.SOLID:
      return 'Обычный цвет'
    case ColorType.GRADIENT:
      return 'Градиентный цвет'
    case ColorType.METALLIC:
      return 'Металлический цвет'
    default:
      return 'Неизвестный тип'
  }
}

const handleSubmit = () => {
  const baseData = {
    name: formData.name,
    type: formData.type,
    is_active: formData.is_active,
    is_new: formData.is_new,
    sort_order: formData.sort_order,
    price_modifier: formData.price_modifier
  }

  let submitData: Partial<Color>

  if (formData.type === ColorType.SOLID) {
    submitData = {
      ...baseData,
      hex_code: formData.hex_code
    }
  } else if (formData.type === ColorType.GRADIENT) {
    submitData = {
      ...baseData,
      gradient_colors: formData.gradient_colors,
      gradient_direction: formData.gradient_direction as 'linear' | 'radial'
    }
  } else if (formData.type === ColorType.METALLIC) {
    submitData = {
      ...baseData,
      metallic_base: formData.metallic_base,
      metallic_intensity: formData.metallic_intensity
    }
  } else {
    submitData = baseData
  }

  emit('save', submitData)
}
</script>

<style scoped lang="postcss">
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex justify-between items-center p-6 border-b border-gray-200;
}

.modal-header h2 {
  @apply text-xl font-semibold text-gray-900;
}

.close-btn {
  @apply p-1 text-gray-400 hover:text-gray-600;
}

.modal-body {
  @apply p-6 space-y-6;
}

.form-section {
  @apply space-y-4;
}

.form-section h3 {
  @apply text-lg font-medium text-gray-900 border-b border-gray-200 pb-2;
}

.form-group {
  @apply space-y-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700;
}

.form-group .checkbox-label {
  @apply flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700;
}

.form-group input[type="checkbox"] {
  @apply w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500;
}

.form-group input, .form-group select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.form-group small {
  @apply text-xs text-gray-500;
}

.form-row {
  @apply grid grid-cols-2 gap-4;
}

.color-input-group {
  @apply flex gap-2;
}

.color-input-group input[type="text"] {
  @apply flex-1;
}

.color-picker {
  @apply w-12 h-10 border border-gray-300 rounded cursor-pointer;
}

.gradient-stops {
  @apply space-y-2;
}

.gradient-stop {
  @apply flex items-center gap-2;
}

.position-input {
  @apply w-16;
}

.remove-stop {
  @apply w-8 h-8 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.add-stop {
  @apply px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200;
}

.intensity-value {
  @apply ml-2 text-sm text-gray-600;
}

.color-preview-section {
  @apply flex items-center gap-4;
}

.color-preview-large {
  @apply w-24 h-16 rounded-lg border border-gray-200 relative overflow-hidden;
}

.metallic-shine {
  @apply absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent;
}

.preview-info {
  @apply flex-1 space-y-1;
}

.preview-info p {
  @apply text-sm text-gray-600;
}

.modal-actions {
  @apply flex justify-end gap-3 pt-4 border-t border-gray-200;
}

.btn-cancel {
  @apply px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50;
}

.btn-save {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600;
}
</style>