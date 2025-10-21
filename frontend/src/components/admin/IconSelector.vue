<template>
  <div class="icon-selector">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Иконка услуги
    </label>
    <div class="grid grid-cols-6 gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <div
        v-for="iconOption in availableIcons"
        :key="iconOption.value"
        @click="selectIcon(iconOption.value)"
        :class="[
          'flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all duration-200',
          selectedIcon === iconOption.value
            ? 'bg-primary-500 text-white shadow-lg transform scale-105'
            : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
        ]"
      >
        <component 
          :is="iconOption.component" 
          class="w-6 h-6 mb-1" 
        />
        <span class="text-xs font-medium">{{ iconOption.label }}</span>
      </div>
    </div>
    <p class="text-sm text-gray-500 mt-2">
      Выберите иконку, которая лучше всего описывает вашу услугу
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  CubeIcon,
  CogIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  BeakerIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CameraIcon
} from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedIcon = ref(props.modelValue || 'cube')

const availableIcons = [
  { value: 'cube', label: 'Куб', component: CubeIcon },
  { value: 'cog', label: 'Шестерня', component: CogIcon },
  { value: 'sparkles', label: 'Искры', component: SparklesIcon },
  { value: 'wrench', label: 'Инструмент', component: WrenchScrewdriverIcon },
  { value: 'paint', label: 'Кисть', component: PaintBrushIcon },
  { value: 'beaker', label: 'Колба', component: BeakerIcon },
  { value: 'chip', label: 'Чип', component: CpuChipIcon },
  { value: 'rocket', label: 'Ракета', component: RocketLaunchIcon },
  { value: 'bulb', label: 'Лампочка', component: LightBulbIcon },
  { value: 'shield', label: 'Щит', component: ShieldCheckIcon },
  { value: 'document', label: 'Документ', component: ClipboardDocumentListIcon },
  { value: 'camera', label: 'Камера', component: CameraIcon }
]

const selectIcon = (iconValue: string) => {
  selectedIcon.value = iconValue
  emit('update:modelValue', iconValue)
}

watch(() => props.modelValue, (newValue) => {
  selectedIcon.value = newValue || 'cube'
})
</script>