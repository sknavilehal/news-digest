<template>
  <div class="home-page">
    <!-- Welcome Section -->
    <section class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">
          <span v-if="authStore.isAuthenticated">
            Welcome back, {{ authStore.user?.username }}! 👋
          </span>
          <span v-else>
            Stay Informed with Latest News 📰
          </span>
        </h1>
        <p class="welcome-description">
          <span v-if="authStore.isAuthenticated">
            Here are the latest articles from your selected categories: 
            <strong>{{ selectedCategoriesText }}</strong>
          </span>
          <span v-else>
            Discover trending news from around the world. Sign in to customize your news feed.
          </span>
        </p>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button 
            v-if="!authStore.isAuthenticated" 
            @click="showSignInPrompt = true"
            class="btn btn-primary"
          >
            Sign In to Personalize
          </button>
          <router-link 
            v-else 
            to="/settings" 
            class="btn btn-secondary"
          >
            Manage Preferences
          </router-link>
          <button 
            @click="handleRefresh" 
            :disabled="newsStore.isLoading"
            class="btn btn-secondary"
          >
            <span v-if="newsStore.isLoading" class="loading"></span>
            {{ newsStore.isLoading ? 'Loading...' : '🔄 Refresh' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" v-if="authStore.isAuthenticated">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ authStore.getUserCategories.length }}</h3>
            <p class="stat-label">Selected Categories</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ newsStore.articles.length }}</h3>
            <p class="stat-label">Articles Available</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <h3 class="stat-number">{{ currentDate }}</h3>
            <p class="stat-label">Today</p>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section class="news-section">
      <div class="section-header">
        <h2 class="section-title">
          {{ authStore.isAuthenticated ? 'Your Personalized Feed' : 'Trending News' }}
        </h2>
        <div class="section-actions">
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'"
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              title="Grid view"
            >
              ⊞
            </button>
            <button 
              @click="viewMode = 'list'"
              :class="['toggle-btn', { active: viewMode === 'list' }]"
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <!-- News Grid Component -->
      <NewsGrid 
        :articles="newsStore.articles"
        :is-filtered="authStore.isAuthenticated"
        :class="{ 'list-view': viewMode === 'list' }"
        @retry="handleRetry"
        @next-page="handleNextPage"
        @previous-page="handlePreviousPage"
      />
    </section>

    <!-- Sign In Prompt Modal -->
    <div v-if="showSignInPrompt" class="modal-overlay" @click.self="showSignInPrompt = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Personalize Your News Feed</h2>
          <button @click="showSignInPrompt = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="prompt-content">
            <div class="prompt-icon">🎯</div>
            <h3>Get News That Matters to You</h3>
            <ul class="benefits-list">
              <li>✨ Customize your news categories</li>
              <li>🔍 Filter content by your interests</li>
              <li>💾 Save your preferences</li>
              <li>⚡ Faster, more relevant updates</li>
            </ul>
            <div class="prompt-actions">
              <button @click="showSignInPrompt = false" class="btn btn-primary">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useNewsStore } from '@/stores/news'
import { useAuthStore } from '@/stores/auth'
import NewsGrid from '@/components/news/NewsGrid.vue'

const newsStore = useNewsStore()
const authStore = useAuthStore()

const showSignInPrompt = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const selectedCategoriesText = computed(() => {
  const categories = authStore.getUserCategories
  if (categories.length === 0) return 'All categories'
  if (categories.length <= 3) return categories.join(', ')
  return `${categories.slice(0, 2).join(', ')} and ${categories.length - 2} more`
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
})

const loadNews = async () => {
  const categories = authStore.isAuthenticated ? authStore.getUserCategories : undefined
  await newsStore.fetchNews({
    page: 1,
    limit: 6,
    categories: categories.length > 0 ? categories : undefined
  })
}

const handleRefresh = async () => {
  const categories = authStore.isAuthenticated ? authStore.getUserCategories : undefined
  await newsStore.refreshNews(categories.length > 0 ? categories : undefined)
}

const handleRetry = async () => {
  await loadNews()
}

const handleNextPage = async () => {
  const categories = authStore.isAuthenticated ? authStore.getUserCategories : undefined
  await newsStore.loadNextPage(categories.length > 0 ? categories : undefined)
}

const handlePreviousPage = async () => {
  const categories = authStore.isAuthenticated ? authStore.getUserCategories : undefined
  await newsStore.loadPreviousPage(categories.length > 0 ? categories : undefined)
}

// Watch for auth state changes to reload news
watch(() => authStore.isAuthenticated, () => {
  loadNews()
})

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth()
  // Load initial news
  loadNews()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  margin: -20px -20px 2rem -20px;
}

.welcome-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-description {
  font-size: 1.125rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

.news-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  overflow: hidden;
}

.toggle-btn {
  background: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  border-right: 1px solid var(--border-color);
}

.toggle-btn:last-child {
  border-right: none;
}

.toggle-btn:hover {
  background: var(--light-gray);
}

.toggle-btn.active {
  background: var(--primary-color);
  color: white;
}

.list-view .news-grid {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.prompt-content {
  text-align: center;
}

.prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.prompt-content h3 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
}

.benefits-list li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
}

.prompt-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-section {
    margin: -10px -10px 2rem -10px;
    padding: 2rem 0;
  }

  .welcome-content {
    padding: 0 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .quick-actions {
    flex-direction: column;
    align-items: center;
  }

  .quick-actions .btn {
    min-width: 200px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.75rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .view-toggle {
    width: 100%;
  }

  .toggle-btn {
    flex: 1;
  }
}
</style>
