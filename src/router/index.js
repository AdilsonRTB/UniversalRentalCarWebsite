import { createRouter, createWebHistory } from 'vue-router'
import Login from '../auth/LoginPage.vue'
import Register from '../auth/RegisterPage2.vue'
import ForgotPassword from '../auth/ForgotPasswordPage.vue'
import VehicleSearch from '../views/VehicleSearch.vue'
import VehicleDetails from '../views/VehicleDetails.vue'
import OwnerDashboard from '../views/OwnerDashboard.vue'
import BookingStatus from '@/components/BookingStatus.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: VehicleSearch
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/vehicle/:id',
    name: 'VehicleDetails',
    component: VehicleDetails,
    props: true
  },
  {
    path: '/owner-dashboard',
    name: 'OwnerDashboard',
    component: OwnerDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/booking-status',
    name: 'BookingStatus',
    component: BookingStatus,
  },
]

const router = createRouter({
  history: createWebHistory('/universal-rent-a-car/'),
  routes
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  // Routes that don't require authentication
  const publicRoutes = ['Home', 'Login', 'Register', 'ForgotPassword', 'VehicleSearch', 'VehicleDetails', 'BookingStatus']
  
  console.log(`[Router] Navigating to: ${to.name} (${to.path}) from: ${from.name || 'initial'} (${from.path || 'initial'})`)
  
  try {
    // Check if user is authenticated with local storage token
    const token = localStorage.getItem('authToken')
    const isAuthenticated = !!token
    
    console.log(`[Router] User authenticated: ${isAuthenticated}`)

    // If user is authenticated and trying to access login/register, redirect to dashboard
    if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
      console.log('[Router] Redirecting authenticated user from login/register to dashboard')
      next('/dashboard')
      return
    }
    
    // Check if route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        console.log('[Router] Unauthenticated user trying to access protected route, redirecting to login')
        next('/login')
        return
      }
      
      console.log('[Router] Authenticated user accessing protected route')
      next()
    } else if (publicRoutes.includes(to.name)) {
      console.log('[Router] Public route access granted')
      next()
    } else {
      console.log('[Router] Unknown route, redirecting to home')
      next('/')
    }
  } catch (error) {
    console.error('[Router] Navigation guard error:', error)
    
    // If there's an error and it's a protected route, redirect to login
    if (to.matched.some(record => record.meta.requiresAuth)) {
      console.log('[Router] Error on protected route, redirecting to login')
      next('/login')
    } else {
      console.log('[Router] Error on public route, allowing access')
      next()
    }
  }
})

export default router

