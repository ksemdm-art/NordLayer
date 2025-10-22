import type { Service, Project } from '@/types'

export interface OrderFormData {
  services: Service[]
  service?: Service  // Выбранная услуга
  files: UploadedFile[]
  selectedGalleryItems?: Project[]
  photos?: PhotoFile[]
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress?: string
  deliveryCity?: string
  deliveryPostalCode?: string
  specifications: OrderSpecification & Record<string, unknown>
  notes: string
  totalPrice: number
  // New fields for improved order form
  alternativeContact?: string  // Alternative contact method
  deliveryNeeded?: boolean | null     // Whether delivery is needed
  deliveryDetails?: string     // Delivery details when needed
}

export interface PhotoFile {
  name: string
  file: File
  preview: string
}

export interface UploadedFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
}

export interface OrderSpecification {
  material?: string
  quality?: string
  infill?: number
  color?: string
  colorName?: string
  selectedColor?: number | null
  isMultiColor?: boolean
  multiColors?: number[]  // Массив ID выбранных цветов для многоцветной печати
  quantity?: number
  urgency?: string
  postProcessing?: string[]
}

export interface PriceCalculation {
  basePrice: number
  materialMultiplier: number
  qualityMultiplier: number
  urgencyMultiplier: number
  fileCountMultiplier: number
  totalPrice: number
  breakdown: PriceBreakdownItem[]
}

export interface PriceBreakdownItem {
  label: string
  value: number
  type: 'base' | 'multiplier' | 'addition'
}