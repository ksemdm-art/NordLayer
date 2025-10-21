import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../common/LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
    expect(wrapper.text()).toContain('Загрузка...')
  })

  it('renders with custom text', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        text: 'Обработка...',
        showText: true
      }
    })
    expect(wrapper.text()).toContain('Обработка...')
  })

  it('hides text when showText is false', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        showText: false
      }
    })
    expect(wrapper.find('.text-center').exists()).toBe(false)
  })

  it('applies correct size classes', () => {
    const wrapper = mount(LoadingSpinner, {
      props: {
        size: 'lg'
      }
    })
    expect(wrapper.find('.w-12').exists()).toBe(true)
    expect(wrapper.find('.h-12').exists()).toBe(true)
  })
})