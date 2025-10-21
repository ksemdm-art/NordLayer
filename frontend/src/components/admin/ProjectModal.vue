<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-primary-900 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-primary-400 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            @click="$emit('close')"
          >
            <span class="sr-only">Закрыть</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="sm:flex sm:items-start">
          <div class="w-full">
            <h3 class="text-lg leading-6 font-medium text-primary-900 mb-6">
              {{ isEditing ? 'Редактировать проект' : 'Создать новый проект' }}
            </h3>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <!-- Title -->
                <div class="sm:col-span-2">
                  <label for="title" class="block text-sm font-medium text-primary-700">
                    Название проекта *
                  </label>
                  <input
                    id="title"
                    v-model="form.title"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.title }"
                  />
                  <p v-if="errors.title" class="mt-2 text-sm text-red-600">{{ errors.title }}</p>
                </div>

                <!-- Category -->
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">
                    Категория *
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.category }"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="miniatures">Миниатюры</option>
                    <option value="functional">Функциональные</option>
                    <option value="decorative">Декоративные</option>
                    <option value="prototypes">Прототипы</option>
                  </select>
                  <p v-if="errors.category" class="mt-2 text-sm text-red-600">{{ errors.category }}</p>
                </div>

                <!-- Featured -->
                <div class="flex items-center">
                  <input
                    id="is_featured"
                    v-model="form.is_featured"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="is_featured" class="ml-2 block text-sm text-gray-900">
                    Рекомендуемый проект
                  </label>
                </div>
              </div>

              <!-- Pricing and Duration Section -->
              <div class="border-t border-gray-200 pt-6">
                <h4 class="text-lg font-medium text-gray-900 mb-4">Стоимость и сроки</h4>
                
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <!-- Complexity Level -->
                  <div>
                    <label for="complexity_level" class="block text-sm font-medium text-gray-700">
                      Уровень сложности
                    </label>
                    <select
                      id="complexity_level"
                      v-model="form.complexity_level"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Не указан</option>
                      <option value="simple">Простой (1-3 часа)</option>
                      <option value="medium">Средний (4-8 часов)</option>
                      <option value="complex">Сложный (9+ часов)</option>
                    </select>
                  </div>

                  <!-- Estimated Duration -->
                  <div>
                    <label for="estimated_duration_hours" class="block text-sm font-medium text-gray-700">
                      Время изготовления (часы)
                    </label>
                    <input
                      id="estimated_duration_hours"
                      v-model.number="form.estimated_duration_hours"
                      type="number"
                      min="0"
                      step="1"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Например: 5"
                    />
                  </div>

                  <!-- Estimated Price -->
                  <div>
                    <label for="estimated_price" class="block text-sm font-medium text-gray-700">
                      Примерная стоимость (₽)
                    </label>
                    <input
                      id="estimated_price"
                      v-model.number="form.estimated_price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Например: 1500"
                    />
                  </div>
                </div>

                <!-- Price Range -->
                <div class="mt-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ценовой диапазон (₽)
                  </label>
                  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label for="price_range_min" class="block text-xs text-gray-500">
                        Минимальная цена
                      </label>
                      <input
                        id="price_range_min"
                        v-model.number="form.price_range_min"
                        type="number"
                        min="0"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="От"
                      />
                    </div>
                    <div>
                      <label for="price_range_max" class="block text-xs text-gray-500">
                        Максимальная цена
                      </label>
                      <input
                        id="price_range_max"
                        v-model.number="form.price_range_max"
                        type="number"
                        min="0"
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="До"
                      />
                    </div>
                  </div>
                  <p class="mt-2 text-xs text-gray-500">
                    Укажите ценовой диапазон, если точная стоимость зависит от параметров заказа
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Описание *
                </label>
                <textarea
                  id="description"
                  v-model="form.description"
                  rows="4"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.description }"
                  placeholder="Подробное описание проекта..."
                ></textarea>
                <p v-if="errors.description" class="mt-2 text-sm text-red-600">{{ errors.description }}</p>
              </div>

              <!-- Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Изображения проекта
                </label>
                
                <!-- Existing images -->
                <div v-if="existingImages.length > 0" class="mb-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Текущие изображения</h4>
                  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <div
                      v-for="(image, index) in existingImages"
                      :key="`existing-${index}`"
                      class="relative group"
                    >
                      <img
                        :src="getImageUrl(image)"
                        :alt="`Existing image ${index + 1}`"
                        class="h-24 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        @click="removeExistingImage(index)"
                        class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Удалить изображение"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Image upload area -->
                <div
                  class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
                  :class="{ 'border-blue-400 bg-blue-50': dragOver }"
                  @drop="handleDrop"
                  @dragover.prevent="dragOver = true"
                  @dragleave="dragOver = false"
                >
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="images" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Загрузить изображения</span>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          class="sr-only"
                          @change="handleImageUpload"
                        />
                      </label>
                      <p class="pl-1">или перетащите сюда</p>
                    </div>
                    <p class="text-xs text-gray-500">PNG, JPG, GIF до 10MB каждый</p>
                  </div>
                </div>

                <!-- Image previews -->
                <div v-if="imagePreview.length > 0" class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  <div
                    v-for="(image, index) in imagePreview"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="image.url"
                      :alt="`Preview ${index + 1}`"
                      class="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- STL File -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  STL файл модели
                </label>
                
                <!-- Existing STL file -->
                <div v-if="existingSTLFile" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 class="text-sm font-medium text-blue-800 mb-2">Текущий STL файл</h4>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm text-blue-700">
                      <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span class="font-medium">{{ getSTLFileName(existingSTLFile) }}</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <a
                        :href="existingSTLFile"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Скачать
                      </a>
                      <button
                        type="button"
                        @click="removeExistingSTL"
                        class="text-red-600 hover:text-red-800 text-sm font-medium"
                        title="Удалить STL файл"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div class="space-y-1 text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div class="flex text-sm text-gray-600">
                      <label for="stl_file" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Загрузить STL файл</span>
                        <input
                          id="stl_file"
                          type="file"
                          accept=".stl"
                          class="sr-only"
                          @change="handleSTLUpload"
                        />
                      </label>
                    </div>
                    <p class="text-xs text-gray-500">STL файлы до 50MB</p>
                  </div>
                </div>

                <div v-if="stlFile" class="mt-2 flex items-center text-sm text-gray-600">
                  <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {{ stlFile.name }}
                  <button
                    type="button"
                    @click="stlFile = null"
                    class="ml-2 text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <!-- Error message -->
              <div v-if="errors.general" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ errors.general }}</h3>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Сохранение...' : (isEditing ? 'Обновить' : 'Создать') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { api } from '@/services/api'

interface Project {
  id?: number
  title: string
  description: string
  category: string
  images: string[]
  stl_file?: string
  is_featured: boolean
  estimated_price?: number
  estimated_duration_hours?: number
  complexity_level?: string
  price_range_min?: number
  price_range_max?: number
}

interface Props {
  project?: Project | null
  isEditing: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', project: Project): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const dragOver = ref(false)
const stlFile = ref<File | null>(null)

// Existing files
const existingImages = ref<string[]>([])
const existingSTLFile = ref<string | null>(null)

const form = reactive({
  title: '',
  description: '',
  category: '',
  is_featured: false,
  estimated_price: undefined as number | undefined,
  estimated_duration_hours: undefined as number | undefined,
  complexity_level: '',
  price_range_min: undefined as number | undefined,
  price_range_max: undefined as number | undefined
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  general: ''
})

const imagePreview = ref<Array<{ file: File; url: string }>>([])

const clearErrors = () => {
  errors.title = ''
  errors.description = ''
  errors.category = ''
  errors.general = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Название проекта обязательно'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Описание проекта обязательно'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'Выберите категорию'
    isValid = false
  }

  return isValid
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addImages(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  
  if (event.dataTransfer?.files) {
    const imageFiles = Array.from(event.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    addImages(imageFiles)
  }
}

const addImages = (files: File[]) => {
  files.forEach(file => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      errors.general = `Файл ${file.name} слишком большой. Максимальный размер: 10MB`
      return
    }

    const url = URL.createObjectURL(file)
    imagePreview.value.push({ file, url })
  })
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(imagePreview.value[index].url)
  imagePreview.value.splice(index, 1)
}

// Methods for existing files
const removeExistingImage = (index: number) => {
  existingImages.value.splice(index, 1)
}

const removeExistingSTL = () => {
  existingSTLFile.value = null
}

const getImageUrl = (image: string): string => {
  if (image.startsWith('http')) {
    return image
  }
  return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/uploads/${image}`
}

const getSTLFileName = (stlPath: string): string => {
  const parts = stlPath.split('/')
  return parts[parts.length - 1] || 'model.stl'
}

const handleSTLUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      errors.general = 'STL файл слишком большой. Максимальный размер: 50MB'
      return
    }
    
    stlFile.value = file
  }
}

const uploadFiles = async () => {
  const uploadedImages: string[] = []
  let uploadedSTL: string | undefined

  // Upload images
  for (const image of imagePreview.value) {
    const formData = new FormData()
    formData.append('file', image.file)
    
    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      uploadedImages.push(response.data.data.url)
    } catch (error) {
      throw new Error(`Ошибка загрузки изображения: ${image.file.name}`)
    }
  }

  // Upload STL file
  if (stlFile.value) {
    const formData = new FormData()
    formData.append('file', stlFile.value)
    
    try {
      const response = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      uploadedSTL = response.data.data.url
    } catch (error) {
      throw new Error('Ошибка загрузки STL файла')
    }
  }

  return { images: uploadedImages, stlFile: uploadedSTL }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  clearErrors()

  try {
    // Check auth token
    const token = localStorage.getItem('admin_token')
    console.log('Auth token:', token ? 'Present' : 'Missing')
    
    // Upload files first
    const { images, stlFile: stlUrl } = await uploadFiles()
    console.log('Uploaded files:', { images, stlUrl })

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      is_featured: form.is_featured,
      images: [...existingImages.value, ...images],
      stl_file: stlUrl || existingSTLFile.value,
      estimated_price: form.estimated_price || null,
      estimated_duration_hours: form.estimated_duration_hours || null,
      complexity_level: form.complexity_level || null,
      price_range_min: form.price_range_min || null,
      price_range_max: form.price_range_max || null
    }
    
    console.log('Project data to send:', projectData)

    let response
    if (props.isEditing && props.project?.id) {
      response = await api.put(`/projects/${props.project.id}`, projectData)
    } else {
      response = await api.post('/projects', projectData)
    }

    emit('saved', response.data.data)
  } catch (error: any) {
    console.error('Error saving project:', error)
    errors.general = error.message || 'Произошла ошибка при сохранении проекта'
  } finally {
    loading.value = false
  }
}

// Initialize form when editing
const initializeForm = (project: Project) => {
  form.title = project.title
  form.description = project.description
  form.category = project.category
  form.is_featured = project.is_featured
  form.estimated_price = project.estimated_price
  form.estimated_duration_hours = project.estimated_duration_hours
  form.complexity_level = project.complexity_level || ''
  form.price_range_min = project.price_range_min
  form.price_range_max = project.price_range_max
  
  // Initialize existing files
  existingImages.value = [...(project.images || [])]
  existingSTLFile.value = project.stl_file || null
}

watch(() => props.project, (project) => {
  if (project && props.isEditing) {
    initializeForm(project)
  }
}, { immediate: true })

onMounted(() => {
  if (props.project && props.isEditing) {
    initializeForm(props.project)
  }
})
</script>