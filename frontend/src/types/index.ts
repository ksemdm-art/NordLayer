// Common type definitions

export interface ProjectImage {
  id: number
  project_id: number
  image_path: string
  alt_text?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export type ComplexityLevel = 'simple' | 'medium' | 'complex'

export interface Project {
  id: number
  title: string
  description: string
  images: ProjectImage[]
  stl_file?: string
  category: string
  created_at: string
  updated_at: string
  is_featured: boolean
  project_metadata?: Record<string, any>
  
  // New pricing and duration fields
  estimated_price?: number
  estimated_duration_hours?: number
  complexity_level?: ComplexityLevel
  price_range_min?: number
  price_range_max?: number
}

export interface OrderFile {
  id: number
  original_filename: string
  file_path: string
  file_size?: number
  mime_type?: string
  created_at: string
}

export interface GalleryItem {
  id: number
  title: string
  image_url?: string
  description?: string
  stl_file?: string
}

export interface ColorInfo {
  color: string
  name: string
}

export interface Order {
  id: number
  customer_name: string
  customer_email?: string
  customer_contact: string
  customer_phone?: string
  alternative_contact?: string
  delivery_needed?: string
  delivery_details?: string
  service_id: number
  service_name?: string
  status: string
  total_price?: number
  source: string
  notes?: string
  specifications?: Record<string, any>
  
  // Извлеченные из specifications для удобства
  color?: string
  color_name?: string
  multi_color?: boolean
  multi_colors?: ColorInfo[]
  quantity?: number
  infill?: number
  material?: string
  quality?: string
  urgency?: string
  
  // Файлы и галерея
  files?: OrderFile[]
  files_info?: Array<{
    name: string
    size: number
    type?: string
  }>
  selected_gallery_items?: GalleryItem[]
  
  // Доставка и оплата (legacy fields from specifications)
  delivery_method?: string
  payment_method?: string
  delivery_address?: string
  delivery_city?: string
  delivery_postal_code?: string
  
  created_at: string
  updated_at: string
}

export interface Article {
  id: number
  title: string
  content: string
  excerpt: string
  featured_image?: string
  category: string
  published_at: string
  is_published: boolean
  tags?: string[]
  reading_time?: number
}

export interface Service {
  id: number
  name: string
  description: string
  is_active: boolean
  category?: string
  icon?: string // Icon identifier string
  features?: string[] // List of service features
  created_at?: string
  updated_at?: string
}

export enum OrderStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum OrderSource {
  WEB = 'web',
  TELEGRAM = 'telegram'
}