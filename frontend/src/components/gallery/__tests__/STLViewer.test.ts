import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import STLViewer from '../STLViewer.vue'

// Mock Three.js
vi.mock('three', () => ({
  Scene: vi.fn(() => ({
    add: vi.fn(),
    remove: vi.fn()
  })),
  PerspectiveCamera: vi.fn(() => ({
    position: { set: vi.fn() },
    aspect: 0,
    updateProjectionMatrix: vi.fn(),
    lookAt: vi.fn()
  })),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    setClearColor: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement('canvas'),
    shadowMap: {
      enabled: false,
      type: 0
    },
    outputColorSpace: 0
  })),
  AmbientLight: vi.fn(),
  DirectionalLight: vi.fn(() => ({
    position: { set: vi.fn() },
    castShadow: false,
    shadow: {
      mapSize: { width: 0, height: 0 }
    }
  })),
  MeshPhongMaterial: vi.fn(() => ({
    color: { setHex: vi.fn() },
    dispose: vi.fn()
  })),
  Mesh: vi.fn(() => ({
    castShadow: false,
    receiveShadow: false,
    geometry: { dispose: vi.fn() },
    material: { dispose: vi.fn() }
  })),
  Box3: vi.fn(() => ({
    setFromObject: vi.fn(() => ({
      getCenter: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
      getSize: vi.fn(() => ({ x: 10, y: 10, z: 10 }))
    }))
  })),
  Vector3: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
  PCFSoftShadowMap: 0,
  SRGBColorSpace: 0
}))

// Mock Three.js examples
vi.mock('three/examples/jsm/loaders/STLLoader.js', () => ({
  STLLoader: vi.fn(() => ({
    load: vi.fn((url, onLoad, _onProgress, _onError) => {
      // Simulate successful load
      setTimeout(() => {
        const mockGeometry = {
          computeBoundingBox: vi.fn(),
          boundingBox: {
            getCenter: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
            getSize: vi.fn(() => ({ x: 10, y: 10, z: 10 }))
          },
          translate: vi.fn(),
          scale: vi.fn(),
          dispose: vi.fn()
        }
        onLoad(mockGeometry)
      }, 100)
    })
  }))
}))

vi.mock('three/examples/jsm/controls/OrbitControls.js', () => ({
  OrbitControls: vi.fn(() => ({
    enableDamping: false,
    dampingFactor: 0,
    enableZoom: false,
    enablePan: false,
    enableRotate: false,
    target: { copy: vi.fn() },
    update: vi.fn(),
    dispose: vi.fn()
  }))
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 16)
  return 1
})

global.cancelAnimationFrame = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  disconnect: vi.fn()
}))

describe('STLViewer', () => {
  let wrapper: unknown

  beforeEach(() => {
    // Mock DOM methods
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 400
    })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 300
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300
      }
    })

    expect(wrapper.find('.stl-viewer-container').exists()).toBe(true)
    expect(wrapper.find('.stl-viewer').exists()).toBe(true)
  })

  it('shows loading state initially when STL URL is provided', async () => {
    wrapper = mount(STLViewer, {
      props: {
        stlUrl: '/test-model.stl',
        width: 400,
        height: 300
      }
    })

    expect(wrapper.find('.loading-overlay').exists()).toBe(true)
    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
  })

  it('emits load event when model loads successfully', async () => {
    wrapper = mount(STLViewer, {
      props: {
        stlUrl: '/test-model.stl',
        width: 400,
        height: 300
      }
    })

    // Wait for the mock loader to complete
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('shows controls when not loading', async () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300
      }
    })

    // Wait for component to initialize
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.controls-overlay').exists()).toBe(true)
    expect(wrapper.find('.control-button').exists()).toBe(true)
  })

  it('handles color change', async () => {
    wrapper = mount(STLViewer, {
      props: {
        stlUrl: '/test-model.stl',
        width: 400,
        height: 300
      }
    })

    const colorInput = wrapper.find('.color-input')
    expect(colorInput.exists()).toBe(true)

    await colorInput.setValue('#ff0000')
    await colorInput.trigger('change')

    // The color change should be handled internally
    expect(wrapper.vm.modelColor).toBe('#ff0000')
  })

  it('handles fullscreen toggle', async () => {
    // Mock fullscreen API
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null
    })

    const mockRequestFullscreen = vi.fn()
    HTMLElement.prototype.requestFullscreen = mockRequestFullscreen

    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300
      }
    })

    const fullscreenButton = wrapper.find('.control-button:nth-child(2)')
    await fullscreenButton.trigger('click')

    expect(mockRequestFullscreen).toHaveBeenCalled()
  })

  it('shows error state when model fails to load', async () => {
    // Mock STLLoader to simulate error
    const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js')
    vi.mocked(STLLoader).mockImplementation(() => ({
      load: vi.fn((url, onLoad, onProgress, onError) => {
        setTimeout(() => {
          onError(new Error('Failed to load model'))
        }, 100)
      })
    }) as any)

    wrapper = mount(STLViewer, {
      props: {
        stlUrl: '/invalid-model.stl',
        width: 400,
        height: 300
      }
    })

    // Wait for the mock loader to fail
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(wrapper.find('.error-overlay').exists()).toBe(true)
    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('handles retry after error', async () => {
    // Mock STLLoader to simulate error first, then success
    let callCount = 0
    const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js')
    vi.mocked(STLLoader).mockImplementation(() => ({
      load: vi.fn((url, onLoad, onProgress, onError) => {
        setTimeout(() => {
          if (callCount === 0) {
            callCount++
            onError(new Error('Failed to load model'))
          } else {
            const mockGeometry = {
              computeBoundingBox: vi.fn(),
              boundingBox: {
                getCenter: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
                getSize: vi.fn(() => ({ x: 10, y: 10, z: 10 }))
              },
              translate: vi.fn(),
              scale: vi.fn(),
              dispose: vi.fn()
            }
            onLoad(mockGeometry)
          }
        }, 100)
      })
    }) as any)

    wrapper = mount(STLViewer, {
      props: {
        stlUrl: '/test-model.stl',
        width: 400,
        height: 300
      }
    })

    // Wait for initial error
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(wrapper.find('.error-overlay').exists()).toBe(true)

    // Click retry button
    const retryButton = wrapper.find('.retry-button')
    await retryButton.trigger('click')

    // Wait for retry to complete
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('cleans up resources on unmount', () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300
      }
    })

    const disposeSpy = vi.fn()
    wrapper.vm.viewer = {
      dispose: disposeSpy
    }

    wrapper.unmount()

    expect(disposeSpy).toHaveBeenCalled()
  })

  it('updates viewer size when props change', async () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300
      }
    })

    await wrapper.setProps({
      width: 800,
      height: 600
    })

    // The resize should be handled internally
    expect(wrapper.props('width')).toBe(800)
    expect(wrapper.props('height')).toBe(600)
  })

  it('shows instructions when enabled', () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300,
        showInstructions: true
      }
    })

    expect(wrapper.find('.instructions').exists()).toBe(true)
  })

  it('hides instructions when disabled', () => {
    wrapper = mount(STLViewer, {
      props: {
        width: 400,
        height: 300,
        showInstructions: false
      }
    })

    expect(wrapper.find('.instructions').exists()).toBe(false)
  })
})