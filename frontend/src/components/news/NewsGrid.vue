<template>
  <div class="news-grid-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-grid">
        <div v-for="n in 6" :key="n" class="loading-card">
          <div class="loading-image"></div>
          <div class="loading-content">
            <div class="loading-line short"></div>
            <div class="loading-line"></div>
            <div class="loading-line"></div>
            <div class="loading-line medium"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error-container">
      <div class="alert alert-error">
        <h3>⚠️ Something went wrong</h3>
        <p>{{ newsStore.error }}</p>
        <button @click="handleRetry" class="btn btn-primary">
          Try Again
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="articles.length === 0" class="empty-container">
      <div class="empty-state">
        <div class="empty-icon">📰</div>
        <h3>No news articles found</h3>
        <p v-if="isFiltered">
          No articles match your selected categories. Try adjusting your preferences in settings.
        </p>
        <p v-else>
          Check back later for the latest news updates.
        </p>
        <router-link v-if="isFiltered && authStore.isAuthenticated" to="/settings" class="btn btn-primary">
          Update Preferences
        </router-link>
      </div>
    </div>

    <!-- News Grid -->
    <div v-else class="news-grid">
      <NewsCard 
        v-for="article in articles" 
        :key="article.id" 
        :article="article"
        class="news-grid-item"
      />
    </div>

    <!-- Pagination -->
    <div v-if="articles.length > 0" class="pagination">
      <button 
        @click="handlePreviousPage"
        :disabled="!newsStore.hasPreviousPage || isLoading"
        class="btn btn-secondary"
      >
        ← Previous
      </button>
      
      <div class="pagination-info">
        <span class="page-number">Page {{ newsStore.currentPage }} of {{ newsStore.totalPages }}</span>
      </div>
      
      <button 
        @click="handleNextPage"
        :disabled="!newsStore.hasNextPage || isLoading"
        class="btn btn-secondary"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNewsStore } from '@/stores/news'
import { useAuthStore } from '@/stores/auth'
import NewsCard from './NewsCard.vue'

interface Props {
  articles: Array<any>
  isFiltered?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFiltered: false
})

const emit = defineEmits<{
  retry: []
  nextPage: []
  previousPage: []
}>()

const newsStore = useNewsStore()
const authStore = useAuthStore()

const isLoading = computed(() => newsStore.isLoading)
const hasError = computed(() => newsStore.hasError)

const handleRetry = () => {
  emit('retry')
}

const handleNextPage = () => {
  emit('nextPage')
}

const handlePreviousPage = () => {
  emit('previousPage')
}
</script>

<style scoped>
.news-grid-container {
  width: 100%;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.loading-container {
  width: 100%;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.loading-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-image {
  height: 200px;
  background: var(--medium-gray);
}

.loading-content {
  padding: 1.5rem;
}

.loading-line {
  height: 1rem;
  background: var(--medium-gray);
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}

.loading-line.short {
  width: 60%;
  height: 0.75rem;
}

.loading-line.medium {
  width: 80%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.error-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem;
}

.empty-state {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-number {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.pagination .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .news-grid,
  .loading-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-info {
    order: -1;
  }

  .empty-container,
  .error-container {
    padding: 1rem;
    min-height: 300px;
  }

  .empty-icon {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .news-grid,
  .loading-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
