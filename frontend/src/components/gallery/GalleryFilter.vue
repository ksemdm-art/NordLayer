<template>
  <div class="gallery-filter">
    <!-- Search bar -->
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск проектов..."
          class="search-input"
          @input="handleSearchInput"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-search"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Filter controls -->
    <div class="filter-controls">
      <!-- Category filter -->
      <div class="filter-group">
        <label class="filter-label">Категория</label>
        <select v-model="selectedCategory" @change="handleCategoryChange" class="filter-select">
          <option value="">Все категории</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>

      <!-- Sort options -->
      <div class="filter-group">
        <label class="filter-label">Сортировка</label>
        <select v-model="sortBy" @change="handleSortChange" class="filter-select">
          <option value="created_at_desc">Сначала новые</option>
          <option value="created_at_asc">Сначала старые</option>
          <option value="title_asc">По названию (А-Я)</option>
          <option value="title_desc">По названию (Я-А)</option>
          <option value="featured">Рекомендуемые</option>
        </select>
      </div>

      <!-- View options -->
      <div class="filter-group">
        <label class="filter-label">Вид</label>
        <div class="view-toggle">
          <button
            @click="setViewMode('masonry')"
            :class="['view-button', { active: viewMode === 'masonry' }]"
            title="Сетка"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="setViewMode('list')"
            :class="['view-button', { active: viewMode === 'list' }]"
            title="Список"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Complexity filter -->
      <div class="filter-group">
        <label class="filter-label">Сложность</label>
        <div class="complexity-checkboxes">
          <label 
            v-for="complexity in complexityLevels" 
            :key="complexity.value"
            class="complexity-item"
          >
            <input
              v-model="selectedComplexityLevels"
              :value="complexity.value"
              type="checkbox"
              @change="handleComplexityChange"
              class="complexity-checkbox"
            />
            <span class="complexity-label">{{ complexity.label }}</span>
          </label>
        </div>
      </div>

      <!-- Price range filter -->
      <div class="filter-group">
        <label class="filter-label">Цена (₽)</label>
        <div class="price-inputs">
          <input
            v-model.number="minPrice"
            type="number"
            placeholder="От"
            min="0"
            @input="handlePriceChange"
            class="price-input"
          />
          <span class="price-separator">—</span>
          <input
            v-model.number="maxPrice"
            type="number"
            placeholder="До"
            min="0"
            @input="handlePriceChange"
            class="price-input"
          />
        </div>
      </div>

      <!-- Duration filter -->
      <div class="filter-group">
        <label class="filter-label">Срок (часы)</label>
        <div class="duration-inputs">
          <input
            v-model.number="minHours"
            type="number"
            placeholder="От"
            min="0"
            @input="handleDurationChange"
            class="duration-input"
          />
          <span class="duration-separator">—</span>
          <input
            v-model.number="maxHours"
            type="number"
            placeholder="До"
            min="0"
            @input="handleDurationChange"
            class="duration-input"
          />
        </div>
      </div>

      <!-- Filter toggles -->
      <div class="filter-group">
        <div class="filter-toggles">
          <label class="toggle-item">
            <input
              v-model="showOnlyFeatured"
              type="checkbox"
              @change="handleFeaturedToggle"
              class="toggle-checkbox"
            />
            <span class="toggle-label">Только рекомендуемые</span>
          </label>
          
          <label class="toggle-item">
            <input
              v-model="showOnlyWith3D"
              type="checkbox"
              @change="handle3DToggle"
              class="toggle-checkbox"
            />
            <span class="toggle-label">Только с 3D моделями</span>
          </label>
        </div>
      </div>

      <!-- Clear filters -->
      <div class="filter-group">
        <button 
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="clear-filters-button"
        >
          <svg class="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Очистить
        </button>
      </div>
    </div>

    <!-- Active filters display -->
    <div v-if="activeFilters.length > 0" class="active-filters">
      <span class="active-filters-label">Активные фильтры:</span>
      <div class="filter-tags">
        <span
          v-for="filter in activeFilters"
          :key="filter.key"
          class="filter-tag"
        >
          {{ filter.label }}
          <button @click="removeFilter(filter.key)" class="remove-filter">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

export interface FilterOptions {
  search: string
  category: string
  sortBy: string
  viewMode: 'masonry' | 'list'
  showOnlyFeatured: boolean
  showOnlyWith3D: boolean
  complexityLevels: string[]
  minPrice?: number
  maxPrice?: number
  minHours?: number
  maxHours?: number
}

interface FilterTag {
  key: string
  label: string
}

const emit = defineEmits<{
  'filter-change': [filters: FilterOptions]
  'view-change': [viewMode: 'masonry' | 'list']
}>()

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('created_at_desc')
const viewMode = ref<'masonry' | 'list'>('masonry')
const showOnlyFeatured = ref(false)
const showOnlyWith3D = ref(false)
const selectedComplexityLevels = ref<string[]>([])
const minPrice = ref<number>()
const maxPrice = ref<number>()
const minHours = ref<number>()
const maxHours = ref<number>()

const categories = [
  { value: 'miniatures', label: 'Миниатюры' },
  { value: 'prototypes', label: 'Прототипы' },
  { value: 'decorative', label: 'Декоративные' },
  { value: 'functional', label: 'Функциональные' },
  { value: 'architectural', label: 'Архитектурные' },
  { value: 'jewelry', label: 'Ювелирные' },
  { value: 'automotive', label: 'Автомобильные' },
  { value: 'medical', label: 'Медицинские' }
]

const complexityLevels = [
  { value: 'simple', label: 'Простой' },
  { value: 'medium', label: 'Средний' },
  { value: 'complex', label: 'Сложный' }
]

const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategory.value || 
         sortBy.value !== 'created_at_desc' ||
         showOnlyFeatured.value ||
         showOnlyWith3D.value ||
         selectedComplexityLevels.value.length > 0 ||
         minPrice.value !== undefined ||
         maxPrice.value !== undefined ||
         minHours.value !== undefined ||
         maxHours.value !== undefined
})

const activeFilters = computed((): FilterTag[] => {
  const filters: FilterTag[] = []
  
  if (searchQuery.value) {
    filters.push({ key: 'search', label: `Поиск: "${searchQuery.value}"` })
  }
  
  if (selectedCategory.value) {
    const category = categories.find(c => c.value === selectedCategory.value)
    filters.push({ key: 'category', label: `Категория: ${category?.label}` })
  }
  
  if (sortBy.value !== 'created_at_desc') {
    const sortLabels: Record<string, string> = {
      'created_at_asc': 'Сначала старые',
      'title_asc': 'По названию (А-Я)',
      'title_desc': 'По названию (Я-А)',
      'featured': 'Рекомендуемые'
    }
    filters.push({ key: 'sortBy', label: `Сортировка: ${sortLabels[sortBy.value]}` })
  }
  
  if (showOnlyFeatured.value) {
    filters.push({ key: 'featured', label: 'Только рекомендуемые' })
  }
  
  if (showOnlyWith3D.value) {
    filters.push({ key: '3d', label: 'Только с 3D моделями' })
  }
  
  if (selectedComplexityLevels.value.length > 0) {
    const complexityLabels = selectedComplexityLevels.value.map(level => {
      const complexity = complexityLevels.find(c => c.value === level)
      return complexity?.label || level
    }).join(', ')
    filters.push({ key: 'complexity', label: `Сложность: ${complexityLabels}` })
  }
  
  if (minPrice.value !== undefined || maxPrice.value !== undefined) {
    let priceLabel = 'Цена: '
    if (minPrice.value !== undefined && maxPrice.value !== undefined) {
      priceLabel += `${minPrice.value} - ${maxPrice.value} ₽`
    } else if (minPrice.value !== undefined) {
      priceLabel += `от ${minPrice.value} ₽`
    } else if (maxPrice.value !== undefined) {
      priceLabel += `до ${maxPrice.value} ₽`
    }
    filters.push({ key: 'price', label: priceLabel })
  }
  
  if (minHours.value !== undefined || maxHours.value !== undefined) {
    let durationLabel = 'Срок: '
    if (minHours.value !== undefined && maxHours.value !== undefined) {
      durationLabel += `${minHours.value} - ${maxHours.value} ч`
    } else if (minHours.value !== undefined) {
      durationLabel += `от ${minHours.value} ч`
    } else if (maxHours.value !== undefined) {
      durationLabel += `до ${maxHours.value} ч`
    }
    filters.push({ key: 'duration', label: durationLabel })
  }
  
  return filters
})

const emitFilterChange = () => {
  const filters: FilterOptions = {
    search: searchQuery.value,
    category: selectedCategory.value,
    sortBy: sortBy.value,
    viewMode: viewMode.value,
    showOnlyFeatured: showOnlyFeatured.value,
    showOnlyWith3D: showOnlyWith3D.value,
    complexityLevels: selectedComplexityLevels.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    minHours: minHours.value,
    maxHours: maxHours.value
  }
  emit('filter-change', filters)
}

const handleSearchInput = () => {
  emitFilterChange()
}

const handleCategoryChange = () => {
  emitFilterChange()
}

const handleSortChange = () => {
  emitFilterChange()
}

const handleFeaturedToggle = () => {
  emitFilterChange()
}

const handle3DToggle = () => {
  emitFilterChange()
}

const handleComplexityChange = () => {
  emitFilterChange()
}

const handlePriceChange = () => {
  emitFilterChange()
}

const handleDurationChange = () => {
  emitFilterChange()
}

const setViewMode = (mode: 'masonry' | 'list') => {
  viewMode.value = mode
  emit('view-change', mode)
  emitFilterChange()
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilterChange()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  sortBy.value = 'created_at_desc'
  showOnlyFeatured.value = false
  showOnlyWith3D.value = false
  selectedComplexityLevels.value = []
  minPrice.value = undefined
  maxPrice.value = undefined
  minHours.value = undefined
  maxHours.value = undefined
  emitFilterChange()
}

const removeFilter = (key: string) => {
  switch (key) {
    case 'search':
      searchQuery.value = ''
      break
    case 'category':
      selectedCategory.value = ''
      break
    case 'sortBy':
      sortBy.value = 'created_at_desc'
      break
    case 'featured':
      showOnlyFeatured.value = false
      break
    case '3d':
      showOnlyWith3D.value = false
      break
    case 'complexity':
      selectedComplexityLevels.value = []
      break
    case 'price':
      minPrice.value = undefined
      maxPrice.value = undefined
      break
    case 'duration':
      minHours.value = undefined
      maxHours.value = undefined
      break
  }
  emitFilterChange()
}
</script>

<style scoped>
.gallery-filter {
  @apply bg-white rounded-lg shadow-soft p-4 sm:p-6 mb-8 border border-primary-100;
}

.search-container {
  @apply mb-6;
}

.search-input-wrapper {
  @apply relative max-w-md;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400;
}

.search-input {
  @apply w-full pl-10 pr-10 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 bg-white;
}

.clear-search {
  @apply absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400 hover:text-primary-600;
}

.filter-controls {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end;
}

.filter-group {
  @apply space-y-2;
}

.filter-label {
  @apply block text-sm font-medium text-primary-700;
}

.filter-select {
  @apply w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200 bg-white text-primary-800;
}

.view-toggle {
  @apply flex space-x-1 border border-primary-300 rounded-lg p-1 bg-white;
}

.view-button {
  @apply flex-1 flex items-center justify-center p-2 rounded text-primary-600 hover:text-primary-800 hover:bg-primary-50 transition-colors duration-200;
}

.view-button.active {
  @apply bg-primary-900 text-primary-50 shadow-sm;
}

.view-button svg {
  @apply w-5 h-5;
}

.filter-toggles {
  @apply space-y-2;
}

.toggle-item {
  @apply flex items-center space-x-2 cursor-pointer;
}

.toggle-checkbox {
  @apply w-4 h-4 text-accent-500 border-primary-300 rounded focus:ring-accent-500;
}

.toggle-label {
  @apply text-sm text-primary-700;
}

.clear-filters-button {
  @apply w-full flex items-center justify-center space-x-2 px-4 py-2 text-error-600 hover:text-error-700 hover:bg-error-50 rounded-lg transition-colors duration-200 border border-error-200 hover:border-error-300 font-medium;
}

.clear-icon {
  @apply w-4 h-4;
}

.active-filters {
  @apply mt-4 pt-4 border-t border-primary-200;
}

.active-filters-label {
  @apply text-sm font-medium text-primary-700 mb-2 block;
}

.filter-tags {
  @apply flex flex-wrap gap-2;
}

.filter-tag {
  @apply inline-flex items-center space-x-1 bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm border border-accent-200;
}

.remove-filter {
  @apply w-4 h-4 text-accent-600 hover:text-accent-800;
}

.complexity-checkboxes {
  @apply space-y-1;
}

.complexity-item {
  @apply flex items-center space-x-2 cursor-pointer;
}

.complexity-checkbox {
  @apply w-4 h-4 text-accent-500 border-primary-300 rounded focus:ring-accent-500;
}

.complexity-label {
  @apply text-sm text-primary-700;
}

.price-inputs, .duration-inputs {
  @apply flex items-center space-x-2 w-full;
}

.price-input, .duration-input {
  @apply flex-1 px-3 py-2 border border-primary-300 rounded-lg text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500 bg-white text-primary-800 transition-colors duration-200 min-w-0;
}

.price-separator, .duration-separator {
  @apply text-primary-400 text-sm font-medium flex-shrink-0;
}

/* Адаптивные стили */
@media (max-width: 640px) {
  .filter-controls {
    @apply grid-cols-1 gap-4;
  }
  
  .price-inputs, .duration-inputs {
    @apply flex-col space-x-0 space-y-2;
  }
  
  .price-separator, .duration-separator {
    @apply self-center;
  }
  
  .view-toggle {
    @apply w-full;
  }
}

@media (max-width: 480px) {
  .gallery-filter {
    @apply p-3 rounded-md;
  }
  
  .search-input-wrapper {
    @apply max-w-full;
  }
}
</style>