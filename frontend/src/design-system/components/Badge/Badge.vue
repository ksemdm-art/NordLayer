<template>
  <span :class="badgeClasses">
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  dot?: boolean;
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'sm',
  rounded: false,
  outline: false,
  dot: false,
});

const badgeClasses = computed(() => {
  const baseClasses = [
    'inline-flex items-center gap-1 font-medium transition-colors duration-200',
  ];

  // Size classes
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Variant classes (solid)
  const solidVariantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    neutral: 'bg-neutral-100 text-neutral-600',
  };

  // Variant classes (outline)
  const outlineVariantClasses = {
    default: 'border border-neutral-300 text-neutral-700 bg-white',
    primary: 'border border-primary-300 text-primary-700 bg-white',
    secondary: 'border border-secondary-300 text-secondary-700 bg-white',
    success: 'border border-success-300 text-success-700 bg-white',
    warning: 'border border-warning-300 text-warning-700 bg-white',
    error: 'border border-error-300 text-error-700 bg-white',
    neutral: 'border border-neutral-300 text-neutral-600 bg-white',
  };

  // Dot variant classes
  const dotVariantClasses = {
    default: 'w-2 h-2 bg-neutral-400',
    primary: 'w-2 h-2 bg-primary-500',
    secondary: 'w-2 h-2 bg-secondary-500',
    success: 'w-2 h-2 bg-success-500',
    warning: 'w-2 h-2 bg-warning-500',
    error: 'w-2 h-2 bg-error-500',
    neutral: 'w-2 h-2 bg-neutral-400',
  };

  // Border radius
  const radiusClasses = props.rounded ? 'rounded-full' : 'rounded-md';

  // Choose variant classes based on style
  let variantClasses;
  if (props.dot) {
    variantClasses = dotVariantClasses[props.variant];
    return [variantClasses, 'rounded-full'].join(' ');
  } else if (props.outline) {
    variantClasses = outlineVariantClasses[props.variant];
  } else {
    variantClasses = solidVariantClasses[props.variant];
  }

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses,
    radiusClasses,
  ].filter(Boolean).join(' ');
});
</script>