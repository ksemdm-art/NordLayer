<template>
  <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-neutral-200">
      <h2 class="text-2xl font-bold text-neutral-900">Выбор файлов для печати</h2>
      <p class="text-neutral-600 mt-2">Загрузите свои 3D модели или выберите готовые из нашей галереи</p>
    </div>
    
    <div class="p-6">

    <div class="space-y-6">
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

      <!-- Error Message -->
      <div v-if="errors.files" class="error-message">
        <ExclamationTriangleIcon class="w-5 h-5 text-error-500 mr-2" />
        {{ errors.files }}
      </div>

      <!-- Upload Progress -->
      <div v-if="uploadingFiles.length > 0" class="upload-progress">
        <h4 class="text-sm font-medium text-neutral-700 mb-3">Загрузка файлов...</h4>
        <div class="space-y-2">
          <div 
            v-for="upload in uploadingFiles" 
            :key="upload.id"
            class="upload-item"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm text-neutral-600 truncate">{{ upload.name }}</span>
              <span class="text-xs text-neutral-500">{{ upload.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${upload.progress}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Uploaded Files List -->
      <div v-if="modelValue.files.length > 0" class="uploaded-files">
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
              <Button
                variant="ghost"
                size="sm"
                @click="previewFile(file)"
                class="text-primary-600 hover:text-primary-700"
              >
                <EyeIcon class="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                @click="removeFile(index)"
                class="text-error-600 hover:text-error-700"
              >
                <TrashIcon class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

        <!-- File Requirements -->
        <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
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

      <!-- Photo Tab for Lithophane -->
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
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
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
                <div class="gallery-item-meta">
                  <span class="category-tag">{{ item.category }}</span>
                  <span v-if="item.stl_file" class="stl-available">STL доступен</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Selected items summary -->
          <div v-if="selectedGalleryItems.length > 0" class="selected-summary mt-6">
            <h4 class="text-sm font-medium text-neutral-700 mb-3">
              Выбрано моделей: {{ selectedGalleryItems.length }}
            </h4>
            <div class="selected-items">
              <div
                v-for="item in selectedGalleryItems"
                :key="item.id"
                class="selected-item"
              >
                <span class="selected-item-name">{{ item.title }}</span>
                <button
                  type="button"
                  @click="removeGalleryItem(item)"
                  class="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary of all selections -->
      <div v-if="totalSelections > 0" class="selections-summary">
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <CheckCircleIcon class="w-6 h-6 text-primary-600" />
            <div>
              <h4 class="text-sm font-medium text-primary-900">Готово к печати</h4>
              <p class="text-sm text-primary-700">
                {{ modelValue.files.length > 0 ? `${modelValue.files.length} 3D файлов` : '' }}
                {{ modelValue.files.length > 0 && (selectedGalleryItems.length > 0 || (modelValue.photos?.length || 0) > 0) ? ', ' : '' }}
                {{ selectedGalleryItems.length > 0 ? `${selectedGalleryItems.length} моделей из галереи` : '' }}
                {{ selectedGalleryItems.length > 0 && (modelValue.photos?.length || 0) > 0 ? ', ' : '' }}
                {{ (modelValue.photos?.length || 0) > 0 ? `${modelValue.photos?.length} фотографий` : '' }}
              </p>
              <div v-if="modelValue.totalPrice > 0" class="mt-2 pt-2 border-t border-primary-200">
                <p class="text-lg font-bold text-primary-900">
                  Стоимость: {{ formatPrice(modelValue.totalPrice) }}₽
                </p>
              </div>
            </div>
          </div>
        </div>
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
          @click="$emit('next')"
          class="btn-primary btn-lg min-w-32"
        >
          {{ totalSelections > 0 ? 'Далее' : 'Пропустить (файлы необязательны)' }}
          <ArrowRightIcon class="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  </div>

  <!-- File Preview Modal (simplified) -->
  <div v-if="showPreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showPreviewModal = false">
    <div class="bg-white rounded-lg max-w-lg w-full mx-4" @click.stop>
      <div class="px-6 py-4 border-b border-neutral-200">
        <h3 class="text-lg font-semibold">Предварительный просмотр</h3>
      </div>
      
      <div v-if="previewingFile" class="p-6 text-center">
        <DocumentIcon class="w-16 h-16 text-primary-500 mx-auto mb-4" />
        <h4 class="text-lg font-medium text-neutral-900 mb-2">{{ previewingFile.filename }}</h4>
        <p class="text-neutral-600 mb-4">{{ formatFileSize(previewingFile.size) }}</p>
        
        <!-- 3D Preview would go here -->
        <div class="bg-neutral-100 rounded-lg h-64 flex items-center justify-center">
          <p class="text-neutral-500">3D предварительный просмотр будет добавлен позже</p>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
        <button type="button" @click="showPreviewModal = false" class="btn-outline">
          Закрыть
        </button>
        <button type="button" @click="downloadFile(previewingFile)" class="btn-primary">
          Скачать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted } from 'vue'
import {
  CloudArrowUpIcon,
  DocumentPlusIcon,
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PhotoIcon,
  CubeIcon,
  CheckIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/solid'
// Removed design-system imports - using native HTML elements instead
import { uploadFile, formatFileSize, getFileExtension } from '@/utils/fileUpload'
import { api } from '@/services/api'
import type { UploadedFile } from '@/types/orders'
import type { OrderFormData } from '@/types/orders'
import type { Project } from '@/types'

interface Props {
  modelValue: OrderFormData
  errors: Record<string, string>
}

interface UploadingFile {
  id: string
  name: string
  progress: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: OrderFormData]
  next: []
  previous: []
}>()

const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const uploadingFiles = ref<UploadingFile[]>([])
const showPreviewModal = ref(false)
const previewingFile = ref<UploadedFile | null>(null)

// Gallery state
const activeTab = ref<'upload' | 'photos' | 'gallery'>('upload')
const galleryItems = ref<Project[]>([])
const loadingGallery = ref(false)
const isPhotoDragOver = ref(false)
const photoInput = ref<HTMLInputElement>()

// Computed properties
const selectedGalleryItems = computed(() => props.modelValue.selectedGalleryItems || [])
const totalSelections = computed(() => 
  props.modelValue.files.length + 
  selectedGalleryItems.value.length + 
  (props.modelValue.photos?.length || 0)
)

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
  // Only set to false if we're leaving the drop zone entirely
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
  
  // Reset input
  target.value = ''
}

const processFiles = async (files: File[]) => {
  for (const file of files) {
    const uploadId = Math.random().toString(36).substr(2, 9)
    
    // Add to uploading list
    uploadingFiles.value.push({
      id: uploadId,
      name: file.name,
      progress: 0
    })
    
    try {
      const uploadedFile = await uploadFile(file, {
        onProgress: (progress) => {
          const uploadItem = uploadingFiles.value.find(u => u.id === uploadId)
          if (uploadItem) {
            uploadItem.progress = progress
          }
        },
        allowedTypes: ['.stl', '.obj'],
        maxSize: 50 * 1024 * 1024 // 50MB
      })
      
      // Add to uploaded files
      const updatedData = {
        ...props.modelValue,
        files: [...props.modelValue.files, uploadedFile]
      }
      emit('update:modelValue', updatedData)
      
      // Add success animation
      await nextTick()
      animateFileAdded()
      
    } catch (error) {
      console.error('File upload failed:', error)
      // Show error notification
    } finally {
      // Remove from uploading list
      uploadingFiles.value = uploadingFiles.value.filter(u => u.id !== uploadId)
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

const previewFile = (file: UploadedFile) => {
  previewingFile.value = file
  showPreviewModal.value = true
}

const downloadFile = (file: UploadedFile | null) => {
  if (!file) return
  
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const animateFileAdded = () => {
  // Add a subtle animation when file is successfully uploaded
  const lastFileCard = document.querySelector('.file-card:last-child')
  if (lastFileCard) {
    lastFileCard.classList.add('animate-scale-in')
    setTimeout(() => {
      lastFileCard.classList.remove('animate-scale-in')
    }, 300)
  }
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

const removeGalleryItem = (item: Project) => {
  const currentSelected = selectedGalleryItems.value.filter(selected => selected.id !== item.id)
  const updatedData = {
    ...props.modelValue,
    selectedGalleryItems: currentSelected
  }
  emit('update:modelValue', updatedData)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Replace broken image with placeholder
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDdsLTgtNC04IDRtMTYgMGwtOCA0bTgtNHYxMGwtOCA0bTAtMTBMNCA3bTggNHYxME00IDd2MTBsOCA0IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
  img.style.display = 'block'
  img.className = 'w-full h-full object-contain bg-neutral-200'
}

// Photo handling methods
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
  
  // Reset input
  target.value = ''
}

const processPhotos = async (files: File[]) => {
  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  
  for (const file of imageFiles) {
    // Create preview
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

// Format price for display
const formatPrice = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '0'
  }
  return new Intl.NumberFormat('ru-RU').format(Math.round(price))
}

// Load gallery on mount
onMounted(() => {
  loadGalleryItems()
})
</script>

<style scoped>
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

.upload-progress {
  @apply bg-neutral-50 border border-neutral-200 rounded-lg p-4;
}

.upload-item {
  @apply bg-white rounded-lg p-3 border border-neutral-200;
}

.progress-bar {
  @apply w-full bg-neutral-200 rounded-full h-2 overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out;
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

.error-message {
  @apply flex items-center text-error-600 bg-error-50 border border-error-200 rounded-lg px-4 py-3;
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

.gallery-item-meta {
  @apply flex items-center gap-2;
}

.category-tag {
  @apply text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full;
}

.stl-available {
  @apply text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full;
}

.selected-summary {
  @apply bg-neutral-50 border border-neutral-200 rounded-lg p-4;
}

.selected-items {
  @apply flex flex-wrap gap-2;
}

.selected-item {
  @apply flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-3 py-2;
}

.selected-item-name {
  @apply text-sm text-neutral-700;
}

.selections-summary {
  @apply mt-6;
}

/* Button styles */
.btn-base {
  @apply inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.btn-lg {
  @apply px-6 py-3 text-base;
}

.btn-primary {
  @apply btn-base bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.btn-primary:disabled {
  @apply bg-neutral-300 text-neutral-500 cursor-not-allowed hover:bg-neutral-300;
}

.btn-outline {
  @apply btn-base bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500;
}

.btn-outline:disabled {
  @apply bg-neutral-100 text-neutral-400 cursor-not-allowed hover:bg-neutral-100;
}

/* Photo Upload Styles */
.photo-drop-zone {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200;
}

.photo-drop-zone.drag-over {
  @apply border-blue-500 bg-blue-50;
}
</style>