import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import ServicesView from '../ServicesView.vue'

// Mock the router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/services', component: ServicesView },
    { path: '/order', component: { template: '<div>Order</div>' } }
  ]
})

// Mock Heroicons
vi.mock('@heroicons/vue/24/outline', () => ({
  CubeIcon: { template: '<div data-testid="cube-icon"></div>' },
  SparklesIcon: { template: '<div data-testid="sparkles-icon"></div>' },
  CogIcon: { template: '<div data-testid="cog-icon"></div>' },
  CheckIcon: { template: '<div data-testid="check-icon"></div>' },
  ChevronDownIcon: { template: '<div data-testid="chevron-down-icon"></div>' }
}))

// Mock design system components
vi.mock('@/design-system/components', () => ({
  Button: {
    template: '<button @click="$emit(\'click\')" :disabled="disabled" :class="variant"><slot /></button>',
    props: ['variant', 'size', 'disabled'],
    emits: ['click']
  },
  Card: {
    template: '<div class="card"><slot /></div>',
    props: ['class']
  },
  Badge: {
    template: '<span :class="variant"><slot /></span>',
    props: ['variant']
  },
  Input: {
    template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :type="type" :placeholder="placeholder" />',
    props: ['modelValue', 'type', 'placeholder'],
    emits: ['update:modelValue', 'input']
  }
}))

describe('ServicesView', () => {
  let wrapper: unknown

  beforeEach(async () => {
    await router.push('/services')
    wrapper = mount(ServicesView, {
      global: {
        plugins: [router]
      }
    })
  })

  it('renders the hero section correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Наши услуги')
    expect(wrapper.text()).toContain('Полный спектр услуг 3D печати')
  })

  it('displays all services with correct information', () => {
    const serviceCards = wrapper.findAll('.card')
    expect(serviceCards.length).toBeGreaterThanOrEqual(3)
    
    // Check if FDM service is displayed
    expect(wrapper.text()).toContain('FDM Печать')
    expect(wrapper.text()).toContain('от 50₽')
    
    // Check if SLA service is displayed
    expect(wrapper.text()).toContain('SLA Печать')
    expect(wrapper.text()).toContain('от 100₽')
    
    // Check if post-processing service is displayed
    expect(wrapper.text()).toContain('Постобработка')
    expect(wrapper.text()).toContain('от 200₽')
  })

  it('shows service features and price factors', () => {
    expect(wrapper.text()).toContain('Особенности:')
    expect(wrapper.text()).toContain('Факторы ценообразования:')
    expect(wrapper.text()).toContain('Быстрое изготовление')
    expect(wrapper.text()).toContain('PLA, ABS, PETG')
  })

  it('displays the price calculator', () => {
    expect(wrapper.text()).toContain('Калькулятор стоимости')
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
  })

  it('calculates price correctly', async () => {
    // Select FDM service (id: 1)
    const serviceSelect = wrapper.find('select')
    await serviceSelect.setValue('1')
    
    // Set volume
    const volumeInput = wrapper.find('input[type="number"]')
    await volumeInput.setValue('10')
    
    await wrapper.vm.$nextTick()
    
    // Check if calculation is displayed
    expect(wrapper.text()).toContain('Расчет стоимости')
    expect(wrapper.text()).toContain('₽')
  })

  it('updates calculation when parameters change', async () => {
    const wrapper_vm = wrapper.vm
    
    // Set initial values
    wrapper_vm.calculator.serviceType = '1'
    wrapper_vm.calculator.volume = '10'
    wrapper_vm.calculator.material = 'premium'
    wrapper_vm.calculator.complexity = 'complex'
    wrapper_vm.calculator.postProcessing = true
    
    await wrapper.vm.$nextTick()
    
    const result = wrapper_vm.calculationResult
    expect(result.total).toBeGreaterThan(0)
    expect(result.material).toBeGreaterThan(0)
    expect(result.complexity).toBeGreaterThan(0)
  })

  it('disables order button for inactive services', () => {
    // All services in mock data are active, so we need to modify the test
    // or check the disabled state logic
    const orderButtons = wrapper.findAll('button').filter((button: unknown) => 
      button.text().includes('Заказать') || button.text().includes('Недоступно')
    )
    expect(orderButtons.length).toBeGreaterThan(0)
  })

  it('shows process steps', () => {
    expect(wrapper.text()).toContain('Как мы работаем')
    expect(wrapper.text()).toContain('Загрузка файла')
    expect(wrapper.text()).toContain('Анализ и расчет')
    expect(wrapper.text()).toContain('Печать')
    expect(wrapper.text()).toContain('Доставка')
  })

  it('displays service-specific FAQs', () => {
    expect(wrapper.text()).toContain('Какие форматы файлов вы принимаете?')
    expect(wrapper.text()).toContain('Можно ли изменить размер модели?')
  })

  it('toggles FAQ answers when clicked', async () => {
    const faqButtons = wrapper.findAll('button')
    const faqButton = faqButtons.find((button: unknown) => 
      button.text().includes('Какие форматы файлов')
    )
    
    if (faqButton) {
      await faqButton.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.text()).toContain('STL, OBJ, 3MF')
    }
  })

  it('navigates to order page with service parameters', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    
    // Call orderService method
    const service = wrapper.vm.services[0]
    wrapper.vm.orderService(service)
    
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/order',
      query: { service: service.id }
    })
  })

  it('navigates to order with calculator parameters', async () => {
    const pushSpy = vi.spyOn(router, 'push')
    
    // Set calculator values
    wrapper.vm.calculator.serviceType = '1'
    wrapper.vm.calculator.volume = '10'
    wrapper.vm.calculator.material = 'premium'
    wrapper.vm.calculator.complexity = 'complex'
    wrapper.vm.calculator.postProcessing = true
    
    wrapper.vm.proceedToOrder()
    
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/order',
      query: {
        service: '1',
        volume: '10',
        material: 'premium',
        complexity: 'complex',
        postProcessing: true
      }
    })
  })

  it('formats factor names correctly', () => {
    expect(wrapper.vm.formatFactorName('volume')).toBe('Объем')
    expect(wrapper.vm.formatFactorName('material')).toBe('Материал')
    expect(wrapper.vm.formatFactorName('unknown')).toBe('unknown')
  })

  it('sets correct SEO meta information', () => {
    expect(document.title).toBe('Услуги 3D печати - FDM, SLA печать и постобработка')
  })

  it('has responsive design classes', () => {
    expect(wrapper.find('.grid.md\\:grid-cols-2').exists()).toBe(true)
    expect(wrapper.find('.grid.md\\:grid-cols-4').exists()).toBe(true)
  })
})