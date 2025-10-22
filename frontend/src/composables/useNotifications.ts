import { ref, readonly } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

const notifications = ref<Notification[]>([])

let notificationId = 0

export function useNotifications() {
  const add = (notification: Omit<Notification, 'id'>): string => {
    const id = `notification-${++notificationId}`
    const newNotification: Notification = {
      id,
      duration: 5000,
      persistent: false,
      ...notification
    }

    notifications.value.push(newNotification)

    // Auto remove non-persistent notifications
    if (!newNotification.persistent && newNotification.duration) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  // Convenience methods
  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    return add({ type: 'success', title, message, ...options })
  }

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    return add({ type: 'error', title, message, persistent: true, ...options })
  }

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    return add({ type: 'warning', title, message, ...options })
  }

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    return add({ type: 'info', title, message, ...options })
  }

  return {
    notifications: readonly(notifications),
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
}

// Global instance for use across the app
export const globalNotifications = useNotifications()