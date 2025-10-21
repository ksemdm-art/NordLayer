<template>
  <header class="bg-white shadow-soft border-b border-primary-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <RouterLink to="/" class="flex items-center">
            <NordLayerLogo variant="full" size="md" color="primary" />
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === item.href }"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="hidden md:block">
          <RouterLink
            to="/order"
            class="bg-accent-500 hover:bg-accent-600 text-primary-50 px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Заказать печать
          </RouterLink>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="text-primary-600 hover:text-primary-950 focus:outline-none focus:text-primary-950 transition-colors duration-200"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-primary-200 py-4">
        <div class="flex flex-col space-y-3">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="nav-link-mobile"
            :class="{ 'nav-link-mobile-active': $route.path === item.href }"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </RouterLink>
          <RouterLink
            to="/order"
            class="bg-accent-500 hover:bg-accent-600 text-primary-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center mt-4"
            @click="mobileMenuOpen = false"
          >
            Заказать печать
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import NordLayerLogo from '@/components/common/NordLayerLogo.vue'

const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Главная', href: '/' },
  { name: 'Галерея', href: '/gallery' },
  { name: 'Услуги', href: '/services' },
  { name: 'Отзывы', href: '/reviews' },
  { name: 'Блог', href: '/blog' },
]
</script>

<style scoped>
.nav-link {
  @apply text-primary-700 hover:text-primary-950 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200;
}

.nav-link-active {
  @apply text-primary-950 bg-accent-50 font-bold;
}

.nav-link-mobile {
  @apply text-primary-700 hover:text-primary-950 block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200;
}

.nav-link-mobile-active {
  @apply text-primary-950 bg-accent-50 font-bold;
}
</style>