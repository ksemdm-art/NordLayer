import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ProjectCard from '../ProjectCard.vue'
import type { Project } from '@/types'

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/gallery/:id', name: 'project-detail', component: { template: '<div>Project Detail</div>' } }
  ]
})

const mockProject: Project = {
  id: 1,
  title: 'Test Project',
  description: 'This is a test project description that should be truncated if it is too long to fit in the card layout properly.',
  images: ['/test-image-1.jpg', '/test-image-2.jpg'],
  stl_file: '/test-model.stl',
  category: 'miniatures',
  created_at: '2024-01-15T10:00:00Z',
  is_featured: true
}

const mockProjectWithoutSTL: Project = {
  id: 2,
  title: 'Project Without STL',
  description: 'Short description.',
  images: ['/test-image.jpg'],
  category: 'decorative',
  created_at: '2024-01-10T14:30:00Z',
  is_featured: false
}

const mockProjectWithoutImages: Project = {
  id: 3,
  title: 'Project Without Images',
  description: 'Project with no images.',
  images: [],
  category: 'functional',
  created_at: '2024-01-05T16:45:00Z',
  is_featured: false
}

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.project-title').text()).toBe('Test Project')
    expect(wrapper.find('.project-description').text()).toContain('This is a test project description')
    expect(wrapper.find('.category-badge').text()).toBe('Миниатюры')
  })

  it('shows featured badge for featured projects', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.featured-badge').exists()).toBe(true)
    expect(wrapper.classes()).toContain('featured')
  })

  it('does not show featured badge for non-featured projects', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProjectWithoutSTL },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.featured-badge').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('featured')
  })

  it('shows STL badge when STL file is available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.stl-badge').exists()).toBe(true)
    expect(wrapper.find('.stl-badge').text()).toContain('3D')
  })

  it('does not show STL badge when STL file is not available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProjectWithoutSTL },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.stl-badge').exists()).toBe(false)
  })

  it('displays project image when available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const image = wrapper.find('.project-image')
    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toBe('/test-image-1.jpg')
    expect(image.attributes('alt')).toBe('Test Project')
  })

  it('shows placeholder when no images are available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProjectWithoutImages },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.placeholder-image').exists()).toBe(true)
    expect(wrapper.find('.placeholder-icon').exists()).toBe(true)
    expect(wrapper.find('.project-image').exists()).toBe(false)
  })

  it('shows image count when multiple images are available', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const stat = wrapper.find('.stat')
    expect(stat.exists()).toBe(true)
    expect(stat.text()).toBe('2')
  })

  it('does not show image count for single image', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProjectWithoutSTL },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.stat').exists()).toBe(false)
  })

  it('truncates long descriptions', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const description = wrapper.find('.project-description').text()
    expect(description).toContain('...')
    expect(description.length).toBeLessThan(mockProject.description.length)
  })

  it('does not truncate short descriptions', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProjectWithoutSTL },
      global: {
        plugins: [router]
      }
    })

    const description = wrapper.find('.project-description').text()
    expect(description).toBe('Short description.')
    expect(description).not.toContain('...')
  })

  it('formats date correctly', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const date = wrapper.find('.project-date')
    expect(date.exists()).toBe(true)
    expect(date.text()).toBe('15 января 2024 г.')
  })

  it('formats category correctly', () => {
    const testCases = [
      { category: 'miniatures', expected: 'Миниатюры' },
      { category: 'prototypes', expected: 'Прототипы' },
      { category: 'decorative', expected: 'Декоративные' },
      { category: 'functional', expected: 'Функциональные' },
      { category: 'unknown', expected: 'unknown' }
    ]

    testCases.forEach(({ category, expected }) => {
      const project = { ...mockProject, category }
      const wrapper = mount(ProjectCard, {
        props: { project },
        global: {
          plugins: [router]
        }
      })

      expect(wrapper.find('.category-badge').text()).toBe(expected)
    })
  })

  it('navigates to project detail on click', async () => {
    const push = vi.fn()
    const mockRouter = {
      push
    }

    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router],
        mocks: {
          $router: mockRouter
        }
      }
    })

    await wrapper.trigger('click')
    expect(push).toHaveBeenCalledWith('/gallery/1')
  })

  it('shows hover overlay on mouse hover', async () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('.hover-overlay').exists()).toBe(true)
    expect(wrapper.find('.view-button').exists()).toBe(true)
  })

  it('handles image error gracefully', async () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const image = wrapper.find('.project-image')
    await image.trigger('error')

    // The image should be hidden on error
    expect(image.element.style.display).toBe('none')
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.classes()).toContain('project-card')
    expect(wrapper.classes()).toContain('group')
    expect(wrapper.classes()).toContain('featured')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(ProjectCard, {
      props: { project: mockProject },
      global: {
        plugins: [router]
      }
    })

    const image = wrapper.find('.project-image')
    expect(image.attributes('alt')).toBe('Test Project')
    expect(image.attributes('loading')).toBe('lazy')

    const date = wrapper.find('.project-date')
    expect(date.attributes('datetime')).toBe('2024-01-15T10:00:00Z')
  })
})