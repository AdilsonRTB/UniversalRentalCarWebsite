import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api'

// Global authentication state
const isAuthenticated = ref(!!localStorage.getItem('authToken'))
const user = ref(null)
const loading = ref(false)
const error = ref(null)

// Watch for localStorage changes
window.addEventListener('storage', (e) => {
  if (e.key === 'authToken') {
    isAuthenticated.value = !!e.newValue
    if (!e.newValue) {
      user.value = null
    }
  }
})

export function useAuth() {
  const router = useRouter()
  
  // Initialize authentication
  const initAuth = async () => {
    loading.value = true
    error.value = null
    
    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (token && userData) {
        isAuthenticated.value = true
        user.value = JSON.parse(userData)
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (err) {
      console.error('Authentication initialization failed:', err)
      error.value = err.message
      isAuthenticated.value = false
      user.value = null
    } finally {
      loading.value = false
    }
  }

  // Login - redirect to login page
  const login = async () => {
    router.push('/login')
  }

  // Login with credentials (for use in login page)
  const loginWithCredentials = async (email, password, rememberMe = false) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login({ email, password })
      
      // Store authentication data
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('userData', JSON.stringify(response.user))
      
      if (response.customer) {
        localStorage.setItem('customerData', JSON.stringify(response.customer))
      }
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      }
      
      isAuthenticated.value = true
      user.value = response.user
      
      return response
    } catch (err) {
      console.error('Login failed:', err)
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Call logout API if needed
      // await authService.logout()
      
      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('customerData')
      localStorage.removeItem('rememberMe')
      
      isAuthenticated.value = false
      user.value = null
      
      // Redirect to home page
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
      error.value = err.message
      throw err
    }
  }

  // Register - redirect to register page
  const register = async () => {
    router.push('/register')
  }

  // Check if user has specific role
  const hasRole = (role) => {
    const userData = localStorage.getItem('userData')
    if (!userData) return false
    
    try {
      const user = JSON.parse(userData)
      // Since the response doesn't include roles, we can check user type
      if (role === 'customer') return user.is_customer
      // Add other role checks as needed
      return false
    } catch {
      return false
    }
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.some(role => hasRole(role))
  }

  // Get authorization header for API calls
  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return token ? `Bearer ${token}` : null
  }

  // Computed properties
  const userRole = computed(() => {
    const userData = localStorage.getItem('userData')
    if (!userData) return null
    
    try {
      const user = JSON.parse(userData)
      if (user.is_customer) return 'customer'
      // Add other role mappings as needed
      return 'user'
    } catch {
      return null
    }
  })

  const isAdmin = computed(() => {
    return hasRole('admin')
  })

  const isOwner = computed(() => {
    return hasRole('owner')
  })

  const isClient = computed(() => {
    return hasRole('customer')
  })

  const userName = computed(() => {
    const customerData = localStorage.getItem('customerData')
    if (customerData) {
      try {
        const customer = JSON.parse(customerData)
        return `${customer.first_name} ${customer.last_name}`.trim()
      } catch (error) {
        // Ignore parsing errors
      }
    }
    
    return user.value?.username || user.value?.email || ''
  })

  const userEmail = computed(() => {
    return user.value?.email || ''
  })

  return {
    // State
    isAuthenticated,
    user,
    loading,
    error,
    
    // Actions
    initAuth,
    login,
    loginWithCredentials,
    logout,
    register,
    
    // Role checks
    hasRole,
    hasAnyRole,
    
    // Computed
    userRole,
    isAdmin,
    isOwner,
    isClient,
    userName,
    userEmail,
    
    // Utils
    getAuthHeader
  }
}
