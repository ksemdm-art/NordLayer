<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <div v-if="$slots['icon-left']" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <slot name="icon-left" />
      </div>
      
      <input
        :id="inputId"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        v-bind="$attrs"
        @blur="handleBlur"
        @focus="handleFocus"
        @input="handleInput"
      />
      
      <div v-if="$slots['icon-right']" class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <slot name="icon-right" />
      </div>
    </div>
    
    <div v-if="error || hint" class="input-message">
      <p v-if="error" class="text-error-600 text-sm">{{ error }}</p>
      <p v-else-if="hint" class="text-neutral-500 text-sm">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue';

export interface InputProps {
  modelValue?: string | number;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  disabled: false,
  readonly: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
}>();

const slots = useSlots();
const isFocused = ref(false);
const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value || ''),
});

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
  ];

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  // Variant classes with NordLayer styling
  const variantClasses = {
    default: 'border border-primary-300 rounded-lg bg-white focus:border-primary-900 focus:ring-primary-500 transition-all duration-300',
    filled: 'border-0 rounded-lg bg-primary-100 focus:bg-white focus:ring-primary-500 transition-all duration-300',
    outlined: 'border-2 border-primary-300 rounded-lg bg-white focus:border-primary-900 focus:ring-primary-500 transition-all duration-300',
  };

  // State classes
  const stateClasses = [];
  
  if (props.error) {
    stateClasses.push('border-error-500 focus:border-error-500 focus:ring-error-500');
  }
  
  if (props.disabled) {
    stateClasses.push('bg-primary-100 text-primary-400 cursor-not-allowed');
  }
  
  if (props.readonly) {
    stateClasses.push('bg-primary-50 cursor-default');
  }

  // Icon padding
  const iconPadding = [];
  if (slots['icon-left']) {
    iconPadding.push('pl-10');
  }
  if (slots['icon-right']) {
    iconPadding.push('pr-10');
  }

  return [
    ...baseClasses,
    sizeClasses[props.size],
    variantClasses[props.variant],
    ...stateClasses,
    ...iconPadding,
  ].filter(Boolean).join(' ');
});

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleInput = (event: Event) => {
  emit('input', event);
};
</script>

<style scoped>
.input-wrapper {
  @apply space-y-1;
}

.input-label {
  @apply block text-sm font-medium text-primary-900;
}

.input-message {
  @apply mt-1;
}
</style>