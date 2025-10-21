import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      // API call will be implemented later
      console.log('Fetching projects...')
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects
  }
})