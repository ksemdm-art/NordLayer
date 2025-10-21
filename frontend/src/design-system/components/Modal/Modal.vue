<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div 
          class="modal-container"
          :class="modalClasses"
          @click.stop
        >
          <div class="modal-content">
            <!-- Header -->
            <div v-if="$slots.header || showClose" class="modal-header">
              <div class="modal-header-content">
                <slot name="header" />
              </div>
              
              <button
                v-if="showClose"
                @click="close"
                class="modal-close-button"
                type="button"
                aria-label="Закрыть"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'

export interface ModalProps {
  modelValue: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnOverlay?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  size: 'md',
  showClose: true,
  closeOnOverlay: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalClasses = computed(() => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }

  return [
    'modal-dialog',
    sizeClasses[props.size]
  ].join(' ')
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape && props.modelValue) {
    close()
  }
}

onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscapeKey)
  }
  
  // Prevent body scroll when modal is open
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  if (props.closeOnEscape) {
    document.removeEventListener('keydown', handleEscapeKey)
  }
  
  // Restore body scroll
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm;
}

.modal-container {
  @apply w-full;
}

.modal-dialog {
  @apply bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col;
}

.modal-content {
  @apply flex flex-col max-h-full;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0;
}

.modal-header-content {
  @apply flex-1 min-w-0;
}

.modal-close-button {
  @apply ml-4 p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0;
}

.modal-body {
  @apply p-6 overflow-y-auto flex-1;
}

.modal-footer {
  @apply p-6 border-t border-neutral-200 flex-shrink-0;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  transform: scale(0.95) translateY(-20px);
}
</style>