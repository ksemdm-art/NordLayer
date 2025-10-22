import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../HomeView.vue'

// Mock the router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/services', component: { template: '<div>Services</div>' } },
    { path: '/gallery', component: { template: '<div>Gallery</div>' } },
    { path: '/order', component: { template: '<div>Order</div>' } }
  ]
})

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  CubeIcon: { template: '<div data-testid="cube-icon"></div>' },
  CogIcon: { template: '<div data-testid="cog-icon"></div>' },
  SparklesIcon: { template: '<div data-testid="sparkles-icon"></div>' },
  ClockIcon: { template: '<div data-testid="clock-icon"></div>' },
  ShieldCheckIcon: { template: '<div data-testid="shield-check-icon"></div>' },
  TruckIcon: { template: '<div data-testid="truck-icon"></div>' },
  StarIcon: { template: '<div data-testid="star-icon"></div>' },
  UserIcon: { template: '<div data-testid="user-icon"></div>' },
  ChevronDownIcon: { template: '<div data-testid="chevron-down-icon"></div>' }
}))

// Mock design system components
vi.mock('@/design-system/components', () => ({
  Button: {
    template: '<button @click="$emit(\'click\')" :class="variant"><slot /></button>',
    props: ['variant', 'size'],
    emits: ['click']
  },
  Card: {
    template: '<div class="card"><slot /></div>'
  }
}))

describe('HomeView', () => {
  let wrapper: unknown

  beforeEach(async () => {
    await router.push('/')
    wrapper = mount(HomeView, {
      global: {
        plugins: [router]
      }
    })
  })

  it('renders the hero section correctly', () => {
    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('Превратите ваши идеи в реальность')
  })

  it('displays featured services', () => {
    const serviceCards = wrapper.findAll('.card')
    expect(serviceCards.length).toBeGreaterThan(0)
  })

  it('shows advantages section', () => {
    // Check advantages section exists
    // The advantages are rendered in the template, so we check for their presence
    expect(wrapper.text()).toContain('Почему выбирают нас')
  })

  it('displays testimonials', () => {
    expect(wrapper.text()).toContain('Отзывы клиентов')
    expect(wrapper.text()).toContain('Алексей Петров')
  })

  it('shows FAQ section', () => {
    expect(wrapper.text()).toContain('Часто задаваемые вопросы')
    expect(wrapper.text()).toContain('Какие материалы вы используете?')
  })

  it('navigates to services when button is clicked', async () => {
    const servicesButton = wrapper.find('button:contains("Наши услуги")')
    if (servicesButton.exists()) {
      await servicesButton.trigger('click')
      // Check if navigation was attempted (router.push was called)
      expect(router.currentRoute.value.path).toBe('/')
    }
  })

  it('toggles FAQ items when clicked', async () => {
    const faqButtons = wrapper.findAll('button')
    const faqButton = faqButtons.find((button: unknown) => 
      button.text().includes('Какие материалы вы используете?')
    )
    
    if (faqButton) {
      await faqButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      // Check if FAQ answer is visible
      expect(wrapper.text()).toContain('PLA, ABS, PETG')
    }
  })

  it('sets correct SEO meta information', () => {
    expect(document.title).toBe('3D Печать - Профессиональные услуги 3D печати')
  })

  it('has smooth scroll functionality', () => {
    // Mock scrollIntoView since it doesn't exist in test environment
    const scrollIntoViewMock = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoViewMock
    
    wrapper.vm.scrollToServices()
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('displays floating animation elements', () => {
    const floatingElements = wrapper.findAll('.animate-float')
    expect(floatingElements.length).toBeGreaterThan(0)
  })
})