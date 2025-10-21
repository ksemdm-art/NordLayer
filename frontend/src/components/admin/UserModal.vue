<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
              {{ isEdit ? 'Редактировать пользователя' : 'Создать пользователя' }}
            </h3>

            <form @submit.prevent="saveUser" class="space-y-6">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  :disabled="isEdit"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="user@example.com"
                />
                <p v-if="isEdit" class="mt-1 text-sm text-gray-500">
                  Email нельзя изменить после создания пользователя
                </p>
              </div>

              <!-- Full Name -->
              <div>
                <label for="full_name" class="block text-sm font-medium text-gray-700">
                  Полное имя
                </label>
                <input
                  id="full_name"
                  v-model="form.full_name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Иван Иванов"
                />
              </div>

              <!-- Password (only for new users) -->
              <div v-if="!isEdit">
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Пароль *
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Введите пароль"
                />
              </div>

              <!-- Role -->
              <div>
                <label for="role" class="block text-sm font-medium text-gray-700">
                  Роль *
                </label>
                <select
                  id="role"
                  v-model="form.role"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Выберите роль</option>
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <!-- Status -->
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
                    <span class="ml-2 text-sm text-gray-900">Активный пользователь</span>
                  </label>
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
import { ref, reactive, onMounted } from 'vue'
import { api } from '@/services/api'

interface User {
  id?: number
  email: string
  full_name?: string
  role: string
  is_active: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
}

interface Props {
  user?: User | null
  isEdit?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'saved', user: User): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  full_name: '',
  password: '',
  role: '',
  is_active: true
})

const saveUser = async () => {
  loading.value = true
  error.value = ''
  
  try {
    let response
    
    if (props.isEdit && props.user?.id) {
      // For editing, don't send password and email
      const updateData = {
        full_name: form.full_name,
        role: form.role,
        is_active: form.is_active
      }
      response = await api.put(`/users/${props.user.id}`, updateData)
    } else {
      // For creating, send all data
      response = await api.post('/users', form)
    }
    
    emit('saved', response.data.data)
  } catch (err: any) {
    console.error('Error saving user:', err)
    error.value = err.response?.data?.message || 'Произошла ошибка при сохранении пользователя'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.isEdit && props.user) {
    Object.assign(form, {
      email: props.user.email,
      full_name: props.user.full_name || '',
      role: props.user.role,
      is_active: props.user.is_active,
      password: '' // Don't populate password for editing
    })
  }
})
</script>