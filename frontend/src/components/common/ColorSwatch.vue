<template>
  <div 
    class="color-swatch-container"
    :class="{ 'selected': isSelected, 'disabled': disabled }"
    @click="!disabled && $emit('select', color)"
  >
    <!-- Color Preview -->
    <div 
      class="color-swatch"
      :style="getColorStyle(color)"
      :title="getColorTooltip(color)"
    >
      <!-- Metallic shine effect -->
      <div 
        v-if="color.type === ColorType.METALLIC" 
        class="metallic-shine"
      ></div>
      
      <!-- NEW Badge -->
      <div v-if="color.is_new" class="new-badge-overlay">
        NEW
      </div>
      
      <!-- Selection indicator -->
      <div v-if="isSelected" class="selection-indicator">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- Multi-color index -->
      <div v-if="multiColorIndex" class="multi-color-index">
        {{ multiColorIndex }}
      </div>
    </div>

    <!-- Color Info -->
    <div class="color-info">
      <span class="color-name">{{ color.name }}</span>
      
      <!-- Price Modifier -->
      <span 
        v-if="color.price_modifier !== 1 && showPriceModifier" 
        class="price-modifier"
        :class="{ 'price-increase': color.price_modifier > 1 }"
      >
        {{ color.price_modifier > 1 ? '+' : '' }}{{ Math.round((color.price_modifier - 1) * 100) }}%
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Color, ColorType, type SolidColor, type GradientColor, type MetallicColor } from '@/api/colors'

interface Props {
  color: Color
  isSelected?: boolean
  disabled?: boolean
  multiColorIndex?: number
  showPriceModifier?: boolean
}

interface Emits {
  (e: 'select', color: Color): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  disabled: false,
  multiColorIndex: 0,
  showPriceModifier: true
})

defineEmits<Emits>()

const getColorStyle = (color: Color): Record<string, string> => {
  if (color.type === ColorType.SOLID) {
    const solidColor = color as SolidColor
    return { backgroundColor: solidColor.hex_code }
  } else if (color.type === ColorType.GRADIENT) {
    const gradientColor = color as GradientColor
    const stops = gradientColor.gradient_colors
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(', ')
    
    const direction = gradientColor.gradient_direction === 'radial' ? 'radial-gradient' : 'linear-gradient'
    return { background: `${direction}(${stops})` }
  } else if (color.type === ColorType.METALLIC) {
    const metallicColor = color as MetallicColor
    const baseColor = metallicColor.metallic_base
    const intensity = metallicColor.metallic_intensity
    
    return {
      background: `linear-gradient(135deg, ${baseColor} 0%, #ffffff${Math.round(intensity * 255).toString(16).padStart(2, '0')} 50%, ${baseColor} 100%)`,
      boxShadow: `inset 0 1px 0 rgba(255,255,255,${intensity})`
    }
  }
  
  return { backgroundColor: '#cccccc' }
}

const getColorTooltip = (color: Color): string => {
  let tooltip = `${color.name} (${getTypeLabel(color.type)})`
  
  if (color.price_modifier !== 1 && props.showPriceModifier) {
    const modifier = Math.round((color.price_modifier - 1) * 100)
    tooltip += ` - ${modifier > 0 ? '+' : ''}${modifier}% к цене`
  }
  
  if (color.is_new) {
    tooltip += ' - НОВИНКА!'
  }
  
  return tooltip
}

const getTypeLabel = (type: ColorType): string => {
  switch (type) {
    case ColorType.SOLID:
      return 'Обычный'
    case ColorType.GRADIENT:
      return 'Градиент'
    case ColorType.METALLIC:
      return 'Металлик'
    default:
      return ''
  }
}
</script>

<style scoped>
.color-swatch-container {
  @apply cursor-pointer border-2 border-transparent rounded-lg p-3 hover:border-gray-300 transition-all;
  min-width: 90px;
}

.color-swatch-container.selected {
  @apply border-blue-500 ring-2 ring-blue-200;
}

.color-swatch-container.disabled {
  @apply opacity-50 cursor-not-allowed;
}

.color-swatch-container:hover:not(.selected):not(.disabled) {
  @apply transform scale-105;
}

.color-swatch {
  @apply w-12 h-12 rounded-full border border-gray-200 relative mb-2 flex items-center justify-center mx-auto;
  margin-top: 8px;
  margin-bottom: 12px;
}

.metallic-shine {
  @apply absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none;
}

.new-badge-overlay {
  @apply absolute bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center;
  top: -4px;
  right: -4px;
  font-size: 9px;
  min-width: 26px;
  height: 18px;
  line-height: 1;
}

.selection-indicator {
  @apply absolute inset-0 flex items-center justify-center text-white bg-black/30 rounded-full;
}

.multi-color-index {
  @apply absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold;
  font-size: 10px;
}

.color-info {
  @apply text-center;
}

.color-name {
  @apply text-sm font-medium text-gray-900 block leading-tight;
  word-wrap: break-word;
  hyphens: auto;
}

.price-modifier {
  @apply inline-block text-xs px-1 py-0.5 rounded bg-gray-100 text-gray-600 mt-1;
}

.price-modifier.price-increase {
  @apply bg-orange-100 text-orange-600;
}
</style>