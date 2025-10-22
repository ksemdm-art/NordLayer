#!/bin/bash

cd frontend

echo "🔧 Исправляем оставшиеся any типы..."

# Исправляем конкретные файлы
# ContentModal
sed -i '' 's/(newValue: any)/(newValue: string)/g' src/components/admin/ContentModal.vue
sed -i '' 's/(newType: any)/(newType: string)/g' src/components/admin/ContentModal.vue

# ArticleModal  
sed -i '' 's/(err: Error | unknown)/(err: unknown)/g' src/components/admin/ArticleModal.vue

# OrderDetailModal - заменяем colorInfo: any на более конкретные типы
sed -i '' 's/colorInfo: any/colorInfo: unknown/g' src/components/admin/OrderDetailModal.vue

# ProjectModal
sed -i '' 's/(error: Error | unknown)/(error: unknown)/g' src/components/admin/ProjectModal.vue

# UserModal
sed -i '' 's/(error: Error | unknown)/(error: unknown)/g' src/components/admin/UserModal.vue

# ContactForm
sed -i '' 's/(error: Error | unknown)/(error: unknown)/g' src/components/common/ContactForm.vue

# MasonryGrid
sed -i '' 's/items: any/items: unknown[]/g' src/components/gallery/MasonryGrid.vue

# OrderForm
sed -i '' 's/specifications: any/specifications: Record<string, unknown>/g' src/components/orders/OrderForm.vue

# ServiceSelectionStep
sed -i '' 's/price_factors: any/price_factors: Record<string, number>/g' src/components/orders/steps/ServiceSelectionStep.vue

# ReviewStep - исправляем any в функциях работы с цветами
sed -i '' 's/colorInfo: any/colorInfo: unknown/g' src/components/orders/steps/ReviewStep.vue

# useServices
sed -i '' 's/Service & { price_factors: any }/Service \& { price_factors: Record<string, number> }/g' src/composables/useServices.ts

# api.ts
sed -i '' 's/error: any/error: unknown/g' src/services/api.ts

# content.ts - исправляем все any типы
sed -i '' 's/value: any/value: unknown/g' src/services/content.ts
sed -i '' 's/content: any/content: Record<string, unknown>/g' src/services/content.ts
sed -i '' 's/data: any/data: Record<string, unknown>/g' src/services/content.ts

# stores/orders.ts
sed -i '' 's/specifications: any/specifications: Record<string, unknown>/g' src/stores/orders.ts

# Stories
sed -i '' 's/args: any/args: Record<string, unknown>/g' src/stories/Header.stories.ts
sed -i '' 's/argTypes: any/argTypes: Record<string, unknown>/g' src/stories/Page.stories.ts

# fileUpload.ts
sed -i '' 's/metadata: any/metadata: Record<string, unknown>/g' src/utils/fileUpload.ts
sed -i '' 's/response: any/response: Record<string, unknown>/g' src/utils/fileUpload.ts

# three-loader.ts
sed -i '' 's/material: any/material: unknown/g' src/utils/three-loader.ts

# Views - исправляем any в обработчиках ошибок и данных
find src/views -name "*.vue" -exec sed -i '' 's/error: any/error: unknown/g' {} \;
find src/views -name "*.vue" -exec sed -i '' 's/response: any/response: Record<string, unknown>/g' {} \;
find src/views -name "*.vue" -exec sed -i '' 's/data: any/data: Record<string, unknown>/g' {} \;

# Admin views
sed -i '' 's/error: any/error: unknown/g' src/views/admin/*.vue
sed -i '' 's/response: any/response: Record<string, unknown>/g' src/views/admin/*.vue

echo "✅ Все any типы исправлены"