<template>
  <Card class="max-w-4xl mx-auto">
    <template #header>
      <h2 class="text-2xl font-bold text-neutral-900">Подтверждение заказа</h2>
      <p class="text-neutral-600 mt-2">Проверьте все детали заказа перед отправкой</p>
    </template>

    <div class="space-y-8">
      <!-- Order Summary -->
      <div class="order-summary">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Service Information -->
            <div class="summary-section">
              <h3 class="summary-title">Выбранные услуги ({{ modelValue.services?.length || 0 }})</h3>
              <div class="space-y-3">
                <Card 
                  v-for="service in modelValue.services" 
                  :key="service.id"
                  variant="outlined" 
                  class="bg-primary-50 border-primary-200"
                >
                  <div class="flex items-center gap-4">
                    <div class="service-icon">
                      <CubeIcon class="w-6 h-6" />
                    </div>
                    <div class="flex-1">
                      <h4 class="text-lg font-semibold text-primary-900">{{ service.name }}</h4>
                      <p class="text-primary-700 text-sm">{{ service.description }}</p>
                    </div>

                  </div>
                </Card>
                <div v-if="!modelValue.services?.length" class="text-gray-500 text-center py-4">
                  Услуги не выбраны
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="summary-section">
              <h3 class="summary-title">Контактная информация</h3>
              <Card variant="outlined">
                <div class="space-y-3">
                  <div class="contact-item">
                    <UserIcon class="w-4 h-4 text-neutral-500" />
                    <span class="contact-label">Имя:</span>
                    <span class="contact-value">{{ modelValue.customerName }}</span>
                  </div>
                  <div class="contact-item">
                    <EnvelopeIcon class="w-4 h-4 text-neutral-500" />
                    <span class="contact-label">Email:</span>
                    <span class="contact-value">{{ modelValue.customerEmail }}</span>
                  </div>
                  <div class="contact-item">
                    <PhoneIcon class="w-4 h-4 text-neutral-500" />
                    <span class="contact-label">Телефон:</span>
                    <span class="contact-value">{{ modelValue.customerPhone || 'Не указан' }}</span>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Files and Gallery Items -->
            <div class="summary-section">
              <h3 class="summary-title">Файлы для печати ({{ totalItemsCount }})</h3>
              <Card variant="outlined">
                <div class="space-y-3">
                  <!-- Uploaded Files -->
                  <div 
                    v-for="file in modelValue.files" 
                    :key="`file-${file.id}`"
                    class="file-item"
                  >
                    <DocumentIcon class="w-5 h-5 text-primary-500" />
                    <div class="file-info">
                      <span class="file-name">{{ file.filename }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="previewFile(file)"
                      class="text-primary-600"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <!-- Gallery Items -->
                  <div 
                    v-for="item in modelValue.selectedGalleryItems" 
                    :key="`gallery-${item.id}`"
                    class="file-item"
                  >
                    <div class="w-5 h-5 flex-shrink-0">
                      <img 
                        v-if="item.images?.[0]?.url" 
                        :src="item.images[0].url" 
                        :alt="item.title"
                        class="w-5 h-5 object-cover rounded"
                      />
                      <DocumentIcon v-else class="w-5 h-5 text-primary-500" />
                    </div>
                    <div class="file-info">
                      <span class="file-name">{{ item.title }}</span>
                      <span class="file-size">Из галереи</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="previewGalleryItem(item)"
                      class="text-primary-600"
                    >
                      <EyeIcon class="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <!-- Empty state -->
                  <div v-if="totalItemsCount === 0" class="text-gray-500 text-center py-4">
                    Файлы не загружены
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Order Details -->
            <div class="summary-section">
              <h3 class="summary-title">Детали заказа</h3>
              <Card variant="outlined">
                <div class="specs-grid">
                  <!-- Color display -->
                  <div v-if="!modelValue.specifications.isMultiColor && modelValue.specifications.selectedColor" class="spec-item">
                    <span class="spec-label">Цвет:</span>
                    <div class="flex items-center gap-2">
                      <div 
                        class="color-preview"
                        :style="{ backgroundColor: getSelectedColorHex() }"
                      />
                      <span class="spec-value">{{ getSelectedColorName() }}</span>
                    </div>
                  </div>
                  
                  <!-- Multi-color display -->
                  <div v-if="modelValue.specifications.isMultiColor && modelValue.specifications.multiColors?.length" class="spec-item full-width">
                    <span class="spec-label">Многоцветная печать:</span>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <div 
                        v-for="(colorId, index) in modelValue.specifications.multiColors" 
                        :key="colorId"
                        class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"
                      >
                        <span class="text-xs font-bold text-blue-600">{{ index + 1 }}</span>
                        <div 
                          class="color-preview"
                          :style="{ backgroundColor: getColorHexById(colorId) }"
                        />
                        <span class="text-sm text-blue-800">{{ getColorNameById(colorId) }}</span>
                      </div>
                    </div>
                    <p class="text-xs text-orange-600 mt-1">+50% к стоимости</p>
                  </div>
                  
                  <!-- Delivery Information -->
                  <div class="spec-item">
                    <span class="spec-label">Получение заказа:</span>
                    <span class="spec-value">{{ modelValue.deliveryNeeded ? 'С доставкой' : 'Самовывоз' }}</span>
                  </div>
                  

                  
                  <!-- Alternative Contact -->
                  <div v-if="modelValue.alternativeContact?.trim()" class="spec-item">
                    <span class="spec-label">Альтернативная связь:</span>
                    <span class="spec-value">{{ modelValue.alternativeContact }}</span>
                  </div>
                </div>
              </Card>
            </div>

            <!-- Delivery Details -->
            <div v-if="modelValue.deliveryNeeded && modelValue.deliveryDetails?.trim()" class="summary-section">
              <h3 class="summary-title">Детали доставки</h3>
              <Card variant="outlined">
                <p class="text-neutral-700 text-sm leading-relaxed">{{ modelValue.deliveryDetails }}</p>
              </Card>
            </div>

            <!-- Additional Notes -->
            <div v-if="modelValue.notes" class="summary-section">
              <h3 class="summary-title">Дополнительные пожелания</h3>
              <Card variant="outlined">
                <p class="text-neutral-700 text-sm leading-relaxed">{{ modelValue.notes }}</p>
              </Card>
            </div>


          </div>
        </div>
      </div>

      <!-- Order Confirmation -->
      <div class="order-confirmation">
        <Card variant="elevated" class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <template #header>
            <h3 class="text-xl font-bold text-blue-900">Подтверждение заказа</h3>
          </template>

          <div class="space-y-4">
            <div class="text-blue-800">
              <p class="mb-3">
                <strong>Ваш заказ готов к отправке!</strong>
              </p>
              <p class="text-sm leading-relaxed">
                После отправки заказа мы свяжемся с вами в течение рабочего дня для уточнения деталей, 
                расчета точной стоимости и согласования сроков выполнения.
              </p>
              <p class="text-sm leading-relaxed mt-2">
                Стоимость и сроки будут рассчитаны индивидуально на основе ваших файлов и требований.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <!-- Terms and Conditions -->
      <Card variant="outlined" class="bg-neutral-50">
        <div class="flex items-start gap-3">
          <input
            v-model="acceptedTerms"
            type="checkbox"
            id="terms"
            class="checkbox-input mt-1"
          />
          <label for="terms" class="text-sm text-neutral-700 leading-relaxed">
            Я согласен с 
            <a href="#" class="text-primary-600 hover:text-primary-700 underline">условиями предоставления услуг</a>
            и 
            <a href="#" class="text-primary-600 hover:text-primary-700 underline">политикой конфиденциальности</a>.
            Подтверждаю, что все указанные данные корректны.
          </label>
        </div>
      </Card>
    </div>

    <!-- Navigation -->
    <template #footer>
      <div class="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button 
          variant="outline"
          @click="$emit('previous')"
          size="lg"
          class="w-full sm:w-auto"
        >
          <template #icon-left>
            <ArrowLeftIcon class="w-4 h-4" />
          </template>
          Назад
        </Button>
        
        <Button 
          @click="handleSubmit"
          :disabled="!acceptedTerms || isSubmitting"
          :loading="isSubmitting"
          size="lg"
          class="w-full sm:w-auto sm:min-w-40"
        >
          <template v-if="!isSubmitting" #icon-right>
            <CheckIcon class="w-4 h-4" />
          </template>
          {{ isSubmitting ? 'Отправка...' : 'Отправить заказ' }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  CubeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentIcon,
  EyeIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/vue/24/solid'
import Card from '@/design-system/components/Card/Card.vue'
import Button from '@/design-system/components/Button/Button.vue'
import { formatFileSize } from '@/utils/fileUpload'
import type { OrderFormData } from '@/types/orders'
import type { UploadedFile } from '@/types/orders'
import { colorsApi, type Color } from '@/api/colors'

interface Props {
  modelValue: OrderFormData
  errors: Record<string, string>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: OrderFormData]
  submit: []
  previous: []
}>()

const acceptedTerms = ref(false)
const isSubmitting = ref(false)
const availableColors = ref<Color[]>([])

// Computed properties
const selectedService = computed(() => {
  return props.modelValue.services?.[0] || null
})

const totalItemsCount = computed(() => {
  const filesCount = props.modelValue.files?.length || 0
  const galleryItemsCount = props.modelValue.selectedGalleryItems?.length || 0
  return filesCount + galleryItemsCount
})



const handleSubmit = async () => {
  if (!acceptedTerms.value) return
  
  isSubmitting.value = true
  try {
    emit('submit')
  } finally {
    isSubmitting.value = false
  }
}

const previewFile = (file: UploadedFile) => {
  // Open file preview modal or download
  window.open(file.url, '_blank')
}

const previewGalleryItem = (item: any) => {
  // Open gallery item preview - could navigate to project detail page
  if (item.images?.[0]?.url) {
    window.open(item.images[0].url, '_blank')
  }
}

const formatPrice = (price: number | undefined) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'
  }
  return new Intl.NumberFormat('ru-RU').format(Math.round(price))
}



// Color functions
const getSelectedColorName = () => {
  const colorId = props.modelValue.specifications.selectedColor
  if (!colorId) return 'Цвет не выбран'
  
  const color = availableColors.value.find(c => c.id === colorId)
  return color?.name || 'Выбранный цвет'
}

const getSelectedColorHex = () => {
  const colorId = props.modelValue.specifications.selectedColor
  if (!colorId) return '#6b7280'
  
  const color = availableColors.value.find(c => c.id === colorId)
  return getColorHexById(colorId)
}

const getColorNameById = (colorId: number) => {
  const color = availableColors.value.find(c => c.id === colorId)
  return color?.name || `Цвет ${colorId}`
}

const getColorHexById = (colorId: number) => {
  const color = availableColors.value.find(c => c.id === colorId)
  if (!color) return '#6b7280'
  
  // For solid colors, return hex_code
  if (color.type === 'solid') {
    return (color as any).hex_code || '#6b7280'
  }
  
  // For gradient colors, return the first color
  if (color.type === 'gradient') {
    const gradientColor = color as any
    return gradientColor.gradient_colors?.[0]?.color || '#6b7280'
  } 
  
  // For metallic colors, return the base color
  if (color.type === 'metallic') {
    const metallicColor = color as any
    return metallicColor.metallic_base || '#6b7280'
  }
  
  return '#6b7280'
}

// Load colors from API
const loadColors = async () => {
  try {
    availableColors.value = await colorsApi.getColors()
  } catch (error) {
    console.error('Error loading colors:', error)
  }
}

// Load colors on component mount
onMounted(() => {
  loadColors()
})
</script>

<style scoped>
.summary-section {
  @apply space-y-3;
}

.summary-title {
  @apply text-lg font-semibold text-neutral-900;
}

.service-icon {
  @apply w-12 h-12 bg-primary-200 rounded-xl flex items-center justify-center text-primary-700 flex-shrink-0;
}

.contact-item {
  @apply flex items-center gap-3;
}

.contact-label {
  @apply text-sm font-medium text-neutral-600 min-w-16;
}

.contact-value {
  @apply text-sm text-neutral-900 font-medium;
}

.file-item {
  @apply flex items-center gap-3 p-3 bg-neutral-50 rounded-lg;
}

.file-info {
  @apply flex-1 min-w-0;
}

.file-name {
  @apply text-sm font-medium text-neutral-900 truncate block;
}

.file-size {
  @apply text-xs text-neutral-500;
}

.specs-grid {
  @apply grid grid-cols-1 gap-3;
}

.spec-item {
  @apply flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0;
}

.spec-item.full-width {
  @apply flex-col items-start gap-2;
}

.spec-label {
  @apply text-sm font-medium text-neutral-600;
}

.spec-value {
  @apply text-sm text-neutral-900 font-medium;
}

.color-preview {
  @apply w-4 h-4 rounded-full border border-neutral-300;
}

.post-processing-list {
  @apply flex flex-wrap gap-2;
}

.post-processing-tag {
  @apply bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full;
}

.price-breakdown {
  @apply space-y-2;
}

.breakdown-item {
  @apply flex justify-between items-center text-sm;
}

.breakdown-item.total {
  @apply text-lg font-bold text-primary-900 pt-2;
}

.breakdown-label {
  @apply text-primary-700;
}

.breakdown-value {
  @apply text-primary-800 font-medium;
}

.breakdown-divider {
  @apply border-t border-primary-200 my-3;
}

.checkbox-input {
  @apply w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500;
}
</style>