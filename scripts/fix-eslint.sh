#!/bin/bash

# Скрипт для исправления ESLint ошибок

cd frontend

echo "🔧 Исправляем ESLint ошибки..."

# Исправляем неиспользуемые переменные в тестах
echo "Исправляем тесты..."
sed -i '' 's/onProgress, onError/_onProgress, _onError/g' src/components/gallery/__tests__/STLViewer.test.ts
sed -i '' 's/index/_index/g' src/components/orders/__tests__/OrderForm.test.ts
sed -i '' 's/index/_index/g' src/components/reviews/ReviewForm.vue
sed -i '' 's/featureIndex/_featureIndex/g' src/views/ServicesView.vue

# Исправляем неиспользуемые импорты
echo "Исправляем неиспользуемые импорты..."

# ContentModal
sed -i '' 's/import { ref, reactive, computed } from/import { ref, reactive } from/g' src/components/admin/ContentModal.vue

# ServiceModal  
sed -i '' 's/import { ref, reactive, computed } from/import { ref, reactive } from/g' src/components/admin/ServiceModal.vue

# ColorSwatch
sed -i '' 's/import { computed } from/\/\/ import { computed } from/g' src/components/common/ColorSwatch.vue

# NotificationContainer
sed -i '' 's/import { ref, computed } from/import { ref } from/g' src/components/common/NotificationContainer.vue

# GalleryFilter
sed -i '' 's/import { ref, computed, watch } from/import { ref, computed } from/g' src/components/gallery/GalleryFilter.vue

# ReviewsList
sed -i '' 's/import { ref, onMounted, computed } from/import { ref, onMounted } from/g' src/components/reviews/ReviewsList.vue

# useApi
sed -i '' 's/import { ref } from/import { ref } from/g' src/composables/useApi.ts

# useNotifications
sed -i '' 's/import { ref, reactive } from/import { ref } from/g' src/composables/useNotifications.ts

# useSEO
sed -i '' 's/import { ref, watch, onMounted } from/import { ref } from/g' src/composables/useSEO.ts

# api.ts
sed -i '' 's/import axios, { AxiosRequestConfig } from/import axios from/g' src/services/api.ts

# ColorsView
sed -i '' 's/import { ref, onMounted, computed } from/import { ref, onMounted } from/g' src/views/admin/ColorsView.vue

# ContactRequestsView
sed -i '' 's/import { ref, onMounted, computed } from/import { ref, onMounted } from/g' src/views/admin/ContactRequestsView.vue

echo "✅ Основные исправления применены"

# Запускаем ESLint с автоисправлением
echo "🔧 Запускаем ESLint с автоисправлением..."
npm run lint

echo "✅ ESLint исправления завершены"