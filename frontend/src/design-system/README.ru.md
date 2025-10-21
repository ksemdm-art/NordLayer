# Дизайн-система платформы 3D печати

Комплексная дизайн-система, созданная для платформы 3D печати, включающая современные компоненты, согласованные токены и адаптивные макеты.

## Обзор

Эта дизайн-система предоставляет:
- **Дизайн-токены**: Цвета, типографика, отступы, тени и анимации
- **UI компоненты**: Переиспользуемые Vue.js компоненты с согласованным стилем
- **Адаптивная сетка**: Гибкая система макетов для всех размеров экрана
- **Документация Storybook**: Интерактивная документация компонентов
- **Поддержка TypeScript**: Полная типизация и IntelliSense

## Быстрый старт

### Установка

```bash
# Установите дизайн-систему в ваш Vue.js проект
npm install
```

### Использование

```vue
<template>
  <div>
    <!-- Используйте отдельные компоненты -->
    <Button variant="primary" size="lg" @click="handleClick">
      Начать
    </Button>
    
    <Card variant="elevated" padding="lg">
      <template #header>
        <h2>3D Проект</h2>
      </template>
      
      <p>Детали вашего проекта 3D печати...</p>
      
      <template #footer>
        <Button variant="outline">Подробнее</Button>
      </template>
    </Card>
    
    <!-- Используйте адаптивную сетку -->
    <Grid :cols="1" :gap="6" :responsive="{ md: 2, lg: 3 }">
      <Card v-for="project in projects" :key="project.id">
        <!-- Содержимое проекта -->
      </Card>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { Button, Card, Grid } from '@/design-system';

// Логика вашего компонента
</script>
```

### Установка плагина

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import DesignSystem from './design-system';

const app = createApp(App);
app.use(DesignSystem);
app.mount('#app');
```

После установки плагина компоненты доступны с префиксом `Ds`:

```vue
<template>
  <DsButton variant="primary">Нажми меня</DsButton>
  <DsCard title="Моя карточка">Содержимое здесь</DsCard>
</template>
```

## Дизайн-токены

### Цвета

Дизайн-система использует современную цветовую палитру, оптимизированную для тематики 3D печати:

- **Основной**: Синие тона для главных действий и брендинга
- **Вторичный**: Фиолетовые тона для второстепенных действий
- **Акцентный**: Оранжевые тона для выделения и призывов к действию
- **Нейтральный**: Серая шкала для текста и фонов
- **Семантические**: Успех (зелёный), Предупреждение (жёлтый), Ошибка (красный)

Каждый цвет имеет 11 оттенков (50-950) для максимальной гибкости.

### Типографика

- **Семейство шрифтов**: Inter (основной), JetBrains Mono (моноширинный)
- **Размеры шрифтов**: 9 размеров от xs (12px) до 9xl (128px)
- **Толщина шрифтов**: 9 толщин от thin (100) до black (900)
- **Высота строк**: Оптимизирована для читаемости

### Отступы

Согласованная система отступов на основе приращений 0.25rem (4px):
- Базовая единица: 4px
- Шкала: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Тени

Три системы теней:
- **Стандартные**: sm, default, md, lg, xl, 2xl
- **Пользовательские**: soft, medium, hard
- **Цветные**: glow (основной), glow-accent (оранжевый)

### Анимации

Плавные микровзаимодействия:
- **Появление**: fade-in, slide-up, slide-down, scale-in
- **Непрерывные**: bounce-soft, pulse-soft, spin
- **Интерактивные**: эффекты наведения, активные состояния

## Компоненты

### Button (Кнопка)

Универсальный компонент кнопки с множественными вариантами и размерами.

```vue
<Button variant="primary" size="lg" :loading="isLoading">
  Отправить заказ
</Button>
```

**Свойства:**
- `variant`: primary, secondary, outline, ghost, danger
- `size`: xs, sm, md, lg, xl
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `rounded`: boolean

### Card (Карточка)

Гибкий компонент карточки для контейнеров содержимого.

```vue
<Card variant="elevated" padding="lg" hover>
  <template #header>Заголовок карточки</template>
  Содержимое карточки размещается здесь
  <template #footer>
    <Button size="sm">Действие</Button>
  </template>
</Card>
```

**Свойства:**
- `variant`: default, elevated, outlined, ghost
- `padding`: none, sm, md, lg, xl
- `rounded`: none, sm, md, lg, xl, 2xl
- `hover`: boolean
- `interactive`: boolean

### Input (Поле ввода)

Компонент поля ввода формы с состояниями валидации.

```vue
<Input
  v-model="email"
  type="email"
  label="Email адрес"
  placeholder="ваш@email.com"
  :error="emailError"
  required
>
  <template #icon-left>
    <EmailIcon />
  </template>
</Input>
```

**Свойства:**
- `type`: text, email, password, number, tel, url, search
- `size`: sm, md, lg
- `variant`: default, filled, outlined
- `label`: string
- `error`: string
- `hint`: string

### Badge (Значок)

Индикаторы статуса и категорий.

```vue
<Badge variant="success" size="sm">
  Завершено
</Badge>
```

**Свойства:**
- `variant`: default, primary, secondary, success, warning, error, neutral
- `size`: xs, sm, md, lg
- `outline`: boolean
- `rounded`: boolean
- `dot`: boolean

### Modal (Модальное окно)

Наложенные диалоги с настраиваемым содержимым.

```vue
<Modal v-model="isOpen" title="Подтвердить действие" size="md">
  Вы уверены, что хотите удалить этот проект?
  
  <template #footer>
    <Button variant="ghost" @click="isOpen = false">Отмена</Button>
    <Button variant="danger" @click="confirmDelete">Удалить</Button>
  </template>
</Modal>
```

**Свойства:**
- `size`: xs, sm, md, lg, xl, 2xl, full
- `closable`: boolean
- `closeOnBackdrop`: boolean
- `persistent`: boolean

### Grid (Сетка)

Система адаптивной сетки макетов.

```vue
<Grid :cols="1" :gap="4" :responsive="{ sm: 2, md: 3, lg: 4 }">
  <Card v-for="item in items" :key="item.id">
    {{ item.content }}
  </Card>
</Grid>
```

**Свойства:**
- `cols`: 1-12, auto, none
- `gap`: 0-24
- `responsive`: объект с переопределениями точек останова

## Адаптивный дизайн

Дизайн-система включает 7 точек останова:

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px
- `3xl`: 1600px

Все компоненты разработаны для бесшовной работы на всех размерах экрана.

## Документация Storybook

Запустите Storybook для интерактивного изучения всех компонентов:

```bash
npm run storybook
```

Это запустит Storybook на `http://localhost:6006` с:
- Документацией компонентов
- Интерактивными элементами управления
- Примерами использования
- Справочником дизайн-токенов

## Разработка

### Добавление новых компонентов

1. Создайте директорию компонента: `src/design-system/components/NewComponent/`
2. Добавьте `NewComponent.vue` с интерфейсом TypeScript props
3. Создайте `NewComponent.stories.ts` для документации Storybook
4. Экспортируйте из `components/index.ts`
5. Добавьте в плагин в `index.ts`

### Обновления дизайн-токенов

1. Обновите файлы токенов в `src/design-system/tokens/`
2. Обновите конфигурацию Tailwind для соответствия
3. Обновите истории Storybook для демонстрации изменений
4. Протестируйте на всех компонентах

### Тестирование

```bash
# Запустить тесты компонентов
npm run test:unit

# Запустить тесты Storybook
npm run test:storybook
```

## Лучшие практики

### Использование компонентов

- Используйте семантические HTML элементы
- Предоставляйте правильные ARIA метки
- Поддерживайте навигацию с клавиатуры
- Следуйте рекомендациям по контрастности цветов
- Тестируйте со скринридерами

### Производительность

- Компоненты поддерживают tree-shaking
- Минимальные накладные расходы во время выполнения
- Оптимизированные анимации
- Эффективные перерендеры

### Доступность

- Соответствие WCAG 2.1 AA
- Поддержка навигации с клавиатуры
- Дружелюбность к скринридерам
- Поддержка высокого контраста
- Управление фокусом

## Поддержка браузеров

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Участие в разработке

1. Следуйте существующему стилю кода
2. Добавляйте истории Storybook для новых компонентов
3. Включайте типы TypeScript
4. Тестируйте во всех поддерживаемых браузерах
5. Обновляйте документацию

## Лицензия

Лицензия MIT - см. файл LICENSE для деталей.