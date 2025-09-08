export interface NewsArticle {
  id: number
  title: string
  summary: string
  category: string
  sourceUrl: string
  date: string
  imageUrl?: string
}

export interface User {
  id: string
  username: string
  email: string
  selectedCategories: string[]
  createdAt: Date
}

export interface LoginCredentials {
  email: string // Can be email or username
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  isSignedIn: boolean
  user: User | null
}

export interface NewsState {
  articles: NewsArticle[]
  currentPage: number
  totalPages: number
  loading: boolean
  error: string | null
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  categories?: string[]
}

export const NEWS_CATEGORIES = [
  'Technology',
  'Sports',
  'Politics',
  'Business',
  'Entertainment',
  'Health',
  'Science',
  'World'
] as const

export type NewsCategory = typeof NEWS_CATEGORIES[number]
