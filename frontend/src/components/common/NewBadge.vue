<template>
  <span 
    v-if="isNew" 
    class="new-badge"
    :class="variant"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  isNew: boolean
  label?: string
  variant?: 'default' | 'small' | 'large' | 'overlay'
}

withDefaults(defineProps<Props>(), {
  label: 'NEW',
  variant: 'default'
})
</script>

<style scoped>
.new-badge {
  @apply inline-flex items-center justify-center font-bold text-white bg-blue-600 rounded shadow-sm;
}

.new-badge.default {
  @apply px-2 py-1 text-xs;
}

.new-badge.small {
  @apply px-1.5 py-0.5 text-xs;
}

.new-badge.large {
  @apply px-3 py-1.5 text-sm;
}

.new-badge.overlay {
  @apply absolute -top-1 -right-1 px-1.5 py-0.5 text-xs leading-none rounded-full;
  font-size: 9px;
  min-width: 24px;
}
</style>