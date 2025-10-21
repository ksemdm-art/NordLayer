<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="card-header" :class="headerClasses">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
      </slot>
    </div>
    
    <div v-if="$slots.default" class="card-body" :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hover?: boolean;
  interactive?: boolean;
  title?: string;
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default',
  padding: 'md',
  rounded: 'lg',
  hover: false,
  interactive: false,
});

const cardClasses = computed(() => {
  const baseClasses = ['card', 'transition-all', 'duration-200'];

  // Variant classes с цветами брендбука
  const variantClasses = {
    default: 'bg-white border border-primary-200',
    elevated: 'bg-white shadow-nordic',
    outlined: 'bg-white border-2 border-primary-300',
    ghost: 'bg-transparent',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  // Rounded classes
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  // Interactive classes с эффектами брендбука
  const interactiveClasses = props.interactive 
    ? 'cursor-pointer hover:shadow-aurora active:scale-[0.98] transition-all duration-300'
    : '';

  // Hover classes с эффектами брендбука
  const hoverClasses = props.hover && !props.interactive
    ? 'hover:shadow-aurora hover:-translate-y-2 transition-all duration-300'
    : '';

  return [
    ...baseClasses,
    variantClasses[props.variant],
    paddingClasses[props.padding],
    roundedClasses[props.rounded],
    interactiveClasses,
    hoverClasses,
  ].filter(Boolean).join(' ');
});

const headerClasses = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'pb-2',
    md: 'pb-3',
    lg: 'pb-4',
    xl: 'pb-6',
  };
  
  return [
    'border-b border-primary-200',
    paddingMap[props.padding],
  ].filter(Boolean).join(' ');
});

const bodyClasses = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'py-2',
    md: 'py-3',
    lg: 'py-4',
    xl: 'py-6',
  };
  
  return paddingMap[props.padding];
});

const footerClasses = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'pt-2',
    md: 'pt-3',
    lg: 'pt-4',
    xl: 'pt-6',
  };
  
  return [
    'border-t border-primary-200',
    paddingMap[props.padding],
  ].filter(Boolean).join(' ');
});
</script>

<style scoped>
.card-header:empty,
.card-body:empty,
.card-footer:empty {
  display: none;
}
</style>