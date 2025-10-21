import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface STLViewerOptions {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: number
  enableControls?: boolean
  enableFullscreen?: boolean
  showGrid?: boolean
  onLoad?: () => void
  onError?: (error: Error) => void
  onProgress?: (progress: number) => void
}

export class STLViewer {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private controls?: OrbitControls
  private container: HTMLElement
  private model?: THREE.Mesh
  private animationId?: number
  private options: Required<STLViewerOptions>
  private gridObjects: THREE.Object3D[] = []

  constructor(options: STLViewerOptions) {
    this.container = options.container
    
    // Получаем реальные размеры контейнера
    const containerRect = this.container.getBoundingClientRect()
    const actualWidth = containerRect.width || options.width || 800
    const actualHeight = containerRect.height || options.height || 600
    
    this.options = {
      width: actualWidth,
      height: actualHeight,
      backgroundColor: options.backgroundColor || 0xf5f5f5,
      enableControls: options.enableControls !== false,
      enableFullscreen: options.enableFullscreen !== false,
      showGrid: options.showGrid !== false,
      onLoad: options.onLoad || (() => {}),
      onError: options.onError || (() => {}),
      onProgress: options.onProgress || (() => {}),
      container: options.container
    }

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.options.width / this.options.height,
      0.1,
      1000
    )
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    })

    this.init()
  }

  private init() {
    // Setup renderer с оптимизированными настройками
    this.renderer.setSize(this.options.width, this.options.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2 // Увеличиваем экспозицию для яркости
    this.renderer.antialias = true
    
    // Включаем физически корректные источники света
    this.renderer.physicallyCorrectLights = true
    
    // Создаем градиентный фон
    this.setupGradientBackground()
    
    this.container.appendChild(this.renderer.domElement)
    
    // Принудительно устанавливаем стили для canvas чтобы он заполнил весь контейнер
    const canvas = this.renderer.domElement
    canvas.style.cssText = 'width: 100% !important; height: 100% !important; display: block !important;'

    // Setup camera
    this.camera.position.set(0, 0, 100)

    // Setup controls
    if (this.options.enableControls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.enableZoom = true
      this.controls.enablePan = true
      this.controls.enableRotate = true
    }

    // Setup lighting
    this.setupLighting()

    // Start render loop
    this.animate()

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  private setupGradientBackground(bright: boolean = true) {
    // Создаем стильный фон
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    
    const context = canvas.getContext('2d')!
    
    // Создаем радиальный градиент с центром смещенным вверх
    const gradient = context.createRadialGradient(512, 200, 0, 512, 600, 800)
    
    if (bright) {
      // Светлая цветовая схема
      gradient.addColorStop(0, '#6366f1') // Яркий индиго в центре
      gradient.addColorStop(0.3, '#8b5cf6') // Фиолетовый
      gradient.addColorStop(0.6, '#6b7280') // Серый
      gradient.addColorStop(1, '#374151') // Темно-серый по краям
    } else {
      // Темная драматическая схема
      gradient.addColorStop(0, '#1e1b4b') // Глубокий индиго в центре
      gradient.addColorStop(0.3, '#312e81') // Темно-фиолетовый
      gradient.addColorStop(0.6, '#1e293b') // Темно-серый
      gradient.addColorStop(1, '#0f172a') // Почти черный по краям
    }
    
    context.fillStyle = gradient
    context.fillRect(0, 0, 1024, 1024)
    
    // Добавляем тонкие световые блики
    const highlights = context.createRadialGradient(300, 150, 0, 300, 150, 200)
    const highlightOpacity = bright ? 0.4 : 0.3
    highlights.addColorStop(0, `rgba(139, 92, 246, ${highlightOpacity})`) // Фиолетовый блик
    highlights.addColorStop(1, 'rgba(139, 92, 246, 0)')
    
    context.fillStyle = highlights
    context.fillRect(0, 0, 1024, 1024)
    
    // Добавляем второй блик
    const highlights2 = context.createRadialGradient(700, 800, 0, 700, 800, 300)
    const highlight2Opacity = bright ? 0.3 : 0.2
    highlights2.addColorStop(0, `rgba(59, 130, 246, ${highlight2Opacity})`) // Синий блик
    highlights2.addColorStop(1, 'rgba(59, 130, 246, 0)')
    
    context.fillStyle = highlights2
    context.fillRect(0, 0, 1024, 1024)
    
    const texture = new THREE.CanvasTexture(canvas)
    this.scene.background = texture
  }

  private setupEnvironmentMap(material: THREE.MeshStandardMaterial) {
    // Создаем простую environment map для отражений
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    
    // Создаем простую сцену для environment map
    const envScene = new THREE.Scene()
    const envGeometry = new THREE.SphereGeometry(50, 32, 16)
    const envMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide
    })
    const envSphere = new THREE.Mesh(envGeometry, envMaterial)
    envScene.add(envSphere)
    
    // Генерируем environment map
    const envMap = pmremGenerator.fromScene(envScene).texture
    material.envMap = envMap
    
    pmremGenerator.dispose()
  }

  private addShadowPlane() {
    // Создаем невидимую плоскость для теней
    const planeGeometry = new THREE.PlaneGeometry(200, 200)
    const planeMaterial = new THREE.ShadowMaterial({
      opacity: 0.3,
      transparent: true
    })
    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -30 // Размещаем под моделью
    plane.receiveShadow = true
    
    this.scene.add(plane)
    
    // Добавляем пространственную сетку если включена
    if (this.options.showGrid) {
      this.addGrid()
    }
  }

  private addGrid() {
    // Очищаем предыдущие объекты сетки
    this.clearGrid()
    
    // Создаем только основную горизонтальную сетку (более тонкую и ненавязчивую)
    const gridHelper = new THREE.GridHelper(80, 16, 0x666666, 0xcccccc)
    gridHelper.position.y = -25
    
    // Делаем сетку очень тонкой и полупрозрачной
    if (gridHelper.material) {
      const material = gridHelper.material as THREE.LineBasicMaterial
      material.opacity = 0.15
      material.transparent = true
    }
    this.scene.add(gridHelper)
    this.gridObjects.push(gridHelper)

    // Добавляем только небольшие оси координат в углу
    this.addAxes()
  }

  private clearGrid() {
    // Удаляем все объекты сетки из сцены
    this.gridObjects.forEach(obj => {
      this.scene.remove(obj)
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })
    this.gridObjects = []
  }

  private addAxes() {
    // Создаем небольшие оси координат в углу
    const axesHelper = new THREE.AxesHelper(15)
    axesHelper.position.set(-35, -24, -35)
    
    // Делаем оси полупрозрачными и ненавязчивыми
    if (axesHelper.material && Array.isArray(axesHelper.material)) {
      const materials = axesHelper.material as THREE.LineBasicMaterial[]
      materials.forEach((material, index) => {
        if (material) {
          material.opacity = 0.6
          material.transparent = true
        }
      })
    }
    
    this.scene.add(axesHelper)
    this.gridObjects.push(axesHelper)
  }

  private setupLighting() {
    // Создаем профессиональное студийное освещение
    
    // Увеличиваем ambient light для общей яркости
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // Основной key light - яркий белый свет сверху-спереди
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8)
    keyLight.position.set(100, 150, 100)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.camera.near = 0.5
    keyLight.shadow.camera.far = 500
    keyLight.shadow.camera.left = -100
    keyLight.shadow.camera.right = 100
    keyLight.shadow.camera.top = 100
    keyLight.shadow.camera.bottom = -100
    keyLight.shadow.bias = -0.0001
    this.scene.add(keyLight)

    // Fill light - мягкий свет для заполнения теней
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8)
    fillLight.position.set(-80, 50, 60)
    this.scene.add(fillLight)

    // Back light - контровой свет для объема
    const backLight = new THREE.DirectionalLight(0xffffff, 1.2)
    backLight.position.set(-50, 100, -100)
    this.scene.add(backLight)

    // Rim light - цветной акцентный свет (фиолетовый)
    const rimLight = new THREE.SpotLight(0x8b5cf6, 1.0)
    rimLight.position.set(-120, 80, -60)
    rimLight.angle = Math.PI / 3
    rimLight.penumbra = 0.3
    rimLight.decay = 1.5
    rimLight.distance = 300
    this.scene.add(rimLight)

    // Второй rim light - синий акцент
    const rimLight2 = new THREE.SpotLight(0x3b82f6, 0.8)
    rimLight2.position.set(80, -60, -100)
    rimLight2.angle = Math.PI / 3
    rimLight2.penumbra = 0.4
    rimLight2.decay = 1.5
    rimLight2.distance = 280
    this.scene.add(rimLight2)

    // Дополнительный мягкий свет снизу для устранения жестких теней
    const bottomLight = new THREE.DirectionalLight(0xffffff, 0.4)
    bottomLight.position.set(0, -100, 50)
    this.scene.add(bottomLight)
  }

  async loadSTL(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const loader = new STLLoader()
      
      loader.load(
        url,
        (geometry) => {
          try {
            this.clearModel()
            
            // Center and scale geometry
            geometry.computeBoundingBox()
            const boundingBox = geometry.boundingBox!
            const center = boundingBox.getCenter(new THREE.Vector3())
            const size = boundingBox.getSize(new THREE.Vector3())
            
            // Center geometry
            geometry.translate(-center.x, -center.y, -center.z)
            
            // Scale to fit in view
            const maxDimension = Math.max(size.x, size.y, size.z)
            const scale = 50 / maxDimension
            geometry.scale(scale, scale, scale)

            // Create material with balanced PBR appearance
            const material = new THREE.MeshStandardMaterial({
              color: 0x4f46e5, // Яркий индиго цвет
              metalness: 0.3,  // Умеренная металличность
              roughness: 0.4,  // Сбалансированная шероховатость для мягких отражений
              envMapIntensity: 1.2, // Умеренные отражения
              transparent: false,
              opacity: 1.0,
              // Убираем emissive для более естественного вида
            })
            
            // Добавляем environment map для реалистичных отражений
            this.setupEnvironmentMap(material)

            // Create mesh
            this.model = new THREE.Mesh(geometry, material)
            this.model.castShadow = true
            this.model.receiveShadow = false
            
            this.scene.add(this.model)
            
            // Добавляем невидимый пол для теней
            this.addShadowPlane()
            
            // Adjust camera position
            this.adjustCamera()
            
            this.options.onLoad()
            resolve()
          } catch (error) {
            const err = error instanceof Error ? error : new Error('Failed to process STL file')
            this.options.onError(err)
            reject(err)
          }
        },
        (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100
          this.options.onProgress(percentComplete)
        },
        (error) => {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          const err = new Error(`Failed to load STL file: ${errorMessage}`)
          this.options.onError(err)
          reject(err)
        }
      )
    })
  }

  private clearModel() {
    if (this.model) {
      this.scene.remove(this.model)
      if (this.model.geometry) {
        this.model.geometry.dispose()
      }
      if (this.model.material instanceof THREE.Material) {
        this.model.material.dispose()
      }
      this.model = undefined
    }
  }

  private adjustCamera() {
    if (!this.model) return

    const box = new THREE.Box3().setFromObject(this.model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = this.camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

    cameraZ *= 1.5 // Add some padding

    this.camera.position.set(cameraZ, cameraZ, cameraZ)
    this.camera.lookAt(center)

    if (this.controls) {
      this.controls.target.copy(center)
      this.controls.update()
    }
  }

  private animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this))

    // Добавляем медленное автовращение модели для привлекательности
    if (this.model) {
      // Вращаем только если пользователь не взаимодействует с моделью
      const isUserInteracting = this.controls && (this.controls as any).enabled && 
                                (this.controls as any).autoRotate === false
      
      if (!isUserInteracting) {
        this.model.rotation.y += 0.008
        this.model.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1 // Легкое покачивание
      }
    }

    if (this.controls) {
      this.controls.update()
    }

    this.renderer.render(this.scene, this.camera)
  }

  private handleResize() {
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    this.resize(width, height)
  }

  setModelColor(color: number) {
    if (this.model && this.model.material instanceof THREE.MeshStandardMaterial) {
      this.model.material.color.setHex(color)
    }
  }

  toggleGrid(show: boolean) {
    // Переключаем видимость всех объектов сетки
    this.gridObjects.forEach(obj => {
      obj.visible = show
    })
  }

  setBrightLighting(bright: boolean) {
    // Удаляем все источники света
    const lightsToRemove: THREE.Light[] = []
    this.scene.traverse((child) => {
      if (child instanceof THREE.Light) {
        lightsToRemove.push(child)
      }
    })
    
    lightsToRemove.forEach(light => {
      this.scene.remove(light)
    })
    
    if (bright) {
      // Яркое студийное освещение
      this.setupLighting()
      // Также обновляем фон для яркого режима
      this.setupGradientBackground(true)
    } else {
      // Более темное драматическое освещение
      this.setupDramaticLighting()
      // Темный фон для драматического режима
      this.setupGradientBackground(false)
    }
  }

  private setupDramaticLighting() {
    // Темное драматическое освещение
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3)
    this.scene.add(ambientLight)

    // Основной драматический свет
    const keyLight = new THREE.SpotLight(0xffffff, 3.0)
    keyLight.position.set(80, 120, 100)
    keyLight.angle = Math.PI / 4
    keyLight.penumbra = 0.3
    keyLight.decay = 1.5
    keyLight.distance = 400
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.bias = -0.0001
    this.scene.add(keyLight)

    // Цветные rim lights
    const rimLight = new THREE.SpotLight(0x8b5cf6, 2.0)
    rimLight.position.set(-100, 60, -80)
    rimLight.angle = Math.PI / 3
    rimLight.penumbra = 0.4
    rimLight.decay = 2
    rimLight.distance = 300
    this.scene.add(rimLight)

    const rimLight2 = new THREE.SpotLight(0x3b82f6, 1.8)
    rimLight2.position.set(60, -40, -120)
    rimLight2.angle = Math.PI / 3
    rimLight2.penumbra = 0.5
    rimLight2.decay = 2
    rimLight2.distance = 350
    this.scene.add(rimLight2)
  }

  enableFullscreen() {
    if (!this.options.enableFullscreen) return

    const element = this.renderer.domElement
    if (element.requestFullscreen) {
      element.requestFullscreen()
    }
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    window.removeEventListener('resize', this.handleResize.bind(this))

    this.clearModel()
    this.clearGrid()

    if (this.controls) {
      this.controls.dispose()
    }

    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }

    this.renderer.dispose()
  }

  resize(width?: number, height?: number) {
    const newWidth = width || this.container.clientWidth
    const newHeight = height || this.container.clientHeight

    this.camera.aspect = newWidth / newHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(newWidth, newHeight)
    
    // Принудительно устанавливаем стили для canvas
    const canvas = this.renderer.domElement
    canvas.style.cssText = 'width: 100% !important; height: 100% !important; display: block !important;'
  }
}