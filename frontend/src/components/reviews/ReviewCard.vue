<template>
  <div class="review-card bg-white rounded-lg shadow-nordic overflow-hidden border border-primary-100">
    <!-- Header -->
    <div class="p-6 border-b border-primary-200">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <div class="avatar">
              {{ getInitials(review.customer_name) }}
            </div>
            <div>
              <h3 class="font-semibold text-primary-900">{{ review.customer_name }}</h3>
              <div class="flex items-center space-x-2 mt-1">
                <div class="star-rating">
                  <StarIcon
                    v-for="star in 5"
                    :key="star"
                    class="star"
                    :class="{ 'active': star <= review.rating }"
                  />
                </div>
                <span class="text-sm text-primary-500">
                  {{ formatDate(review.created_at) }}
                </span>
              </div>
            </div>
          </div>
          
          <h4 v-if="review.title" class="text-lg font-medium text-primary-900 mt-3">
            {{ review.title }}
          </h4>
        </div>
        
        <div v-if="review.is_featured" class="featured-badge">
          <StarIcon class="w-4 h-4" />
          <span class="text-xs font-medium">Рекомендуем</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="review-content">
        <p class="text-primary-700 leading-relaxed">{{ review.content }}</p>
      </div>

      <!-- Images -->
      <div v-if="review.images && review.images.length > 0" class="images-gallery mt-4">
        <div class="images-grid">
          <div
            v-for="(image, index) in review.images"
            :key="index"
            class="image-item"
            @click="openImageModal(index)"
          >
            <img
              :src="image.url"
              :alt="image.caption || `Изображение ${index + 1}`"
              class="image-thumbnail"
            />
            <div v-if="image.caption" class="image-caption">
              {{ image.caption }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <Teleport to="body">
      <div
        v-if="showImageModal"
        class="image-modal"
        @click="closeImageModal"
      >
        <div class="modal-content" @click.stop>
          <button
            @click="closeImageModal"
            class="close-button"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
          
          <div class="modal-image-container">
            <img
              :src="currentImage?.url"
              :alt="currentImage?.caption || 'Изображение'"
              class="modal-image"
            />
          </div>
          
          <div v-if="currentImage?.caption" class="modal-caption">
            {{ currentImage.caption }}
          </div>
          
          <!-- Navigation -->
          <div v-if="review.images && review.images.length > 1" class="modal-navigation">
            <button
              @click="previousImage"
              :disabled="currentImageIndex === 0"
              class="nav-button"
            >
              <ChevronLeftIcon class="w-6 h-6" />
            </button>
            
            <span class="image-counter">
              {{ currentImageIndex + 1 }} / {{ review.images.length }}
            </span>
            
            <button
              @click="nextImage"
              :disabled="currentImageIndex === (review.images?.length || 0) - 1"
              class="nav-button"
            >
              <ChevronRightIcon class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

interface ReviewImage {
  url: string
  caption?: string
}

interface Review {
  id: number
  customer_name: string
  rating: number
  title?: string
  content: string
  images?: ReviewImage[]
  is_featured: boolean
  created_at: string
}

interface Props {
  review: Review
}

const props = defineProps<Props>()

const showImageModal = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (!props.review.images || props.review.images.length === 0) return null
  return props.review.images[currentImageIndex.value]
})

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openImageModal = (index: number) => {
  currentImageIndex.value = index
  showImageModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeImageModal = () => {
  showImageModal.value = false
  document.body.style.overflow = ''
}

const previousImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

const nextImage = () => {
  if (props.review.images && currentImageIndex.value < props.review.images.length - 1) {
    currentImageIndex.value++
  }
}

// Handle keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!showImageModal.value) return
  
  if (e.key === 'Escape') {
    closeImageModal()
  } else if (e.key === 'ArrowLeft') {
    previousImage()
  } else if (e.key === 'ArrowRight') {
    nextImage()
  }
}

// Add keyboard event listener
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
.review-card {
  @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.avatar {
  @apply w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm;
}

.star-rating {
  @apply flex items-center space-x-1;
}

.star {
  @apply w-4 h-4 text-primary-300;
}

.star.active {
  @apply text-accent-500;
}

.featured-badge {
  @apply flex items-center space-x-1 bg-accent-100 text-accent-800 px-2 py-1 rounded-full border border-accent-200;
}

.review-content {
  @apply text-sm leading-relaxed;
}

.images-gallery {
  @apply mt-4;
}

.images-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3;
}

.image-item {
  @apply cursor-pointer rounded-lg overflow-hidden bg-primary-50 hover:shadow-md transition-shadow duration-200 border border-primary-100;
}

.image-thumbnail {
  @apply w-full h-24 object-cover;
}

.image-caption {
  @apply p-2 text-xs text-primary-600 bg-white;
}

/* Modal Styles */
.image-modal {
  @apply fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4;
}

.modal-content {
  @apply relative bg-white rounded-lg max-w-4xl max-h-full overflow-hidden shadow-2xl;
}

.close-button {
  @apply absolute top-4 right-4 z-10 bg-primary-900 bg-opacity-80 text-primary-50 rounded-full p-2 hover:bg-opacity-100 transition-colors duration-200;
}

.modal-image-container {
  @apply flex items-center justify-center bg-primary-50;
}

.modal-image {
  @apply max-w-full max-h-[70vh] object-contain;
}

.modal-caption {
  @apply p-4 text-center text-primary-700 bg-white;
}

.modal-navigation {
  @apply flex items-center justify-center space-x-4 p-4 bg-white border-t border-primary-200;
}

.nav-button {
  @apply p-2 rounded-full bg-primary-100 hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-primary-700;
}

.image-counter {
  @apply text-sm text-primary-600 font-medium;
}
</style>