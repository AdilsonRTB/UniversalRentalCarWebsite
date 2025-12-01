<template>
  <a-layout id="app">

    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
    
    <a-layout-footer v-if="!isAuthPage" class="footer-modern">
      <div class="footer-background-pattern"></div>
      <div class="footer-container-modern">
        <!-- Main Footer Content -->
        <div class="footer-main-content">
          <a-row :gutter="[40, 40]">
            <!-- Company Info -->
            <a-col :xs="24" :lg="8">
              <div class="footer-section-modern company-section">
                <div class="company-header">
                  <div class="logo-footer-modern">
                    <img
                        :src="logo"
                        style="max-width: 180px; height: auto; max-height: 60px; object-fit: contain;"
                      />
                    <!--span class="logo-text-modern">Universal Rent-a-Car</!--span-->
                  </div>
                  <div class="company-tagline">
                    Conectando você ao veículo perfeito
                  </div>
                </div>
                <p class="footer-description-modern">
                  {{ t('footer.description') }}
                </p>
                <div class="social-media-modern">
                  <h4>{{ t('footer.followUs') }}</h4>
                  <div class="social-links-modern">
                    <a href="www.facebook.com" class="social-link-modern facebook" aria-label="Facebook">
                      <FacebookOutlined />
                    </a>
                    <a href="www.instagram.com" class="social-link-modern instagram" aria-label="Instagram">
                      <InstagramOutlined />
                    </a>
                  </div>
                </div>
              </div>
            </a-col>
            
            <!-- Quick Links -->
            <a-col :xs="12" :lg="4">
              <div class="footer-section-modern">
                <h3 class="footer-title-modern">{{ t('footer.services') }}</h3>
                <ul class="footer-links-modern">
                  <li><router-link to="/search">{{ t('footer.carRental') }}</router-link></li>
                  <li><router-link to="/search?type=motorcycle">{{ t('footer.motorcycleRental') }}</router-link></li>
                  <li><router-link to="/search?type=van">{{ t('footer.vanRental') }}</router-link></li>
                  <li><router-link to="/search?type=truck">{{ t('footer.truckRental') }}</router-link></li>
                  <li><router-link to="/register?type=owner">Minhas Reservas</router-link></li>
                </ul>
              </div>
            </a-col>

            <!-- Support -->
            <a-col :xs="12" :lg="4">
              <div class="footer-section-modern">
                <h3 class="footer-title-modern">{{ t('footer.support') }}</h3>
                <ul class="footer-links-modern">
                  <li><router-link to="/help">{{ t('footer.helpCenter') }}</router-link></li>
                  <li><router-link to="/faq">{{ t('footer.faq') }}</router-link></li>
                  <li><router-link to="/terms">{{ t('footer.termsOfUse') }}</router-link></li>
                  <li><router-link to="/privacy">{{ t('footer.privacyPolicy') }}</router-link></li>
                  <li><router-link to="/insurance">{{ t('footer.insurance') }}</router-link></li>
                </ul>
              </div>
            </a-col>
            <a-col :xs="12" :lg="4">
              <div class="footer-section-modern">
                <h3 class="footer-title-modern">Contatos</h3>
                <ul class="footer-links-modern">
                  <li><router-link to="/email"><MailOutlined /> universal@gmail.com</router-link></li>
                  <li><router-link to="/phone"><WhatsAppOutlined /> (+231) 9999993</router-link></li>
                </ul>
              </div>
            </a-col>
          </a-row>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom-modern">
          <div class="footer-bottom-content">
            <div class="copyright-section">
              <p class="copyright-modern">
                © {{ currentYear }} Universal Rent-a-Car. Todos os direitos reservados.
              </p>
            </div>
            <div class="payment-section">
              <span class="payment-label">{{ t('footer.paymentMethods') }}</span>
              <div class="payment-icons-modern">
                <div class="payment-icon-wrapper">
                  <CreditCardOutlined />
                </div>
                <div class="payment-icon-wrapper">
                  <BankOutlined />
                </div>
                <div class="payment-icon-wrapper">
                  <PayCircleOutlined />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import {
  FacebookOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  MailOutlined,
  CreditCardOutlined,
  BankOutlined,
  PayCircleOutlined
} from '@ant-design/icons-vue'
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageAndCurrency } from './composables/useLanguageAndCurrency'
import logo from './assets/logo2.png'

const route = useRoute()

// Language and Currency
const {
  t,
} = useLanguageAndCurrency()

// Check if current route is an auth page (login, register, forgot-password)
const isAuthPage = computed(() => {
  const authPages = ['/login', '/register', '/forgot-password', '/booking-status']
  return authPages.includes(route.path)
})



const selectedKeys = ref(['home'])
const mobileMenuVisible = ref(false)
/*const newsletterEmail = ref('')
const newsletterLoading = ref(false)*/

const currentYear = computed(() => new Date().getFullYear())


/*const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) {
    return
  }
  
  newsletterLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message
    console.log('Newsletter subscription successful for:', newsletterEmail.value)
    newsletterEmail.value = ''
    
    // You can replace this with actual API call
    // await newsletterService.subscribe(newsletterEmail.value)
    
  } catch (error) {
    console.error('Newsletter subscription failed:', error)
  } finally {
    newsletterLoading.value = false
  }
}*/

onMounted(() => {
  // Set initial selected key based on current route
  if (route.path === '/') {
    selectedKeys.value = ['home']
  } else if (route.path === '/search') {
    selectedKeys.value = ['search']
  }
})

watch(route, (newRoute) => {
  // Update selected key when route changes
  if (newRoute.path === '/') {
    selectedKeys.value = ['home']
  } else if (newRoute.path === '/search') {
    selectedKeys.value = ['search']
  }
  // Close mobile menu on route change
  mobileMenuVisible.value = false
})
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  -background: #447D9B;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-link {
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.logo-link:hover {
  color: #273F4F;
}

.logo-icon {
  margin-right: 8px;
  font-size: 24px;
}

.mobile-menu-button {
  display: none;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.mobile-menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.desktop-menu {
  flex: 1;
  justify-content: center;
  border: none;
  background: transparent;
}

.desktop-menu .ant-menu-item {
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.desktop-menu .ant-menu-item a {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: color 0.3s ease;
}

.desktop-menu .ant-menu-item:hover {
  border-bottom-color: #273F4F;
}

.desktop-menu .ant-menu-item:hover a {
  color: white;
}

.desktop-menu .ant-menu-item-selected {
  border-bottom-color: #273F4F;
  background: rgba(255, 255, 255, 0.1);
}

.desktop-menu .ant-menu-item-selected a {
  color: white;
}

.desktop-auth {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}

.language-selector,
.currency-selector {
  min-width: 80px;
}

.language-option,
.currency-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 16px;
}

.desktop-auth .ant-btn {
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 500;
}

.desktop-auth .ant-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.desktop-auth .ant-btn-primary {
  background-color: #273F4F;
  border-color: #273F4F;
}

.desktop-auth .ant-btn-primary:hover {
  background-color: #1e2f3a;
  border-color: #1e2f3a;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 16px;
}

.header-icon {
  font-size: 20px;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;
}

.header-icon:hover {
  color: #FE7743;
}

.mobile-drawer .ant-drawer-body {
  padding: 0;
  background: #FE7743;
}

.mobile-menu-content {
  height: 100%;
  background: #FE7743;
}

.mobile-menu {
  border: none;
  background: transparent;
  height: 100%;
}

.mobile-menu .ant-menu-item {
  margin: 0;
  padding: 16px 24px;
  height: auto;
  line-height: 1.5;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-menu .ant-menu-item a {
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.mobile-menu .ant-menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu .ant-menu-item-selected {
  background: rgba(255, 255, 255, 0.15);
}

.mobile-menu .ant-menu-divider {
  background: rgba(255, 255, 255, 0.2);
  margin: 8px 0;
}

.content {
  min-height: calc(100vh - 134px);
  background: #D7D7D7;
}

/* Adjust content height when footer is hidden */
.content:last-child {
  min-height: 100vh;
}

.footer-modern {
  position: relative;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #273f4f 100%);
  color: white;
  overflow: hidden;
}

.footer-background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(254, 119, 67, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 75% 75%, rgba(68, 125, 155, 0.1) 0%, transparent 25%);
  pointer-events: none;
}

.footer-container-modern {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 24px 0;
  z-index: 1;
}

.footer-main-content {
  margin-bottom: 60px;
}

.footer-section-modern {
  height: 100%;
}

.company-section {
  padding-right: 40px;
}

.company-header {
  margin-bottom: 32px;
}

.logo-footer-modern {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.footer-logo-icon-modern {
  font-size: 32px;
  color: #FE7743;
  margin-right: 12px;
  filter: drop-shadow(0 0 8px rgba(254, 119, 67, 0.3));
}

.logo-text-modern {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.company-tagline {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin-bottom: 8px;
}

.footer-description-modern {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 32px;
}

.social-media-modern h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.social-links-modern {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.social-link-modern {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 20px;
  position: relative;
  overflow: hidden;
}

.social-link-modern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  transition: all 0.4s ease;
  z-index: -1;
}

.social-link-modern.facebook::before { background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%); }
.social-link-modern.instagram::before { background: linear-gradient(135deg, #e91e63 0%, #f06292 50%, #ffab40 100%); }
.social-link-modern.twitter::before { background: linear-gradient(135deg, #1da1f2 0%, #42a5f5 100%); }
.social-link-modern.linkedin::before { background: linear-gradient(135deg, #0077b5 0%, #0d8bce 100%); }
.social-link-modern.youtube::before { background: linear-gradient(135deg, #ff0000 0%, #ff5722 100%); }

.social-link-modern:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.footer-title-modern {
  color: white;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  position: relative;
  padding-bottom: 8px;
}

.footer-title-modern::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #FE7743 0%, #447D9B 100%);
  border-radius: 2px;
}

.footer-links-modern {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-modern li {
  margin-bottom: 12px;
}

.footer-links-modern a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
  display: inline-block;
  position: relative;
}

.footer-links-modern a::before {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: linear-gradient(90deg, #FE7743 0%, #447D9B 100%);
  transition: width 0.3s ease;
}

.footer-links-modern a:hover {
  color: #FE7743;
  transform: translateX(4px);
}

.footer-links-modern a:hover::before {
  width: 100%;
}

.contact-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.contact-info-modern {
  margin-bottom: 32px;
}

.contact-item-modern {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 0;
}

.contact-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #FE7743 0%, #e6693c 100%);
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(254, 119, 67, 0.3);
}

.contact-icon-modern {
  font-size: 20px;
  color: white;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.contact-value {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.newsletter-modern {
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-title {
  color: white;
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
}

.newsletter-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  font-size: 14px;
}

.newsletter-form-modern {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.newsletter-input-modern {
  flex: 1;
  height: 48px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 15px;
}

.newsletter-input-modern::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.newsletter-input-modern:focus {
  background: rgba(255, 255, 255, 0.12);
  border-color: #FE7743;
  box-shadow: 0 0 0 3px rgba(254, 119, 67, 0.2);
}

.newsletter-btn-modern {
  height: 48px;
  padding: 0 20px;
  background: linear-gradient(135deg, #FE7743 0%, #e6693c 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(254, 119, 67, 0.3);
}

.newsletter-btn-modern:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(254, 119, 67, 0.4);
  background: linear-gradient(135deg, #e6693c 0%, #cc5a32 100%);
}

.footer-bottom-modern {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
  margin-top: 40px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.copyright-modern {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.payment-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.payment-icons-modern {
  display: flex;
  gap: 12px;
}

.payment-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.payment-icon-wrapper:hover {
  background: rgba(254, 119, 67, 0.2);
  border-color: #FE7743;
  transform: translateY(-2px);
}

.payment-icon-wrapper .anticon {
  font-size: 20px;
  color: #FE7743;
}

/* Responsive */
@media (max-width: 768px) {
  .footer-container-modern {
    padding: 60px 16px 0;
  }
  
  .company-section {
    padding-right: 0;
    margin-bottom: 40px;
  }
  
  .contact-section {
    padding: 24px;
    margin-top: 32px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .payment-section {
    width: 100%;
    justify-content: flex-start;
  }
  
  .social-links-modern {
    justify-content: flex-start;
  }
  
  .newsletter-form-modern {
    flex-direction: column;
  }
  
  .newsletter-input-modern {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .footer-container-modern {
    padding: 40px 12px 0;
  }
  
  .logo-text-modern {
    font-size: 24px;
  }
  
  .footer-logo-icon-modern {
    font-size: 28px;
  }
  
  .contact-item-modern {
    align-items: flex-start;
  }
  
  .contact-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .contact-icon-modern {
    font-size: 18px;
  }
  
  .payment-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .mobile-menu-button {
    display: block;
  }
  
  .desktop-menu,
  .desktop-auth {
    display: none;
  }
  
  .logo-link {
    font-size: 18px;
  }
  
  .logo-icon {
    font-size: 20px;
  }
  
  .footer-container-modern {
    padding: 60px 16px 0;
  }
  
  .company-section {
    padding-right: 0;
    margin-bottom: 40px;
  }
  
  .contact-section {
    padding: 24px;
    margin-top: 32px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .payment-section {
    width: 100%;
    justify-content: flex-start;
  }
  
  .social-links-modern {
    justify-content: flex-start;
  }
  
  .newsletter-form-modern {
    flex-direction: column;
  }
  
  .newsletter-input-modern {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 12px;
  }
  
  .logo-link {
    font-size: 16px;
  }
  
  .logo-icon {
    font-size: 18px;
    margin-right: 6px;
  }
  
  .footer-container-modern {
    padding: 40px 12px 0;
  }
  
  .logo-text-modern {
    font-size: 24px;
  }
  
  .footer-logo-icon-modern {
    font-size: 28px;
  }
  
  .contact-item-modern {
    align-items: flex-start;
  }
  
  .contact-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .contact-icon-modern {
    font-size: 18px;
  }
  
  .payment-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

/* Custom scrollbar for mobile menu */
.mobile-menu-content::-webkit-scrollbar {
  width: 4px;
}

.mobile-menu-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-menu-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.mobile-menu-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}


.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.notification-item.priority {
  background: #fff2e8;
  padding: 12px;
  border-radius: 8px;
  border-bottom: none;
  margin-bottom: 12px;
}

.notification-icon {
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.notification-item.priority .notification-icon {
  color: #fa8c16;
}

.notification-item:not(.priority) .notification-icon {
  color: #1890ff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #273F4F;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.notification-desc {
  font-size: 0.8rem;
  color: #666;
  line-height: 1.4;
}
</style>

