<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-description">Customize your news preferences and account settings</p>
    </div>

    <!-- Not authenticated state -->
    <div v-if="!authStore.isAuthenticated" class="auth-required">
      <div class="alert alert-info">
        <h3>🔒 Authentication Required</h3>
        <p>Please sign in to access your settings and customize your news preferences.</p>
        <router-link to="/" class="btn btn-primary">Go to Home</router-link>
      </div>
    </div>

    <!-- Settings Content -->
    <div v-else class="settings-content">
      <!-- Account Information -->
      <section class="settings-section">
        <div class="section-header">
          <h2 class="section-title">👤 Account Information</h2>
          <p class="section-description">Your basic account details</p>
        </div>
        
        <div class="settings-card">
          <div class="account-info">
            <div class="info-item">
              <label class="info-label">Username</label>
              <span class="info-value">{{ authStore.user?.username }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">Email</label>
              <span class="info-value">{{ authStore.user?.email }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- News Categories -->
      <section class="settings-section">
        <div class="section-header">
          <h2 class="section-title">📰 News Categories</h2>
          <p class="section-description">
            Select the categories you're interested in. Only articles from your selected categories will appear in your feed.
          </p>
        </div>

        <div class="settings-card">
          <form @submit.prevent="handleSaveCategories">
            <div class="categories-grid">
              <div 
                v-for="category in allCategories" 
                :key="category"
                class="category-item"
              >
                <label class="category-label">
                  <input
                    type="checkbox"
                    :value="category"
                    v-model="selectedCategories"
                    class="category-checkbox"
                    :disabled="categoriesLoading"
                  >
                  <span class="category-name">{{ category }}</span>
                  <span class="category-icon">{{ getCategoryIcon(category) }}</span>
                </label>
              </div>
            </div>

            <div v-if="categoriesError" class="alert alert-error">
              {{ categoriesError }}
            </div>

            <div class="categories-summary">
              <p class="summary-text">
                <strong>{{ selectedCategories.length }}</strong> 
                {{ selectedCategories.length === 1 ? 'category' : 'categories' }} selected
              </p>
              <p v-if="selectedCategories.length === 0" class="summary-warning">
                ⚠️ No categories selected. You won't see any personalized content.
              </p>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="categoriesLoading || !hasChanges"
              >
                <span v-if="categoriesLoading" class="loading"></span>
                {{ categoriesLoading ? 'Saving...' : 'Save Preferences' }}
              </button>
              <button 
                type="button" 
                @click="resetCategories"
                class="btn btn-secondary"
                :disabled="categoriesLoading"
              >
                Reset to Default
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="settings-section">
        <div class="section-header">
          <h2 class="section-title">⚡ Quick Actions</h2>
          <p class="section-description">Manage your account and data</p>
        </div>

        <div class="settings-card">
          <div class="quick-actions-grid">
            <button @click="handleRefreshNews" class="action-btn" :disabled="refreshLoading">
              <div class="action-icon">🔄</div>
              <div class="action-content">
                <h3 class="action-title">Refresh News</h3>
                <p class="action-description">Get the latest articles</p>
              </div>
              <span v-if="refreshLoading" class="loading"></span>
            </button>

            <button @click="handleClearCache" class="action-btn">
              <div class="action-icon">🧹</div>
              <div class="action-content">
                <h3 class="action-title">Clear Cache</h3>
                <p class="action-description">Reset stored preferences</p>
              </div>
            </button>

            <button @click="showLogoutConfirm = true" class="action-btn danger">
              <div class="action-icon">🚪</div>
              <div class="action-content">
                <h3 class="action-title">Sign Out</h3>
                <p class="action-description">End your session</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Success Message -->
      <div v-if="showSuccess" class="alert alert-success">
        ✅ Settings saved successfully!
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutConfirm" class="modal-overlay" @click.self="showLogoutConfirm = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Confirm Sign Out</h2>
          <button @click="showLogoutConfirm = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to sign out? Your preferences will be saved.</p>
          <div class="modal-actions">
            <button @click="handleLogout" class="btn btn-danger">Sign Out</button>
            <button @click="showLogoutConfirm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNewsStore } from '@/stores/news'
import { NEWS_CATEGORIES } from '@/types'

const authStore = useAuthStore()
const newsStore = useNewsStore()
const router = useRouter()

const selectedCategories = ref<string[]>([])
const categoriesLoading = ref(false)
const categoriesError = ref('')
const refreshLoading = ref(false)
const showSuccess = ref(false)
const showLogoutConfirm = ref(false)

const allCategories = NEWS_CATEGORIES

const hasChanges = computed(() => {
  const currentCategories = authStore.getUserCategories
  return JSON.stringify(selectedCategories.value.sort()) !== JSON.stringify(currentCategories.sort())
})

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Technology': '💻',
    'Sports': '⚽',
    'Politics': '🏛️',
    'Business': '💼',
    'Entertainment': '🎬',
    'Health': '🏥',
    'Science': '🔬',
    'World': '🌍'
  }
  return icons[category] || '📄'
}

const handleSaveCategories = async () => {
  categoriesLoading.value = true
  categoriesError.value = ''

  try {
    const success = await authStore.updateCategories(selectedCategories.value)
    if (success) {
      showSuccess.value = true
      setTimeout(() => {
        showSuccess.value = false
      }, 3000)
    } else {
      categoriesError.value = 'Failed to save preferences. Please try again.'
    }
  } catch (error) {
    categoriesError.value = 'An error occurred while saving preferences.'
  } finally {
    categoriesLoading.value = false
  }
}

const resetCategories = () => {
  selectedCategories.value = ['Technology', 'Sports', 'Politics']
}

const handleRefreshNews = async () => {
  refreshLoading.value = true
  try {
    await newsStore.refreshNews(authStore.getUserCategories)
  } finally {
    refreshLoading.value = false
  }
}

const handleClearCache = () => {
  localStorage.clear()
  alert('Cache cleared successfully!')
}

const handleLogout = () => {
  authStore.logout()
  showLogoutConfirm.value = false
  router.push('/')
}

// Initialize categories from store
watch(() => authStore.user, (user) => {
  if (user) {
    selectedCategories.value = [...user.selectedCategories]
  }
}, { immediate: true })

onMounted(() => {
  // Initialize auth state if not already done
  authStore.initializeAuth()
  
  // Set initial categories
  if (authStore.user) {
    selectedCategories.value = [...authStore.user.selectedCategories]
  }
})
</script>

<style scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

.auth-required {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.settings-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.section-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.settings-card {
  padding: 2rem;
}

.account-info {
  display: grid;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-weight: 500;
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  color: var(--text-primary);
  font-weight: 500;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-item {
  position: relative;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.category-label:hover {
  border-color: var(--primary-color);
  background: #fafafa;
}

.category-checkbox:checked + .category-name + .category-icon {
  transform: scale(1.2);
}

.category-label:has(.category-checkbox:checked) {
  border-color: var(--primary-color);
  background: #f0f7ff;
}

.category-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--primary-color);
}

.category-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
}

.category-icon {
  font-size: 1.25rem;
  transition: transform 0.2s ease;
}

.categories-summary {
  background: var(--light-gray);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.summary-text {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.summary-warning {
  margin: 0;
  color: var(--warning-color);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-actions-grid {
  display: grid;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.action-btn:hover {
  border-color: var(--primary-color);
  background: #fafafa;
}

.action-btn.danger:hover {
  border-color: var(--danger-color);
  background: #fef2f2;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.action-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
}

/* Modal */
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
  max-width: 400px;
  width: 100%;
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

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions .btn {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-page {
    margin: 0;
  }

  .section-header,
  .settings-card {
    padding: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .btn {
    width: 100%;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.875rem;
  }

  .section-header,
  .settings-card {
    padding: 1rem;
  }

  .action-btn {
    padding: 1rem;
  }

  .action-title {
    font-size: 1rem;
  }
}
</style>
