<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">📰 News Digest</h1>
        <p class="hero-subtitle">Your Personalized News Aggregator</p>
        <p class="hero-description">
          Stay informed with the latest news from around the world, 
          tailored to your interests and delivered in a clean, easy-to-read format.
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">✨ Features</h2>
        <p class="section-description">Everything you need to stay informed</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3 class="feature-title">Personalized Feed</h3>
          <p class="feature-description">
            Customize your news categories and get articles that match your interests. 
            No more irrelevant content cluttering your feed.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Real-time Updates</h3>
          <p class="feature-description">
            Get the latest news as it happens. Our system continuously monitors 
            trusted sources to bring you breaking news and updates.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3 class="feature-title">Mobile Responsive</h3>
          <p class="feature-description">
            Access your news feed from anywhere. Our responsive design works 
            perfectly on desktop, tablet, and mobile devices.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">Privacy Focused</h3>
          <p class="feature-description">
            Your reading preferences stay private. We don't track your reading 
            habits or sell your data to third parties.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🌐</div>
          <h3 class="feature-title">Multiple Sources</h3>
          <p class="feature-description">
            We aggregate news from diverse, trusted sources to give you a 
            comprehensive view of current events.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3 class="feature-title">Smart Filtering</h3>
          <p class="feature-description">
            Our advanced algorithms help surface the most relevant and 
            important stories based on your preferences.
          </p>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="section-header">
        <h2 class="section-title">📂 News Categories</h2>
        <p class="section-description">Choose from a wide range of topics</p>
      </div>

      <div class="categories-grid">
        <div 
          v-for="category in newsCategories" 
          :key="category"
          class="category-badge"
        >
          <span class="category-icon">{{ getCategoryIcon(category) }}</span>
          <span class="category-name">{{ category }}</span>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="tech-section">
      <div class="section-header">
        <h2 class="section-title">🔧 Built With</h2>
        <p class="section-description">Modern web technologies for the best experience</p>
      </div>

      <div class="tech-grid">
        <div class="tech-item">
          <h4 class="tech-name">Vue.js 3</h4>
          <p class="tech-description">Progressive JavaScript framework with Composition API</p>
        </div>
        <div class="tech-item">
          <h4 class="tech-name">TypeScript</h4>
          <p class="tech-description">Type-safe development for better code quality</p>
        </div>
        <div class="tech-item">
          <h4 class="tech-name">Pinia</h4>
          <p class="tech-description">Modern state management for Vue applications</p>
        </div>
        <div class="tech-item">
          <h4 class="tech-name">Vue Router</h4>
          <p class="tech-description">Official router for Vue.js applications</p>
        </div>
        <div class="tech-item">
          <h4 class="tech-name">Vite</h4>
          <p class="tech-description">Fast build tool and development server</p>
        </div>
        <div class="tech-item">
          <h4 class="tech-name">CSS3</h4>
          <p class="tech-description">Modern styling with custom properties and grid</p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="section-header">
        <h2 class="section-title">📈 Platform Statistics</h2>
        <p class="section-description">Our platform at a glance</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ mockStats.categories }}</div>
          <div class="stat-label">News Categories</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mockStats.sources }}</div>
          <div class="stat-label">Trusted Sources</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mockStats.articles }}</div>
          <div class="stat-label">Articles Daily</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ mockStats.updates }}</div>
          <div class="stat-label">Updates Per Hour</div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Get Started?</h2>
        <p class="cta-description">
          Join thousands of users who trust News Digest for their daily news consumption.
        </p>
        <div class="cta-actions">
          <router-link to="/" class="btn btn-primary btn-lg">
            Explore News Feed
          </router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/" class="btn btn-secondary btn-lg">
            Sign Up for Free
          </router-link>
          <router-link v-else to="/settings" class="btn btn-secondary btn-lg">
            Customize Settings
          </router-link>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="section-header">
        <h2 class="section-title">📧 Get in Touch</h2>
        <p class="section-description">Have questions or feedback? We'd love to hear from you!</p>
      </div>

      <div class="contact-grid">
        <div class="contact-card">
          <div class="contact-icon">💌</div>
          <h3 class="contact-title">Email Support</h3>
          <p class="contact-description">Get help with any issues or questions</p>
          <a href="mailto:support@newsdigest.example.com" class="contact-link">
            support@newsdigest.example.com
          </a>
        </div>

        <div class="contact-card">
          <div class="contact-icon">💡</div>
          <h3 class="contact-title">Feature Requests</h3>
          <p class="contact-description">Suggest new features or improvements</p>
          <a href="mailto:feedback@newsdigest.example.com" class="contact-link">
            feedback@newsdigest.example.com
          </a>
        </div>

        <div class="contact-card">
          <div class="contact-icon">🐛</div>
          <h3 class="contact-title">Bug Reports</h3>
          <p class="contact-description">Report technical issues or bugs</p>
          <a href="mailto:bugs@newsdigest.example.com" class="contact-link">
            bugs@newsdigest.example.com
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { NEWS_CATEGORIES } from '@/types'

const authStore = useAuthStore()

const newsCategories = NEWS_CATEGORIES

const mockStats = {
  categories: 8,
  sources: '50+',
  articles: '500+',
  updates: 24
}

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
</script>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 1rem;
  margin-bottom: 4rem;
}

.hero-content {
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0.9;
}

/* Section Styles */
.features-section,
.categories-section,
.tech-section,
.stats-section,
.contact-section {
  margin-bottom: 4rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
  margin: 0;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.category-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.category-badge:hover {
  transform: translateY(-2px);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-weight: 500;
  color: var(--text-primary);
}

/* Tech Grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.tech-item {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}

.tech-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.tech-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

/* CTA Section */
.cta-section {
  background: var(--light-gray);
  padding: 4rem 2rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 4rem;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contact-card {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-3px);
}

.contact-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.contact-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.contact-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.contact-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.contact-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .features-grid,
  .categories-grid,
  .tech-grid,
  .stats-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .feature-card,
  .tech-item,
  .stat-card,
  .contact-card {
    padding: 1.5rem;
  }

  .cta-section {
    padding: 3rem 1.5rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-actions .btn {
    min-width: 200px;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 0 1rem;
  }

  .hero-title {
    font-size: 1.875rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .features-section,
  .categories-section,
  .tech-section,
  .stats-section,
  .contact-section {
    margin-bottom: 3rem;
  }

  .feature-card,
  .tech-item,
  .stat-card,
  .contact-card {
    padding: 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }
}
</style>
