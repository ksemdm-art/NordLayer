<template>
  <component 
    :is="iconComponent" 
    :class="iconClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  icon: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'cube',
  class: 'w-6 h-6'
})

const iconMap = {
  cube: CubeIcon,
  cog: CogIcon,
  sparkles: SparklesIcon,
  wrench: WrenchScrewdriverIcon,
  paint: PaintBrushIcon,
  beaker: BeakerIcon,
  chip: CpuChipIcon,
  rocket: RocketLaunchIcon,
  bulb: LightBulbIcon,
  shield: ShieldCheckIcon,
  document: ClipboardDocumentListIcon,
  camera: CameraIcon
}

const iconComponent = computed(() => {
  return iconMap[props.icon as keyof typeof iconMap] || CubeIcon
})

const iconClass = computed(() => props.class)
</script>