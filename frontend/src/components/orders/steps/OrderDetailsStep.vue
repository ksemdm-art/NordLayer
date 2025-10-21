<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Детали заказа</h2>
      
      <!-- Контактная информация -->
      <div class="space-y-4 mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Контактная информация</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Имя *</label>
            <input 
              v-model="localData.customerName"
              type="text" 
              placeholder="Введите ваше имя"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.customerName }"
              @input="updateData"
            />
            <p v-if="errors.customerName" class="text-red-500 text-sm mt-1">{{ errors.customerName }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input 
              v-model="localData.customerEmail"
              type="email" 
              placeholder="Введите ваш email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.customerEmail }"
              @input="updateData"
            />
            <p v-if="errors.customerEmail" class="text-red-500 text-sm mt-1">{{ errors.customerEmail }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
            <input 
              v-model="localData.customerPhone"
              type="tel" 
              placeholder="+7 (999) 123-45-67"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="updateData"
            />
          </div>
        </div>
      </div>

      <!-- Выбор цвета -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Выбор цвета</h3>
        <div v-if="loadingColors" class="text-gray-500">Загрузка цветов...</div>
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <ColorSwatch
            v-for="color in availableColors"
            :key="color.id"
            :color="color"
            :is-selected="localData.specifications.selectedColor === color.id"
            @select="selectColor"
          />
        </div>
        <p v-if="localData.specifications.color" class="text-sm text-gray-600 mt-2">
          Выбранный цвет: {{ getSelectedColorName() }}
        </p>
      </div>

      <!-- Мульти-цветная печать -->
      <div class="mb-8">
        <div class="flex items-center gap-3">
          <input
            id="multiColor"
            v-model="localData.specifications.multiColor"
            type="checkbox"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            @change="updateData"
          />
          <label for="multiColor" class="text-sm font-medium text-gray-700">
            Мульти-цветная печать (+50% к стоимости)
          </label>
        </div>
        <p class="text-sm text-gray-500 mt-1">
          Печать модели в нескольких цветах с ручной сменой филамента
        </p>
      </div>

      <!-- Дополнительные параметры -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Дополнительные параметры</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Количество</label>
            <input 
              v-model.number="localData.specifications.quantity"
              type="number" 
              min="1"
              placeholder="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="updateData"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Заполнение (%)</label>
            <select 
              v-model="localData.specifications.infill"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @change="updateData"
            >
              <option value="15">15% (быстро, экономично)</option>
              <option value="20">20% (стандарт)</option>
              <option value="50">50% (прочно)</option>
              <option value="100">100% (максимальная прочность)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Комментарии -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-2">Комментарии к заказу</label>
        <textarea 
          v-model="localData.notes"
          rows="3"
          placeholder="Дополнительные пожелания или требования..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="updateData"
        ></textarea>
      </div>
    </div>

    <!-- Навигация -->
    <div class="flex justify-between">
      <button 
        @click="$emit('previous')"
        class="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Назад
      </button>
      
      <button 
        @click="$emit('next')"
        :disabled="!isFormValid"
        class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Далее
        <ArrowRightIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/solid'
import type { OrderFormData } from '@/types/orders'
import { colorsApi, type Color } from '@/api/colors'
import ColorSwatch from '@/components/common/ColorSwatch.vue'

interface Props {
  modelValue: OrderFormData
  errors: Record<string, string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: OrderFormData]
  next: []
  previous: []
}>()

// Local reactive copy for immediate UI updates
const localData = reactive<OrderFormData>({ ...props.modelValue })

// Colors state
const availableColors = ref<Color[]>([])
const loadingColors = ref(true)

// Initialize specifications if not present
if (!localData.specifications) localData.specifications = {}
if (!localData.specifications.quantity) localData.specifications.quantity = 1
if (!localData.specifications.infill) localData.specifications.infill = 20
if (!localData.specifications.multiColor) localData.specifications.multiColor = false

const isFormValid = computed(() => {
  const hasValidContact = localData.customerName?.trim() && 
                         localData.customerEmail?.trim() && 
                         isValidEmail(localData.customerEmail)
  
  return hasValidContact
})

const updateData = () => {
  emit('update:modelValue', { ...localData })
}

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const selectColor = (color: Color) => {
  localData.specifications.selectedColor = color.id
  localData.specifications.colorName = color.name
  updateData()
}

const getSelectedColorName = (): string => {
  const selectedColor = availableColors.value.find(c => c.id === localData.specifications.selectedColor)
  return selectedColor?.name || localData.specifications.colorName || 'Неизвестный цвет'
}

const loadColors = async () => {
  try {
    loadingColors.value = true
    availableColors.value = await colorsApi.getColors()
  } catch (error) {
    console.error('Error loading colors:', error)
  } finally {
    loadingColors.value = false
  }
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  Object.assign(localData, newValue)
}, { deep: true })

onMounted(() => {
  loadColors()
})
</script>

<style scoped>
.delivery-option {
  @apply flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200;
}

.delivery-option:has(input:checked) {
  @apply border-blue-500 bg-blue-50;
}

.delivery-option-content {
  @apply flex-1;
}

.payment-option {
  @apply flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200;
}

.payment-option:has(input:checked) {
  @apply border-blue-500 bg-blue-50;
}
</style>