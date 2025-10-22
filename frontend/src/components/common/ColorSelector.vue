<template>
  <div class="color-selector">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Загрузка цветов...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span>{{ error }}</span>
      <button @click="loadAllColors" class="retry-btn">
        Повторить
      </button>
    </div>

    <!-- Color Grid -->
    <div v-else class="color-grid">
      <div
        v-for="color in filteredColors"
        :key="color.id"
        class="color-option"
        :class="{ 
          'selected': selectedColorId === color.id,
          [`color-type-${color.type}`]: true
        }"
        @click="selectColor(color)"
        :title="getColorTooltip(color)"
      >
        <!-- Color Preview -->
        <div 
          class="color-preview"
          :style="getColorStyle(color)"
        >
          <!-- Metallic shine effect -->
          <div 
            v-if="color.type === ColorType.METALLIC" 
            class="metallic-shine"
          ></div>
          
          <!-- NEW Badge -->
          <div v-if="color.is_new" class="new-badge-overlay">
            NEW
          </div>
          
          <!-- Selection indicator -->
          <div v-if="selectedColorId === color.id" class="selection-indicator">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Color Info -->
        <div class="color-info">
          <span class="color-name">{{ color.name }}</span>
          
          <!-- Price Modifier -->
          <span 
            v-if="color.price_modifier !== 1 && showPriceModifier" 
            class="price-modifier"
            :class="{ 'price-increase': color.price_modifier > 1 }"
          >
            {{ color.price_modifier > 1 ? '+' : '' }}{{ Math.round((color.price_modifier - 1) * 100) }}%
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredColors.length === 0" class="empty-state">
        <span>Нет доступных цветов</span>
      </div>
    </div>

    <!-- Selected Color Preview -->
    <div v-if="selectedColor" class="selected-color-preview">
      <h4>Выбранный цвет:</h4>
      <div class="preview-card">
        <div 
          class="preview-color"
          :style="getColorStyle(selectedColor)"
        >
          <div 
            v-if="selectedColor.type === ColorType.METALLIC" 
            class="metallic-shine"
          ></div>
        </div>
        <div class="preview-info">
          <span class="preview-name">{{ selectedColor.name }}</span>
          <span class="preview-type">{{ getTypeLabel(selectedColor.type) }}</span>
          <span 
            v-if="selectedColor.price_modifier !== 1 && showPriceModifier"
            class="preview-price"
          >
            Изменение цены: {{ selectedColor.price_modifier > 1 ? '+' : '' }}{{ Math.round((selectedColor.price_modifier - 1) * 100) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useColors } from '@/composables/useColors'
import { colorsApi, type Color, ColorType } from '@/api/colors'

interface Props {
  modelValue?: number | null
  showPriceModifier?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'colorSelected', color: Color | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  showPriceModifier: true,
  disabled: false
})

const emit = defineEmits<Emits>()

const { 
  loading, 
  getColorStyle: getColorStyleFromComposable
} = useColors()

const allColors = ref<Color[]>([])
const error = ref<string | null>(null)

const selectedColorId = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const filteredColors = computed(() => {
  return allColors.value.filter(color => color.is_active)
})

const selectedColor = computed(() => {
  if (!selectedColorId.value) return null
  return allColors.value.find(color => color.id === selectedColorId.value) || null
})

const loadAllColors = async () => {
  error.value = null
  try {
    allColors.value = await colorsApi.getColors()
  } catch (err) {
    error.value = 'Ошибка загрузки цветов'
    console.error('Error loading colors:', err)
  }
}

const selectColor = (color: Color) => {
  if (props.disabled) return
  
  const newValue = selectedColorId.value === color.id ? null : color.id
  selectedColorId.value = newValue
  emit('colorSelected', newValue ? color : null)
}

const getColorStyle = (color: Color): Record<string, string> => {
  return getColorStyleFromComposable(color)
}

const getColorTooltip = (color: Color): string => {
  let tooltip = `${color.name} (${getTypeLabel(color.type)})`
  
  if (color.price_modifier !== 1 && props.showPriceModifier) {
    const modifier = Math.round((color.price_modifier - 1) * 100)
    tooltip += ` - ${modifier > 0 ? '+' : ''}${modifier}% к цене`
  }
  
  return tooltip
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

// Load initial colors
onMounted(() => {
  loadAllColors()
})
</script>

<style scoped>
.color-selector {
  @apply w-full;
}

.loading-state, .error-state {
  @apply flex items-center justify-center gap-2 py-8 text-gray-500;
}

.spinner {
  @apply w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin;
}

.retry-btn {
  @apply px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
}

.color-grid {
  @apply grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3;
}

.color-option {
  @apply cursor-pointer border-2 border-transparent rounded-lg p-2 hover:border-gray-300 transition-all;
  min-width: 80px;
}

.color-option.selected {
  @apply border-blue-500 ring-2 ring-blue-200;
}

.color-option:hover:not(.selected) {
  @apply transform scale-105;
}

.color-preview {
  @apply w-12 h-12 rounded-full border border-gray-200 relative mb-2 flex items-center justify-center mx-auto;
  margin-top: 8px;
  margin-bottom: 12px;
}

.metallic-shine {
  @apply absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none;
}

.new-badge-overlay {
  @apply absolute bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center;
  top: -4px;
  right: -4px;
  font-size: 9px;
  min-width: 26px;
  height: 18px;
  line-height: 1;
}

.selection-indicator {
  @apply absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded-full;
}

.color-info {
  @apply text-center;
}

.color-name {
  @apply text-sm font-medium text-gray-900 block leading-tight;
  word-wrap: break-word;
  hyphens: auto;
}

.price-modifier {
  @apply inline-block text-xs px-1 py-0.5 rounded bg-gray-100 text-gray-600 mt-1;
}

.price-modifier.price-increase {
  @apply bg-orange-100 text-orange-600;
}

.empty-state {
  @apply col-span-full text-center py-8 text-gray-500;
}

.selected-color-preview {
  @apply mt-4 p-3 bg-gray-50 rounded-lg;
}

.selected-color-preview h4 {
  @apply text-base font-semibold mb-2;
}

.preview-card {
  @apply flex items-center gap-3;
}

.preview-color {
  @apply w-12 h-12 rounded-lg border border-gray-200 relative overflow-hidden flex-shrink-0;
}

.preview-info {
  @apply flex flex-col gap-1;
}

.preview-name {
  @apply font-medium text-gray-900;
}

.preview-type {
  @apply text-sm text-gray-600;
}

.preview-price {
  @apply text-sm text-orange-600 font-medium;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .color-grid {
    @apply grid-cols-3 gap-2;
  }
  
  .color-option {
    min-width: 80px;
    @apply p-2;
  }
  
  .color-preview {
    @apply w-10 h-10;
    margin-top: 6px;
    margin-bottom: 10px;
  }
  
  .color-name {
    @apply text-xs;
  }
}
</style>