<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section relative overflow-hidden bg-primary-900 text-white">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-800/90 to-primary-900/95"></div>
      <div class="relative container mx-auto px-4 py-20 lg:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up text-primary-50 drop-shadow-lg">
            {{ content['home.hero.title'] || 'Слой за слоем рождается форма' }}
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-primary-100 animate-fade-in-up animation-delay-200 drop-shadow">
            {{ content['home.hero.subtitle'] || 'NordLayer — мастерская цифрового ремесла из Карелии. Мы не просто печатаем — мы создаём вещи с душой.' }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button 
              @click="scrollToServices"
              class="px-8 py-4 bg-accent-500 text-primary-50 font-bold rounded-lg transform hover:scale-105 hover:shadow-xl hover:bg-accent-600 transition-all duration-300 ease-out shadow-lg"
            >
              {{ content['home.hero.cta_text'] || 'Наши услуги' }}
            </button>
            <button 
              @click="navigateToGallery"
              class="px-8 py-4 bg-transparent border-2 border-primary-50 text-primary-50 font-bold rounded-lg transform hover:scale-105 hover:shadow-xl hover:bg-primary-50 hover:text-primary-900 transition-all duration-300 ease-out"
            >
              Посмотреть работы
            </button>
          </div>
        </div>
      </div>
      
      <!-- Nordic floating elements -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-accent-500/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-primary-300/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-20 h-20 bg-accent-400/20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Services Preview Section -->
    <section ref="servicesSection" class="py-16 bg-gradient-to-br from-primary-50 to-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Наше ремесло
          </h2>
          <p class="text-lg text-primary-700 max-w-2xl mx-auto font-medium">
            Технологии становятся искусством в руках мастеров
          </p>
        </div>
        
        <!-- Loading State -->
        <div v-if="servicesLoading" class="grid md:grid-cols-3 gap-8 mb-12">
          <Card 
            v-for="i in 3" 
            :key="i"
            class="text-center bg-white border-0 animate-pulse"
          >
            <div class="p-6">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-200"></div>
              <div class="h-6 bg-primary-200 rounded mb-3 mx-auto w-3/4"></div>
              <div class="h-4 bg-primary-200 rounded mb-2"></div>
              <div class="h-4 bg-primary-200 rounded mb-4 w-2/3 mx-auto"></div>
              <div class="h-8 bg-primary-200 rounded w-1/2 mx-auto"></div>
            </div>
          </Card>
        </div>

        <!-- Services -->
        <div v-else class="grid md:grid-cols-3 gap-8 mb-12">
          <Card 
            v-for="(service, index) in featuredServices" 
            :key="service.id"
            class="text-center hover:shadow-xl transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-105 bg-white border-0"
          >
            <div class="p-6">
              <div 
                class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                :class="getServiceIconClass(index)"
              >
                <ServiceIcon :icon="service.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-bold mb-3 text-primary-900">{{ service.name }}</h3>
              <p class="text-primary-600 mb-4">{{ service.description }}</p>
            </div>
          </Card>
        </div>
        
        <div class="text-center">
          <button 
            @click="navigateToServices"
            class="px-8 py-4 bg-primary-900 text-primary-50 font-bold rounded-lg hover:shadow-xl hover:scale-105 hover:bg-primary-800 transition-all duration-300 ease-out shadow-lg"
          >
            Все услуги
          </button>
        </div>
      </div>
    </section>

    <!-- Advantages Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {{ content['home.features.title'] || 'Северный характер' }}
          </h2>
          <p class="text-lg text-primary-700 max-w-2xl mx-auto font-medium">
            Честность, мастерство и внимание к деталям — основа нашей работы
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div 
            v-for="advantage in dynamicAdvantages" 
            :key="advantage.title"
            class="text-center group"
          >
            <div class="w-20 h-20 mx-auto mb-4 bg-accent-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out shadow-lg group-hover:shadow-xl">
              <component :is="getAdvantageIcon(advantage.icon)" class="w-10 h-10 text-primary-50 transition-transform duration-300" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-primary-900">{{ advantage.title }}</h3>
            <p class="text-primary-700 font-medium">{{ advantage.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-12 bg-primary-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-3">
            Отзывы клиентов
          </h2>
          <p class="text-lg text-primary-700 max-w-2xl mx-auto mb-4 font-medium">
            Что говорят наши клиенты о качестве наших услуг
          </p>
        </div>
        
        <!-- Loading State -->
        <div v-if="reviewsLoading" class="grid md:grid-cols-3 gap-8 mb-12">
          <div v-for="i in 3" :key="i" class="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div class="flex items-center mb-4">
              <div class="flex space-x-1">
                <div v-for="j in 5" :key="j" class="w-5 h-5 bg-primary-200 rounded"></div>
              </div>
            </div>
            <div class="space-y-2 mb-4">
              <div class="h-4 bg-primary-200 rounded w-full"></div>
              <div class="h-4 bg-primary-200 rounded w-3/4"></div>
            </div>
            <div class="flex items-center">
              <div class="w-12 h-12 bg-primary-200 rounded-full mr-3"></div>
              <div class="space-y-1">
                <div class="h-4 bg-primary-200 rounded w-20"></div>
                <div class="h-3 bg-primary-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <div v-else-if="featuredReviews.length > 0" class="grid md:grid-cols-3 gap-8 mb-12">
          <Card 
            v-for="review in featuredReviews" 
            :key="review.id"
            class="hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out"
          >
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <StarIcon 
                    v-for="i in 5" 
                    :key="i" 
                    class="w-5 h-5"
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  />
                </div>
                <span class="ml-2 text-sm text-primary-600">{{ review.rating }}/5</span>
              </div>
              <h4 v-if="review.title" class="font-semibold text-primary-900 mb-2">{{ review.title }}</h4>
              <p class="text-primary-600 mb-4 italic">"{{ review.content }}"</p>
              
              <!-- Review Images -->
              <div v-if="review.images && review.images.length > 0" class="mb-4">
                <div class="grid grid-cols-2 gap-2" :class="{ 'grid-cols-1': review.images.length === 1 }">
                  <div 
                    v-for="(image, index) in review.images.slice(0, 2)" 
                    :key="index"
                    class="relative group cursor-pointer"
                    @click="openImageModal(image.url)"
                  >
                    <img 
                      :src="image.url" 
                      :alt="image.caption || `Фото результата ${index + 1}`"
                      class="w-full h-24 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <svg v-if="review.images.length > 2 && index === 1" class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                      </svg>
                    </div>
                    <div v-if="review.images.length > 2 && index === 1" class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      +{{ review.images.length - 2 }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center">
                <div class="w-12 h-12 bg-gradient-nordic rounded-full flex items-center justify-center mr-3">
                  <span class="text-primary-50 font-semibold text-sm">{{ getInitials(review.customer_name) }}</span>
                </div>
                <div>
                  <div class="font-semibold text-primary-900">{{ review.customer_name }}</div>
                  <div class="text-sm text-primary-500">{{ formatReviewDate(review.created_at) }}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Fallback to static testimonials if no reviews -->
        <div v-else class="grid md:grid-cols-3 gap-8 mb-12">
          <Card 
            v-for="testimonial in fallbackTestimonials" 
            :key="testimonial.id"
            class="hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out"
          >
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                  <StarIcon v-for="i in 5" :key="i" class="w-5 h-5 fill-current" />
                </div>
              </div>
              <p class="text-primary-600 mb-4 italic">"{{ testimonial.text }}"</p>
              <div class="flex items-center">
                <div class="w-12 h-12 bg-primary-300 rounded-full flex items-center justify-center mr-3">
                  <UserIcon class="w-6 h-6 text-primary-900" />
                </div>
                <div>
                  <div class="font-semibold text-primary-900">{{ testimonial.author }}</div>
                  <div class="text-sm text-primary-600">{{ testimonial.role }}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div class="text-center">
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              @click="navigateToReviews"
              class="px-8 py-4 bg-primary-900 text-primary-50 font-bold rounded-lg hover:shadow-xl hover:scale-105 hover:bg-primary-800 transition-all duration-300 ease-out shadow-lg"
            >
              Все отзывы
            </button>
            <button 
              @click="showReviewForm"
              class="px-8 py-4 bg-accent-500 text-primary-50 font-bold rounded-lg hover:shadow-xl hover:scale-105 hover:bg-accent-600 transition-all duration-300 ease-out shadow-lg"
            >
              Оставить отзыв
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Часто задаваемые вопросы
          </h2>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="mb-4"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 bg-primary-50 hover:bg-primary-100 hover:shadow-lg rounded-lg transition-all duration-300 ease-out flex justify-between items-center group"
            >
              <span class="font-bold text-lg pr-4 text-primary-900">{{ faq.question }}</span>
              <ChevronDownIcon 
                :class="['w-6 h-6 ml-4 flex-shrink-0 transition-all duration-400 ease-out group-hover:text-accent-500 text-primary-600', openFaqs.includes(index) ? 'rotate-180' : '']"
              />
            </button>
            <div 
              v-if="openFaqs.includes(index)"
              class="overflow-hidden animate-slide-down"
            >
              <div class="px-6 py-4 bg-white ml-6 relative">
                <div class="absolute left-0 top-2 bottom-2 w-1 bg-accent-500 rounded-full"></div>
                <p class="text-primary-700 font-medium">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16 bg-primary-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Свяжитесь с нами
          </h2>
          <p class="text-lg text-primary-700 max-w-2xl mx-auto font-medium">
            Есть вопросы? Нужна консультация? Мы всегда готовы помочь!
          </p>
        </div>
        
        <ContactForm @success="handleContactSuccess" />
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary-900 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-primary-50 drop-shadow-lg">
          Готовы воплотить идею в жизнь?
        </h2>
        <p class="text-xl mb-8 text-primary-100 drop-shadow">
          Каждый проект начинается с разговора. Расскажите нам о своей идее
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            @click="navigateToOrder"
            class="px-8 py-4 bg-accent-500 text-primary-50 font-bold rounded-lg hover:bg-accent-600 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out shadow-lg"
          >
            Начать проект
          </button>
          <button 
            @click="scrollToContact"
            class="px-8 py-4 bg-transparent border-2 border-primary-50 text-primary-50 font-bold rounded-lg hover:bg-primary-50 hover:text-primary-900 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
          >
            Обсудить идею
          </button>
        </div>
      </div>
    </section>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-primary-900">Оставить отзыв</h2>
            <button
              @click="closeReviewModal"
              class="text-primary-400 hover:text-primary-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <ReviewForm
            :order-id="0"
            :customer-name="''"
            :customer-email="''"
            @submit="handleReviewSubmit"
            @cancel="closeReviewModal"
          />
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full">
        <button
          @click="closeImageModal"
          class="absolute top-4 right-4 text-white hover:text-primary-200 transition-colors z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img 
          :src="selectedImage" 
          alt="Увеличенное изображение"
          class="max-w-full max-h-full object-contain rounded-lg"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card } from '@/design-system/components'
import { useContent } from '@/services/content'
import ReviewForm from '@/components/reviews/ReviewForm.vue'
import ContactForm from '@/components/common/ContactForm.vue'
import ServiceIcon from '@/components/ServiceIcon.vue'
import { api } from '@/services/api'
import { 
  ClockIcon,
  ShieldCheckIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const servicesSection = ref<HTMLElement>()
const openFaqs = ref<number[]>([])
const showReviewModal = ref(false)
const { getContentByGroup } = useContent()
const content = ref<Record<string, any>>({})

// Reviews data
const featuredReviews = ref<any[]>([])
const reviewsLoading = ref(false)

// Image modal
const selectedImage = ref<string | null>(null)

// Загружаем контент для главной страницы
onMounted(async () => {
  try {
    // Load content and reviews in parallel
    await Promise.all([
      getContentByGroup('home').then(data => {
        content.value = data
      }).catch(error => {
        console.error('Error loading home content:', error)
      }),
      loadFeaturedReviews(),
      loadFeaturedServices()
    ])
  } catch (error) {
    console.error('Error loading page data:', error)
  }
  
  // Добавляем обработчик для обновления данных при возврате на страницу
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Страница стала видимой - перезагружаем услуги
      console.log('🔄 Page became visible, reloading services...')
      loadFeaturedServices()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Очищаем обработчик при размонтировании
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  // Add escape key listener for image modal
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeImageModal()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  // Cleanup on unmount
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Динамические преимущества из CMS
const dynamicAdvantages = computed(() => {
  const featuresItems = content.value['home.features.items']
  if (Array.isArray(featuresItems)) {
    return featuresItems
  }
  // Fallback к статичным данным
  return advantages.value
})

// Функция для получения иконки преимущества
const getAdvantageIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'quality': ShieldCheckIcon,
    'speed': ClockIcon,
    'price': ClockIcon,
    'support': UserIcon
  }
  return iconMap[iconName] || ClockIcon
}

// Services data from API
const featuredServices = ref<any[]>([])
const servicesLoading = ref(false)

const advantages = ref([
  {
    title: 'Мастерство',
    description: 'Каждый слой — с душой',
    icon: 'quality'
  },
  {
    title: 'Честность',
    description: 'Без пафоса, только дело',
    icon: 'speed'
  },
  {
    title: 'Технологии',
    description: 'Современное оборудование',
    icon: 'price'
  },
  {
    title: 'Забота',
    description: 'Поддержка на каждом этапе',
    icon: 'support'
  }
])

const fallbackTestimonials = ref([
  {
    id: 1,
    text: 'Отличное качество печати и быстрые сроки. Рекомендую!',
    author: 'Алексей Петров',
    role: 'Инженер'
  },
  {
    id: 2,
    text: 'Помогли с прототипом для стартапа. Все сделали идеально.',
    author: 'Мария Сидорова',
    role: 'Предприниматель'
  },
  {
    id: 3,
    text: 'Профессиональный подход и разумные цены.',
    author: 'Дмитрий Козлов',
    role: 'Дизайнер'
  }
])

// Load featured reviews from API
const loadFeaturedReviews = async () => {
  reviewsLoading.value = true
  
  try {
    // First try to get featured reviews
    let response = await fetch('/api/v1/reviews/featured?limit=3')
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        featuredReviews.value = result.data
        return
      }
    }
    
    // If no featured reviews, get top-rated reviews
    response = await fetch('/api/v1/reviews/?approved_only=true&limit=3')
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data.length > 0) {
        // Sort by rating (highest first) and take top 3
        const sortedReviews = result.data.sort((a: any, b: any) => b.rating - a.rating)
        featuredReviews.value = sortedReviews.slice(0, 3)
      }
    }
  } catch (error) {
    console.error('Error loading featured reviews:', error)
    // Keep featuredReviews empty to show fallback testimonials
  } finally {
    reviewsLoading.value = false
  }
}

// Load featured services from API
const loadFeaturedServices = async () => {
  servicesLoading.value = true
  
  try {
    // Используем API клиент и явно запрашиваем только активные услуги
    // Добавляем timestamp для предотвращения кеширования
    const timestamp = Date.now()
    const response = await api.get(`/services?active_only=true&limit=3&_t=${timestamp}`)
    
    if (response.data && response.data.success && response.data.data.length > 0) {
      // Услуги уже отфильтрованы на бэкенде, просто добавляем иконки
      featuredServices.value = response.data.data.map((service: any) => ({
        ...service,
        icon: service.icon || 'cube'
      }))
    } else {
      // Fallback к демо данным если нет услуг
      featuredServices.value = getFallbackServices()
    }
  } catch (error) {
    console.error('Error loading featured services:', error)
    // Fallback к демо данным
    featuredServices.value = getFallbackServices()
  } finally {
    servicesLoading.value = false
  }
}



// Fallback данные для демонстрации
const getFallbackServices = () => [
  {
    id: 1,
    name: 'FDM Печать',
    description: 'Быстрое прототипирование и функциональные детали',
    icon: 'cube',
    is_active: true
  },
  {
    id: 2,
    name: '3D моделирование',
    description: 'Воплотим ваши идеи в осязаемые предметы',
    icon: 'sparkles',
    is_active: true
  },
  {
    id: 3,
    name: 'Постобработка',
    description: 'Шлифовка, покраска и финишная обработка',
    icon: 'cog',
    is_active: true
  }
]

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatReviewDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long'
  })
}

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  selectedImage.value = null
}

const faqs = ref([
  {
    question: 'Какие материалы вы используете?',
    answer: 'Мы работаем с широким спектром материалов: PLA, ABS, PETG, TPU для FDM печати, а также различные фотополимеры для SLA печати.'
  },
  {
    question: 'Сколько времени занимает печать?',
    answer: 'Время печати зависит от размера и сложности модели. Обычно от 1 до 5 рабочих дней.'
  },
  {
    question: 'Какие файлы вы принимаете?',
    answer: 'Мы принимаем файлы в форматах STL, OBJ, 3MF. Также можем работать с STEP и другими CAD форматами.'
  },
  {
    question: 'Есть ли доставка?',
    answer: 'Да, мы осуществляем доставку по всей России. Стоимость доставки рассчитывается индивидуально.'
  }
])

const scrollToServices = () => {
  servicesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToServices = () => {
  router.push('/services')
}

const navigateToGallery = () => {
  router.push('/gallery')
}

const navigateToOrder = () => {
  router.push('/order')
}

const navigateToReviews = () => {
  router.push('/reviews')
}

const showReviewForm = () => {
  router.push('/reviews/leave')
}

const closeReviewModal = () => {
  showReviewModal.value = false
}

const handleReviewSubmit = (reviewData: any) => {
  console.log('Review submitted:', reviewData)
  showReviewModal.value = false
  
  // Показать уведомление об успешной отправке отзыва
  alert('Спасибо за отзыв! Он будет опубликован после модерации.')
}

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const scrollToContact = () => {
  const contactSection = document.querySelector('.contact-form')?.closest('section')
  contactSection?.scrollIntoView({ behavior: 'smooth' })
}

const handleContactSuccess = () => {
  // Show success notification or handle success
  console.log('Contact form submitted successfully')
}

// Function to get different colors for service icons
const getServiceIconClass = (index: number) => {
  const iconClasses = [
    'bg-primary-900', // Северный синий
    'bg-accent-500',  // Медный акцент
    'bg-primary-700'  // Средний синий
  ]
  return iconClasses[index % iconClasses.length]
}

// SEO optimization
onMounted(() => {
  document.title = 'NordLayer - Мастерская цифрового ремесла из Карелии'
  
  // Add meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'NordLayer — мастерская цифрового ремесла из Карелии. Слой за слоем рождается форма. Мы не просто печатаем — мы создаём вещи с душой.')
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(2deg);
  }
  66% {
    transform: translateY(-25px) rotate(-2deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 300px;
    transform: translateY(0);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-float {
  animation: float 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-slide-down {
  animation: slide-down 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

/* Улучшенные переходы для кнопок */
button, .btn {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

button:hover, .btn:hover {
  transform: translateY(-2px);
}

/* Плавные переходы для карточек */
.card-hover {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-hover:hover {
  transform: translateY(-8px) scale(1.02);
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>