<template>
  <article class="news-card" @click="handleCardClick">
    <div v-if="article.imageUrl" class="news-image">
      <img :src="article.imageUrl" :alt="article.title" loading="lazy">
    </div>
    
    <div class="news-content">
      <div class="news-meta">
        <span class="news-category" :class="`category-${article.category.toLowerCase()}`">
          {{ article.category }}
        </span>
        <span class="news-date">{{ formattedDate }}</span>
      </div>
      
      <h3 class="news-title">{{ article.title }}</h3>
      
      <p class="news-summary">{{ article.summary }}</p>
      
      <div class="news-actions">
        <a 
          :href="article.sourceUrl" 
          target="_blank" 
          rel="noopener noreferrer"
          class="read-more-link"
          @click.stop
        >
          Read Full Article →
        </a>
        <button 
          class="share-btn"
          @click.stop="handleShare"
          title="Share article"
        >
          📤
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NewsArticle } from '@/types'

interface Props {
  article: NewsArticle
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  const date = new Date(props.article.date)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const handleCardClick = () => {
  // Could navigate to a detailed article view
  // For now, just open the source URL
  window.open(props.article.sourceUrl, '_blank', 'noopener,noreferrer')
}

const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.article.title,
        text: props.article.summary,
        url: props.article.sourceUrl
      })
    } catch (error) {
      console.log('Error sharing:', error)
      fallbackShare()
    }
  } else {
    fallbackShare()
  }
}

const fallbackShare = () => {
  const shareText = `${props.article.title}\n\n${props.article.summary}\n\n${props.article.sourceUrl}`
  navigator.clipboard.writeText(shareText).then(() => {
    alert('Article details copied to clipboard!')
  }).catch(() => {
    alert('Could not copy to clipboard')
  })
}
</script>

<style scoped>
.news-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.05);
}

.news-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.news-category {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-technology { background: #dbeafe; color: #1e40af; }
.category-sports { background: #dcfce7; color: #166534; }
.category-politics { background: #fef3c7; color: #92400e; }
.category-business { background: #f3e8ff; color: #7c3aed; }
.category-entertainment { background: #fce7f3; color: #be185d; }
.category-health { background: #ecfdf5; color: #059669; }
.category-science { background: #e0f2fe; color: #0369a1; }
.category-world { background: #fef2f2; color: #dc2626; }

.news-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.news-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.read-more-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.read-more-link:hover {
  color: var(--primary-hover);
}

.share-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  font-size: 1.125rem;
}

.share-btn:hover {
  background: var(--light-gray);
}

/* Responsive */
@media (max-width: 768px) {
  .news-image {
    height: 150px;
  }

  .news-content {
    padding: 1rem;
  }

  .news-title {
    font-size: 1.125rem;
  }

  .news-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
