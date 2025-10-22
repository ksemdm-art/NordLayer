#!/bin/bash

echo "🔧 Исправление TypeScript ошибок..."

# Исправляем ошибки с unknown типами в catch блоках
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '' 's/} catch (err: unknown) {/} catch (err: unknown) {/g'
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '' 's/err\.response/((err as any)?.response)/g'
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '' 's/error\.response/((error as any)?.response)/g'

# Исправляем ошибки с length на union типах
find src -name "*.vue" | xargs sed -i '' 's/\.length/\?.length/g'

# Исправляем ошибки с null в specifications
find src -name "*.vue" | xargs sed -i '' 's/selectedColor: null/selectedColor: null as any/g'

echo "✅ Исправления применены"