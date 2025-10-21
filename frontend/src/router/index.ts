import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { globalNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Главная - 3D Print Pro',
      description: 'Профессиональные услуги 3D печати'
    }
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('../views/GalleryView.vue'),
    meta: {
      title: 'Галерея проектов - 3D Print Pro',
      description: 'Примеры наших работ и 3D проектов'
    }
  },
  {
    path: '/gallery/:id',
    name: 'project-detail',
    component: () => import('../views/ProjectDetailView.vue'),
    meta: {
      title: 'Проект - 3D Print Pro',
      description: 'Детали проекта 3D печати'
    }
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesView.vue'),
    meta: {
      title: 'Услуги - 3D Print Pro',
      description: 'Наши услуги 3D печати и прайс-лист'
    }
  },
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/BlogView.vue'),
    meta: {
      title: 'Блог - 3D Print Pro',
      description: 'Статьи и новости о 3D печати'
    }
  },
  {
    path: '/blog/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetailView.vue'),
    meta: {
      title: 'Статья - 3D Print Pro',
      description: 'Читать статью о 3D печати'
    }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('../views/OrderView.vue'),
    meta: {
      title: 'Заказать печать - 3D Print Pro',
      description: 'Оформить заказ на 3D печать'
    }
  },
  {
    path: '/order/success/:id',
    name: 'order-success',
    component: () => import('../views/OrderSuccessView.vue'),
    meta: {
      title: 'Заказ оформлен - 3D Print Pro',
      description: 'Ваш заказ успешно оформлен'
    }
  },
  {
    path: '/reviews',
    name: 'reviews',
    component: () => import('../views/ReviewsView.vue'),
    meta: {
      title: 'Отзывы клиентов - 3D Print Pro',
      description: 'Отзывы наших клиентов о качестве 3D печати и сервисе'
    }
  },
  {
    path: '/reviews/leave',
    name: 'leave-review',
    component: () => import('../views/LeaveReviewView.vue'),
    meta: {
      title: 'Оставить отзыв - 3D Print Pro',
      description: 'Поделитесь своим опытом работы с нами'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      title: 'Контакты - 3D Print Pro',
      description: 'Свяжитесь с нами для консультации по 3D печати'
    }
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/admin/LoginView.vue'),
    meta: {
      title: 'Вход в админ-панель - 3D Print Pro',
      description: 'Авторизация администратора'
    }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: {
      title: 'Админ-панель - 3D Print Pro',
      description: 'Панель управления',
      requiresAuth: true
    }
  },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: () => import('../views/admin/ProjectsView.vue'),
    meta: {
      title: 'Управление проектами - 3D Print Pro',
      description: 'Управление проектами галереи',
      requiresAuth: true
    }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('../views/admin/OrdersView.vue'),
    meta: {
      title: 'Управление заказами - 3D Print Pro',
      description: 'Просмотр и управление заказами клиентов',
      requiresAuth: true
    }
  },
  {
    path: '/admin/articles',
    name: 'admin-articles',
    component: () => import('../views/admin/ArticlesView.vue'),
    meta: {
      title: 'Управление статьями - 3D Print Pro',
      description: 'Создание и редактирование статей блога',
      requiresAuth: true
    }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/admin/UsersView.vue'),
    meta: {
      title: 'Управление пользователями - 3D Print Pro',
      description: 'Управление пользователями системы',
      requiresAuth: true
    }
  },
  {
    path: '/admin/content',
    name: 'admin-content',
    component: () => import('../views/admin/ContentView.vue'),
    meta: {
      title: 'Управление контентом - 3D Print Pro',
      description: 'Редактирование текстов и контента сайта',
      requiresAuth: true
    }
  },
  {
    path: '/admin/services',
    name: 'admin-services',
    component: () => import('../views/admin/ServicesManagementView.vue'),
    meta: {
      title: 'Управление услугами - 3D Print Pro',
      description: 'Создание и редактирование услуг компании',
      requiresAuth: true
    }
  },
  {
    path: '/admin/colors',
    name: 'admin-colors',
    component: () => import('../views/admin/ColorsView.vue'),
    meta: {
      title: 'Управление цветами - 3D Print Pro',
      description: 'Управление цветами для 3D печати',
      requiresAuth: true
    }
  },
  {
    path: '/admin/reviews',
    name: 'admin-reviews',
    component: () => import('../views/admin/ReviewsManagementView.vue'),
    meta: {
      title: 'Управление отзывами - 3D Print Pro',
      description: 'Модерация и управление отзывами клиентов',
      requiresAuth: true
    }
  },
  {
    path: '/admin/contact-requests',
    name: 'admin-contact-requests',
    component: () => import('../views/admin/ContactRequestsView.vue'),
    meta: {
      title: 'Управление запросами обратной связи - 3D Print Pro',
      description: 'Просмотр и обработка запросов от клиентов',
      requiresAuth: true
    }
  },
  // 404 page
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Страница не найдена - 3D Print Pro',
      description: 'Запрашиваемая страница не найдена'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when changing pages
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  // Update document title
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }

  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta?.description) {
    metaDescription.setAttribute('content', to.meta.description as string)
  }

  // Check authentication for admin routes
  if (to.meta?.requiresAuth) {
    const authStore = useAuthStore()
    
    // Initialize auth if not already done
    if (!authStore.user && authStore.token) {
      try {
        await authStore.initAuth()
      } catch (error) {
        // Auth failed, redirect to login
        next('/admin/login')
        return
      }
    }
    
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      next('/admin/login')
      return
    }
  }

  // Redirect authenticated admin users away from login page
  if (to.name === 'admin-login') {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated && authStore.isAdmin) {
      next('/admin')
      return
    }
  }

  next()
})

router.onError((error) => {
  console.error('Router error:', error)
  globalNotifications.error(
    'Ошибка навигации',
    'Произошла ошибка при переходе на страницу'
  )
})

export default router