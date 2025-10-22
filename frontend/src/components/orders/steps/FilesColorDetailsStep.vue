<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-neutral-200">
      <h2 class="text-2xl font-bold text-neutral-900">Файлы, цвет и детали заказа</h2>
      <p class="text-neutral-600 mt-2">Загрузите файлы, выберите цвет и укажите дополнительную информацию (все поля необязательны)</p>
    </div>
    
    <div class="p-6 space-y-8">
      <!-- Info Message -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <InformationCircleIcon class="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 class="text-sm font-medium text-blue-900 mb-1">Этот шаг необязательный</h4>
            <p class="text-sm text-blue-700">
              Вы можете пропустить загрузку файлов и выбор цвета. Все детали можно обсудить после оформления заказа.
            </p>
          </div>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">1. Файлы для печати</h3>
        
        <!-- Selection Tabs -->
        <div class="selection-tabs">
          <button
            class="tab-button"
            :class="{ 'active': activeTab === 'upload' }"
            @click="activeTab = 'upload'"
          >
            <CloudArrowUpIcon class="w-5 h-5 mr-2" />
            Загрузить 3D файлы
          </button>
          <button
            class="tab-button"
            :class="{ 'active': activeTab === 'photos' }"
            @click="activeTab = 'photos'"
          >
            <PhotoIcon class="w-5 h-5 mr-2" />
            Загрузить фото
          </button>
          <button
            class="tab-button"
            :class="{ 'active': activeTab === 'gallery' }"
            @click="activeTab = 'gallery'"
          >
            <CubeIcon class="w-5 h-5 mr-2" />
            Выбрать из галереи
          </button>
        </div>

        <!-- Upload Tab -->
        <div v-show="activeTab === 'upload'" class="tab-content">
          <!-- Drag & Drop Zone -->
          <div
            ref="dropZone"
            class="drop-zone"
            :class="getDropZoneClasses()"
            @click="triggerFileInput"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".stl,.obj"
              class="hidden"
              @change="handleFileSelect"
            />

            <div class="drop-zone-content">
              <Transition name="bounce" mode="out-in">
                <div v-if="isDragOver" key="drag-over" class="text-center">
                  <CloudArrowUpIcon class="w-16 h-16 text-primary-500 mx-auto mb-4 animate-bounce" />
                  <p class="text-lg font-medium text-primary-700">Отпустите файлы для загрузки</p>
                </div>
                
                <div v-else key="default" class="text-center">
                  <DocumentPlusIcon class="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <p class="text-lg font-medium text-neutral-700 mb-2">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <p class="text-sm text-neutral-500">
                    Максимальный размер файла: 50 МБ
                  </p>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Uploaded Files List -->
          <div v-if="modelValue.files.length > 0" class="uploaded-files mt-4">
            <h4 class="text-sm font-medium text-neutral-700 mb-3">
              Загруженные файлы ({{ modelValue.files.length }})
            </h4>
            
            <div class="files-grid">
              <div 
                v-for="(file, index) in modelValue.files" 
                :key="file.id"
                class="file-card"
              >
                <div class="file-preview">
                  <DocumentIcon class="w-8 h-8 text-primary-500" />
                </div>
                
                <div class="file-info">
                  <h5 class="file-name">{{ file.filename }}</h5>
                  <p class="file-size">{{ formatFileSize(file.size) }}</p>
                  <p class="file-type">{{ getFileExtension(file.filename || '').toUpperCase() }}</p>
                </div>
                
                <div class="file-actions">
                  <button
                    @click="removeFile(index)"
                    class="text-red-600 hover:text-red-700 p-1"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- File Requirements -->
          <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mt-4">
            <div class="flex items-start gap-3">
              <InformationCircleIcon class="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 class="text-sm font-medium text-neutral-900 mb-2">Требования к файлам:</h4>
                <ul class="text-sm text-neutral-600 space-y-1">
                  <li>• Поддерживаемые форматы: STL, OBJ</li>
                  <li>• Максимальный размер файла: 50 МБ</li>
                  <li>• Модель должна быть водонепроницаемой (manifold)</li>
                  <li>• Рекомендуемое разрешение: 0.1-0.3 мм</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Photo Tab -->
        <div v-show="activeTab === 'photos'" class="tab-content">
          <div class="space-y-4">
            <div
              class="photo-drop-zone"
              :class="{ 'drag-over': isPhotoDragOver }"
              @click="triggerPhotoInput"
              @dragover.prevent="handlePhotoDragOver"
              @dragleave.prevent="handlePhotoDragLeave"
              @drop.prevent="handlePhotoDrop"
            >
              <input
                ref="photoInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handlePhotoSelect"
              />
              
              <div class="text-center">
                <PhotoIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p class="text-lg font-medium text-gray-700 mb-2">
                  Загрузите фотографии для литофании
                </p>
                <p class="text-sm text-gray-500">
                  Поддерживаются JPG, PNG. Рекомендуется высокое разрешение.
                </p>
              </div>
            </div>
            
            <!-- Uploaded Photos -->
            <div v-if="modelValue.photos && modelValue.photos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="(photo, index) in modelValue.photos" 
                :key="index"
                class="relative group"
              >
                <img 
                  :src="photo.preview" 
                  :alt="photo.name"
                  class="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  @click="removePhoto(index)"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p class="text-xs text-gray-600 mt-1 truncate">{{ photo.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery Tab -->
        <div v-show="activeTab === 'gallery'" class="tab-content">
          <div v-if="loadingGallery" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p class="text-neutral-600 mt-4">Загрузка галереи...</p>
          </div>
          
          <div v-else-if="galleryItems.length === 0" class="text-center py-12">
            <CubeIcon class="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <p class="text-neutral-600">Галерея пуста</p>
          </div>
          
          <div v-else>
            <div class="gallery-grid">
              <div
                v-for="item in galleryItems"
                :key="item.id"
                class="gallery-item"
                :class="{ 'selected': isGalleryItemSelected(item) }"
                @click="toggleGalleryItem(item)"
              >
                <div class="gallery-item-image">
                  <img
                    v-if="item.images && item.images.length > 0"
                    :src="typeof item.images[0] === 'string' ? item.images[0] : item.images[0].image_path"
                    :alt="typeof item.images[0] === 'string' ? item.title : (item.images[0].alt_text || item.title)"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <div v-else class="w-full h-full bg-neutral-200 flex items-center justify-center">
                    <CubeIcon class="w-8 h-8 text-neutral-400" />
                  </div>
                  
                  <!-- Selection indicator -->
                  <div v-if="isGalleryItemSelected(item)" class="selection-indicator">
                    <CheckIcon class="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div class="gallery-item-info">
                  <h4 class="gallery-item-title">{{ item.title }}</h4>
                  <p class="gallery-item-description">{{ item.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Color Selection Section -->
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">2. Выбор цвета</h3>
        
        <div class="bg-gray-50 rounded-lg p-6">
          <div class="space-y-4">
            <!-- Single Color -->
            <div v-if="!modelValue.specifications.isMultiColor">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Выберите цвет для печати
              </label>
              <ColorSelector
                :model-value="modelValue.specifications.selectedColor as any"
                @update:model-value="updateSelectedColor"
                :show-price-modifier="true"
                @color-selected="handleColorSelected"
              />
            </div>
            
            <!-- Multi-color option -->
            <div class="border-t border-gray-200 pt-4">
              <label class="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                     :class="{ 'border-blue-500 bg-blue-50': modelValue.specifications.isMultiColor }">
                <input
                  type="checkbox"
                  :checked="!!modelValue.specifications.isMultiColor"
                  @change="updateMultiColor"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <span class="font-medium">Многоцветная печать</span>
                  <span class="text-orange-600 font-medium ml-2">+50%</span>
                  <p class="text-sm text-gray-600">Печать в нескольких цветах (требует специальной подготовки файла)</p>
                </div>
              </label>
              
              <!-- Multi-color selection -->
              <div v-if="modelValue.specifications.isMultiColor" class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-medium text-gray-900 mb-3">
                  Выберите цвета для многоцветной печати (до 4 цветов)
                </h4>
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  <ColorSwatch
                    v-for="color in availableColors"
                    :key="`multi-${color.id}`"
                    :color="color"
                    :is-selected="isColorSelectedForMulti(color.id)"
                    :disabled="!isColorSelectedForMulti(color.id) && getSelectedMultiColors().length >= 4"
                    :multi-color-index="getMultiColorIndex(color.id)"
                    @select="toggleMultiColor"
                  />
                </div>
                <p class="text-xs text-gray-600 mt-2">
                  Выбрано: {{ getSelectedMultiColors().length }}/4 цветов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">3. Дополнительная информация</h3>
        
        <div class="bg-gray-50 rounded-lg p-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Опишите ваши требования и пожелания
          </label>
          <textarea
            v-model="additionalInfo"
            placeholder="Например: размеры, особенности обработки, сроки, упаковка, цвет, материал и т.д."
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 resize-none"
          />
          <p class="text-sm text-gray-500 mt-2">
            Эта информация поможет нам лучше понять ваши потребности и выполнить заказ максимально качественно.
          </p>
        </div>
      </div>

      <!-- Summary Section -->
      <div v-if="totalSelections > 0 || additionalInfo.trim()" class="section">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <CheckCircleIcon class="w-6 h-6 text-blue-600" />
            <div>
              <h4 class="text-sm font-medium text-blue-900">Информация о заказе</h4>
              <div class="text-sm text-blue-700 space-y-1 mt-2">
                <p v-if="modelValue.files.length > 0">
                  📁 {{ modelValue.files.length }} 3D файлов загружено
                </p>
                <p v-if="selectedGalleryItems.length > 0">
                  🎨 {{ selectedGalleryItems.length }} моделей из галереи выбрано
                </p>
                <p v-if="(modelValue.photos?.length || 0) > 0">
                  📷 {{ modelValue.photos?.length }} фотографий загружено
                </p>
                <p v-if="selectedColorName">
                  🎨 Цвет: {{ selectedColorName }}
                </p>
                <p v-if="modelValue.specifications.isMultiColor">
                  🌈 Многоцветная печать (+50%)
                </p>
                <p v-if="additionalInfo.trim()">
                  📝 Дополнительная информация указана
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Validation Errors -->
    <div v-if="Object.keys(allErrors).length > 0" class="px-6 py-4 bg-red-50 border-t border-red-200">
      <div class="space-y-2">
        <div v-for="(error, field) in allErrors" :key="field" class="flex items-center text-red-600">
          <InformationCircleIcon class="w-5 h-5 text-red-500 mr-2" />
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="px-6 py-4 border-t border-neutral-200 bg-neutral-50">
      <div class="flex justify-between">
        <button 
          type="button"
          @click="$emit('previous')"
          class="btn-outline btn-lg"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2" />
          Назад
        </button>
        
        <button 
          type="button"
          @click="handleNext"
          :disabled="!isValid"
          class="btn-primary btn-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Далее
          <ArrowRightIcon class="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  CloudArrowUpIcon,
  DocumentPlusIcon,
  DocumentIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  PhotoIcon,
  CubeIcon,
  CheckIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
import ColorSelector from '@/components/common/ColorSelector.vue'
import ColorSwatch from '@/components/common/ColorSwatch.vue'
import { uploadFile, formatFileSize, getFileExtension } from '@/utils/fileUpload'
import { api } from '@/services/api'
import { colorsApi, type Color } from '@/api/colors'
// import type { UploadedFile } from '@/types/orders' // Used in uploadFile function
import type { OrderFormData } from '@/types/orders'
import type { Project } from '@/types'

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

// File upload state
const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const activeTab = ref<'upload' | 'photos' | 'gallery'>('upload')

// Gallery state
const galleryItems = ref<Project[]>([])
const loadingGallery = ref(false)

// Photo state
const isPhotoDragOver = ref(false)
const photoInput = ref<HTMLInputElement>()

// Color state
const availableColors = ref<Color[]>([])

// Additional info state
const additionalInfo = ref(props.modelValue.notes || '')

// Local validation errors
const localErrors = ref<Record<string, string>>({})

// Computed properties
const selectedGalleryItems = computed(() => props.modelValue.selectedGalleryItems || [])
const totalSelections = computed(() => 
  props.modelValue.files.length + 
  selectedGalleryItems.value.length + 
  (props.modelValue.photos?.length || 0)
)

const selectedColorName = computed(() => {
  if (!props.modelValue.specifications.selectedColor) return null
  const color = availableColors.value.find(c => c.id === props.modelValue.specifications.selectedColor)
  return color?.name || null
})

// Validation functions
const validateFiles = (): string => {
  // Файлы теперь необязательны - можно заказать без файлов
  // Валидация убрана, так как можно заказать консультацию или услуги без файлов
  return ''
}

const validateColor = (): string => {
  // Цвет теперь необязателен - может быть выбран позже при обсуждении заказа
  return ''
}

// Computed properties for validation
const allErrors = computed(() => {
  return { ...props.errors, ...localErrors.value }
})

const isValid = computed(() => {
  const filesError = validateFiles()
  const colorError = validateColor()
  
  return !filesError && !colorError
})

// File upload methods
const getDropZoneClasses = () => {
  const baseClasses = 'drop-zone border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer'
  
  if (isDragOver.value) {
    return `${baseClasses} border-primary-500 bg-primary-50 scale-[1.02]`
  }
  
  return `${baseClasses} border-neutral-300 hover:border-primary-400 hover:bg-primary-50`
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  if (!dropZone.value?.contains(event.relatedTarget as Node)) {
    isDragOver.value = false
  }
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  await processFiles(files)
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  await processFiles(files)
  
  target.value = ''
}

const processFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      const uploadedFile = await uploadFile(file, {
        allowedTypes: ['.stl', '.obj'],
        maxSize: 50 * 1024 * 1024 // 50MB
      })
      
      const updatedData = {
        ...props.modelValue,
        files: [...props.modelValue.files, uploadedFile]
      }
      emit('update:modelValue', updatedData)
      
      await nextTick()
      animateFileAdded()
      
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }
}

const removeFile = (index: number) => {
  const updatedFiles = [...props.modelValue.files]
  updatedFiles.splice(index, 1)
  
  const updatedData = {
    ...props.modelValue,
    files: updatedFiles
  }
  emit('update:modelValue', updatedData)
}

const animateFileAdded = () => {
  const lastFileCard = document.querySelector('.file-card:last-child')
  if (lastFileCard) {
    lastFileCard.classList.add('animate-scale-in')
    setTimeout(() => {
      lastFileCard.classList.remove('animate-scale-in')
    }, 300)
  }
}

// Photo methods
const triggerPhotoInput = () => {
  photoInput.value?.click()
}

const handlePhotoDragOver = (event: DragEvent) => {
  event.preventDefault()
  isPhotoDragOver.value = true
}

const handlePhotoDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isPhotoDragOver.value = false
}

const handlePhotoDrop = async (event: DragEvent) => {
  event.preventDefault()
  isPhotoDragOver.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  await processPhotos(files)
}

const handlePhotoSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  await processPhotos(files)
  
  target.value = ''
}

const processPhotos = async (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  for (const file of imageFiles) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const photo = {
        name: file.name,
        file: file,
        preview: e.target?.result as string
      }
      
      const currentPhotos = props.modelValue.photos || []
      const updatedData = {
        ...props.modelValue,
        photos: [...currentPhotos, photo]
      }
      emit('update:modelValue', updatedData)
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = (index: number) => {
  const currentPhotos = props.modelValue.photos || []
  const updatedPhotos = [...currentPhotos]
  updatedPhotos.splice(index, 1)
  
  const updatedData = {
    ...props.modelValue,
    photos: updatedPhotos
  }
  emit('update:modelValue', updatedData)
}

// Gallery methods
const loadGalleryItems = async () => {
  loadingGallery.value = true
  try {
    const response = await api.get('/projects')
    galleryItems.value = response.data.data || []
  } catch (error) {
    console.error('Error loading gallery items:', error)
    galleryItems.value = []
  } finally {
    loadingGallery.value = false
  }
}

const isGalleryItemSelected = (item: Project): boolean => {
  return selectedGalleryItems.value.some(selected => selected.id === item.id)
}

const toggleGalleryItem = (item: Project) => {
  const currentSelected = [...selectedGalleryItems.value]
  const index = currentSelected.findIndex(selected => selected.id === item.id)
  
  if (index > -1) {
    currentSelected.splice(index, 1)
  } else {
    currentSelected.push(item)
  }
  
  const updatedData = {
    ...props.modelValue,
    selectedGalleryItems: currentSelected
  }
  emit('update:modelValue', updatedData)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDdsLTgtNC04IDRtMTYgMGwtOCA0bTgtNHYxMGwtOCA0bTAtMTBMNCA3bTggNHYxME00IDd2MTBsOCA0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
  img.style.display = 'block'
  img.className = 'w-full h-full object-contain bg-neutral-200'
}

// Update functions
const updateSelectedColor = (colorId: number | null) => {
  const updatedData = {
    ...props.modelValue,
    specifications: {
      ...props.modelValue.specifications,
      selectedColor: colorId
    }
  }
  emit('update:modelValue', updatedData)
}

const updateMultiColor = (event: Event) => {
  const target = event.target as HTMLInputElement
  const updatedData = {
    ...props.modelValue,
    specifications: {
      ...props.modelValue.specifications,
      isMultiColor: target.checked
    }
  }
  emit('update:modelValue', updatedData)
}

// Color methods
const handleColorSelected = (color: Color | null) => {
  if (color) {
    const updatedData = {
      ...props.modelValue,
      specifications: {
        ...props.modelValue.specifications,
        selectedColor: color.id
      }
    }
    emit('update:modelValue', updatedData)
  }
}

// Removed unused handleMultiColorChange function

const isColorSelectedForMulti = (colorId: number): boolean => {
  return Array.isArray(props.modelValue.specifications.multiColors) ? props.modelValue.specifications.multiColors.includes(colorId) : false
}

const getSelectedMultiColors = (): number[] => {
  return Array.isArray(props.modelValue.specifications.multiColors) ? props.modelValue.specifications.multiColors : []
}

const getMultiColorIndex = (colorId: number): number => {
  const multiColors = Array.isArray(props.modelValue.specifications.multiColors) ? props.modelValue.specifications.multiColors : []
  const index = multiColors.indexOf(colorId)
  return index >= 0 ? index + 1 : 0
}

const toggleMultiColor = (color: Color) => {
  const colors = Array.isArray(props.modelValue.specifications.multiColors) ? [...props.modelValue.specifications.multiColors] : []
  const index = colors.indexOf(color.id)
  
  if (index >= 0) {
    colors.splice(index, 1)
  } else if (colors.length < 4) {
    colors.push(color.id)
  }
  
  const updatedData = {
    ...props.modelValue,
    specifications: {
      ...props.modelValue.specifications,
      multiColors: colors
    }
  }
  emit('update:modelValue', updatedData)
}

// Load colors
const loadColors = async () => {
  try {
    availableColors.value = await colorsApi.getColors()
  } catch (error) {
    console.error('Error loading colors:', error)
  }
}

// Handle next step
const handleNext = () => {
  if (isValid.value) {
    // Update additional info in the model
    const updatedData = {
      ...props.modelValue,
      notes: additionalInfo.value
    }
    emit('update:modelValue', updatedData)
    emit('next')
  }
}

// Reactive validation watchers
watch(() => [props.modelValue.files, props.modelValue.selectedGalleryItems, props.modelValue.photos], () => {
  const error = validateFiles()
  if (error) {
    localErrors.value.files = error
  } else {
    delete localErrors.value.files
  }
}, { immediate: true, deep: true })

watch(() => [props.modelValue.specifications.selectedColor, props.modelValue.specifications.isMultiColor], () => {
  const error = validateColor()
  if (error) {
    localErrors.value.color = error
  } else {
    delete localErrors.value.color
  }
}, { immediate: true, deep: true })

// Load data on mount
onMounted(() => {
  loadGalleryItems()
  loadColors()
})
</script>

<style scoped>
.section {
  @apply border-b border-gray-100 pb-6 last:border-b-0 last:pb-0;
}

.drop-zone {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.drop-zone::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(var(--primary-500-rgb), 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.drop-zone:hover::before {
  transform: translateX(100%);
}

.drop-zone-content {
  position: relative;
  z-index: 1;
}

.uploaded-files {
  @apply space-y-4;
}

.files-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.file-card {
  @apply bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-all duration-200;
}

.file-preview {
  @apply w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-3;
}

.file-info {
  @apply mb-3;
}

.file-name {
  @apply text-sm font-medium text-neutral-900 truncate mb-1;
}

.file-size {
  @apply text-xs text-neutral-500;
}

.file-type {
  @apply text-xs text-primary-600 font-medium;
}

.file-actions {
  @apply flex items-center gap-2;
}

/* Tab styles */
.selection-tabs {
  @apply flex border-b border-neutral-200 mb-6;
}

.tab-button {
  @apply flex items-center px-6 py-3 text-sm font-medium border-b-2 border-transparent transition-all duration-200;
}

.tab-button:hover {
  @apply text-primary-600 border-primary-200;
}

.tab-button.active {
  @apply text-primary-600 border-primary-500 bg-primary-50;
}

.tab-content {
  @apply space-y-6;
}

/* Gallery styles */
.gallery-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}

.gallery-item {
  @apply bg-white border-2 border-neutral-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary-300 hover:shadow-md;
}

.gallery-item.selected {
  @apply border-primary-500 bg-primary-50 shadow-lg;
}

.gallery-item-image {
  @apply relative h-48 overflow-hidden;
}

.selection-indicator {
  @apply absolute top-2 right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center shadow-lg;
}

.gallery-item-info {
  @apply p-4;
}

.gallery-item-title {
  @apply text-sm font-semibold text-neutral-900 mb-1 truncate;
}

.gallery-item-description {
  @apply text-xs text-neutral-600 mb-2 line-clamp-2;
}

/* Photo Upload Styles */
.photo-drop-zone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200;
}

.photo-drop-zone.drag-over {
  @apply border-blue-500 bg-blue-50;
}

/* Button styles */
.btn-base {
  @apply inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-lg {
  @apply px-6 py-3 text-base;
}

.btn-primary {
  @apply btn-base bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.btn-outline {
  @apply btn-base bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500;
}

/* Animations */
.bounce-enter-active,
.bounce-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-enter-from,
.bounce-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>