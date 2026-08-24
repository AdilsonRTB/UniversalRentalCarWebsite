import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLanguageAndCurrency } from './useLanguageAndCurrency'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds
const LAST_ACTIVITY_KEY = 'lastActivityTimestamp'
const SESSION_EXPIRY_KEY = 'sessionExpiryTimestamp'

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
      const now = Date.now()
      const expiryTime = now + INACTIVITY_TIMEOUT
      localStorage.setItem(LAST_ACTIVITY_KEY, now.toString())
      localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString())
    }
  }

  const clearSession = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('customerData')
    localStorage.removeItem('rememberMe')
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    localStorage.removeItem(SESSION_EXPIRY_KEY)
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

  // Check if session already expired (e.g. user left tab open or closed browser)
  const checkStoredActivity = () => {
    if (!isAuthenticated()) return

    // Primeiro verifica o timestamp de expiração absoluto
    const expiryTimestamp = localStorage.getItem(SESSION_EXPIRY_KEY)
    if (expiryTimestamp) {
      const expiry = parseInt(expiryTimestamp, 10)
      if (Date.now() >= expiry) {
        handleInactivityLogout()
        return
      }
    }

    // Fallback: verifica a última atividade (caso o SESSION_EXPIRY_KEY não exista)
    const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity, 10)
      if (elapsed >= INACTIVITY_TIMEOUT) {
        handleInactivityLogout()
        return
      }
    } else {
      // Se não há registro de atividade, define um agora
      updateLastActivity()
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

    // Adicionar listener para quando o usuário volta à aba/janela
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Verificar se a sessão expirou enquanto estava ausente
      checkStoredActivity()
      if (isAuthenticated()) {
        resetTimer()
      }
    }
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

    document.removeEventListener('visibilitychange', handleVisibilityChange)
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
