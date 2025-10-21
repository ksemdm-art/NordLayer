<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-neutral-50">
    <div class="max-w-md w-full bg-white rounded-lg shadow-soft p-8 text-center">
      <div class="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      
      <h2 class="text-xl font-semibold text-neutral-900 mb-2">
        Что-то пошло не так
      </h2>
      
      <p class="text-neutral-600 mb-6">
        Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу или вернуться позже.
      </p>
      
      <div class="space-y-3">
        <button
          @click="retry"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Попробовать снова
        </button>
        
        <button
          @click="goHome"
          class="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          На главную
        </button>
      </div>
      
      <details v-if="errorDetails && isDevelopment" class="mt-6 text-left">
        <summary class="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
          Детали ошибки (только для разработки)
        </summary>
        <pre class="mt-2 text-xs text-error-600 bg-error-50 p-3 rounded overflow-auto">{{ errorDetails }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasError = ref(false)
const errorDetails = ref<string>('')

const isDevelopment = import.meta.env.DEV

onErrorCaptured((error: Error) => {
  hasError.value = true
  errorDetails.value = error.stack || error.message
  console.error('Error caught by ErrorBoundary:', error)
  return false
})

const retry = () => {
  hasError.value = false
  errorDetails.value = ''
  // Force component re-render
  window.location.reload()
}

const goHome = () => {
  hasError.value = false
  errorDetails.value = ''
  router.push('/')
}
</script>