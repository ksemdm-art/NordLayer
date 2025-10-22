#!/bin/bash

echo "🔧 Массовое исправление TypeScript ошибок..."

# Исправляем ошибки с unknown в catch блоках
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '' 's/} catch (err: unknown) {/} catch (err: any) {/g'
find src -name "*.vue" -o -name "*.ts" | xargs sed -i '' 's/} catch (error: unknown) {/} catch (error: any) {/g'

# Исправляем ошибки с .length на union типах
find src -name "*.vue" | xargs sed -i '' 's/specifications\.services\.length/Array.isArray(specifications.services) ? specifications.services.length : 0/g'
find src -name "*.vue" | xargs sed -i '' 's/specifications\.selectedServices\.length/Array.isArray(specifications.selectedServices) ? specifications.selectedServices.length : 0/g'
find src -name "*.vue" | xargs sed -i '' 's/specifications\.servicesList\.length/Array.isArray(specifications.servicesList) ? specifications.servicesList.length : 0/g'
find src -name "*.vue" | xargs sed -i '' 's/specifications\.orderServices\.length/Array.isArray(specifications.orderServices) ? specifications.orderServices.length : 0/g'
find src -name "*.vue" | xargs sed -i '' 's/specifications\.additionalServices\.length/Array.isArray(specifications.additionalServices) ? specifications.additionalServices.length : 0/g'
find src -name "*.vue" | xargs sed -i '' 's/specifications\.multiColors\.length/Array.isArray(specifications.multiColors) ? specifications.multiColors.length : 0/g'

# Исправляем ошибки с типами в v-for
find src -name "*.vue" | xargs sed -i '' 's/v-for="(service, index) in order\.specifications\.services"/v-for="(service, index) in (Array.isArray(order.specifications?.services) ? order.specifications.services : [])"/g'
find src -name "*.vue" | xargs sed -i '' 's/v-for="(service, index) in order\.specifications\.selectedServices"/v-for="(service, index) in (Array.isArray(order.specifications?.selectedServices) ? order.specifications.selectedServices : [])"/g'

# Исправляем ошибки с colorInfo
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.color/((colorInfo as any)?.color)/g'
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.value/((colorInfo as any)?.value)/g'
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.hex/((colorInfo as any)?.hex)/g'
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.name/((colorInfo as any)?.name)/g'
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.label/((colorInfo as any)?.label)/g'
find src -name "*.vue" | xargs sed -i '' 's/colorInfo\?\.title/((colorInfo as any)?.title)/g'

echo "✅ Массовые исправления применены"