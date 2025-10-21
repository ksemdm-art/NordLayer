<template>
  <footer class="bg-primary-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="col-span-1 md:col-span-2">
          <div class="mb-4">
            <NordLayerLogo variant="full" size="lg" color="white" />
          </div>
          <p class="text-primary-200 mb-4 max-w-md font-medium">
            Мастерская цифрового ремесла из Карелии. Слой за слоем рождается форма. 
            Мы не просто печатаем — мы создаём вещи с душой.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-primary-200">Навигация</h3>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="text-primary-300 hover:text-primary-50 transition-colors duration-200">
                Главная
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/gallery" class="text-primary-300 hover:text-primary-50 transition-colors duration-200">
                Галерея
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/services" class="text-primary-300 hover:text-primary-50 transition-colors duration-200">
                Услуги
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/reviews" class="text-primary-300 hover:text-primary-50 transition-colors duration-200">
                Отзывы
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/blog" class="text-primary-300 hover:text-primary-50 transition-colors duration-200">
                Блог
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-primary-200">Контакты</h3>
          <ul class="space-y-2 text-primary-300">
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span>nordlayer@yandex.com</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span>+7 (921) 455-85-34</span>
            </li>
            <li class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
              </svg>
              <span>Петрозаводск, Карелия</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-primary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-primary-400 text-sm">
          © {{ currentYear }} NordLayer. Все права защищены.
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <a href="#" class="text-primary-400 hover:text-primary-50 text-sm transition-colors duration-200">
            Политика конфиденциальности
          </a>
          <a href="#" class="text-primary-400 hover:text-primary-50 text-sm transition-colors duration-200">
            Условия использования
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import NordLayerLogo from '@/components/common/NordLayerLogo.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>