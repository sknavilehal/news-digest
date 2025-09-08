<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3 class="footer-title">📰 News Digest</h3>
        <p class="footer-description">
          Your personalized news aggregator for staying informed with the latest updates.
        </p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Quick Links</h4>
        <ul class="footer-links">
          <li><router-link to="/" class="footer-link">Home</router-link></li>
          <li><router-link to="/about" class="footer-link">About</router-link></li>
          <li v-if="authStore.isAuthenticated"><router-link to="/settings" class="footer-link">Settings</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Categories</h4>
        <ul class="footer-links">
          <li v-for="category in popularCategories" :key="category" class="category-item">
            {{ category }}
          </li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">Connect</h4>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Twitter">🐦</a>
          <a href="#" class="social-link" aria-label="Facebook">📘</a>
          <a href="#" class="social-link" aria-label="LinkedIn">💼</a>
          <a href="#" class="social-link" aria-label="RSS">📡</a>
        </div>
      </div>
    </div>
    
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">
          © {{ currentYear }} News Digest. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <a href="#" class="footer-bottom-link">Privacy Policy</a>
          <a href="#" class="footer-bottom-link">Terms of Service</a>
          <a href="#" class="footer-bottom-link">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { NEWS_CATEGORIES } from '@/types'

const authStore = useAuthStore()

const currentYear = computed(() => new Date().getFullYear())

const popularCategories = computed(() => {
  return NEWS_CATEGORIES.slice(0, 4) // Show first 4 categories
})
</script>

<style scoped>
.footer {
  background: var(--text-primary);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
}

.footer-title {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.footer-subtitle {
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
}

.footer-description {
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-color);
}

.category-item {
  color: #cbd5e1;
  font-size: 0.875rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid #475569;
  padding: 1.5rem 0;
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #cbd5e1;
  margin: 0;
  font-size: 0.875rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-bottom-link:hover {
  color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  .footer-content {
    padding: 2rem 1rem 1.5rem;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-bottom-content {
    padding: 0 1rem;
    flex-direction: column;
    text-align: center;
  }

  .footer-bottom-links {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
