<template>
  <div :class="gridClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24;
  responsive?: {
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
}

const props = withDefaults(defineProps<GridProps>(), {
  cols: 1,
  gap: 4,
});

const gridClasses = computed(() => {
  const baseClasses = ['grid'];

  // Base columns
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
    auto: 'grid-cols-auto',
    none: 'grid-cols-none',
  };

  // Gap classes
  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
    9: 'gap-9',
    10: 'gap-10',
    12: 'gap-12',
    14: 'gap-14',
    16: 'gap-16',
    20: 'gap-20',
    24: 'gap-24',
  };

  // Responsive classes
  const responsiveClasses = [];
  if (props.responsive) {
    if (props.responsive.xs) responsiveClasses.push(`xs:grid-cols-${props.responsive.xs}`);
    if (props.responsive.sm) responsiveClasses.push(`sm:grid-cols-${props.responsive.sm}`);
    if (props.responsive.md) responsiveClasses.push(`md:grid-cols-${props.responsive.md}`);
    if (props.responsive.lg) responsiveClasses.push(`lg:grid-cols-${props.responsive.lg}`);
    if (props.responsive.xl) responsiveClasses.push(`xl:grid-cols-${props.responsive.xl}`);
    if (props.responsive['2xl']) responsiveClasses.push(`2xl:grid-cols-${props.responsive['2xl']}`);
  }

  return [
    ...baseClasses,
    colsClasses[props.cols],
    gapClasses[props.gap],
    ...responsiveClasses,
  ].filter(Boolean).join(' ');
});
</script>