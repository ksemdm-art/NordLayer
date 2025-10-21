<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <div 
        class="animate-spin rounded-full border-4 border-neutral-200"
        :class="[
          sizeClasses,
          `border-t-${color}-500`
        ]"
      ></div>
      <div 
        v-if="showText && text"
        class="mt-4 text-center text-neutral-600 text-sm font-medium"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'accent'
  text?: string
  showText?: boolean
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  text: 'Загрузка...',
  showText: true,
  fullScreen: false
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const containerClass = computed(() => {
  return props.fullScreen ? 'min-h-screen' : 'py-8'
})
</script>