import axios from 'axios'

// Base URL for authentication API
const AUTH_API_BASE_URL = process.env.VUE_APP_AUTH_API_URL || 'http://localhost:8080/api/auth'

// Create axios instance for auth requests
const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await authApi.post('/refresh-token', {
            refreshToken: refreshToken
          })
          
          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('authToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          return authApi(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        authService.logout()
      }
    }
    
    return Promise.reject(error)
  }
)

/**
 * Authentication Service
 * Handles user login, registration, and authentication state
 */
class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Remember user login
   * @returns {Promise<Object>} User data and tokens
   */
  async login(email, password, rememberMe = false) {
    try {
      const response = await authApi.post('/login', {
        email,
        password,
        rememberMe
      })
      
      const { user, accessToken, refreshToken } = response.data
      
      // Store tokens
      localStorage.setItem('authToken', accessToken)
      if (rememberMe && refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // Store user data
      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('authMethod', 'custom') // Distinguish from Keycloak
      
      return { user, accessToken, refreshToken }
      
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao fazer login')
    }
  }
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registered user data
   */
  async register(userData) {
    try {
      const response = await authApi.post('/register', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        licenseNumber: userData.licenseNumber,
        licenseValidity: userData.licenseValidity,
        address: {
          location: userData.address.location,
          postalCode: userData.address.postalCode,
          city: userData.address.city
        }
      })
      
      return response.data
      
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message)
      throw new Error(error.response?.data?.message || 'Erro ao criar conta')
    }
  }
  
  /**
   * Logout current user
   */
  async logout() {
    try {
      // Call backend logout endpoint
      await authApi.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('authMethod')
    }
  }
  
  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    try {
      await authApi.post('/forgot-password', { email })
    } catch (error) {
      console.error('Password reset request error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao solicitar recuperação de palavra-passe')
    }
  }
  
  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async resetPassword(token, newPassword) {
    try {
      await authApi.post('/reset-password', {
        token,
        newPassword
      })
    } catch (error) {
      console.error('Password reset error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao redefinir palavra-passe')
    }
  }
  
  /**
   * Get current user data
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('currentUser')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    const token = localStorage.getItem('authToken')
    const authMethod = localStorage.getItem('authMethod')
    
    return isAuth && token && authMethod === 'custom'
  }
  
  /**
   * Get authentication token
   * @returns {string|null} Auth token
   */
  getToken() {
    return localStorage.getItem('authToken')
  }
  
  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      const response = await authApi.put('/profile', userData)
      
      // Update stored user data
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      
      return response.data
      
    } catch (error) {
      console.error('Profile update error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao atualizar perfil')
    }
  }
  
  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(currentPassword, newPassword) {
    try {
      await authApi.put('/change-password', {
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.error('Password change error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao alterar palavra-passe')
    }
  }
  
  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise<void>}
   */
  async verifyEmail(token) {
    try {
      await authApi.post('/verify-email', { token })
    } catch (error) {
      console.error('Email verification error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao verificar e-mail')
    }
  }
  
  /**
   * Resend verification email
   * @returns {Promise<void>}
   */
  async resendVerificationEmail() {
    try {
      await authApi.post('/resend-verification')
    } catch (error) {
      console.error('Resend verification error:', error)
      throw new Error(error.response?.data?.message || 'Erro ao reenviar e-mail de verificação')
    }
  }
  
  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} Email exists status
   */
  async checkEmailExists(email) {
    try {
      const response = await authApi.post('/check-email', { email })
      return response.data.exists
    } catch (error) {
      console.error('Email check error:', error)
      return false
    }
  }
  
  /**
   * Validate driving license
   * @param {string} licenseNumber - License number
   * @param {string} licenseValidity - License validity date
   * @returns {Promise<boolean>} Validation status
   */
  async validateDrivingLicense(licenseNumber, licenseValidity) {
    try {
      const response = await authApi.post('/validate-license', {
        licenseNumber,
        licenseValidity
      })
      return response.data.valid
    } catch (error) {
      console.error('License validation error:', error)
      return false
    }
  }
  
  /**
   * Get user permissions/roles
   * @returns {Promise<Array>} User roles
   */
  async getUserRoles() {
    try {
      const response = await authApi.get('/user-roles')
      return response.data.roles
    } catch (error) {
      console.error('Get user roles error:', error)
      return []
    }
  }
  
  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Has role status
   */
  hasRole(role) {
    const user = this.getCurrentUser()
    return user?.roles?.includes(role) || false
  }
}

// Create and export single instance
const authService = new AuthService()
export default authService

// Export the class for testing or multiple instances if needed
export { AuthService }