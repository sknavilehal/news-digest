import axios from 'axios'
import type { NewsArticle, User, ApiResponse, PaginationParams, LoginCredentials, RegisterCredentials } from '@/types'

// API base URL - in production, this would come from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const authState = localStorage.getItem('authState')
    if (authState) {
      try {
        const { user } = JSON.parse(authState)
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`
        }
      } catch (error) {
        console.error('Error parsing auth state:', error)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth state and redirect to login
      localStorage.removeItem('authState')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.post('/auth/login', credentials)
    // return response.data
    
    // Mock response for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
          resolve({
            success: true,
            data: {
              user: {
                id: '1',
                username: 'demo',
                email: 'demo@example.com',
                selectedCategories: ['Technology', 'Sports', 'Politics'],
                createdAt: new Date('2023-01-01')
              },
              token: 'mock-jwt-token-12345'
            }
          })
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.post('/auth/register', credentials)
    // return response.data
    
    // Mock response
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate validation
        if (credentials.email === 'test@example.com') {
          reject(new Error('User with this email already exists'))
          return
        }
        
        if (credentials.username === 'demo') {
          reject(new Error('Username already taken'))
          return
        }

        resolve({
          success: true,
          data: {
            user: {
              id: Date.now().toString(),
              username: credentials.username,
              email: credentials.email,
              selectedCategories: ['Technology'],
              createdAt: new Date()
            },
            token: `mock-jwt-token-${Date.now()}`
          }
        })
      }, 1000)
    })
  },

  async logout(): Promise<ApiResponse<null>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.post('/auth/logout')
    // return response.data
    
    // Mock response
    return Promise.resolve({ success: true, data: null })
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.get('/auth/me')
    // return response.data
    
    // Mock response
    return Promise.resolve({
      success: true,
      data: {
        id: '1',
        username: 'demo',
        email: 'demo@example.com',
        selectedCategories: ['Technology', 'Sports'],
        createdAt: new Date('2023-01-01')
      }
    })
  }
}

// News API
export const newsApi = {
  async getNews(params: PaginationParams): Promise<ApiResponse<{ articles: NewsArticle[]; totalPages: number }>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.get('/news', { params })
    // return response.data
    
    // Mock response - will be replaced with actual API call
    return Promise.resolve({
      success: true,
      data: {
        articles: [],
        totalPages: 1
      }
    })
  },

  async getNewsById(id: number): Promise<ApiResponse<NewsArticle>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.get(`/news/${id}`)
    // return response.data
    
    // Mock response
    return Promise.resolve({
      success: true,
      data: {
        id,
        title: 'Mock Article',
        summary: 'Mock summary',
        category: 'Technology',
        sourceUrl: 'https://example.com',
        date: new Date().toISOString()
      }
    })
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.get('/news/categories')
    // return response.data
    
    // Mock response
    return Promise.resolve({
      success: true,
      data: ['Technology', 'Sports', 'Politics', 'Business', 'Entertainment', 'Health', 'Science', 'World']
    })
  }
}

// User API
export const userApi = {
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.put('/user/profile', userData)
    // return response.data
    
    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            username: 'mockuser',
            email: 'mock@example.com',
            selectedCategories: userData.selectedCategories || [],
            createdAt: new Date('2023-01-01')
          }
        })
      }, 500)
    })
  },

  async updateCategories(categories: string[]): Promise<ApiResponse<User>> {
    // TODO: Uncomment when backend is ready
    // const response = await apiClient.put('/user/categories', { categories })
    // return response.data
    
    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            username: 'mockuser',
            email: 'mock@example.com',
            selectedCategories: categories,
            createdAt: new Date('2023-01-01')
          }
        })
      }, 500)
    })
  }
}

export default apiClient
