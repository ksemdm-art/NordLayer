<template>
  <section v-if="newColors.length > 0" class="new-colors-section">
    <div class="section-header">
      <h2>Новые цвета</h2>
      <p>Попробуйте наши последние цветовые решения</p>
    </div>

    <div class="colors-grid">
      <div
        v-for="color in newColors"
        :key="color.id"
        class="color-card"
        @click="selectColor(color)"
        :class="{ 'selected': selectedColorId === color.id }"
      >
        <!-- Color Preview -->
        <div 
          class="color-preview"
          :style="getColorStyle(color)"
        >
          <div 
            v-if="color.type === ColorType.METALLIC" 
            class="metallic-shine"
          ></div>
          
          <!-- New Badge -->
          <div class="new-badge-overlay">
            <span class="new-badge">НОВИНКА</span>
          </div>
        </div>

        <!-- Color Info -->
        <div class="color-info">
          <h3 class="color-name">{{ color.name }}</h3>
          <p class="color-type">{{ getTypeLabel(color.type) }}</p>
          
          <!-- Price Modifier -->
          <div 
            v-if="color.price_modifier !== 1" 
            class="price-info"
            :class="{ 'price-increase': color.price_modifier > 1 }"
          >
            {{ color.price_modifier > 1 ? '+' : '' }}{{ Math.round((color.price_modifier - 1) * 100) }}% к цене
          </div>
        </div>
      </div>
    </div>

    <!-- View All Button -->
    <div class="section-footer">
      <router-link to="/colors" class="view-all-btn">
        Посмотреть все цвета
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { colorsApi, type Color, ColorType } from '@/api/colors'
import { useColors } from '@/composables/useColors'

interface Props {
  modelValue?: number | null
  limit?: number
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'colorSelected', color: Color | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  limit: 6
})

const emit = defineEmits<Emits>()

const { getColorStyle } = useColors()

const newColors = ref<Color[]>([])
const loading = ref(false)

const selectedColorId = computed({
  get: () => props.modelValue,
  set: (value: number | null) => emit('update:modelValue', value)
})

const loadNewColors = async () => {
  loading.value = true
  try {
    newColors.value = await colorsApi.getColors(ColorType.SOLID, false)
    // Фильтруем только новые цвета (можно добавить поле is_new в API)
    newColors.value = newColors.value.slice(0, props.limit)
  } catch (error) {
    console.error('Error loading new colors:', error)
  } finally {
    loading.value = false
  }
}

const selectColor = (color: Color) => {
  const newValue = selectedColorId.value === color.id ? null : color.id
  selectedColorId.value = newValue
  emit('colorSelected', newValue ? color : null)
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

onMounted(() => {
  loadNewColors()
})
</script>

<style scoped>
.new-colors-section {
  @apply py-12 px-4;
}

.section-header {
  @apply text-center mb-8;
}

.section-header h2 {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.section-header p {
  @apply text-lg text-gray-600;
}

.colors-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8;
}

.color-card {
  @apply cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border-2 border-transparent;
}

.color-card:hover {
  @apply transform scale-105;
}

.color-card.selected {
  @apply border-blue-500 ring-2 ring-blue-200;
}

.color-preview {
  @apply w-full h-32 relative overflow-hidden;
}

.metallic-shine {
  @apply absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none;
}

.new-badge-overlay {
  @apply absolute top-2 right-2;
}

.new-badge {
  @apply px-2 py-1 text-xs bg-green-500 text-white rounded-full font-medium shadow-sm;
}

.color-info {
  @apply p-4;
}

.color-name {
  @apply text-lg font-semibold text-gray-900 mb-1;
}

.color-type {
  @apply text-sm text-gray-600 mb-2;
}

.price-info {
  @apply text-sm font-medium;
}

.price-info.price-increase {
  @apply text-orange-600;
}

.section-footer {
  @apply text-center;
}

.view-all-btn {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .colors-grid {
    @apply grid-cols-2;
  }
  
  .color-preview {
    @apply h-24;
  }
  
  .color-info {
    @apply p-3;
  }
  
  .color-name {
    @apply text-base;
  }
}
</style>