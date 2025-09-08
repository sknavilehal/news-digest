<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">
          {{ isLoginMode ? 'Welcome Back' : 'Create Account' }}
        </h1>
        <p class="auth-subtitle">
          {{ isLoginMode ? 'Sign in to your account' : 'Join News Digest today' }}
        </p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- Username field (register only) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-control"
            placeholder="Enter your username"
            required
            :disabled="loading"
            minlength="3"
            maxlength="20"
          />
          <small class="form-help">3-20 characters, letters and numbers only</small>
        </div>
        
        <!-- Email field -->
        <div class="form-group">
          <label for="email" class="form-label">
            {{ isLoginMode ? 'Email or Username' : 'Email Address' }}
          </label>
          <input
            id="email"
            v-model="form.email"
            :type="isLoginMode ? 'text' : 'email'"
            class="form-control"
            :placeholder="isLoginMode ? 'Enter email or username' : 'Enter your email address'"
            required
            :disabled="loading"
          />
        </div>
        
        <!-- Password field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Enter your password"
              required
              :disabled="loading"
              :minlength="isLoginMode ? 1 : 6"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
              :disabled="loading"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <small v-if="!isLoginMode" class="form-help">Minimum 6 characters</small>
        </div>
        
        <!-- Confirm Password field (register only) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <div class="password-input-container">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirm your password"
              required
              :disabled="loading"
              minlength="6"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
              :disabled="loading"
            >
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <small v-if="form.confirmPassword && form.password !== form.confirmPassword" class="form-error">
            Passwords do not match
          </small>
        </div>
        
        <!-- Error message -->
        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
        
        <!-- Submit button -->
        <button 
          type="submit" 
          class="btn btn-primary btn-lg submit-btn"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="loading"></span>
          {{ loading ? (isLoginMode ? 'Signing in...' : 'Creating account...') : (isLoginMode ? 'Sign In' : 'Create Account') }}
        </button>
      </form>
      
      <!-- Mode switch -->
      <div class="auth-switch">
        <p>
          {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
          <button 
            type="button" 
            class="link-btn"
            @click="toggleMode"
            :disabled="loading"
          >
            {{ isLoginMode ? 'Sign up' : 'Sign in' }}
          </button>
        </p>
      </div>
      
      <!-- Demo credentials -->
      <div class="demo-info">
        <h4>Demo Account</h4>
        <p><strong>Email:</strong> demo@example.com</p>
        <p><strong>Username:</strong> demo</p>
        <p><strong>Password:</strong> demo123</p>
        <button 
          type="button" 
          class="btn btn-secondary btn-sm"
          @click="fillDemoCredentials"
          :disabled="loading"
        >
          Use Demo Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { LoginCredentials, RegisterCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const isLoginMode = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const isFormValid = computed(() => {
  if (isLoginMode.value) {
    return form.value.email.trim() && form.value.password.trim()
  } else {
    return (
      form.value.username.trim().length >= 3 &&
      form.value.email.trim() &&
      form.value.password.length >= 6 &&
      form.value.password === form.value.confirmPassword
    )
  }
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  clearForm()
  clearError()
}

const clearForm = () => {
  form.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
  showPassword.value = false
  showConfirmPassword.value = false
}

const clearError = () => {
  error.value = ''
}

const fillDemoCredentials = () => {
  form.value.email = 'demo@example.com'
  form.value.password = 'demo123'
  if (!isLoginMode.value) {
    form.value.username = 'demo'
    form.value.confirmPassword = 'demo123'
  }
  clearError()
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  clearError()

  try {
    if (isLoginMode.value) {
      const credentials: LoginCredentials = {
        email: form.value.email.trim(),
        password: form.value.password
      }
      await authStore.login(credentials)
    } else {
      const credentials: RegisterCredentials = {
        username: form.value.username.trim(),
        email: form.value.email.trim(),
        password: form.value.password,
        confirmPassword: form.value.confirmPassword
      }
      await authStore.register(credentials)
    }
    
    // Redirect to home page on success
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

// Clear error when form changes
watch(() => form.value, clearError, { deep: true })
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 440px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-control {
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control:disabled {
  background-color: var(--light-gray);
  cursor: not-allowed;
  opacity: 0.7;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.125rem;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.password-toggle:hover:not(:disabled) {
  color: var(--text-primary);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-help {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.form-error {
  font-size: 0.75rem;
  color: var(--danger-color);
  font-weight: 500;
}

.submit-btn {
  margin-top: 0.5rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.auth-switch {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
}

.auth-switch p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
}

.link-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  padding: 0;
  margin-left: 0.25rem;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.link-btn:hover:not(:disabled) {
  color: var(--primary-hover);
}

.link-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-info {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.demo-info h4 {
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-info p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.demo-info .btn {
  margin-top: 0.75rem;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-container {
    padding: 1rem 0.5rem;
  }
  
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-title {
    font-size: 1.5rem;
  }
}
</style>
