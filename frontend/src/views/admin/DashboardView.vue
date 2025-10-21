<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Дашборд</h1>
        <p class="mt-2 text-sm text-gray-700">
          Обзор основных метрик и активности платформы
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.name"
          class="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
        >
          <dt>
            <div class="absolute rounded-md p-3" :class="stat.iconBackground">
              <component :is="stat.icon" class="h-6 w-6 text-white" />
            </div>
            <p class="ml-16 truncate text-sm font-medium text-gray-500">{{ stat.name }}</p>
          </dt>
          <dd class="ml-16 flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
            <p
              v-if="stat.change"
              class="ml-2 flex items-baseline text-sm font-semibold"
              :class="stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
            >
              <svg
                v-if="stat.changeType === 'increase'"
                class="h-5 w-5 flex-shrink-0 self-center text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04L10.75 5.612V16.25A.75.75 0 0110 17z"
                  clip-rule="evenodd"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5 flex-shrink-0 self-center text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04L9.25 14.388V3.75A.75.75 0 0110 3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only"> {{ stat.changeType === 'increase' ? 'Увеличение' : 'Уменьшение' }} на </span>
              {{ stat.change }}
            </p>
          </dd>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent orders -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Последние заказы</h3>
              <router-link
                to="/admin/orders"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Все заказы
              </router-link>
            </div>
            <div class="mt-6 flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                <li v-for="order in recentOrders" :key="order.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        Заказ #{{ order.id }}
                      </p>
                      <p class="text-sm text-gray-500 truncate">
                        {{ order.customer_name }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(order.status)"
                      >
                        {{ getStatusText(order.status) }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Recent projects -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Последние проекты</h3>
              <router-link
                to="/admin/projects"
                class="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Все проекты
              </router-link>
            </div>
            <div class="mt-6 flow-root">
              <ul role="list" class="-my-5 divide-y divide-gray-200">
                <li v-for="project in recentProjects" :key="project.id" class="py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <img
                        v-if="project.images && project.images.length > 0"
                        class="h-8 w-8 rounded object-cover"
                        :src="project.images[0]"
                        :alt="project.title"
                      />
                      <div v-else class="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                        <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ project.title }}
                      </p>
                      <p class="text-sm text-gray-500 truncate">
                        {{ project.category }}
                      </p>
                    </div>
                    <div class="flex-shrink-0">
                      <span
                        v-if="project.is_featured"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        Рекомендуемый
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import { api } from '@/services/api'

interface Order {
  id: number
  customer_name: string
  status: string
  created_at: string
}

interface Project {
  id: number
  title: string
  category: string
  images: string[]
  is_featured: boolean
  created_at: string
}

const stats = ref([
  {
    name: 'Всего проектов',
    value: '0',
    icon: 'CubeIcon',
    iconBackground: 'bg-blue-500',
    change: null,
    changeType: null
  },
  {
    name: 'Активные заказы',
    value: '0',
    icon: 'ShoppingBagIcon',
    iconBackground: 'bg-green-500',
    change: null,
    changeType: null
  },
  {
    name: 'Статьи',
    value: '0',
    icon: 'DocumentTextIcon',
    iconBackground: 'bg-purple-500',
    change: null,
    changeType: null
  },
  {
    name: 'Пользователи',
    value: '0',
    icon: 'UsersIcon',
    iconBackground: 'bg-orange-500',
    change: null,
    changeType: null
  }
])

const recentOrders = ref<Order[]>([])
const recentProjects = ref<Project[]>([])

const getStatusClass = (status: string) => {
  const classes = {
    'new': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'cancelled': 'Отменен'
  }
  return texts[status as keyof typeof texts] || status
}

const loadDashboardData = async () => {
  try {
    // Load stats
    const [projectsRes, ordersRes, articlesRes] = await Promise.all([
      api.get('/projects'),
      api.get('/orders'),
      api.get('/articles')
    ])

    // Extract data from API response format {success, message, data}
    const projects = projectsRes.data.data || []
    const orders = ordersRes.data.data || []
    const articles = articlesRes.data.data || []

    stats.value[0].value = projects.length.toString()
    stats.value[1].value = orders.filter((o: Order) => o.status !== 'completed' && o.status !== 'cancelled').length.toString()
    stats.value[2].value = articles.length.toString()

    // Load recent data
    recentOrders.value = orders.slice(0, 5)
    recentProjects.value = projects.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<script lang="ts">
// Icon components
const CubeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`
}

const ShoppingBagIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" /></svg>`
}

const DocumentTextIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
}

const UsersIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
}

export default {
  components: {
    CubeIcon,
    ShoppingBagIcon,
    DocumentTextIcon,
    UsersIcon
  }
}
</script>