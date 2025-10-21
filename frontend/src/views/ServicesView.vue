<template>
  <div class="services">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-accent-500/20"></div>
      <div class="relative container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary-50 drop-shadow-lg">
          {{ content['services.title'] || 'Наше ремесло' }}
        </h1>
        <p class="text-xl text-primary-100 max-w-2xl mx-auto drop-shadow">
          {{ content['services.subtitle'] || 'Каждая технология — это инструмент мастера. Мы печатаем, красим, создаём.' }}
        </p>
      </div>
      
      <!-- Декоративные элементы -->
      <div class="absolute top-20 left-10 w-16 h-16 bg-accent-500/20 rounded-full animate-float"></div>
      <div class="absolute top-40 right-20 w-12 h-12 bg-primary-300/20 rounded-full animate-float animation-delay-1000"></div>
      <div class="absolute bottom-20 left-1/4 w-20 h-20 bg-accent-400/20 rounded-full animate-float animation-delay-2000"></div>
    </section>

    <!-- Services Grid -->
    <section class="py-16 bg-gradient-to-br from-primary-50 to-white relative overflow-hidden">
      
      <div class="container mx-auto px-4 relative">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div 
            v-for="(service, index) in services" 
            :key="service.id"
            class="bg-white rounded-xl shadow-lg group hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-3 hover:scale-[1.03] overflow-hidden border border-primary-100"
            :class="getServiceCardClass(index)"
          >
            <div class="relative">
              <!-- Service Image/Icon with dynamic background -->
              <div 
                class="h-40 flex items-center justify-center relative overflow-hidden"
                :class="getServiceBgClass(index)"
              >
                <!-- Декоративные элементы -->
                <div class="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
                <div class="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                <div class="absolute bottom-4 left-4 w-6 h-6 bg-white/15 rounded-full"></div>
                
                <ServiceIcon 
                  v-if="service.icon" 
                  :icon="service.icon" 
                  class="w-16 h-16 text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 ease-out relative z-10 drop-shadow-lg" 
                />
                <div v-else class="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center relative z-10">
                  <span class="text-3xl font-bold text-white drop-shadow-lg">{{ service.name.charAt(0) }}</span>
                </div>
              </div>
              
              <!-- Service Content -->
              <div class="p-6 relative">
                <!-- Декоративная линия -->
                <div class="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-accent-500/30 to-transparent"></div>
                
                <div class="flex justify-between items-start mb-4 mt-2">
                  <h3 class="text-xl font-bold text-primary-900 group-hover:text-accent-600 transition-colors duration-300">{{ service.name }}</h3>
                  <span 
                    :class="service.is_active ? 'bg-accent-100 text-accent-700 border border-accent-200' : 'bg-primary-100 text-primary-700 border border-primary-200'" 
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                  >
                    <div 
                      :class="service.is_active ? 'bg-accent-500' : 'bg-primary-500'" 
                      class="w-2 h-2 rounded-full mr-2"
                    ></div>
                    {{ service.is_active ? 'Доступно' : 'Недоступно' }}
                  </span>
                </div>
                
                <p class="text-primary-700 mb-6 leading-relaxed font-medium">{{ service.description }}</p>
                

                
                <!-- Features -->
                <div v-if="service.features && service.features.length > 0" class="mb-6">
                  <h4 class="font-semibold mb-3 text-primary-800 flex items-center">
                    <div class="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
                    Особенности:
                  </h4>
                  <ul class="space-y-3">
                    <li 
                      v-for="(feature, featureIndex) in service.features" 
                      :key="feature"
                      class="flex items-start text-sm text-primary-600 group/feature"
                    >
                      <div class="flex-shrink-0 w-5 h-5 bg-accent-100 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/feature:bg-accent-200 transition-colors duration-200">
                        <CheckIcon class="w-3 h-3 text-accent-600" />
                      </div>
                      <span class="group-hover/feature:text-primary-800 transition-colors duration-200">{{ feature }}</span>
                    </li>
                  </ul>
                </div>
                

                
                <!-- Action Button -->
                <button 
                  class="w-full px-6 py-4 font-bold rounded-xl transition-all duration-300 ease-out relative overflow-hidden group/btn"
                  :class="service.is_active ? 
                    'bg-gradient-to-r from-primary-900 to-primary-800 text-primary-50 hover:from-primary-800 hover:to-primary-700 shadow-lg hover:shadow-xl hover:scale-105' : 
                    'bg-primary-200 text-primary-500 cursor-not-allowed'"
                  :disabled="!service.is_active"
                  @click="orderService(service)"
                >
                  <div v-if="service.is_active" class="absolute inset-0 bg-gradient-to-r from-accent-500/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <span class="relative z-10 flex items-center justify-center">
                    {{ service.is_active ? 'Заказать услугу' : 'Недоступно' }}
                    <svg v-if="service.is_active" class="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- Process Section -->
    <section class="py-16 bg-primary-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Как мы работаем
          </h2>
        </div>
        
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8">
            <div 
              v-for="(step, index) in processSteps" 
              :key="index"
              class="text-center group"
            >
              <div class="relative mb-6">
                <div class="w-16 h-16 mx-auto bg-gradient-to-br from-primary-900 to-accent-500 rounded-full flex items-center justify-center text-primary-50 text-xl font-bold shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-400 ease-out">
                  {{ index + 1 }}
                </div>
                <div 
                  v-if="index < processSteps.length - 1"
                  class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-accent-300 -translate-y-0.5"
                ></div>
              </div>
              <h3 class="text-lg font-semibold mb-2 group-hover:text-accent-500 transition-colors duration-300 text-primary-900">{{ step.title }}</h3>
              <p class="text-primary-700 text-sm">{{ step.description }}</p>
            </div>
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
            v-for="(faq, index) in serviceFaqs" 
            :key="index"
            class="mb-4"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 bg-primary-50 hover:bg-primary-100 hover:shadow-nordic rounded-lg transition-all duration-300 ease-out flex justify-between items-center group"
            >
              <span class="font-semibold text-lg pr-4 text-primary-900">{{ faq.question }}</span>
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
                <p class="text-primary-700">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// Removed design-system imports - using native HTML elements instead
import { useContent } from '@/services/content'
import { api } from '@/services/api'
import ServiceIcon from '@/components/ServiceIcon.vue'
import { 
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import type { Service } from '@/types'

const router = useRouter()
const openFaqs = ref<number[]>([])
const { getContentByGroup } = useContent()
const content = ref<Record<string, any>>({})

// Загружаем контент для страницы услуг
onMounted(async () => {
  try {
    content.value = await getContentByGroup('services')
  } catch (error) {
    console.error('Error loading services content:', error)
  }
})

// Services data from API
const services = ref<Service[]>([])

// Загружаем услуги из API
const loadServices = async () => {
  try {
    const response = await api.get(`/services?active_only=true&_t=${Date.now()}`)
    const servicesData = response.data.data || []
    
    if (servicesData.length > 0) {
      // Отладочная информация для понимания структуры данных
      console.log('Raw services data:', servicesData)
      
      // Фильтруем только активные услуги и обрабатываем данные
      const activeServices = servicesData.filter((service: any) => service.is_active)
      
      services.value = activeServices.map((service: any) => {
        return {
          ...service,
          icon: service.icon || 'cube',
          features: Array.isArray(service.features) ? service.features : []
        }
      })
    } else {
      // Fallback к демо данным если API не возвращает услуги
      services.value = getFallbackServices()
    }
  } catch (error) {
    console.error('Error loading services:', error)
    // Fallback к демо данным
    services.value = getFallbackServices()
  }
}

// Fallback данные для демонстрации
const getFallbackServices = () => [
  {
    id: 1,
    name: 'FDM Печать',
    description: 'Экономичная технология послойного наплавления пластика. Подходит для прототипов, функциональных деталей и крупных моделей.',
    is_active: true,
    icon: 'cube',
    features: [
      'Быстрое изготовление',
      'Экономичная стоимость',
      'Большой выбор материалов',
      'Идеально для прототипов'
    ]
  },
  {
    id: 2,
    name: 'SLA Печать',
    description: 'Стереолитография обеспечивает высочайшую детализацию и гладкую поверхность. Идеально для ювелирных изделий, миниатюр, стоматологических моделей.',
    is_active: true,
    icon: 'sparkles',
    features: [
      'Высочайшая детализация',
      'Гладкая поверхность',
      'Точность до 0.025мм',
      'Идеально для миниатюр'
    ]
  },
  {
    id: 3,
    name: 'Постобработка',
    description: 'Профессиональная финишная обработка ваших моделей: шлифовка, покраска, сборка. Превратим ваш прототип в готовое изделие.',
    is_active: true,
    icon: 'cog',
    features: [
      'Профессиональная покраска',
      'Шлифовка и полировка',
      'Сборка сложных моделей',
      'Различные покрытия'
    ]
  }
]





// Загружаем данные при монтировании
onMounted(async () => {
  await Promise.all([
    loadServices(),
    (async () => {
      try {
        content.value = await getContentByGroup('services')
      } catch (error) {
        console.error('Error loading services content:', error)
      }
    })()
  ])
  
  // Добавляем обработчик для обновления данных при возврате на страницу
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log('🔄 Services page became visible, reloading services...')
      loadServices()
    }
  }
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Очищаем обработчик при размонтировании
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })
})



const processSteps = ref([
  {
    title: 'Загрузка файла',
    description: 'Отправьте нам файл вашей модели'
  },
  {
    title: 'Анализ и расчет',
    description: 'Мы проанализируем модель и рассчитаем стоимость'
  },
  {
    title: 'Печать',
    description: 'Изготавливаем вашу модель на профессиональном оборудовании'
  },
  {
    title: 'Доставка',
    description: 'Готовое изделие доставляется вам удобным способом'
  }
])

const serviceFaqs = ref([
  {
    question: 'Какие форматы файлов вы принимаете?',
    answer: 'Мы работаем с файлами STL, OBJ, 3MF, а также можем принять STEP, IGES и другие CAD форматы.'
  },
  {
    question: 'Можно ли изменить размер модели?',
    answer: 'Да, мы можем масштабировать вашу модель до нужного размера. Учтите, что это может повлиять на детализацию.'
  },
  {
    question: 'Какая максимальная точность печати?',
    answer: 'Для FDM печати - 0.1мм, для SLA печати - до 0.025мм по высоте слоя.'
  },
  {
    question: 'Предоставляете ли вы гарантию?',
    answer: 'Да, мы предоставляем гарантию на качество печати. Если модель не соответствует заявленным характеристикам, мы перепечатаем её бесплатно.'
  }
])



const orderService = (service: Service) => {
  router.push({
    path: '/order',
    query: { preselectedServiceId: service.id.toString() }
  })
}

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

// Функции для динамических стилей карточек
const getServiceCardClass = (index: number) => {
  const classes = [
    'hover:shadow-accent-500/20',
    'hover:shadow-primary-500/20', 
    'hover:shadow-accent-400/20'
  ]
  return classes[index % classes.length]
}

const getServiceBgClass = (index: number) => {
  const bgClasses = [
    'bg-gradient-to-br from-primary-900 via-primary-800 to-accent-600',
    'bg-gradient-to-br from-accent-500 via-accent-600 to-primary-800',
    'bg-gradient-to-br from-primary-800 via-accent-500 to-primary-900'
  ]
  return bgClasses[index % bgClasses.length]
}

// SEO optimization
onMounted(() => {
  document.title = 'Услуги 3D печати - FDM, SLA печать и постобработка'
  
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', 'Профессиональные услуги 3D печати: FDM и SLA технологии, постобработка, быстрые сроки. Высокое качество и доступные цены.')
  }
})
</script>

<style scoped>
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

@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(198, 134, 66, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(198, 134, 66, 0.4);
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

.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-slide-down {
  animation: slide-down 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-float {
  animation: float 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* Улучшенные переходы для всех элементов */
* {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Анимация появления карточек */
.grid > div {
  animation: fade-in 0.6s ease-out forwards;
}

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }

/* Плавные переходы для форм */
input, select, textarea {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

input:focus, select:focus, textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 42, 65, 0.15);
}

/* Улучшенные переходы для кнопок */
button {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Эффекты для карточек услуг */
.group:hover .w-16.h-16 {
  animation: float-gentle 2s ease-in-out infinite;
}

/* Стили для кастомных селектов */
select {
  background-image: none;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #8E9BAE;
  pointer-events: none;
  transition: all 0.3s ease;
}

/* Декоративные эффекты */
.blur-xl {
  filter: blur(40px);
}
</style>