import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { globalNotifications } from '@/composables/useNotifications'
import type { Order } from '@/types'
import type { OrderFormData } from '@/types/orders'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentOrder = ref<Order | null>(null)

  const createOrder = async (orderData: OrderFormData): Promise<Order> => {
    loading.value = true
    error.value = null
    
    try {
      // Transform form data to API format according to OrderCreate schema
      const firstService = orderData.services?.[0]
      
      if (!firstService?.id) {
        throw new Error('Не выбрана услуга')
      }
      
      const apiData = {
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_contact: orderData.customerPhone || orderData.customerEmail,
        service_id: firstService.id,
        source: 'web' as const,
        // Добавляем данные о доставке в корневые поля (API ожидает строки)
        delivery_needed: orderData.deliveryNeeded === true ? 'true' : 'false',
        delivery_details: orderData.deliveryDetails || null,
        alternative_contact: orderData.alternativeContact || null,
        specifications: {
          // Сначала базовые specifications
          ...orderData.specifications,
          // Затем дополнительные данные (они не должны перезаписываться)
          customer_phone: orderData.customerPhone,
          service_type: firstService.name,
          total_price: orderData.totalPrice || 0,
          // Данные о доставке (принудительно устанавливаем)
          delivery_needed: orderData.deliveryNeeded === true ? 'true' : 'false',
          delivery_details: orderData.deliveryDetails || null,
          alternative_contact: orderData.alternativeContact || null,
          // Добавляем все услуги в specifications
          services: orderData.services?.map(service => ({
            id: service.id,
            name: service.name,
            description: service.description,
          })) || [],
          files_info: orderData.files?.map(file => ({
            id: file.id,
            filename: file.filename,
            size: file.size,
            type: file.type
          })) || [],
          selected_gallery_items: orderData.selectedGalleryItems?.map(item => ({
            id: item.id,
            title: item.title
          })) || []
        },
        notes: orderData.notes || ''
      }


      
      const orderResponse = await api.post<Order>('/orders', apiData)
      const newOrder = orderResponse.data
      
      // Убедимся что есть ID
      if (!newOrder.id) {
        newOrder.id = Date.now() // Временный fallback ID
      }
      
      // Add to orders list
      orders.value.unshift(newOrder)
      currentOrder.value = newOrder
      
      // Show success notification
      globalNotifications.success(
        'Заказ создан!',
        `Ваш заказ #${newOrder.id} успешно отправлен. Мы свяжемся с вами в ближайшее время.`
      )
      
      return newOrder
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Не удалось создать заказ'
      error.value = errorMessage
      
      globalNotifications.error(
        'Ошибка создания заказа',
        errorMessage
      )
      
      throw err
    } finally {
      loading.value = false
    }
  }

  const getOrder = async (orderId: number): Promise<Order> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Order>(`/orders/${orderId}`)
      const order = response.data
      
      // Update current order
      currentOrder.value = order
      
      // Update in orders list if exists
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value[index] = order
      }
      
      return order
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Не удалось загрузить заказ'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const getOrders = async (): Promise<Order[]> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<Order[]>('/orders')
      orders.value = response.data
      return response.data
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Не удалось загрузить заказы'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    orders,
    loading,
    error,
    currentOrder,
    createOrder,
    getOrder,
    getOrders,
    clearCurrentOrder,
    clearError
  }
})