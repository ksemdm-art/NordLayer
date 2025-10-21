import { ref, computed } from 'vue'
import { colorsApi, type Color, ColorType, type SolidColor, type GradientColor, type MetallicColor } from '@/api/colors'

const colors = ref<Color[]>([])
const loading = ref(false)
const loaded = ref(false)

export const useColors = () => {
  const loadColors = async (colorType?: ColorType) => {
    if (loaded.value || loading.value) return colors.value
    
    loading.value = true
    try {
      colors.value = await colorsApi.getColors(colorType)
      loaded.value = true
    } catch (error) {
      console.error('Error loading colors:', error)
      colors.value = []
    } finally {
      loading.value = false
    }
    
    return colors.value
  }

  const loadColorsByType = async (colorType: ColorType) => {
    loading.value = true
    try {
      const typeColors = await colorsApi.getColorsByType(colorType)
      return typeColors
    } catch (error) {
      console.error('Error loading colors by type:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  const activeColors = computed(() => 
    colors.value.filter(color => color.is_active)
  )

  const solidColors = computed(() => 
    activeColors.value.filter(color => color.type === ColorType.SOLID) as SolidColor[]
  )

  const gradientColors = computed(() => 
    activeColors.value.filter(color => color.type === ColorType.GRADIENT) as GradientColor[]
  )

  const metallicColors = computed(() => 
    activeColors.value.filter(color => color.type === ColorType.METALLIC) as MetallicColor[]
  )

  const getColorById = (id: number | string) => {
    const colorId = typeof id === 'string' ? parseInt(id) : id
    return colors.value.find(color => color.id === colorId)
  }

  const getColorValue = (colorId: number | string) => {
    const color = getColorById(colorId)
    if (!color) return '#cccccc'
    
    if (color.type === ColorType.SOLID) {
      return (color as SolidColor).hex_code
    } else if (color.type === ColorType.METALLIC) {
      return (color as MetallicColor).metallic_base
    }
    return '#cccccc'
  }

  const getColorName = (colorId: number | string) => {
    const color = getColorById(colorId)
    return color?.name || `Цвет #${colorId}`
  }

  const getColorStyle = (color: Color): Record<string, string> => {
    if (color.type === ColorType.SOLID) {
      const solidColor = color as SolidColor
      return { backgroundColor: solidColor.hex_code }
    } else if (color.type === ColorType.GRADIENT) {
      const gradientColor = color as GradientColor
      const stops = gradientColor.gradient_colors
        .sort((a, b) => a.position - b.position)
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ')
      
      const direction = gradientColor.gradient_direction === 'radial' ? 'radial-gradient' : 'linear-gradient'
      return { background: `${direction}(${stops})` }
    } else if (color.type === ColorType.METALLIC) {
      const metallicColor = color as MetallicColor
      const baseColor = metallicColor.metallic_base
      const intensity = metallicColor.metallic_intensity
      
      // Create metallic effect with gradient and shine
      return {
        background: `linear-gradient(135deg, ${baseColor} 0%, #ffffff${Math.round(intensity * 255).toString(16).padStart(2, '0')} 50%, ${baseColor} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${intensity})`
      }
    }
    
    return { backgroundColor: '#cccccc' }
  }

  const colorsMap = computed(() => {
    const map: Record<number, Color> = {}
    colors.value.forEach(color => {
      map[color.id] = color
    })
    return map
  })

  return {
    colors,
    activeColors,
    solidColors,
    gradientColors,
    metallicColors,
    loading,
    loaded,
    loadColors,
    loadColorsByType,
    getColorById,
    getColorValue,
    getColorName,
    getColorStyle,
    colorsMap
  }
}