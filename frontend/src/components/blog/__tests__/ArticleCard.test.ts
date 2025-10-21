import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleCard from '../ArticleCard.vue'
import type { Article } from '@/types'

// Mock the design system components
vi.mock('@/design-system/components/Card/Card.vue', () => ({
  default: {
    name: 'Card',
    template: '<div class="card"><slot /></div>',
    props: ['variant', 'padding', 'hover', 'interactive']
  }
}))

vi.mock('@/design-system/components/Badge/Badge.vue', () => ({
  default: {
    name: 'Badge',
    template: '<span class="badge"><slot /></span>',
    props: ['variant', 'size']
  }
}))

// Mock the notifications composable
vi.mock('@/composables/useNotifications', () => ({
  globalNotifications: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockArticle: Article = {
  id: 1,
  title: 'Test Article',
  content: 'This is a test article content with some words to calculate reading time.',
  excerpt: 'This is a test excerpt',
  featured_image: 'https://example.com/image.jpg',
  category: 'Технологии',
  published_at: '2024-01-15T10:00:00Z',
  is_published: true,
  tags: ['3d-printing', 'technology', 'tutorial'],
  author: 'Test Author'
}

describe('ArticleCard', () => {
  it('renders article information correctly', () => {
    const wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.text()).toContain('Test Article')
    expect(wrapper.text()).toContain('This is a test excerpt')
    expect(wrapper.text()).toContain('Технологии')
  })

  it('calculates reading time correctly', () => {
    const wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      }
    })

    // Should calculate reading time based on content word count
    expect(wrapper.text()).toContain('мин чтения')
  })

  it('displays tags when available', () => {
    const wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      }
    })

    expect(wrapper.text()).toContain('#3d-printing')
    expect(wrapper.text()).toContain('#technology')
    expect(wrapper.text()).toContain('#tutorial')
  })

  it('emits click event when card is clicked', async () => {
    const wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      }
    })

    await wrapper.find('.card').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('handles articles without featured image', () => {
    const articleWithoutImage = { ...mockArticle, featured_image: undefined }
    const wrapper = mount(ArticleCard, {
      props: {
        article: articleWithoutImage
      }
    })

    // Should render placeholder SVG
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('formats date correctly', () => {
    const wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle
      }
    })

    // Should format date in Russian locale
    expect(wrapper.text()).toContain('2024')
  })
})