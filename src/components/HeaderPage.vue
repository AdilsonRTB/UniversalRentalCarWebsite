<template>
  <div class="hero-header">
    <div class="hero-nav-container">
      <div class="hero-logo">
        <router-link to="/" class="hero-logo-link">
          <img
            :src="logo"
            style="max-width: 180px; height: auto; max-height: 60px; object-fit: contain;"
          />
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="desktop-nav">
        <div class="hero-auth">
          <div class="hero-auth-buttons" v-if="isAuthenticated">
            <a-button class="hero-auth-btn primary" type="link" @click="navigateTo('/owner-dashboard?tab=my-bookings')">
                <CarOutlined />
                Minhas Reservas
              </a-button>
          </div>
          <div class="hero-auth-buttons" v-if="!isAuthenticated">
            <a-button class="hero-auth-btn primary" type="link" @click="navigateTo('/booking-status')">
                <CarOutlined />
                Minhas Reservas
              </a-button>
          </div>
          <div v-if="!isAuthenticated" class="hero-auth-buttons">
            <a-button class="hero-auth-btn primary" @click="login" :loading="loading" type="link">
              <UserOutlined />
              Login | Registar
            </a-button>
          </div>

          <div v-else>
            <a-button class="hero-auth-btn primary" type="link" @click="navigateTo('/owner-dashboard?tab=overview')">
                <UserOutlined />
                {{ customer?.first_name }} {{ customer?.last_name }}

              </a-button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <div class="mobile-menu-container">
        <a-button 
          type="text" 
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
        >
          <MenuOutlined v-if="!mobileMenuVisible" />
          <CloseOutlined v-else />
        </a-button>
      </div>

      <!-- Mobile Menu Overlay -->
      <div v-if="mobileMenuVisible" class="mobile-menu-overlay" @click="toggleMobileMenu">
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <div class="mobile-logo">
              <img
                :src="logo"
                style="max-width: 180px; height: auto; max-height: 60px; object-fit: contain;"
              />
            </div>
            <a-button type="text" @click="toggleMobileMenu" class="mobile-close-btn">
              <CloseOutlined />
            </a-button>
          </div>

          <div class="mobile-menu-content">
            <!-- Language Selector Mobile -->
            <div class="mobile-section">
              <h4>Idioma</h4>
              <a-select  size="large"
                v-model:value="currentLanguage" 
                @change="handleMobileLanguageChange"
                class="mobile-language-select"
              >
                <a-select-option v-for="lang in languages" :key="lang.code" :value="lang.code">
                  {{ lang.flag }} {{ lang.name }}
                </a-select-option>
              </a-select>
            </div>

            <!-- Auth Section Mobile -->
            <div class="mobile-section">
              <div v-if="!isAuthenticated" class="mobile-menu-items">
                <a-button block class="mobile-menu-item" @click="navigateTo('/booking-status')">
                    <CalendarOutlined />
                    Minhas Reservas
                  </a-button>
                <a-button  class="mobile-menu-item" @click="handleMobileLogin" :loading="loading">
                  <UserOutlined />
                  Login | Registar
                </a-button>
              </div>
              <div v-else class="mobile-user-menu">
                <h4>Minha Conta</h4>
                <div class="mobile-menu-items">
                  <a-button block class="mobile-menu-item" @click="navigateTo('/owner-dashboard?tab=overview')">
                    <DashboardOutlined />
                    {{ t('nav.dashboard') }}
                  </a-button>
                  <!--a-button block class="mobile-menu-item" @click="navigateTo('/owner-dashboard?tab=notifications')">
                    <BellOutlined />
                    Notificações
                  </!--a-button>
                  <a-button-- block class="mobile-menu-item" @click="navigateTo('/owner-dashboard?tab=messages')">
                    <MessageOutlined />
                    Mensagens
                  </a-button-->
                  <a-button block class="mobile-menu-item" @click="navigateTo('/owner-dashboard?tab=my-bookings')">
                    <CalendarOutlined />
                    Minhas Reservas
                  </a-button>
                  <a-button block class="mobile-menu-item" @click="navigateTo('/owner-dashboard?tab=profile')">
                    <UserOutlined />
                    Perfil
                  </a-button>
                  <a-button block class="mobile-menu-item logout" @click="handleMobileLogout" danger>
                    <LogoutOutlined />
                    {{ t('nav.logout') }}
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginPageModal 
      :visible="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
      @register="handleRegister"
    />

  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLanguageAndCurrency } from '../composables/useLanguageAndCurrency'
import { 
  CarOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  //BellOutlined,
  //MessageOutlined,
  CalendarOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons-vue'
import {authService} from '../services/api'
import LoginPageModal from '../auth/LoginPageModal.vue'
import logo from '../assets/logo2.png'

const route = useRoute()

const {
  currentLanguage,
  languages,
  changeLanguage,
  t,
  //getLanguageByCode
} = useLanguageAndCurrency()

const router = useRouter()

const customer = ref(null)

const isAuthenticated = ref(!!localStorage.getItem('authToken') || false)

const getCustomerData = async () => {
  loading.value = true
  try {
    const response = await authService.me()
    customer.value = response.data
    console.log('[OwnerDashboard] Fetched customer data:', customer.value)
  } catch (error) {
    console.error('[OwnerDashboard] Error fetching customer data:', error)
    message.error('Erro ao carregar dados do cliente.')
  } finally {
    loading.value = false
  }
}

watch(() => localStorage.getItem('authToken'), (newToken) => {
  isAuthenticated.value = !!newToken
})

onMounted(() => {
  if (isAuthenticated.value) {
    getCustomerData()
  }
})

const login = async () => {
  showLoginModal.value = true
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userRole')
  isAuthenticated.value = false
  message.success('Logout realizado com sucesso!')
  router.push('/')
}

const selectedKeys = ref(['home'])
const mobileMenuVisible = ref(false)
const loading = ref(false)
const showLoginModal = ref(false)

/*const handleLanguageChange = ({ key }) => {
  changeLanguage(key)
}

const handleLogout = async () => {
  await logout()
  mobileMenuVisible.value = false
}*/

// Mobile menu functions
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

const handleMobileLanguageChange = (value) => {
  changeLanguage(value)
}

const handleMobileLogin = () => {
  mobileMenuVisible.value = false
  showLoginModal.value = true
}

const handleLoginSuccess = () => {
  isAuthenticated.value = true
  getCustomerData()
  message.success('Login realizado com sucesso!')
}

const handleRegister = () => {
  router.push('/register')
}

const handleMobileLogout = async () => {
  await logout()
  mobileMenuVisible.value = false
}

const navigateTo = (path) => {
  mobileMenuVisible.value = false
  router.push(path)
}

watch(route, (newRoute) => {
  if (newRoute.path === '/') {
    selectedKeys.value = ['home']
  } else if (newRoute.path === '/search') {
    selectedKeys.value = ['search']
  } else if (newRoute.path === '/vehicles') {
    selectedKeys.value = ['vehicles']
  } else if (newRoute.path === '/about') {
    selectedKeys.value = ['about']
  }else if (newRoute.path === '/booking-status') {
    selectedKeys.value = ['booking-status']
  }
  mobileMenuVisible.value = false
})
</script>

<style scoped>
.hero-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  padding: 0;
  background: linear-gradient(90deg,#3A1C71 0%,#FDBB2D 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;


}

.hero-logo {
  flex-shrink: 0;
}

.hero-logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.hero-logo-link:hover {
  color: white;
  transform: scale(1.05);
}

.hero-logo-icon {
  font-size: 28px;
  color: #FE7743;
}

.hero-logo-text {
  color: white;
}

.desktop-nav {
  flex: 1;
  display: flex;
  justify-content: right;
  margin: 0 0px;
}

.hero-menu {
  background: transparent !important;
  border: none !important;
  height: 0px;
  line-height: 0px;
}

.hero-menu .ant-menu-item {
  border: none !important;
  margin: 0 8px;
  padding: 0;
  background: transparent !important;
}

.hero-menu .ant-menu-item::after {
  display: none;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9) !important;
  text-decoration: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  color: #FE7743 !important;
  background: rgba(254, 119, 67, 0.1);
}

.hero-auth {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.desktop-nav {
  display: flex;
}

.mobile-menu-container {
  display: flex;
}

.mobile-menu-btn {
  color: white !important;
  border: none !important;
  background: transparent !important;
  font-size: 20px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2000;
  display: flex;
  justify-content: right;
}

.mobile-menu {
  background: #ffffff;
  width: 320px;
  height: 100vh;
  padding: 0;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

.mobile-menu-header {
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;
  font-size: 18px;
  font-weight: 700;
}

.mobile-logo .anticon {
  color: #667eea;
}

.mobile-close-btn {
  color: #333 !important;
  border: none !important;
  background: transparent !important;
  font-size: 18px;
  padding: 8px;
}

.mobile-menu-content {
  padding: 20px;
}

.mobile-section {
  margin-bottom: 30px;
}

.mobile-section h4 {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-language-select {
  width: 100%;
}

.mobile-language-select .ant-select-selector {
  background: #f8f9fa !important;
  border: 1px solid #e9ecef !important;
  color: #333 !important;
}

.mobile-auth {
  padding: 0;
}

.mobile-menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-menu-item {
  color: #333 !important;
  border: 1px solid #e9ecef !important;
  background: #f8f9fa !important;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-item:hover {
  background: #e9ecef !important;
  border-color: #667eea !important;
  color: #667eea !important;
}

.mobile-menu-item.logout {
  background: #fff5f5 !important;
  border-color: #fecaca !important;
  color: #dc2626 !important;
}

.mobile-menu-item.logout:hover {
  background: #fef2f2 !important;
  border-color: #f87171 !important;
  color: #dc2626 !important;
}

.settings-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-dropdown {
  margin-right: 8px;
}

.hero-lang-btn,
.hero-currency-btn,
.hero-user-btn {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  border-radius: 8px;
  height: 40px;
  padding: 0 12px;
  transition: all 0.3s ease;
}

.hero-lang-btn:hover,
.hero-currency-btn:hover,
.hero-user-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: white !important;
}

.hero-dropdown-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  min-width: 280px;
}

.hero-dropdown-menu .ant-menu-item-group-title {
  color: #666;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px 8px 16px;
  margin: 0;
}

.hero-dropdown-menu .ant-menu-item {
  padding: 12px 16px !important;
  margin: 0 !important;
  border-radius: 0 !important;
  transition: all 0.3s ease;
}

.hero-dropdown-menu .ant-menu-item:hover {
  background: rgba(102, 126, 234, 0.1) !important;
}

.hero-dropdown-menu .ant-menu-item a {
  display: flex;
  align-items: center;
  color: #333 !important;
  font-weight: 500;
  transition: all 0.3s ease;
}

.hero-dropdown-menu .ant-menu-item:hover a {
  color: #667eea !important;
}

.hero-dropdown-menu .ant-menu-divider {
  margin: 8px 0;
  background: rgba(0, 0, 0, 0.1);
}

.lang-option,
.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 16px;
}

.hero-auth-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-auth-btn {
  display: flex;
  align-items: center;
  -gap: 8px;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
  font-size: medium;
  transition: all 0.3s ease;
}

.hero-name-btn {
  display: flex;
  align-items: center;
  -gap: 8px;
  height: 40px;
  -border-radius: 8px;
  font-weight: 600;
  font-size: medium;
  color: white !important;
  transition: all 0.3s ease;
  background: transparent !important;
}

.hero-auth-btn.secondary {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background: transparent !important;
}

.hero-auth-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
  transform: translateY(-2px);
}

.hero-auth-btn.primary {
  -background: #FE7743 !important;
  border: none !important;
  color: white !important;
}

.hero-auth-btn.primary:hover {
  -background: #e06a3c !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(254, 119, 67, 0.4);
}

.hero-mobile-menu {
  display: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.hero-mobile-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-icon {
  font-size: 24px;
  color: white;
}

.hero-mobile-drawer :deep(.ant-drawer-header) {
  background: #1e293b;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-mobile-drawer :deep(.ant-drawer-body) {
  padding: 0;
  background: #1e293b;
}

.mobile-nav-menu {
  background: transparent !important;
  color: white;
}

.mobile-nav-menu .ant-menu-item {
  color: white !important;
  padding: 16px 24px !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.mobile-nav-menu .ant-menu-item:hover {
  background: rgba(254, 119, 67, 0.1) !important;
  color: #FE7743 !important;
}

.mobile-nav-menu .ant-menu-item a {
  color: inherit !important;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.mobile-auth-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-weight: 500;
}

.mobile-nav-menu .ant-menu-divider {
  background: rgba(255, 255, 255, 0.1);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-nav-container {
    padding: 0 20px;
  }
}

@media (max-width: 1024px) {
  .hero-nav-container {
    padding: 0 16px;
  }
  
  .hero-logo-text {
    font-size: 18px;
  }
  
  .hero-auth {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-container {
    display: block;
  }
  
  .hero-nav-container {
    padding: 0 16px;
    height: 70px;
  }
  
  .hero-logo-text {
    font-size: 16px;
  }
  
  .hero-logo-icon {
    font-size: 22px;
  }
  
  .mobile-menu {
    width: 300px;
  }
}

@media (max-width: 640px) {
  .hero-nav-container {
    padding: 0 12px;
    height: 65px;
  }
  
  .mobile-menu {
    width: 280px;
  }
  
  .mobile-menu-content {
    padding: 16px;
  }
  
  .mobile-section {
    margin-bottom: 25px;
  }
  
  .mobile-menu-item {
    height: 45px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .hero-logo-link {
    font-size: 16px;
  }
  
  .hero-logo-icon {
    font-size: 20px;
  }

  .hero-nav-container {
    height: 60px;
    padding: 0 12px;
  }
  
  .hero-logo-text {
    display: none;
  }
  
  .mobile-menu {
    width: 100vw;
  }
  
  .mobile-menu-overlay {
    justify-content: center;
  }
  
  .mobile-section h4 {
    font-size: 14px;
  }
  
  .mobile-menu-item {
    height: 42px;
    font-size: 13px;
    gap: 10px;
  }
}

@media (max-width: 360px) {
  .hero-nav-container {
    height: 55px;
    padding: 0 8px;
  }
  
  .mobile-menu-content {
    padding: 12px;
  }
  
  .mobile-section {
    margin-bottom: 20px;
  }
}
</style>
