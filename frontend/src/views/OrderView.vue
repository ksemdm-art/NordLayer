<template>
  <div class="order-view">
    <div class="container mx-auto px-4 py-8">
      <OrderForm :preselected-service-id="preselectedServiceId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import OrderForm from '@/components/orders/OrderForm.vue'

const route = useRoute()

const preselectedServiceId = computed(() => {
  const serviceId = route.query.preselectedServiceId as string
  return serviceId ? parseInt(serviceId, 10) : null
})
</script>

<style scoped>
.order-view {
  @apply min-h-screen bg-gradient-to-br from-primary-50 to-white;
}
</style>