<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-neutral-200">
      <h2 class="text-2xl font-bold text-neutral-900">Детали заказа</h2>
      <p class="text-neutral-600 mt-2">Укажите ваши контактные данные и параметры печати</p>
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Information -->
          <div class="form-section">
            <h3 class="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              Контактная информация
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Имя и фамилия *
                </label>
                <input
                  v-model="localData.customerName"
                  type="text"
                  placeholder="Введите ваше имя"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
                  @input="updateData"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-neutral-700 mb-2">
                  Телефон
                </label>
                <input
                  v-model="localData.customerPhone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
                  @input="updateData"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Email *
              </label>
              <input
                v-model="localData.customerEmail"
                type="email"
                placeholder="your@email.com"
                class="w-full px-4 py-2.5 border border-neutral-300 rounded-lg bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-all duration-200"
                @input="updateData"
              />
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="form-section">
            <h3 class="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              Доставка
            </h3>
            
            <div class="space-y-3">
              <label class="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  v-model="localData.specifications.deliveryMethod"
                  @change="updateData"
                  class="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <div class="delivery-option-content">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="font-medium">Самовывоз</span>
                    <span class="text-green-600 font-medium">Бесплатно</span>
                  </div>
                  <p class="text-sm text-neutral-600">Забрать в нашем офисе</p>
                </div>
              </label>
              
              <label class="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="courier"
                  v-model="localData.specifications.deliveryMethod"
                  @change="updateData"
                  class="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <div class="delivery-option-content">
                  <div class="flex items-center gap-3 mb-1">
                    <span class="font-medium">Курьер по городу</span>
                    <span class="text-neutral-600 font-medium">300₽</span>
                  </div>
                  <p class="text-sm text-neutral-600">Доставка в течение дня</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="form-section">
            <h3 class="text-lg font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-200">
              Способ оплаты
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  v-model="localData.specifications.paymentMethod"
                  @change="updateData"
                  class="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <div>
                  <span class="font-medium">Банковская карта</span>
                  <p class="text-sm text-neutral-600">Visa, MasterCard, МИР</p>
                </div>
              </label>
              
              <label class="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  v-model="localData.specifications.paymentMethod"
                  @change="updateData"
                  class="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <div>
                  <span class="font-medium">Наличные</span>
                  <p class="text-sm text-neutral-600">При получении</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 rounded-lg shadow-lg overflow-hidden sticky top-6">
            <div class="px-4 py-3 border-b border-primary-200">
              <h3 class="text-lg font-semibold text-primary-900">Информация о заказе</h3>
            </div>
            
            <div class="p-4 space-y-4">
              <div class="text-sm text-primary-800">
                <p class="mb-2">Услуг выбрано: {{ modelValue.services?.length || 0 }}</p>
                <p class="mb-2">Файлов загружено: {{ modelValue.files?.length || 0 }}</p>
                <p v-if="modelValue.selectedGalleryItems?.length && modelValue.selectedGalleryItems.length > 0" class="mb-2">
                  Моделей из галереи: {{ modelValue.selectedGalleryItems.length }}
                </p>
                <p v-if="modelValue.services?.[0]" class="font-medium">
                  Услуга: {{ modelValue.services[0].name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
      <div class="flex justify-between">
        <button 
          type="button"
          @click="$emit('previous')"
          class="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-all duration-200"
        >
          Назад
        </button>
        
        <button 
          type="button"
          @click="$emit('next')"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200"
        >
          Далее
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { OrderFormData } from '@/types/orders'

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

// Initialize specifications if not present
if (!localData.specifications) localData.specifications = {}
if (!localData.specifications.deliveryMethod) localData.specifications.deliveryMethod = 'pickup'
if (!localData.specifications.paymentMethod) localData.specifications.paymentMethod = 'card'

const updateData = () => {
  emit('update:modelValue', { ...localData })
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  Object.assign(localData, newValue)
}, { deep: true })
</script>

<style scoped>
.delivery-option {
  @apply flex items-start gap-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all duration-200;
}

.delivery-option:has(input:checked) {
  @apply border-primary-500 bg-primary-50;
}

.delivery-option-content {
  @apply flex-1;
}

.payment-option {
  @apply flex items-center gap-3 p-4 border-2 border-neutral-200 rounded-lg cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all duration-200;
}

.payment-option:has(input:checked) {
  @apply border-primary-500 bg-primary-50;
}
</style>