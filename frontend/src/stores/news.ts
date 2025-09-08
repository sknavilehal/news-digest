import { defineStore } from 'pinia'
import type { NewsState, NewsArticle, PaginationParams } from '@/types'
import { newsApi } from '@/services/api'

// Mock data for development
const MOCK_NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    title: "Revolutionary AI Breakthrough Changes Everything",
    summary: "Scientists announce a major breakthrough in artificial intelligence that could transform how we interact with technology. The new system shows unprecedented capabilities in understanding and reasoning.",
    category: "Technology",
    sourceUrl: "https://example.com/ai-breakthrough",
    date: "2024-01-15T10:30:00Z",
    imageUrl: "https://picsum.photos/400/200?random=1"
  },
  {
    id: 2,
    title: "Championship Game Ends in Spectacular Fashion",
    summary: "The season finale delivered an unforgettable match with last-minute plays that kept fans on the edge of their seats. Both teams showcased exceptional skill and determination.",
    category: "Sports",
    sourceUrl: "https://example.com/championship-game",
    date: "2024-01-14T20:15:00Z",
    imageUrl: "https://picsum.photos/400/200?random=2"
  },
  {
    id: 3,
    title: "Global Climate Summit Reaches Historic Agreement",
    summary: "World leaders unite on unprecedented climate action plan. The agreement includes ambitious targets for carbon reduction and significant funding for renewable energy initiatives.",
    category: "Politics",
    sourceUrl: "https://example.com/climate-summit",
    date: "2024-01-14T14:45:00Z",
    imageUrl: "https://picsum.photos/400/200?random=3"
  },
  {
    id: 4,
    title: "Tech Giant Reports Record Quarterly Earnings",
    summary: "The company exceeded all expectations with a 45% increase in revenue, driven by strong demand for cloud services and AI-powered products. Stock prices surge in after-hours trading.",
    category: "Business",
    sourceUrl: "https://example.com/tech-earnings",
    date: "2024-01-13T16:20:00Z",
    imageUrl: "https://picsum.photos/400/200?random=4"
  },
  {
    id: 5,
    title: "Blockbuster Movie Breaks Opening Weekend Records",
    summary: "The highly anticipated sequel smashes box office records, earning over $200 million worldwide in its opening weekend. Critics and audiences alike praise the film's innovative storytelling.",
    category: "Entertainment",
    sourceUrl: "https://example.com/blockbuster-movie",
    date: "2024-01-13T11:00:00Z",
    imageUrl: "https://picsum.photos/400/200?random=5"
  },
  {
    id: 6,
    title: "Breakthrough Medical Treatment Shows Promise",
    summary: "Clinical trials reveal remarkable success rates for a new cancer treatment. The therapy shows minimal side effects and significant improvement in patient outcomes across multiple cancer types.",
    category: "Health",
    sourceUrl: "https://example.com/medical-breakthrough",
    date: "2024-01-12T09:30:00Z",
    imageUrl: "https://picsum.photos/400/200?random=6"
  },
  {
    id: 7,
    title: "Space Mission Discovers Potentially Habitable Planet",
    summary: "NASA's latest space telescope identifies an Earth-like planet in the habitable zone of a nearby star system. Scientists are excited about the possibility of finding signs of life.",
    category: "Science",
    sourceUrl: "https://example.com/space-discovery",
    date: "2024-01-12T07:15:00Z",
    imageUrl: "https://picsum.photos/400/200?random=7"
  },
  {
    id: 8,
    title: "International Trade Agreement Reshapes Global Economy",
    summary: "Major economies sign comprehensive trade deal that promises to reduce tariffs and boost international commerce. Experts predict significant positive impact on global growth.",
    category: "World",
    sourceUrl: "https://example.com/trade-agreement",
    date: "2024-01-11T18:45:00Z",
    imageUrl: "https://picsum.photos/400/200?random=8"
  },
  {
    id: 9,
    title: "Quantum Computing Milestone Achieved",
    summary: "Researchers demonstrate quantum supremacy in solving complex computational problems. The achievement brings us closer to practical quantum computing applications in various industries.",
    category: "Technology",
    sourceUrl: "https://example.com/quantum-computing",
    date: "2024-01-11T13:20:00Z",
    imageUrl: "https://picsum.photos/400/200?random=9"
  },
  {
    id: 10,
    title: "Olympic Champions Announce Retirement",
    summary: "Two legendary athletes who dominated their sports for over a decade announce their retirement. Their careers include multiple Olympic gold medals and world records.",
    category: "Sports",
    sourceUrl: "https://example.com/athlete-retirement",
    date: "2024-01-10T15:30:00Z",
    imageUrl: "https://picsum.photos/400/200?random=10"
  }
]

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    articles: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
  }),

  getters: {
    getCurrentArticles: (state) => state.articles,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    hasNextPage: (state) => state.currentPage < state.totalPages,
    hasPreviousPage: (state) => state.currentPage > 1
  },

  actions: {
    async fetchNews(params: PaginationParams = { page: 1, limit: 6 }) {
      this.loading = true
      this.error = null

      try {
        // TODO: Replace with actual API call
        // const response = await newsApi.getNews(params)
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Filter by categories if provided
        let filteredData = MOCK_NEWS_DATA
        if (params.categories && params.categories.length > 0) {
          filteredData = MOCK_NEWS_DATA.filter(article => 
            params.categories!.includes(article.category)
          )
        }

        // Paginate results
        const startIndex = (params.page - 1) * params.limit
        const endIndex = startIndex + params.limit
        const paginatedArticles = filteredData.slice(startIndex, endIndex)

        this.articles = paginatedArticles
        this.currentPage = params.page
        this.totalPages = Math.ceil(filteredData.length / params.limit)
        
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to fetch news'
        console.error('Error fetching news:', error)
      } finally {
        this.loading = false
      }
    },

    async loadNextPage(categories?: string[]) {
      if (this.hasNextPage && !this.loading) {
        await this.fetchNews({
          page: this.currentPage + 1,
          limit: 6,
          categories
        })
      }
    },

    async loadPreviousPage(categories?: string[]) {
      if (this.hasPreviousPage && !this.loading) {
        await this.fetchNews({
          page: this.currentPage - 1,
          limit: 6,
          categories
        })
      }
    },

    async refreshNews(categories?: string[]) {
      await this.fetchNews({
        page: 1,
        limit: 6,
        categories
      })
    },

    clearError() {
      this.error = null
    }
  }
})
