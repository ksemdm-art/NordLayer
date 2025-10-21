import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'

const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1600
}

export function useBreakpoints() {
  const windowWidth = ref(0)

  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const current = computed(() => {
    const width = windowWidth.value
    if (width >= breakpoints['3xl']) return '3xl'
    if (width >= breakpoints['2xl']) return '2xl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    if (width >= breakpoints.xs) return 'xs'
    return 'xs'
  })

  const isXs = computed(() => windowWidth.value < breakpoints.sm)
  const isSm = computed(() => windowWidth.value >= breakpoints.sm && windowWidth.value < breakpoints.md)
  const isMd = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
  const isLg = computed(() => windowWidth.value >= breakpoints.lg && windowWidth.value < breakpoints.xl)
  const isXl = computed(() => windowWidth.value >= breakpoints.xl && windowWidth.value < breakpoints['2xl'])
  const is2Xl = computed(() => windowWidth.value >= breakpoints['2xl'] && windowWidth.value < breakpoints['3xl'])
  const is3Xl = computed(() => windowWidth.value >= breakpoints['3xl'])

  const isMobile = computed(() => windowWidth.value < breakpoints.md)
  const isTablet = computed(() => windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg)
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)

  const greaterOrEqual = (breakpoint: keyof typeof breakpoints) => {
    return computed(() => windowWidth.value >= breakpoints[breakpoint])
  }

  const smallerThan = (breakpoint: keyof typeof breakpoints) => {
    return computed(() => windowWidth.value < breakpoints[breakpoint])
  }

  return {
    windowWidth: readonly(windowWidth),
    current,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    is3Xl,
    isMobile,
    isTablet,
    isDesktop,
    greaterOrEqual,
    smallerThan
  }
}