#!/bin/bash

# Скрипт для исправления any типов

cd frontend

echo "🔧 Исправляем any типы..."

# Заменяем простые any на unknown в тестах
find src -name "*.test.ts" -exec sed -i '' 's/: any/: unknown/g' {} \;

# Заменяем any в error handlers на Error | unknown
find src -name "*.vue" -exec sed -i '' 's/(err: any)/(err: Error | unknown)/g' {} \;
find src -name "*.ts" -exec sed -i '' 's/(err: any)/(err: Error | unknown)/g' {} \;

# Заменяем any в event handlers на Event
find src -name "*.vue" -exec sed -i '' 's/(event: any)/(event: Event)/g' {} \;

# Заменяем any в response handlers на unknown
find src -name "*.ts" -exec sed -i '' 's/response: any/response: unknown/g' {} \;

# Заменяем any в data handlers на Record<string, unknown>
find src -name "*.ts" -exec sed -i '' 's/data: any/data: Record<string, unknown>/g' {} \;

# Заменяем any в generic functions на unknown
find src -name "*.ts" -exec sed -i '' 's/<T = any>/<T = unknown>/g' {} \;

echo "✅ any типы исправлены"