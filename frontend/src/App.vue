<template>
  <ErrorBoundary>
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
    <NotificationContainer />
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import DefaultLayout from './components/layout/DefaultLayout.vue'
import ErrorBoundary from './components/common/ErrorBoundary.vue'
</script>

<style>
#app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>