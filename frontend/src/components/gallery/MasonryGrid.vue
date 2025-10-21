<template>
  <div 
    ref="gridContainer"
    class="masonry-grid"
    :class="{ 'loading': loading }"
    :style="gridStyle"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="masonry-item"
    >
      <slot :item="item" :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  items: any[]
  columnWidth?: number
  gap?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  columnWidth: 320,
  gap: 24,
  loading: false
})

const gridContainer = ref<HTMLElement>()
let resizeObserver: ResizeObserver | null = null

// Calculate number of columns based on container width
const columns = ref(1)

const calculateColumns = () => {
  if (!gridContainer.value) return
  
  const containerWidth = gridContainer.value.clientWidth
  const minColumns = 1
  const maxColumns = 6
  
  // Calculate how many columns can fit
  const possibleColumns = Math.floor(containerWidth / (props.columnWidth + props.gap))
  columns.value = Math.max(minColumns, Math.min(maxColumns, possibleColumns))
}

// CSS Grid style
const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.value}, ${props.columnWidth}px)`,
    gridAutoRows: 'min-content',
    gap: `${props.gap}px`,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'stretch'
  }
})

const handleResize = () => {
  calculateColumns()
}

onMounted(() => {
  if (gridContainer.value) {
    calculateColumns()
    
    // Setup resize observer
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(gridContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

// Expose methods for parent component
defineExpose({
  relayout: calculateColumns
})
</script>

<style scoped>
.masonry-grid {
  width: 100%;
  min-height: 200px;
  padding: 0 1rem;
  box-sizing: border-box;
}

.masonry-grid.loading {
  opacity: 0.5;
}

.masonry-item {
  width: 100%;
  break-inside: avoid;
  margin-bottom: 0;
  box-sizing: border-box;
}

/* Loading animation */
.masonry-grid.loading .masonry-item {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .masonry-grid {
    padding: 0 0.5rem;
  }
}

@media (max-width: 768px) {
  .masonry-grid {
    padding: 0 0.25rem;
  }
}

@media (max-width: 480px) {
  .masonry-grid {
    padding: 0 0.25rem;
  }
}
</style>