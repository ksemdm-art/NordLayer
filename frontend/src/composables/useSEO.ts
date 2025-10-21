import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  siteName?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export function useSEO() {
  const route = useRoute()
  const originalTitle = ref('')
  const addedMetaTags = ref<HTMLMetaElement[]>([])

  const setMeta = (data: SEOData) => {
    // Clear existing meta tags
    clearMeta()

    const {
      title,
      description,
      keywords,
      image,
      url = window.location.href,
      type = 'article',
      siteName = '3D Printing Platform',
      author,
      publishedTime,
      modifiedTime,
      section,
      tags
    } = data

    // Set page title
    if (title) {
      originalTitle.value = document.title
      document.title = `${title} | ${siteName}`
    }

    // Meta tags to add
    const metaTags = [
      // Basic meta tags
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },

      // Open Graph tags
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: siteName },

      // Twitter Card tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },

      // Article specific tags
      { property: 'article:author', content: author },
      { property: 'article:published_time', content: publishedTime },
      { property: 'article:modified_time', content: modifiedTime },
      { property: 'article:section', content: section },

      // Canonical URL
      { rel: 'canonical', href: url }
    ]

    // Add article tags
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        metaTags.push({ property: 'article:tag', content: tag })
      })
    }

    // Create and append meta tags
    metaTags.forEach(tag => {
      if (!tag.content && !tag.href) return

      let element: HTMLMetaElement | HTMLLinkElement

      if (tag.rel) {
        // Link element for canonical URL
        element = document.createElement('link')
        element.rel = tag.rel
        if (tag.href) element.href = tag.href
      } else {
        // Meta element
        element = document.createElement('meta')
        if (tag.name) element.name = tag.name
        if (tag.property) element.setAttribute('property', tag.property)
        if (tag.content) element.content = tag.content
      }

      document.head.appendChild(element)
      addedMetaTags.value.push(element as HTMLMetaElement)
    })
  }

  const clearMeta = () => {
    // Remove added meta tags
    addedMetaTags.value.forEach(tag => {
      if (tag.parentNode) {
        tag.parentNode.removeChild(tag)
      }
    })
    addedMetaTags.value = []

    // Restore original title
    if (originalTitle.value) {
      document.title = originalTitle.value
      originalTitle.value = ''
    }
  }

  const setDefaultMeta = () => {
    setMeta({
      title: 'Главная',
      description: 'Профессиональные услуги 3D печати. Галерея проектов, образовательные материалы и заказ услуг онлайн.',
      keywords: '3D печать, 3D моделирование, прототипирование, FDM, SLA, услуги 3D печати',
      type: 'website'
    })
  }

  // Cleanup on unmount
  onUnmounted(() => {
    clearMeta()
  })

  return {
    setMeta,
    clearMeta,
    setDefaultMeta
  }
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'Главная',
    description: 'Профессиональные услуги 3D печати. Галерея проектов, образовательные материалы и заказ услуг онлайн.',
    keywords: '3D печать, 3D моделирование, прототипирование, FDM, SLA, услуги 3D печати',
    type: 'website'
  },
  
  blog: {
    title: 'Блог о 3D печати',
    description: 'Образовательные статьи о технологиях, материалах и процессах 3D печати от наших экспертов.',
    keywords: '3D печать, обучение, технологии, материалы, советы, руководства',
    type: 'website'
  },
  
  gallery: {
    title: 'Галерея проектов',
    description: 'Портфолио выполненных проектов 3D печати с интерактивным просмотром моделей.',
    keywords: '3D модели, портфолио, галерея, проекты 3D печати, STL файлы',
    type: 'website'
  },
  
  services: {
    title: 'Услуги 3D печати',
    description: 'Полный спектр услуг 3D печати: FDM, SLA, постобработка. Прозрачные цены и быстрое выполнение.',
    keywords: 'услуги 3D печати, FDM печать, SLA печать, прототипирование, цены',
    type: 'website'
  },
  
  order: {
    title: 'Заказать 3D печать',
    description: 'Закажите 3D печать онлайн. Загрузите модель, выберите материал и получите готовое изделие.',
    keywords: 'заказ 3D печати, онлайн заказ, загрузка модели, 3D печать на заказ',
    type: 'website'
  }
}