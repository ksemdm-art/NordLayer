import { api } from '@/services/api'

export enum ColorType {
  SOLID = 'solid',
  GRADIENT = 'gradient',
  METALLIC = 'metallic'
}

export interface GradientStop {
  color: string
  position: number
}

export interface BaseColor {
  id: number
  name: string
  type: ColorType
  is_active: boolean
  is_new: boolean
  sort_order: number
  price_modifier: number
  created_at: string
  updated_at: string
}

export interface SolidColor extends BaseColor {
  type: ColorType.SOLID
  hex_code: string
}

export interface GradientColor extends BaseColor {
  type: ColorType.GRADIENT
  gradient_colors: GradientStop[]
  gradient_direction: 'linear' | 'radial'
}

export interface MetallicColor extends BaseColor {
  type: ColorType.METALLIC
  metallic_base: string
  metallic_intensity: number
}

export type Color = SolidColor | GradientColor | MetallicColor

export interface ColorsResponse {
  success: boolean
  data: Color[]
}

export interface ColorTypesResponse {
  success: boolean
  data: Array<{
    value: ColorType
    label: string
  }>
}

export const colorsApi = {
  async getColors(colorType?: ColorType, includeInactive = false): Promise<Color[]> {
    try {
      let url = '/colors/'
      const params = new URLSearchParams()
      
      if (colorType) {
        params.append('color_type', colorType)
      }
      if (includeInactive) {
        params.append('include_inactive', 'true')
      }
      
      // Добавляем timestamp для предотвращения кеширования
      params.append('_t', Date.now().toString())
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      console.log('🔄 Fetching colors from:', url)
      const response = await api.get<ColorsResponse>(url)
      console.log('✅ Colors API response:', response.data)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching colors:', error)
      // Возвращаем fallback цвета если API недоступен
      return [
        { 
          id: 1, 
          name: 'Белый', 
          type: ColorType.SOLID,
          hex_code: '#FFFFFF', 
          is_active: true,
          is_new: false,
          sort_order: 1, 
          price_modifier: 1.0,
          created_at: '', 
          updated_at: '' 
        },
        { 
          id: 2, 
          name: 'Чёрный', 
          type: ColorType.SOLID,
          hex_code: '#000000', 
          is_active: true,
          is_new: false,
          sort_order: 2, 
          price_modifier: 1.0,
          created_at: '', 
          updated_at: '' 
        },
        { 
          id: 3, 
          name: 'Красный', 
          type: ColorType.SOLID,
          hex_code: '#FF0000', 
          is_active: true,
          is_new: false,
          sort_order: 3, 
          price_modifier: 1.0,
          created_at: '', 
          updated_at: '' 
        },
      ] as SolidColor[]
    }
  },

  async getColorsByType(colorType: ColorType): Promise<Color[]> {
    try {
      const response = await api.get<ColorsResponse>(`/colors/by-type/${colorType}`)
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching colors by type:', error)
      return []
    }
  },



  async getColorTypes(): Promise<Array<{ value: ColorType; label: string }>> {
    try {
      const response = await api.get<ColorTypesResponse>('/colors/types')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching color types:', error)
      return [
        { value: ColorType.SOLID, label: 'Solid Color' },
        { value: ColorType.GRADIENT, label: 'Gradient' },
        { value: ColorType.METALLIC, label: 'Metallic' }
      ]
    }
  },

  async createColor(colorData: Partial<Color>): Promise<Color> {
    const response = await api.post<{ success: boolean; data: Color }>('/colors/', colorData)
    return response.data.data
  },

  async updateColor(id: number, colorData: Partial<Color>): Promise<Color> {
    const response = await api.put<{ success: boolean; data: Color }>(`/colors/${id}`, colorData)
    return response.data.data
  },

  async deleteColor(id: number): Promise<void> {
    await api.delete(`/colors/${id}`)
  },

  async toggleActiveStatus(id: number): Promise<Color> {
    console.log('🔄 Toggling active status for color ID:', id)
    const response = await api.patch<{ success: boolean; data: Color }>(`/colors/${id}/toggle-active`)
    console.log('✅ Toggle active response:', response.data)
    return response.data.data
  },

  async toggleNewStatus(id: number): Promise<Color> {
    console.log('🔄 Toggling new status for color ID:', id)
    const response = await api.patch<{ success: boolean; data: Color }>(`/colors/${id}/toggle-new`)
    console.log('✅ Toggle new response:', response.data)
    return response.data.data
  }
}