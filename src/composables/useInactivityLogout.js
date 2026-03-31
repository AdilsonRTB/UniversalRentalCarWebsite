import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLanguageAndCurrency } from './useLanguageAndCurrency'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp'

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click'
]

export function useInactivityLogout() {
  const router = useRouter()
  const { t } = useLanguageAndCurrency()
  let inactivityTimer = null
  let checkInterval = null

  const isAuthenticated = () => !!localStorage.getItem('authToken')

  const updateLastActivity = () => {
    if (isAuthenticated()) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())
    }
  }

  const clearSession = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('customerData')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    localStorage.removeItem('vehicle_search_end_date')
    localStorage.removeItem('vehicle_search_start_date')
  }

  const handleInactivityLogout = () => {
    if (!isAuthenticated()) return

    clearSession()
    message.warning(t('session.expiredMessage') || 'Your session has expired due to inactivity. Please log in again.')
    router.push('/')
  }

  const resetTimer = () => {
    if (!isAuthenticated()) return

    updateLastActivity()

    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
    }

    inactivityTimer = setTimeout(() => {
      handleInactivityLogout()
    }, INACTIVITY_TIMEOUT)
  }

  // Check if session already expired (e.g. user left tab open)
  const checkStoredActivity = () => {
    if (!isAuthenticated()) return

    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10)
      if (elapsed >= INACTIVITY_TIMEOUT) {
        handleInactivityLogout()
        return
      }
    }
  }

  // Periodic check for cross-tab logout and elapsed time
  const startPeriodicCheck = () => {
    checkInterval = setInterval(() => {
      if (!isAuthenticated()) {
        // Logged out from another tab
        stopTracking()
        return
      }
      checkStoredActivity()
    }, 60 * 1000) // Check every minute
  }

  const startTracking = () => {
    if (!isAuthenticated()) return

    updateLastActivity()
    resetTimer()
    startPeriodicCheck()

    ACTIVITY_EVENTS.forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true })
    })
  }

  const stopTracking = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }

    ACTIVITY_EVENTS.forEach((event) => {
      document.removeEventListener(event, resetTimer)
    })
  }

  onMounted(() => {
    checkStoredActivity()
    startTracking()
  })

  onUnmounted(() => {
    stopTracking()
  })

  return {
    startTracking,
    stopTracking,
    resetTimer
  }
}
