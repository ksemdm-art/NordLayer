<template>
  <div class="min-h-screen bg-neutral-50 py-12">
    <div class="ds-container space-y-12">
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1 class="text-5xl font-bold text-neutral-900 animate-fade-in">
          Платформа 3D Печати
        </h1>
        <p class="text-xl text-neutral-600 max-w-2xl mx-auto animate-slide-up">
          Профессиональные услуги 3D печати с современным дизайном и передовыми технологиями
        </p>
        <div class="flex gap-4 justify-center animate-scale-in">
          <Button variant="primary" size="lg">
            Начать проект
          </Button>
          <Button variant="outline" size="lg">
            Посмотреть галерею
          </Button>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-neutral-900 mb-4">Наши услуги</h2>
          <p class="text-lg text-neutral-600">Профессиональные решения 3D печати для любых задач</p>
        </div>
        
        <Grid :cols="1" :gap="6" :responsive="{ md: 2, lg: 3 }">
          <Card 
            v-for="service in services" 
            :key="service.id"
            variant="elevated" 
            padding="lg" 
            hover
            class="text-center"
          >
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <div class="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <h3 class="text-xl font-semibold text-neutral-900 mb-2">{{ service.title }}</h3>
            <p class="text-neutral-600 mb-4">{{ service.description }}</p>
            <Badge :variant="service.badgeVariant" class="mb-4">{{ service.category }}</Badge>
            <div class="text-2xl font-bold text-primary-600">{{ service.price }}</div>
          </Card>
        </Grid>
      </section>

      <!-- Project Gallery Preview -->
      <section class="space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-neutral-900 mb-4">Последние проекты</h2>
          <p class="text-lg text-neutral-600">Изучите наши новейшие творения 3D печати</p>
        </div>
        
        <Grid :cols="2" :gap="4" :responsive="{ md: 3, lg: 4 }">
          <Card 
            v-for="project in projects" 
            :key="project.id"
            variant="elevated" 
            padding="none" 
            hover
            interactive
          >
            <div class="aspect-square bg-gradient-to-br from-accent-100 via-primary-100 to-secondary-100 relative overflow-hidden">
              <div class="absolute inset-0 bg-black/10"></div>
              <div class="absolute bottom-4 left-4 right-4">
                <Badge variant="success" size="xs" class="mb-2">Доступно</Badge>
                <h4 class="text-white font-semibold text-sm">{{ project.title }}</h4>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between text-sm text-neutral-500">
                <span>{{ project.material }}</span>
                <span>{{ project.printTime }}</span>
              </div>
            </div>
          </Card>
        </Grid>
      </section>

      <!-- Contact Form -->
      <section class="max-w-2xl mx-auto">
        <Card variant="elevated" padding="xl">
          <template #header>
            <h2 class="text-2xl font-bold text-neutral-900">Получить расчёт</h2>
            <p class="text-neutral-600 mt-2">Расскажите нам о вашем проекте 3D печати</p>
          </template>
          
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                v-model="form.name"
                label="Полное имя"
                placeholder="Ваше имя"
                required
              />
              <Input
                v-model="form.email"
                type="email"
                label="Email адрес"
                placeholder="ваш@email.com"
                required
              />
            </div>
            
            <Input
              v-model="form.project"
              label="Тип проекта"
              placeholder="Опишите ваш проект"
            />
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-neutral-700">
                Загрузить файлы
              </label>
              <div class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                <div class="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div class="w-6 h-6 bg-primary-500 rounded"></div>
                </div>
                <p class="text-neutral-600 mb-2">Перетащите STL файлы сюда или нажмите для выбора</p>
                <p class="text-sm text-neutral-500">Поддерживаются STL, OBJ файлы до 50МБ</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="flex gap-3 justify-end">
              <Button variant="ghost">Отмена</Button>
              <Button variant="primary" :loading="isSubmitting">
                Отправить запрос
              </Button>
            </div>
          </template>
        </Card>
      </section>

      <!-- Status Examples -->
      <section class="space-y-6">
        <h2 class="text-2xl font-bold text-neutral-900 text-center">Примеры статусов заказов</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="md" class="text-center">
            <Badge variant="neutral" class="mb-2">Черновик</Badge>
            <h4 class="font-medium text-neutral-900">Заказ №1001</h4>
            <p class="text-sm text-neutral-600">Ожидание файлов</p>
          </Card>
          
          <Card padding="md" class="text-center">
            <Badge variant="warning" class="mb-2">В обработке</Badge>
            <h4 class="font-medium text-neutral-900">Заказ №1002</h4>
            <p class="text-sm text-neutral-600">Расчёт на рассмотрении</p>
          </Card>
          
          <Card padding="md" class="text-center">
            <Badge variant="primary" class="mb-2">Печатается</Badge>
            <h4 class="font-medium text-neutral-900">Заказ №1003</h4>
            <p class="text-sm text-neutral-600">Осталось 2ч 30м</p>
          </Card>
          
          <Card padding="md" class="text-center">
            <Badge variant="success" class="mb-2">Завершён</Badge>
            <h4 class="font-medium text-neutral-900">Заказ №1004</h4>
            <p class="text-sm text-neutral-600">Готов к выдаче</p>
          </Card>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Button, Card, Input, Badge, Grid } from '../components';

const form = ref({
  name: '',
  email: '',
  project: '',
});

const isSubmitting = ref(false);

const services = [
  {
    id: 1,
    title: 'FDM Печать',
    description: 'Высококачественная FDM печать для прототипов и функциональных деталей',
    category: 'Стандарт',
    price: 'от 1500₽',
    badgeVariant: 'primary' as const,
  },
  {
    id: 2,
    title: 'SLA Печать',
    description: 'Сверхточная печать смолой для детализированных миниатюр',
    category: 'Премиум',
    price: 'от 2500₽',
    badgeVariant: 'secondary' as const,
  },
  {
    id: 3,
    title: 'Многоцветная',
    description: 'Продвинутая многоматериальная и многоцветная печать',
    category: 'Профессионал',
    price: 'от 4000₽',
    badgeVariant: 'warning' as const,
  },
];

const projects = [
  { id: 1, title: 'Миниатюра дракона', material: 'PLA', printTime: '2ч 30м' },
  { id: 2, title: 'Подставка для телефона', material: 'PETG', printTime: '1ч 15м' },
  { id: 3, title: 'Декоративная ваза', material: 'PLA+', printTime: '3ч 45м' },
  { id: 4, title: 'Сборка шестерён', material: 'ABS', printTime: '4ч 20м' },
  { id: 5, title: 'Персональный брелок', material: 'PLA', printTime: '30м' },
  { id: 6, title: 'Абажур для лампы', material: 'PETG', printTime: '2ч 10м' },
  { id: 7, title: 'Головоломка-коробка', material: 'PLA+', printTime: '5ч 30м' },
  { id: 8, title: 'Горшок для растений', material: 'PLA', printTime: '1ч 45м' },
];
</script>