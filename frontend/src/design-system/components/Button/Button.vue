<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    
    <span :class="{ 'opacity-0': loading }" class="flex items-center justify-center gap-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'copper';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
  tag?: 'button' | 'a' | 'router-link';
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  to?: string | object;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  rounded: false,
  tag: 'button',
  type: 'button',
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const buttonClasses = computed(() => {
  const baseClasses = [
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  ];

  // Size classes
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  // Variant classes с точными цветами брендбука
  const variantClasses = {
    primary: 'bg-primary-900 text-primary-50 hover:bg-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 font-bold',
    secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200 focus:ring-primary-500 shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-300 font-semibold',
    outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-primary-50 focus:ring-primary-500 active:scale-[0.98] transition-all duration-300 font-semibold',
    ghost: 'text-primary-700 hover:bg-primary-100 hover:text-primary-900 focus:ring-primary-500 active:scale-[0.98] transition-all duration-300 font-medium',
    copper: 'bg-accent-500 text-primary-50 hover:bg-accent-600 focus:ring-accent-400 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 font-bold',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-300 font-bold',
  };

  // Border radius
  const radiusClasses = props.rounded ? 'rounded-full' : 'rounded-lg';

  // Full width
  const widthClasses = props.fullWidth ? 'w-full' : '';

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    radiusClasses,
    widthClasses,
  ].filter(Boolean).join(' ');
});

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>