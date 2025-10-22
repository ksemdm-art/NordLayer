<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-6">
          Изменить статус заказа #{{ order?.id }}
        </h3>
        <form @submit.prevent="updateStatus">
          <div class="space-y-4">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Статус</label>
              <select id="status" v-model="selectedStatus" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                <option value="new">Новый</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Завершен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="$emit('close')" class="bg-white py-2 px-4 border border-gray-300 rounded-md">Отмена</button>
            <button type="submit" class="py-2 px-4 bg-blue-600 text-white rounded-md">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import type { Order } from '@/types'

const props = defineProps<{
  order: Order | null
}>()

const emit = defineEmits<{
  close: []
  updated: [order: Order]
}>()

const selectedStatus = ref('')

const updateStatus = async () => {
  if (!props.order) return
  try {
    const response = await api.put(`/orders/${props.order.id}`, {
      status: selectedStatus.value
    })
    
    // Проверяем, что API вернул обновленные данные
    if (response.data && response.data.data) {
      emit('updated', response.data.data)
    } else {
      // Если API не вернул данные, создаем обновленный объект
      const updatedOrder = { ...props.order, status: selectedStatus.value }
      emit('updated', updatedOrder)
    }
    emit('close')
  } catch (error) {
    console.error('Error updating order status:', error)
    // Показываем пользователю ошибку
    alert('Ошибка при обновлении статуса заказа. Проверьте консоль для деталей.')
  }
}

onMounted(() => {
  if (props.order) {
    selectedStatus.value = props.order.status || 'new'
  }
})
</script>