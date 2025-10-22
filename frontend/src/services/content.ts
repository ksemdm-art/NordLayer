import { api } from './api'

export interface ContentItem {
  id: number
  key: string
  content_type: string
  content?: string
  json_content?: any
  description?: string
  group_name?: string
  is_active: boolean
  sort_order: string
  created_at: string
  updated_at: string
}

export interface ContentDict {
  [key: string]: any
}

class ContentService {
  private cache: Map<string, any> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 минут

  /**
   * Получить контент по списку ключей
   */
  async getContentByKeys(keys: string[]): Promise<ContentDict> {
    const cacheKey = `keys:${keys.sort().join(',')}`
    
    // Проверяем кэш
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await api.get(`/cms/content/by-keys?keys=${keys.join(',')}`)
      const content = response.data.data || {}
      
      // Кэшируем результат
      this.setCache(cacheKey, content)
      
      return content
    } catch (error) {
      console.error('Error loading content by keys:', error)
      return {}
    }
  }

  /**
   * Получить контент группы
   */
  async getContentByGroup(groupName: string): Promise<ContentDict> {
    const cacheKey = `group:${groupName}`
    
    // Проверяем кэш
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await api.get(`/cms/content/by-group/${groupName}`)
      const content = response.data.data || {}
      
      // Кэшируем результат
      this.setCache(cacheKey, content)
      
      return content
    } catch (error) {
      console.error('Error loading content by group:', error)
      return {}
    }
  }

  /**
   * Получить страницу по slug
   */
  async getPageBySlug(slug: string) {
    const cacheKey = `page:${slug}`
    
    // Проверяем кэш
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await api.get(`/cms/pages/${slug}`)
      const page = response.data.data
      
      // Кэшируем результат
      this.setCache(cacheKey, page)
      
      return page
    } catch (error) {
      console.error('Error loading page:', error)
      return null
    }
  }

  /**
   * Получить значение контента по ключу
   */
  async getContent(key: string, defaultValue: any = ''): Promise<any> {
    const content = await this.getContentByKeys([key])
    return content[key] !== undefined ? content[key] : defaultValue
  }

  /**
   * Очистить кэш
   */
  clearCache(): void {
    this.cache.clear()
    this.cacheExpiry.clear()
  }

  /**
   * Очистить кэш для конкретного ключа
   */
  clearCacheKey(key: string): void {
    this.cache.delete(key)
    this.cacheExpiry.delete(key)
  }

  private isValidCache(key: string): boolean {
    const expiry = this.cacheExpiry.get(key)
    if (!expiry || Date.now() > expiry) {
      this.cache.delete(key)
      this.cacheExpiry.delete(key)
      return false
    }
    return this.cache.has(key)
  }

  private setCache(key: string, value: unknown): void {
    this.cache.set(key, value)
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION)
  }
}

export const contentService = new ContentService()

// Composable для использования в компонентах Vue
export function useContent() {
  return {
    getContent: contentService.getContent.bind(contentService),
    getContentByKeys: contentService.getContentByKeys.bind(contentService),
    getContentByGroup: contentService.getContentByGroup.bind(contentService),
    getPageBySlug: contentService.getPageBySlug.bind(contentService),
    clearCache: contentService.clearCache.bind(contentService)
  }
}