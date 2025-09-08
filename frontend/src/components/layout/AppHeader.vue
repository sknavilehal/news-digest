<template>
  <header v-if="!$route.meta.hideNavigation" class="header">
    <div class="header-content">
      <!-- Logo/Brand -->
      <div class="brand">
        <router-link to="/" class="brand-link">
          <h1 class="brand-title">📰 News Digest</h1>
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/settings" class="nav-link" v-if="authStore.isAuthenticated">Settings</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </nav>

      <!-- Auth Section -->
      <div class="auth-section">
        <div v-if="authStore.isAuthenticated" class="user-info">
          <span class="user-name">Welcome, {{ authStore.user?.username }}!</span>
          <button @click="handleLogout" class="btn btn-secondary btn-sm">Logout</button>
        </div>
        <div v-else class="login-section">
          <router-link to="/login" class="btn btn-primary btn-sm">Sign In</router-link>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <button 
      class="mobile-menu-btn md:hidden"
      @click="showMobileMenu = !showMobileMenu"
      :class="{ active: showMobileMenu }"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ active: showMobileMenu }">
      <router-link to="/" class="mobile-nav-link" @click="showMobileMenu = false">Home</router-link>
      <router-link to="/settings" class="mobile-nav-link" v-if="authStore.isAuthenticated" @click="showMobileMenu = false">Settings</router-link>
      <router-link to="/about" class="mobile-nav-link" @click="showMobileMenu = false">About</router-link>
      
      <div class="mobile-auth">
        <div v-if="authStore.isAuthenticated">
          <span class="mobile-user-name">{{ authStore.user?.username }}</span>
          <button @click="handleLogout" class="btn btn-secondary btn-sm">Logout</button>
        </div>
        <div v-else>
          <router-link to="/login" class="btn btn-primary btn-sm" @click="showMobileMenu = false">Sign In</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const showMobileMenu = ref(false)

const handleLogout = () => {
  authStore.logout()
  showMobileMenu.value = false
  router.push('/')
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-title {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: var(--text-primary);
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
  padding: 1rem 2rem;
}

.mobile-menu.active {
  display: block;
}

.mobile-nav-link {
  display: block;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.mobile-nav-link:last-of-type {
  border-bottom: none;
}

.mobile-auth {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
}

.mobile-user-name {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
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
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  max-width: 400px;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions .btn {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }

  .nav,
  .auth-section {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .brand-title {
    font-size: 1.25rem;
  }
}
</style>
