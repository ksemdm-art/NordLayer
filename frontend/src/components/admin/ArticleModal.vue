<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
              {{ isEdit ? 'Редактировать статью' : 'Создать статью' }}
            </h3>

            <form @submit.prevent="saveArticle" class="space-y-6">
              <!-- Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Заголовок *
                </label>
                <input
                  id="title"
                  v-model="form.title"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Введите заголовок статьи"
                />
              </div>

              <!-- Excerpt -->
              <div>
                <label for="excerpt" class="block text-sm font-medium text-gray-700">
                  Краткое описание *
                </label>
                <textarea
                  id="excerpt"
                  v-model="form.excerpt"
                  rows="3"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Краткое описание статьи для превью"
                ></textarea>
              </div>

              <!-- Category and Status -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="category" class="block text-sm font-medium text-gray-700">
                    Категория *
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Выберите категорию</option>
                    <option value="news">Новости</option>
                    <option value="tutorials">Уроки</option>
                    <option value="projects">Проекты</option>
                  </select>
                </div>

                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Статус *
                  </label>
                  <select
                    id="status"
                    v-model="form.status"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="draft">Черновик</option>
                    <option value="published">Опубликована</option>
                  </select>
                </div>
              </div>

              <!-- Featured Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Изображение статьи
                </label>
                <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div class="space-y-1 text-center">
                    <div v-if="form.featured_image" class="mb-4">
                      <img
                        :src="form.featured_image"
                        alt="Preview"
                        class="mx-auto h-32 w-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        @click="form.featured_image = ''"
                        class="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Удалить изображение
                      </button>
                    </div>
                    <div v-else>
                      <svg
                        class="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label
                          for="featured-image"
                          class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Загрузить изображение</span>
                          <input
                            id="featured-image"
                            type="file"
                            class="sr-only"
                            accept="image/*"
                            @change="handleImageUpload"
                          />
                        </label>
                        <p class="pl-1">или перетащите сюда</p>
                      </div>
                      <p class="text-xs text-gray-500">PNG, JPG, GIF до 10MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700">
                  Содержание статьи *
                </label>
                <textarea
                  id="content"
                  v-model="form.content"
                  rows="12"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Введите содержание статьи (поддерживается Markdown)"
                ></textarea>
                <p class="mt-2 text-sm text-gray-500">
                  Вы можете использовать Markdown для форматирования текста.
                </p>
              </div>

              <!-- Error message -->
              <div v-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
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
                  {{ loading ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать') }}
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
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/services/api'
import type { Article } from '@/types'

interface ArticleForm {
  id?: number
  title: string
  excerpt: string
  content: string
  featured_image?: string
  status: string
  category: string
  views?: number
  created_at?: string
  updated_at?: string
}

interface Props {
  article?: Article | null
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', article: Article): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const error = ref('')

const form = reactive<ArticleForm>({
  title: '',
  excerpt: '',
  content: '',
  featured_image: '',
  status: 'draft',
  category: ''
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    error.value = 'Размер файла не должен превышать 10MB'
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Пожалуйста, выберите изображение'
    return
  }
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    loading.value = true
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    form.featured_image = response.data.data.url
    error.value = ''
  } catch (err: any) {
    console.error('Error uploading image:', err)
    error.value = err.response?.data?.message || 'Ошибка при загрузке изображения'
  } finally {
    loading.value = false
  }
}

const saveArticle = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔄 Saving article:', form.title, 'isEdit:', props.isEdit)
    console.log('📤 Article data:', form)
    
    let response
    
    if (props.isEdit && props.article?.id) {
      console.log('🔄 Updating existing article ID:', props.article.id)
      response = await api.put(`/articles/${props.article.id}`, form)
    } else {
      console.log('🔄 Creating new article')
      response = await api.post('/articles', form)
    }
    
    console.log('✅ Article save response:', response.data)
    
    // Преобразуем ответ сервера в тип Article
    const savedArticle: Article = {
      ...response.data.data,
      is_published: response.data.data.status === 'published'
    }
    
    console.log('✅ Emitting saved article:', savedArticle)
    emit('saved', savedArticle)
  } catch (err: any) {
    console.error('❌ Error saving article:', err)
    console.error('❌ Error response:', err.response?.data)
    error.value = err.response?.data?.message || 'Произошла ошибка при сохранении статьи'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.isEdit && props.article) {
    Object.assign(form, {
      title: props.article.title,
      excerpt: props.article.excerpt,
      content: props.article.content,
      featured_image: props.article.featured_image || '',
      status: props.article.is_published ? 'published' : 'draft',
      category: props.article.category
    })
  }
})
</script>