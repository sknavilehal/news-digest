import { defineStore } from 'pinia'
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '@/types'

// Mock users database (in real app, this would be backend)
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'demo123',
    selectedCategories: ['Technology', 'Science'],
    createdAt: new Date('2023-01-01')
  }
]

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isSignedIn: false,
    user: null
  }),

  getters: {
    getCurrentUser: (state) => state.user,
    getUserCategories: (state) => state.user?.selectedCategories || [],
    isAuthenticated: (state) => state.isSignedIn && state.user !== null
  },

  actions: {
    // Mock login - in real app, this would call an API
    async login(credentials: LoginCredentials): Promise<boolean> {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user exists (by email or username)
        const foundUser = mockUsers.find(
          u => (u.email === credentials.email || u.username === credentials.email) && 
               u.password === credentials.password
        )
        
        if (!foundUser) {
          throw new Error('Invalid email/username or password')
        }
        
        // Remove password from user object
        const { password, ...userWithoutPassword } = foundUser
        this.user = userWithoutPassword
        this.isSignedIn = true
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('authState', JSON.stringify({
          isSignedIn: true,
          user: userWithoutPassword
        }))
        
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    // Mock registration - in real app, this would call an API
    async register(credentials: RegisterCredentials): Promise<boolean> {
      try {
        // Validate passwords match
        if (credentials.password !== credentials.confirmPassword) {
          throw new Error('Passwords do not match')
        }

        // Validate password length
        if (credentials.password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Check if user already exists
        const existingUser = mockUsers.find(
          u => u.email === credentials.email || u.username === credentials.username
        )
        
        if (existingUser) {
          if (existingUser.email === credentials.email) {
            throw new Error('A user with this email already exists')
          } else {
            throw new Error('A user with this username already exists')
          }
        }
        
        // Create new user
        const newUser: User & { password: string } = {
          id: Date.now().toString(),
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          selectedCategories: ['Technology'], // Default category
          createdAt: new Date()
        }
        
        // Add to mock database
        mockUsers.push(newUser)
        
        // Auto-login after registration
        const { password, ...userWithoutPassword } = newUser
        this.user = userWithoutPassword
        this.isSignedIn = true
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('authState', JSON.stringify({
          isSignedIn: true,
          user: userWithoutPassword
        }))
        
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },

    logout() {
      this.isSignedIn = false
      this.user = null
      localStorage.removeItem('authState')
    },

    // Update user categories
    async updateCategories(categories: string[]): Promise<boolean> {
      try {
        if (!this.user) return false

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.user.selectedCategories = [...categories]
        
        // Update localStorage
        localStorage.setItem('authState', JSON.stringify({
          isSignedIn: this.isSignedIn,
          user: this.user
        }))
        
        // Update in mock database
        const userIndex = mockUsers.findIndex(u => u.id === this.user?.id)
        if (userIndex !== -1) {
          mockUsers[userIndex].selectedCategories = [...categories]
        }
        
        return true
      } catch (error) {
        console.error('Failed to update categories:', error)
        return false
      }
    },

    // Initialize auth state from localStorage
    initializeAuth() {
      const stored = localStorage.getItem('authState')
      if (stored) {
        try {
          const authState = JSON.parse(stored)
          this.isSignedIn = authState.isSignedIn
          this.user = authState.user
        } catch (error) {
          console.error('Failed to parse stored auth state:', error)
          localStorage.removeItem('authState')
        }
      }
    },

    // Clear any auth errors
    clearError() {
      // This would be implemented if we had error state
    }
  }
})
