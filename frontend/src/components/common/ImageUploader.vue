<template>
  <div class="image-uploader">
    <!-- Upload Zone -->
    <div
      ref="dropZone"
      class="upload-zone"
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
        :accept="accept"
        :max="maxFiles"
        class="hidden"
        @change="handleFileSelect"
      />

      <div class="upload-zone-content">
        <div v-if="isDragOver" class="text-center">
          <PhotoIcon class="w-12 h-12 text-primary-500 mx-auto mb-3 animate-bounce" />
          <p class="text-sm font-medium text-primary-700">Отпустите изображения для загрузки</p>
        </div>
        
        <div v-else class="text-center">
          <PhotoIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-sm font-medium text-neutral-700 mb-1">
            Перетащите изображения сюда или нажмите для выбора
          </p>
          <p class="text-xs text-neutral-500">
            Максимум {{ maxFiles }} файлов, до {{ maxSizeMB }}MB каждый
          </p>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message mt-2">
      <ExclamationTriangleIcon class="w-4 h-4 text-red-500 mr-2" />
      <span class="text-sm text-red-600">{{ error }}</span>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploadingFiles.length > 0" class="upload-progress mt-4">
      <h4 class="text-sm font-medium text-neutral-700 mb-2">Загрузка изображений...</h4>
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

    <!-- Uploaded Images Preview -->
    <div v-if="images.length > 0" class="images-preview mt-4">
      <h4 class="text-sm font-medium text-neutral-700 mb-2">Загруженные изображения:</h4>
      <div class="images-grid">
        <div 
          v-for="(image, index) in images" 
          :key="index"
          class="image-item"
        >
          <div class="image-preview">
            <img 
              :src="getImagePreview(image)" 
              :alt="`Изображение ${index + 1}`"
              class="image-thumbnail"
            />
            <button
              @click="removeImage(index)"
              class="remove-button"
              type="button"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          <input
            v-model="image.caption"
            placeholder="Подпись к изображению"
            class="caption-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PhotoIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface ImageData {
  file?: File
  url?: string
  caption?: string
  preview?: string
}

interface Props {
  modelValue: ImageData[]
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
}

interface Emits {
  (e: 'update:modelValue', value: ImageData[]): void
  (e: 'upload', files: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxSizeMB: 10,
  accept: 'image/*'
})

const emit = defineEmits<Emits>()

const dropZone = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)
const error = ref('')
const uploadingFiles = ref<Array<{ id: string, name: string, progress: number }>>([])

const images = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const getDropZoneClasses = () => ({
  'drag-over': isDragOver.value,
  'has-error': !!error.value
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  processFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  processFiles(files)
}

const processFiles = (files: File[]) => {
  error.value = ''
  
  // Validate file count
  if (images.value.length + files.length > props.maxFiles) {
    error.value = `Максимальное количество файлов: ${props.maxFiles}`
    return
  }
  
  // Validate files
  const validFiles: File[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      error.value = 'Можно загружать только изображения'
      continue
    }
    
    if (file.size > props.maxSizeMB * 1024 * 1024) {
      error.value = `Размер файла не должен превышать ${props.maxSizeMB}MB`
      continue
    }
    
    validFiles.push(file)
  }
  
  if (validFiles.length === 0) return
  
  // Create image previews
  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage: ImageData = {
        file,
        preview: e.target?.result as string,
        caption: ''
      }
      
      images.value = [...images.value, newImage]
    }
    reader.readAsDataURL(file)
  })
  
  // Emit upload event
  emit('upload', validFiles)
}

const removeImage = (index: number) => {
  const newImages = [...images.value]
  newImages.splice(index, 1)
  images.value = newImages
}

const getImagePreview = (image: ImageData): string => {
  return image.preview || image.url || ''
}

// Clear file input when images change
watch(images, () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}, { deep: true })
</script>

<style scoped>
.upload-zone {
  @apply border-2 border-dashed border-neutral-300 rounded-lg p-6 cursor-pointer transition-colors duration-200;
}

.upload-zone:hover {
  @apply border-neutral-400 bg-neutral-50;
}

.upload-zone.drag-over {
  @apply border-primary-400 bg-primary-50;
}

.upload-zone.has-error {
  @apply border-red-300 bg-red-50;
}

.upload-zone-content {
  @apply pointer-events-none;
}

.error-message {
  @apply flex items-center;
}

.upload-progress {
  @apply space-y-2;
}

.upload-item {
  @apply bg-neutral-50 rounded-lg p-3;
}

.progress-bar {
  @apply w-full bg-neutral-200 rounded-full h-2;
}

.progress-fill {
  @apply bg-primary-500 h-2 rounded-full transition-all duration-300;
}

.images-preview {
  @apply space-y-2;
}

.images-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4;
}

.image-item {
  @apply space-y-2;
}

.image-preview {
  @apply relative rounded-lg overflow-hidden bg-neutral-100;
}

.image-thumbnail {
  @apply w-full h-32 object-cover;
}

.remove-button {
  @apply absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200;
}

.caption-input {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}
</style>