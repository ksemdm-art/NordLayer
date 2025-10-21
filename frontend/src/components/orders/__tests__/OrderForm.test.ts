import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import OrderForm from '../OrderForm.vue'

// Mock the steps components
vi.mock('../steps/ServiceSelectionStep.vue', () => ({
  default: {
    name: 'ServiceSelectionStep',
    template: '<div data-testid="service-selection">Service Selection</div>',
    emits: ['next', 'previous', 'update:modelValue']
  }
}))

vi.mock('../steps/FileUploadStep.vue', () => ({
  default: {
    name: 'FileUploadStep',
    template: '<div data-testid="file-upload">File Upload</div>',
    emits: ['next', 'previous', 'update:modelValue']
  }
}))

vi.mock('../steps/OrderDetailsStep.vue', () => ({
  default: {
    name: 'OrderDetailsStep',
    template: '<div data-testid="order-details">Order Details</div>',
    emits: ['next', 'previous', 'update:modelValue']
  }
}))

vi.mock('../steps/ReviewStep.vue', () => ({
  default: {
    name: 'ReviewStep',
    template: '<div data-testid="review">Review</div>',
    emits: ['submit', 'previous', 'update:modelValue']
  }
}))

// Mock heroicons
vi.mock('@heroicons/vue/24/solid', () => ({
  CheckIcon: { template: '<div data-testid="check-icon"></div>' }
}))

describe('OrderForm', () => {
  let wrapper: any
  let router: any
  let pinia: any

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/order/success/:id', component: { template: '<div>Success</div>' } }
      ]
    })

    pinia = createPinia()

    wrapper = mount(OrderForm, {
      global: {
        plugins: [router, pinia],
        stubs: {
          Transition: false
        }
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('shows progress indicator with correct steps', () => {
    const steps = wrapper.findAll('.step-indicator')
    expect(steps).toHaveLength(4)
  })

  it('displays the first step initially', () => {
    expect(wrapper.find('[data-testid="service-selection"]').exists()).toBe(true)
  })

  it('shows correct step titles', () => {
    const stepTitles = ['Выбор услуги', 'Загрузка файлов', 'Детали заказа', 'Подтверждение']
    
    stepTitles.forEach((title, index) => {
      expect(wrapper.text()).toContain(title)
    })
  })

  it('initializes form data correctly', () => {
    expect(wrapper.vm.formData).toEqual({
      service: null,
      files: [],
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      specifications: {},
      notes: '',
      totalPrice: 0
    })
  })

  it('starts at step 0', () => {
    expect(wrapper.vm.currentStep).toBe(0)
  })

  it('has correct step classes for current step', () => {
    const firstStep = wrapper.find('.step-indicator')
    expect(firstStep.classes()).toContain('bg-primary-100')
  })
})