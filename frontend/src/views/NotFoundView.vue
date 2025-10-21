<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 Illustration -->
      <div class="mb-8">
        <div class="text-6xl font-bold text-primary-600 mb-4">404</div>
        <div class="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-neutral-900 mb-4">
        Страница не найдена
      </h1>

      <p class="text-neutral-600 mb-8">
        К сожалению, запрашиваемая страница не существует. Возможно, она была перемещена или удалена.
      </p>

      <div class="space-y-3">
        <RouterLink
          to="/"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-block"
        >
          На главную
        </RouterLink>
        
        <button
          @click="goBack"
          class="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Назад
        </button>
      </div>

      <!-- Quick Links -->
      <div class="mt-8 pt-8 border-t border-neutral-200">
        <h3 class="text-sm font-semibold text-neutral-900 mb-4">Популярные разделы</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <RouterLink
            to="/gallery"
            class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
          >
            Галерея
          </RouterLink>
          <RouterLink
            to="/services"
            class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
          >
            Услуги
          </RouterLink>
          <RouterLink
            to="/blog"
            class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
          >
            Блог
          </RouterLink>
          <RouterLink
            to="/order"
            class="text-neutral-600 hover:text-primary-600 transition-colors duration-200"
          >
            Заказать
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>