<template>
  <div class="stl-viewer-container" :class="{ 'fullscreen': isFullscreen }">
    <div 
      ref="viewerContainer" 
      class="stl-viewer"
      :class="{ 'loading': loading }"
    >
      <!-- Loading overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Загрузка 3D модели...</p>
          <div v-if="progress > 0" class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Error overlay -->
      <div v-if="error" class="error-overlay">
        <div class="error-content">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3>Ошибка загрузки</h3>
          <p>{{ error }}</p>
          <button @click="retry" class="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>

      <!-- Controls overlay -->
      <div v-if="!loading && !error" class="controls-overlay">
        <div class="controls-group">
          <button 
            @click="resetView" 
            class="control-button"
            title="Сбросить вид"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button 
            @click="toggleFullscreen" 
            class="control-button"
            title="Полноэкранный режим"
          >
            <svg v-if="!isFullscreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v-4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5m0 0l-5.5 5.5" />
            </svg>
          </button>



          <div class="color-picker">
            <input 
              v-model="modelColor" 
              type="color" 
              @change="changeModelColor"
              class="color-input"
              title="Изменить цвет модели"
            />
          </div>

          <button 
            @click="toggleLighting" 
            class="control-button"
            :class="{ 'active': brightLighting }"
            title="Переключить яркость освещения"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
        </div>

        <!-- Instructions -->
        <div class="instructions" v-if="showInstructions && !hideInstructions" @click="hideInstructions = true">
          <div class="instruction-content">
            <div class="instruction-icon">🖱️</div>
            <p>Вращайте • Масштабируйте • Исследуйте</p>
            <div class="instruction-hint">Нажмите, чтобы скрыть</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { STLViewer } from '@/utils/three-loader'

interface Props {
  stlUrl?: string
  width?: number
  height?: number
  backgroundColor?: string
  showInstructions?: boolean
  showGrid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  backgroundColor: '#f8fafc',
  showInstructions: true,
  showGrid: false
})

const emit = defineEmits<{
  load: []
  error: [error: string]
  progress: [progress: number]
}>()

const viewerContainer = ref<HTMLElement>()
const loading = ref(false)
const error = ref<string | null>(null)
const progress = ref(0)
const isFullscreen = ref(false)
const modelColor = ref('#4f46e5')
const hideInstructions = ref(false)
const showGridState = ref(props.showGrid)
const brightLighting = ref(true)

let viewer: STLViewer | null = null
let resizeObserver: ResizeObserver | null = null

const initViewer = async () => {
  if (!viewerContainer.value) return

  try {
    viewer = new STLViewer({
      container: viewerContainer.value,
      width: props.width,
      height: props.height,
      backgroundColor: hexToNumber(props.backgroundColor),
      enableControls: true,
      enableFullscreen: true,
      showGrid: props.showGrid,
      onLoad: () => {
        loading.value = false
        error.value = null
        emit('load')
      },
      onError: (err) => {
        loading.value = false
        error.value = err.message
        emit('error', err.message)
      },
      onProgress: (prog) => {
        progress.value = prog
        emit('progress', prog)
      }
    })

    if (props.stlUrl) {
      await loadModel()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to initialize viewer'
  }
}

const loadModel = async () => {
  if (!viewer || !props.stlUrl) return

  loading.value = true
  error.value = null
  progress.value = 0

  try {
    await viewer.loadSTL(props.stlUrl)
  } catch (err) {
    // Error handling is done in the viewer callbacks
  }
}

const resetView = () => {
  if (viewer) {
    // Re-adjust camera to default position
    loadModel()
  }
}

const toggleFullscreen = () => {
  if (!viewer) return

  if (!isFullscreen.value) {
    viewer.enableFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

const changeModelColor = () => {
  if (viewer) {
    viewer.setModelColor(hexToNumber(modelColor.value))
  }
}

const retry = () => {
  error.value = null
  loadModel()
}

const toggleGrid = () => {
  showGridState.value = !showGridState.value
  if (viewer) {
    viewer.toggleGrid(showGridState.value)
  }
}

const toggleLighting = () => {
  brightLighting.value = !brightLighting.value
  if (viewer) {
    viewer.setBrightLighting(brightLighting.value)
  }
}

const hexToNumber = (hex: string): number => {
  return parseInt(hex.replace('#', ''), 16)
}

// Handle fullscreen changes
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
  
  if (viewer) {
    nextTick(() => {
      viewer!.resize()
    })
  }
}

// Watch for STL URL changes
watch(() => props.stlUrl, () => {
  if (props.stlUrl) {
    loadModel()
  }
})

onMounted(() => {
  initViewer()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  
  // Настраиваем ResizeObserver для отслеживания изменений размера
  if (viewerContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      if (viewer) {
        nextTick(() => {
          viewer!.resize()
        })
      }
    })
    resizeObserver.observe(viewerContainer.value)
  }
  
  // Автоматически скрыть инструкции через 4 секунды
  if (props.showInstructions) {
    setTimeout(() => {
      hideInstructions.value = true
    }, 4000)
  }
})

onUnmounted(() => {
  if (viewer) {
    viewer.dispose()
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.stl-viewer-container {
  @apply relative w-full h-full;
}

.stl-viewer {
  @apply relative w-full h-full overflow-hidden rounded-xl;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e293b 75%, #0f172a 100%);
  min-height: 300px;
  box-shadow: 
    inset 0 1px 0 rgba(139, 92, 246, 0.3),
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.stl-viewer :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
}

.stl-viewer.loading {
  @apply cursor-wait;
}

.loading-overlay {
  @apply absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10;
}

.loading-spinner {
  @apply text-center;
}

.spinner {
  @apply w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4;
}

.loading-text {
  @apply text-gray-600 mb-4;
}

.progress-bar {
  @apply w-48 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-primary-600 transition-all duration-300 ease-out;
}

.error-overlay {
  @apply absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10;
}

.error-content {
  @apply text-center p-6;
}

.error-icon {
  @apply w-16 h-16 text-red-500 mx-auto mb-4;
}

.error-content h3 {
  @apply text-xl font-semibold text-gray-900 mb-2;
}

.error-content p {
  @apply text-gray-600 mb-4;
}

.retry-button {
  @apply bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.controls-overlay {
  @apply absolute top-4 right-4 z-20;
}

.controls-group {
  @apply flex items-center space-x-2 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-white border-opacity-20;
}

.control-button {
  @apply w-10 h-10 flex items-center justify-center text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200;
}

.control-button svg {
  @apply w-5 h-5;
}

.control-button.active {
  @apply bg-amber-500 bg-opacity-80 text-white;
}

.color-picker {
  @apply relative;
}

.color-input {
  @apply w-8 h-8 rounded-lg border-2 border-white border-opacity-30 cursor-pointer shadow-lg;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.color-input::-webkit-color-swatch-wrapper {
  @apply p-0;
}

.color-input::-webkit-color-swatch {
  @apply border-0 rounded;
}

.instructions {
  @apply absolute top-full right-0 mt-2 bg-black bg-opacity-75 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap cursor-pointer;
  animation: fadeInOut 4s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}

.fullscreen .stl-viewer {
  @apply fixed inset-0 z-50 rounded-none;
}

.fullscreen .controls-overlay {
  @apply fixed top-4 right-4 z-50;
}
</style>