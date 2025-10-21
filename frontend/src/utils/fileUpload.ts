import api from '@/services/api'
import type { UploadedFile } from '@/types/orders'

export interface FileUploadOptions {
  onProgress?: (progress: number) => void
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

// Re-export from types
export type { UploadedFile } from '@/types/orders'

export class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

export async function uploadFile(
  file: File,
  options: FileUploadOptions = {}
): Promise<UploadedFile> {
  const {
    onProgress,
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image/*', 'model/stl', '.stl', '.obj', '.3mf']
  } = options

  // Validate file size
  if (file.size > maxSize) {
    throw new FileUploadError(
      `Файл слишком большой. Максимальный размер: ${formatFileSize(maxSize)}`,
      'FILE_TOO_LARGE'
    )
  }

  // Validate file type
  const isAllowed = allowedTypes.some(type => {
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    if (type.includes('*')) {
      const baseType = type.split('/')[0]
      return file.type.startsWith(baseType)
    }
    return file.type === type
  })

  if (!isAllowed) {
    throw new FileUploadError(
      `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`,
      'INVALID_FILE_TYPE'
    )
  }

  // Create form data
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await api.post<UploadedFile>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    // API возвращает данные в формате { success: true, data: {...} }
    const fileData = (response.data as any)?.data || response.data
    
    // Убеждаемся, что у нас есть все необходимые поля
    return {
      id: fileData.id || Math.random().toString(36).substr(2, 9),
      filename: fileData.filename || file.name,
      url: fileData.url || '',
      size: fileData.size || file.size,
      type: fileData.type || file.type
    }
  } catch (error: any) {
    if (error.response?.status === 413) {
      throw new FileUploadError(
        'Файл слишком большой для загрузки',
        'FILE_TOO_LARGE'
      )
    }
    
    throw new FileUploadError(
      error.response?.data?.message || 'Ошибка при загрузке файла',
      'UPLOAD_FAILED'
    )
  }
}

export async function uploadMultipleFiles(
  files: File[],
  options: FileUploadOptions = {}
): Promise<UploadedFile[]> {
  const uploadPromises = files.map(file => uploadFile(file, options))
  return Promise.all(uploadPromises)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return ''
  }
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function is3DModelFile(file: File): boolean {
  const modelExtensions = ['stl', 'obj', '3mf', 'ply', 'gltf', 'glb']
  const extension = getFileExtension(file.name).toLowerCase()
  return modelExtensions.includes(extension)
}