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
              {{ isEdit ? 'Редактировать контент' : 'Создать контент' }}
            </h3>

            <form @submit.prevent="saveContent" class="space-y-6">
              <!-- Key -->
              <div>
                <label for="key" class="block text-sm font-medium text-gray-700">
                  Ключ *
                </label>
                <input
                  id="key"
                  v-model="form.key"
                  type="text"
                  required
                  :disabled="isEdit"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="home.hero.title"
                />
                <p class="mt-1 text-sm text-gray-500">
                  Уникальный идентификатор контента (например: home.hero.title)
                </p>
              </div>

              <!-- Description -->
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Описание
                </label>
                <input
                  id="description"
                  v-model="form.description"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Описание для администраторов"
                />
              </div>

              <!-- Group and Type -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="group_name" class="block text-sm font-medium text-gray-700">
                    Группа
                  </label>
                  <input
                    id="group_name"
                    v-model="form.group_name"
                    type="text"
                    list="groups-list"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="home, services, about..."
                  />
                  <datalist id="groups-list">
                    <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
                  </datalist>
                </div>

                <div>
                  <label for="content_type" class="block text-sm font-medium text-gray-700">
                    Тип контента *
                  </label>
                  <select
                    id="content_type"
                    v-model="form.content_type"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="text">Текст</option>
                    <option value="html">HTML</option>
                    <option value="json">JSON</option>
                    <option value="image_url">URL изображения</option>
                  </select>
                </div>
              </div>

              <!-- Sort Order and Status -->
              <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label for="sort_order" class="block text-sm font-medium text-gray-700">
                    Порядок сортировки
                  </label>
                  <input
                    id="sort_order"
                    v-model="form.sort_order"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Статус
                  </label>
                  <div class="mt-2">
                    <label class="inline-flex items-center">
                      <input
                        v-model="form.is_active"
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-900">Активен</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div v-if="form.content_type !== 'json'">
                <label for="content" class="block text-sm font-medium text-gray-700">
                  Содержимое *
                </label>
                <textarea
                  v-if="form.content_type === 'html'"
                  id="content"
                  v-model="form.content"
                  rows="8"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder="<h1>Заголовок</h1><p>Текст...</p>"
                ></textarea>
                <textarea
                  v-else-if="form.content_type === 'text'"
                  id="content"
                  v-model="form.content"
                  rows="4"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Введите текст..."
                ></textarea>
                <input
                  v-else-if="form.content_type === 'image_url'"
                  id="content"
                  v-model="form.content"
                  type="url"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <!-- JSON Content -->
              <div v-if="form.content_type === 'json'">
                <label for="json_content" class="block text-sm font-medium text-gray-700">
                  JSON содержимое *
                </label>
                <textarea
                  id="json_content"
                  v-model="jsonContentString"
                  rows="8"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                  placeholder='{"title": "Заголовок", "description": "Описание"}'
                ></textarea>
                <p class="mt-1 text-sm text-gray-500">
                  Введите валидный JSON
                </p>
                <div v-if="jsonError" class="mt-2 text-sm text-red-600">
                  {{ jsonError }}
                </div>
              </div>

              <!-- Preview -->
              <div v-if="form.content || jsonContentString" class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Предварительный просмотр:</h4>
                <div v-if="form.content_type === 'html'" v-html="form.content" class="prose prose-sm max-w-none"></div>
                <div v-else-if="form.content_type === 'text'" class="text-sm text-gray-700">{{ form.content }}</div>
                <div v-else-if="form.content_type === 'image_url'" class="text-sm">
                  <img v-if="form.content" :src="form.content" alt="Preview" class="max-w-xs max-h-32 object-contain rounded" />
                  <span v-else class="text-gray-500">URL изображения</span>
                </div>
                <div v-else-if="form.content_type === 'json'" class="text-sm">
                  <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{{ jsonContentString }}</pre>
                </div>
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
import { ref, reactive, onMounted, watch } from 'vue'
import { api } from '@/services/api'

interface Content {
  id?: number
  key: string
  content_type: string
  content?: string
  json_content?: Record<string, unknown>
  description?: string
  group_name?: string
  is_active: boolean
  sort_order: string
  created_at?: string
  updated_at?: string
}

interface Props {
  content?: Content | null
  isEdit?: boolean
  groups?: string[]
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', content: Content): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const error = ref('')
const jsonError = ref('')

const form = reactive({
  key: '',
  content_type: 'text',
  content: '',
  json_content: null as any,
  description: '',
  group_name: '',
  is_active: true,
  sort_order: '0'
})

const jsonContentString = ref('')

// Watch for JSON content changes and validate
watch(jsonContentString, (newValue: string) => {
  jsonError.value = ''
  if (newValue.trim()) {
    try {
      form.json_content = JSON.parse(newValue)
    } catch (e) {
      jsonError.value = 'Невалидный JSON'
      form.json_content = null
    }
  } else {
    form.json_content = null
  }
})

// Watch for content type changes
watch(() => form.content_type, (newType: string) => {
  if (newType === 'json') {
    form.content = ''
  } else {
    form.json_content = null
    jsonContentString.value = ''
  }
})

const saveContent = async () => {
  loading.value = true
  error.value = ''
  
  // Validate JSON if needed
  if (form.content_type === 'json') {
    if (!jsonContentString.value.trim()) {
      error.value = 'JSON содержимое обязательно для типа JSON'
      loading.value = false
      return
    }
    if (jsonError.value) {
      error.value = 'Исправьте ошибки в JSON перед сохранением'
      loading.value = false
      return
    }
  }
  
  try {
    let response
    
    if (props.isEdit && props.content?.id) {
      response = await api.put(`/cms/admin/content/${props.content.id}`, form)
    } else {
      response = await api.post('/cms/admin/content', form)
    }
    
    emit('saved', response.data.data)
  } catch (err: any) {
    console.error('Error saving content:', err)
    error.value = err.response?.data?.message || 'Произошла ошибка при сохранении контента'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.isEdit && props.content) {
    Object.assign(form, {
      key: props.content.key,
      content_type: props.content.content_type,
      content: props.content.content || '',
      json_content: props.content.json_content,
      description: props.content.description || '',
      group_name: props.content.group_name || '',
      is_active: props.content.is_active,
      sort_order: props.content.sort_order
    })
    
    if (props.content.content_type === 'json' && props.content.json_content) {
      jsonContentString.value = JSON.stringify(props.content.json_content, null, 2)
    }
  }
})
</script>