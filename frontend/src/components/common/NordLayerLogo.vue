<template>
  <div class="nordlayer-logo" :class="sizeClass">
    <!-- Full logo with modern design -->
    <div v-if="variant === 'full'" class="flex items-center gap-3">
      <svg 
        :width="logoSize" 
        :height="logoSize" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <defs>
          <linearGradient :id="`logo-gradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :style="`stop-color:${logoColor};stop-opacity:1`" />
            <stop offset="100%" :style="`stop-color:${accentColor};stop-opacity:1`" />
          </linearGradient>
        </defs>
        
        <!-- Современный логотип в виде слоёв (символизирует 3D печать) -->
        <g id="nordlayer-symbol">
          <!-- Основание -->
          <rect x="8" y="30" width="24" height="4" rx="2" :fill="logoColor" opacity="0.8"/>
          <!-- Средний слой -->
          <rect x="10" y="22" width="20" height="4" rx="2" :fill="`url(#logo-gradient-${uniqueId})`"/>
          <!-- Верхний слой -->
          <rect x="12" y="14" width="16" height="4" rx="2" :fill="accentColor"/>
          <!-- Вершина -->
          <circle cx="20" cy="10" r="3" :fill="accentColor"/>
          
          <!-- Северная звезда (символ навигации и точности) -->
          <path d="M20 4 L21 7 L24 6 L22 9 L25 10 L22 11 L24 14 L21 13 L20 16 L19 13 L16 14 L18 11 L15 10 L18 9 L16 6 L19 7 Z" 
                :fill="logoColor" opacity="0.6"/>
        </g>
      </svg>
      
      <span 
        class="font-bold leading-tight"
        :class="[textColorClass, textSizeClass]"
      >
        NordLayer
      </span>
    </div>

    <!-- Aurora variant with beautiful gradient -->
    <svg 
      v-else-if="variant === 'aurora'" 
      :width="width || 140" 
      :height="height || 32" 
      viewBox="0 0 140 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="logo-svg"
    >
      <defs>
        <linearGradient :id="`aurora-gradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#C68642;stop-opacity:1" />
          <stop offset="30%" style="stop-color:#E2A574;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#8E9BAE;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1B2A41;stop-opacity:1" />
        </linearGradient>
        
        <linearGradient :id="`text-gradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1B2A41;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#8E9BAE;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#C68642;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <g id="nordlayer-logo-aurora">
        <!-- Символ слоёв -->
        <g id="layers-symbol">
          <rect x="4" y="24" width="20" height="2.5" rx="1.25" :fill="`url(#aurora-gradient-${uniqueId})`" opacity="0.8"/>
          <rect x="6" y="19" width="16" height="2.5" rx="1.25" :fill="`url(#aurora-gradient-${uniqueId})`"/>
          <rect x="8" y="14" width="12" height="2.5" rx="1.25" :fill="`url(#aurora-gradient-${uniqueId})`"/>
          <circle cx="14" cy="10" r="1.5" :fill="`url(#aurora-gradient-${uniqueId})`"/>
        </g>
        
        <text 
          x="32" 
          y="20" 
          font-family="Inter, sans-serif" 
          font-size="14" 
          font-weight="700" 
          :fill="`url(#text-gradient-${uniqueId})`"
        >
          NordLayer
        </text>
      </g>
    </svg>

    <!-- Symbol only (layers icon) -->
    <svg 
      v-else-if="variant === 'symbol'" 
      :width="width || 32" 
      :height="height || 32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      class="logo-svg"
    >
      <defs>
        <linearGradient :id="`symbol-gradient-${uniqueId}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="`stop-color:${logoColor};stop-opacity:1`" />
          <stop offset="100%" :style="`stop-color:${accentColor};stop-opacity:1`" />
        </linearGradient>
      </defs>
      
      <g id="layers-symbol">
        <!-- Основание -->
        <rect x="4" y="24" width="24" height="3" rx="1.5" :fill="logoColor" opacity="0.7"/>
        <!-- Средний слой -->
        <rect x="6" y="18" width="20" height="3" rx="1.5" :fill="`url(#symbol-gradient-${uniqueId})`"/>
        <!-- Верхний слой -->
        <rect x="8" y="12" width="16" height="3" rx="1.5" :fill="accentColor"/>
        <!-- Вершина -->
        <circle cx="16" cy="8" r="2.5" :fill="accentColor"/>
      </g>
    </svg>

    <!-- Compact variant for small spaces -->
    <div v-else-if="variant === 'compact'" class="flex items-center gap-2">
      <svg 
        :width="logoSize" 
        :height="logoSize" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        class="logo-svg"
      >
        <rect x="4" y="18" width="16" height="2" rx="1" :fill="logoColor" opacity="0.7"/>
        <rect x="6" y="14" width="12" height="2" rx="1" :fill="logoColor"/>
        <rect x="8" y="10" width="8" height="2" rx="1" :fill="accentColor"/>
        <circle cx="12" cy="7" r="1.5" :fill="accentColor"/>
      </svg>
      
      <span 
        class="font-bold"
        :class="[textColorClass, 'text-sm']"
      >
        NL
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'full' | 'aurora' | 'symbol' | 'compact'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'copper'
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'full',
  size: 'md',
  color: 'primary'
})

// Уникальный ID для градиентов (избегаем конфликтов)
const uniqueId = computed(() => Math.random().toString(36).substr(2, 9))

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-16 h-6',
    sm: 'w-20 h-8',
    md: 'w-32 h-10',
    lg: 'w-40 h-12',
    xl: 'w-48 h-16'
  }
  return sizes[props.size]
})

const logoSize = computed(() => {
  const sizes = {
    xs: 20,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const sizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  }
  return sizes[props.size]
})

const logoColor = computed(() => {
  const colors = {
    primary: '#1B2A41',  // Северный синий - чистота, глубина
    white: '#F4F7FA',    // Ледяной белый - простота, ясность
    copper: '#C68642'    // Медный акцент - ремесло, тепло
  }
  return colors[props.color]
})

const accentColor = computed(() => {
  const colors = {
    primary: '#C68642',  // Медный акцент для primary
    white: '#C68642',    // Медный акцент для white
    copper: '#1B2A41'    // Северный синий для copper
  }
  return colors[props.color]
})

const textColorClass = computed(() => {
  const colorClasses = {
    primary: 'text-primary-900',  // Северный синий
    white: 'text-primary-50',     // Ледяной белый
    copper: 'text-accent-500'     // Медный акцент
  }
  return colorClasses[props.color]
})
</script>

<style scoped>
.nordlayer-logo {
  @apply inline-flex items-center;
}

.logo-svg {
  @apply transition-all duration-300 ease-out;
  filter: drop-shadow(0 2px 4px rgba(27, 42, 65, 0.1));
}

.nordlayer-logo:hover .logo-svg {
  @apply scale-105;
  filter: drop-shadow(0 4px 8px rgba(27, 42, 65, 0.15));
}

/* Анимация появления */
.nordlayer-logo {
  animation: fadeInScale 0.6s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive sizing */
@media (max-width: 640px) {
  .nordlayer-logo {
    @apply scale-90;
  }
}

/* Улучшенная типографика */
.nordlayer-logo span {
  letter-spacing: -0.02em;
  text-rendering: optimizeLegibility;
}
</style>