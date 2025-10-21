<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Свяжитесь с нами
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-gray-200">
            Мы всегда готовы ответить на ваши вопросы и помочь с вашим проектом
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Information and Form -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <!-- Contact Information -->
          <div class="space-y-8">
            <div>
              <h2 class="text-3xl font-bold text-neutral-700 mb-6">
                Как с нами связаться
              </h2>
              <p class="text-lg text-neutral-600 mb-8">
                Выберите удобный для вас способ связи. Мы отвечаем быстро и всегда готовы помочь!
              </p>
            </div>

            <!-- Contact Methods -->
            <div class="space-y-6">
              <div class="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div class="flex-shrink-0">
                  <EnvelopeIcon class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-neutral-700 mb-2">Email</h3>
                  <p class="text-neutral-600 mb-2">Напишите нам на почту</p>
                  <a href="mailto:info@3dprint.ru" class="text-blue-600 hover:text-blue-700 font-medium">
                    info@3dprint.ru
                  </a>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div class="flex-shrink-0">
                  <PhoneIcon class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-neutral-700 mb-2">Телефон</h3>
                  <p class="text-neutral-600 mb-2">Звоните в рабочее время</p>
                  <a href="tel:+79991234567" class="text-blue-600 hover:text-blue-700 font-medium">
                    +7 (999) 123-45-67
                  </a>
                  <p class="text-sm text-neutral-500 mt-1">Пн-Пт: 9:00-18:00</p>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div class="flex-shrink-0">
                  <ChatBubbleLeftRightIcon class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-neutral-700 mb-2">Telegram</h3>
                  <p class="text-neutral-600 mb-2">Быстрая связь в мессенджере</p>
                  <a href="https://t.me/3dprint_bot" class="text-blue-600 hover:text-blue-700 font-medium">
                    @3dprint_bot
                  </a>
                </div>
              </div>

              <div class="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div class="flex-shrink-0">
                  <MapPinIcon class="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-neutral-700 mb-2">Адрес</h3>
                  <p class="text-neutral-600 mb-2">Приходите к нам в офис</p>
                  <p class="text-neutral-700">
                    г. Москва, ул. Примерная, д. 123<br>
                    офис 456
                  </p>
                  <p class="text-sm text-neutral-500 mt-1">Предварительная запись обязательна</p>
                </div>
              </div>
            </div>

            <!-- Working Hours -->
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-lg font-semibold text-neutral-700 mb-4">Режим работы</h3>
              <div class="space-y-2 text-neutral-600">
                <div class="flex justify-between">
                  <span>Понедельник - Пятница:</span>
                  <span class="font-medium">9:00 - 18:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Суббота:</span>
                  <span class="font-medium">10:00 - 16:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Воскресенье:</span>
                  <span class="font-medium">Выходной</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <ContactForm @success="handleContactSuccess" />
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-neutral-700 mb-4">
            Часто задаваемые вопросы
          </h2>
          <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
            Возможно, ответ на ваш вопрос уже есть здесь
          </p>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="mb-4"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 bg-gray-50 hover:bg-gray-100 hover:shadow-md rounded-lg transition-all duration-300 ease-out flex justify-between items-center group"
            >
              <span class="font-semibold text-lg pr-4">{{ faq.question }}</span>
              <ChevronDownIcon 
                :class="['w-6 h-6 ml-4 flex-shrink-0 transition-all duration-400 ease-out group-hover:text-blue-600', openFaqs.includes(index) ? 'rotate-180' : '']"
              />
            </button>
            <div 
              v-if="openFaqs.includes(index)"
              class="overflow-hidden animate-slide-down"
            >
              <div class="px-6 py-4 bg-white ml-6 relative">
                <div class="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-full"></div>
                <p class="text-neutral-600">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div class="text-center">
          <CheckCircleIcon class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-2xl font-bold text-neutral-700 mb-2">Сообщение отправлено!</h3>
          <p class="text-neutral-600 mb-6">
            Спасибо за ваше обращение. Мы свяжемся с вами в ближайшее время.
          </p>
          <button
            @click="closeSuccessModal"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContactForm from '@/components/common/ContactForm.vue'
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

const openFaqs = ref<number[]>([])
const showSuccessModal = ref(false)

const faqs = ref([
  {
    question: 'Как быстро вы отвечаете на запросы?',
    answer: 'Мы стараемся отвечать на все запросы в течение 2-4 часов в рабочее время. В выходные дни ответ может занять до 24 часов.'
  },
  {
    question: 'Можно ли получить консультацию по телефону?',
    answer: 'Конечно! Звоните нам в рабочее время, и наши специалисты ответят на все ваши вопросы о 3D печати и наших услугах.'
  },
  {
    question: 'Предоставляете ли вы техническую поддержку?',
    answer: 'Да, мы предоставляем полную техническую поддержку по всем нашим услугам. Поможем с подготовкой файлов, выбором материалов и постобработкой.'
  },
  {
    question: 'Можно ли приехать к вам в офис?',
    answer: 'Да, но обязательно предварительно договоритесь о встрече. Это поможет нам подготовиться и уделить вам максимум внимания.'
  },
  {
    question: 'Работаете ли вы с корпоративными клиентами?',
    answer: 'Конечно! Мы работаем как с частными лицами, так и с компаниями. Для корпоративных клиентов предусмотрены специальные условия.'
  },
  {
    question: 'Как узнать стоимость моего проекта?',
    answer: 'Отправьте нам файлы вашего проекта через форму обратной связи или на email, и мы рассчитаем стоимость в течение нескольких часов.'
  }
])

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const handleContactSuccess = () => {
  showSuccessModal.value = true
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
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

.animate-slide-down {
  animation: slide-down 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
</style>